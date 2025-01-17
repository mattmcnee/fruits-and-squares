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

export function useAuth() {
  const auth = getAuth(app);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Listen for auth state changes and set state accordingly
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, [auth]);

  const getTokenFromCode = async (code: string): Promise<string | null> => {
    const FUNCTION_URL = import.meta.env.VITE_FIREBASE_FUNCTION_BASE_URL;

    try {
      const response = await fetch(`${FUNCTION_URL}/linkedinAuth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      // Check if the response contains a custom token
      if (data.token) {
        return data.token;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching token from code:", error);
      return null;
    }
  }

  const signInWithCode = async (code: string): Promise<void> => {
    const token = await getTokenFromCode(code);
    if (!token) {
      console.error("Error fetching token from code");
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
    const REDIRECT_URI = import.meta.env.VITE_LINKEDIN_REDIRECT_URI;
    const AUTH_URL = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=openid%20profile%20email`;

    window.location.href = AUTH_URL;
  }

  // Logout user
  const logout = async (): Promise<SignInResponse> => {
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
