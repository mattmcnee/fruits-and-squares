import { useState, useEffect } from "react";
import app from "./config";
import { 
  getAuth, 
  signOut,
  signInWithCustomToken,
  User,
} from "firebase/auth";

interface SignInResponse {
  status: string;
  code: string;
}

const hasWarnedRef = { current: false };

export function useAuth() {

  // Forgiving auth initialization: if config is missing warn once and return null
  let auth;
  try {
    auth = getAuth(app);
  } catch (error) {
    if (!hasWarnedRef.current) {
      console.warn("Firebase config is missing or invalid:", error);
      hasWarnedRef.current = true;
    }
    auth = null;
  }

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(auth ? true : false);
  const DEV_MODE = import.meta.env.MODE === "development";

  const REDIRECT_URI = DEV_MODE 
    ? import.meta.env.VITE_DEV_LINKEDIN_REDIRECT_URI 
    : import.meta.env.VITE_LINKEDIN_REDIRECT_URI;

  const FUNCTION_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL;


  // Listen for auth state changes and set state accordingly
  useEffect(() => {
    if (!auth) return;

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [auth]);

  const getTokenFromCode = async (code: string): Promise<string | null> => {
    if (!FUNCTION_URL) {
      console.warn("Function URL is missing");
      
      return null;
    }

    try {
      const response = await fetch(`${FUNCTION_URL}/linkedinAuth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, redirect: REDIRECT_URI }),
      });

      const data = await response.json();

      // Check if the response contains a custom token
      if (data.token) {
        return data.token;
      } else {
        return null;
      }
    } catch (error) {
      console.warn("Failed to generate token from code");
      
      return null;
    }
  };

  const signInWithCode = async (code: string): Promise<void> => {
    if (!auth) {
      if (!hasWarnedRef.current) {
        console.warn("Firebase auth is not initialized");
        hasWarnedRef.current = true;
      }
      return;
    }

    const token = await getTokenFromCode(code);
    if (!token) {
      console.warn("Error fetching token from code");
      
      return;
    }
    signInWithCustomToken(auth, token)
      .then((userCredential) => {
        setUser(userCredential.user);
      })
      .catch((error) => {
        console.error("Error signing in with custom token:", error);
      });
  };

  const authenticateWithLinkedIn = async (): Promise<void> => {
    const CLIENT_ID = import.meta.env.VITE_LINKEDIN_CLIENT_ID;
    if (!CLIENT_ID || !REDIRECT_URI) {
      console.warn("LinkedIn client ID or redirect URI missing");
      
      return;
    }

    const AUTH_URL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=openid%20profile%20email`;
    window.location.href = AUTH_URL;
  };

  // Logout user
  const logout = async (): Promise<SignInResponse> => {
    if (!auth) {
      if (!hasWarnedRef.current) {
        console.warn("Firebase auth is not initialized");
        hasWarnedRef.current = true;
      }
      return { status: "error", code: "auth-not-initialized" };
    }

    try {
      await signOut(auth);
      setUser(null);
      
      return { status: "success", code: "" };
    } catch (error: any) {
      return { status: "error", code: error.code };
    }
  };

  return { 
    user, 
    logout, 
    loading, 
    signInWithCode,
    authenticateWithLinkedIn,
    getTokenFromCode
  };
}

export default useAuth;
