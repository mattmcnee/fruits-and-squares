const axios = require("axios");
const functions = require("firebase-functions");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const cors = require("cors");
const serviceAccount = require("./sa.key.json");
const { getAuth } = require("firebase-admin/auth");
import type { UserRecord } from "firebase-admin/auth";

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const corsHandler = cors({ origin: true });

// User interface to define user properties
interface User {
  email: string;
  name: string;
  picture: string;
  uid: string;
}

exports.linkedinAuth = functions.https.onRequest((req: any, res: any) => {
  corsHandler(req, res, async () => {
    try {
      const { code } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Missing authorization code" });
      }

      // Step 1: Exchange authorization code for access and ID tokens
      const tokenResponse = await axios.post(
        "https://www.linkedin.com/oauth/v2/accessToken",
        new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
          client_id: process.env.LINKEDIN_CLIENT_ID!,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const idToken = tokenResponse.data.id_token;

      // Step 2: Verify the ID token's signature and claims
      const decodedIdToken = await verifyLinkedInIdToken(idToken);

      // Step 3: Construct user object from verified ID token
      const user: User = {
        email: decodedIdToken.email,
        name: decodedIdToken.given_name,
        picture: decodedIdToken.picture,
        uid: decodedIdToken.sub,
      };

      // Step 4: Check if the user already exists in Firebase Auth
      const { token, user: firebaseUser } = await signupOrLogin(user);

      return res.json({ token, user: firebaseUser });
    } catch (error: any) {
      console.error("Auth error:", error.response?.data || error.message);

      if (
        error.response?.data?.error === "invalid_request" &&
        error.response?.data?.error_description?.includes("authorization code expired")
      ) {
        return res.status(400).json({
          error: "LinkedIn Authorization code has expired",
          details: "Please sign in again to continue",
        });
      }

      // Generic error response
      return res.status(500).json({
        error: "Internal Server Error",
        details: "An error occurred during LinkedIn authentication",
      });
    }
  });
});

// Function to verify the LinkedIn ID token
const verifyLinkedInIdToken = async (idToken: string): Promise<{ [key: string]: any }> => {
  // Fetch LinkedIn's JWKS
  const jwksResponse = await axios.get("https://www.linkedin.com/oauth/openid/jwks");
  const jwks = jwksResponse.data.keys;

  // Get the token's header to identify the key used for signing
  const decodedHeader = jwt.decode(idToken, { complete: true })?.header;

  if (!decodedHeader || !decodedHeader.kid) {
    throw new Error("Invalid ID token: Missing or malformed header");
  }

  // Find the matching key in the JWKS
  const jwk = jwks.find((key: any) => key.kid === decodedHeader.kid);

  if (!jwk) {
    throw new Error("Unable to find matching key in LinkedIn JWKS");
  }

  // Convert the JWK to a PEM format
  const pem = jwkToPem(jwk);

  // Verify the token using the PEM
  const verifiedToken = jwt.verify(idToken, pem, {
    algorithms: ["RS256"],
    issuer: "https://www.linkedin.com",
    audience: process.env.LINKEDIN_CLIENT_ID!,
  });

  return verifiedToken;
};

// Convert JWK to PEM
const jwkToPem = (jwk: any): string => {
  const { n, e } = jwk;
  const modulus = Buffer.from(n, "base64");
  const exponent = Buffer.from(e, "base64");

  const modulusHex = modulus.toString("hex");
  const exponentHex = exponent.toString("hex");

  return `-----BEGIN RSA PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A${modulusHex}
AQAB${exponentHex}==
-----END RSA PUBLIC KEY-----`;
};

// Function for Firebase signup or login
const signupOrLogin = async (user: User): Promise<{ token: string; user: UserRecord }> => {
  try {
    try {
      const userRecord: UserRecord = await getAuth().getUser(user.uid);
      const token = await getAuth().createCustomToken(userRecord.uid);
      
      return { token, user: userRecord };
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        const userRecord: UserRecord = await getAuth().createUser({
          uid: user.uid,
          email: user.email,
          displayName: user.name,
          photoURL: user.picture,
        });
        const token = await getAuth().createCustomToken(userRecord.uid);
        
        return { token, user: userRecord };
      }
      throw error;
    }
  } catch (error: any) {
    console.error("Error in signupOrLogin:", error);
    throw error;
  }
};
