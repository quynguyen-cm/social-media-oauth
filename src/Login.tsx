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

  // Lắng nghe trạng thái đăng nhập từ Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe(); // Cleanup
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      setUser(user);

      const idToken = await user.getIdToken();
      console.log("Google ID Token:", idToken);

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
        throw new Error(`Lỗi từ backend: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Backend response (Google):", data);
    } catch (error: any) {
      setError(error.message);
      console.error("Error during Google sign-in:", error);
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      setUser(user);

      const idToken = await user.getIdToken();
      console.log("Facebook ID Token:", idToken);

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
        throw new Error(`Lỗi từ backend: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Backend response (Facebook):", data);
    } catch (error: any) {
      setError(error.message);
      console.error("Error during Facebook sign-in:", error);
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
        throw new Error(`Lỗi khi gọi API LinkedIn: ${response.statusText}`);
      }

      const data: { authUrl: string } = await response.json();
      if (!data.authUrl) {
        throw new Error("Không tìm thấy authUrl trong response");
      }

      window.location.href = data.authUrl;
    } catch (error: any) {
      setError(error.message);
      console.error("Error during LinkedIn sign-in:", error);
    }
  };

  return (
    <div>
      <h2>Firebase OAuth with React</h2>
      {user ? (
        <div>
          <p>Chào mừng, {user.displayName || "Người dùng"}</p>
          <button onClick={() => auth.signOut()}>Đăng xuất</button>
        </div>
      ) : (
        <div>
          <button onClick={handleGoogleSignIn}>Đăng nhập với Google</button>
          <button onClick={handleFacebookSignIn} style={{ marginLeft: "10px" }}>
            Đăng nhập với Facebook
          </button>
          <button onClick={handleLinkedInSignIn} style={{ marginLeft: "10px" }}>
            Đăng nhập với LinkedIn
          </button>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
