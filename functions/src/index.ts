const axios = require("axios");
const functions = require("firebase-functions");
const jwt = require("jsonwebtoken");
const admin = require("firebase-admin");
const cors = require("cors");
const serviceAccount = require("./sa.key.json");

// Firebase admin imports
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

      // Step 1: Exchange authorization code for user details
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

      // Step 2: Construct user object from LinkedIn details
      const idToken = tokenResponse.data.id_token;
      const decodedIdToken = jwt.decode(idToken) as { [key: string]: any };

      const user: User = {
        email: decodedIdToken.email,
        name: decodedIdToken.given_name,
        picture: decodedIdToken.picture,
        uid: decodedIdToken.sub,
      };

      // Step 3: Check if the user already exists in Firebase Auth
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

const signupOrLogin = async (user: User): Promise<{ token: string; user: UserRecord }> => {
  try {
    try {
      // Try to get the user first
      const userRecord: UserRecord = await getAuth().getUser(user.uid);

      // User exists, create custom token
      const token = await getAuth().createCustomToken(userRecord.uid);

      return { token, user: userRecord };
    } catch (error: any) {
      // User doesn't exist, create new user
      if (error.code === "auth/user-not-found") {
        const userRecord: UserRecord = await getAuth().createUser({
          uid: user.uid,
          email: user.email,
          displayName: user.name,
          photoURL: user.picture,
        });

        // Create custom token for the new user
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
