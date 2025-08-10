/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  auth,
  facebookProvider,
  googleProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "./firebase";

const Login = () => {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser(user);

      const idToken = await user.getIdToken();

      const response = await fetch(
        "https://wsdah-api.myrae.app/api/auth/google-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        }
      );

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      await response.json();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      setUser(user);

      const idToken = await user.getIdToken();

      const response = await fetch(
        "https://wsdah-api.myrae.app/api/auth/facebook-login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        }
      );

      if (!response.ok) {
        throw new Error(`Backend error: ${response.statusText}`);
      }

      await response.json();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleLinkedInSignIn = async () => {
    try {
      const response = await fetch(
        "https://wsdah-api.myrae.app/api/auth/linkedin",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error calling LinkedIn API: ${response.statusText}`);
      }

      const data: { authUrl: string; state: string } = await response.json();
      if (!data.authUrl || !data.state) {
        throw new Error("authUrl or state not found in response");
      }

      // Save state for verification after callback
      localStorage.setItem("linkedin_state", data.state);

      // Redirect to authUrl
      window.location.href = data.authUrl;
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("user");
      localStorage.removeItem("linkedin_state");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Firebase OAuth with React</h2>
      {user ? (
        <div>
          <p>Welcome, {user.displayName || "User"}</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <button onClick={handleGoogleSignIn}>Sign in with Google</button>
          <button onClick={handleFacebookSignIn} style={{ marginLeft: "10px" }}>
            Sign in with Facebook
          </button>
          <button onClick={handleLinkedInSignIn} style={{ marginLeft: "10px" }}>
            Sign in with LinkedIn
          </button>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
