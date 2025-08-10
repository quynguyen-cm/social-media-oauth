/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { auth, signInWithCustomToken, updateProfile } from "./firebase";

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
  firebase_token: string;
}

const LinkedInCallback = () => {
  const [searchParams] = useSearchParams();
  const [authData, setAuthData] = useState<LinkedInAuthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code");
        if (!code) {
          throw new Error("Không tìm thấy code trong query params");
        }

        const response = await fetch(
          `https://wsdah-api.myrae.app/api/auth/linkedin/callback?code=${code}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Lỗi khi xử lý callback từ LinkedIn: ${response.statusText}`
          );
        }

        const data: LinkedInAuthResponse = await response.json();
        setAuthData(data);

        // Đăng nhập vào Firebase với firebase_token
        const userCredential = await signInWithCustomToken(
          auth,
          data.firebase_token
        );

        // Cập nhật thông tin profile Firebase
        await updateProfile(userCredential.user, {
          displayName: data.user.username,
          photoURL: data.user.avatar,
        });

        // Lưu token và thông tin người dùng vào localStorage
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);
        localStorage.setItem("firebase_token", data.firebase_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Chuyển hướng người dùng sau khi đăng nhập thành công
        window.location.href = "/dashboard";
      } catch (err: any) {
        setError(err.message);
        console.error("Error during LinkedIn callback:", err);
      }
    };

    handleCallback();
  }, [searchParams]);

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  if (!authData) {
    return <div>Đang xử lý đăng nhập...</div>;
  }

  return (
    <div>
      <h1>Đăng nhập thành công!</h1>
      <p>Chào mừng: {authData.user.username}</p>
      <p>Email: {authData.user.email || "Không có"}</p>
      <img src={authData.user.avatar} alt="Avatar" width={100} />
    </div>
  );
};

export default LinkedInCallback;
