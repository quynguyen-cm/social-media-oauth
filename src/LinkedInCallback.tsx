/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

interface LinkedInAuthResponse {
  message: string;
  user: {
    sub: string;
    email: string | null;
    phone_number: string | null;
    username: string;
    avatar: string;
  };
  access_token: string;
  refresh_token: string;
}

const LinkedInCallback = () => {
  const [searchParams] = useSearchParams();
  const [authData, setAuthData] = useState<LinkedInAuthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const hasCalled = useRef(false); // Track if API was already called

  useEffect(() => {
    if (hasCalled.current) return; // Prevent second call
    hasCalled.current = true;

    const handleCallback = async () => {
      try {
        setIsLoading(true);
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const storedState = localStorage.getItem("linkedin_state");

        if (!code) {
          throw new Error("Authorization code is missing in query parameters");
        }
        if (!state || !storedState || state !== storedState) {
          throw new Error("State mismatch or missing");
        }

        const response = await fetch(
          `https://wsdah-api.myrae.app/api/auth/linkedin/callback?code=${code}&state=${state}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Callback API failed: ${response.status} - ${errorText}`
          );
        }

        const data: LinkedInAuthResponse = await response.json();
        setAuthData(data);

        const userData = {
          sub: data.user.sub,
          email: data.user.email || "N/A",
          username: data.user.username || "User",
          avatar: data.user.avatar || "",
        };
        localStorage.setItem("user", JSON.stringify(userData));

        localStorage.removeItem("linkedin_state");

        const redirectTo =
          localStorage.getItem("redirect_after_login") || "/dashboard";
        localStorage.removeItem("redirect_after_login");
        navigate(redirectTo);
      } catch (err: any) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <div>Loading...</div>
        <div>Please wait while we process your login.</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/login")}>Try Again</button>
      </div>
    );
  }

  if (!authData) {
    return null;
  }

  const safeUsername = authData.user.username || "User";
  const safeEmail = authData.user.email || "N/A";
  const safeAvatar = authData.user.avatar || "";

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Login Successful!</h1>
      <p>Welcome: {safeUsername}</p>
      <p>Email: {safeEmail}</p>
      {safeAvatar && <img src={safeAvatar} alt="Avatar" width={100} />}
      <button onClick={() => navigate("/dashboard")}>Go to Dashboard</button>
    </div>
  );
};

export default LinkedInCallback;
