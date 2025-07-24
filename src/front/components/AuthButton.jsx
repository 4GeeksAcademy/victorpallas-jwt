import React from "react";
import { useNavigate } from "react-router-dom";

const AuthButton = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleClick = () => {
    if (token) {
      localStorage.removeItem("token");
      navigate("/");
      window.location.reload();
    } else {
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "0.5rem 1rem",
        backgroundColor: "#0e7a29ff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold"
      }}
    >
      {token ? "Logout" : "Login"}
    </button>
  );
};

export default AuthButton;
