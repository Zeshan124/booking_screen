"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showAlertMessage } from "../vendor_revenue/components/CommonFunctionalities";
import "./login.css";

const Login = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_LOGIN_PASSWORD) {
      localStorage.setItem("isLoggedIn", "true");
      showAlertMessage("You are Logged In", "success");
      setTimeout(() => {
        router.push("/");
      }, 500);
    } else {
      showAlertMessage("Something went wrong", "fail");
      // setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="custom-container">
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            marginBottom: "20px",
            color: "#333",
            textAlign: "center",
          }}
        >
          Welcome to the Finance Screen of Qist Bazaar!
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#666",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          Please enter your password to continue.
        </p>
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "12px 16px",
            marginBottom: "20px",
            width: "100%",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "16px",
            transition: "border-color 0.3s",
          }}
        />
        <button onClick={handleLogin} className="login-btn">
          Login
        </button>
        {error && (
          <p
            style={{
              color: "#e74c3c",
              marginTop: "20px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
