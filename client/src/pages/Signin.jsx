import React from "react";
import Login from "../components/Login";
import Logo from "../components/Logo";

const Signin = () => {
  return (
    <div className="flex justify-center items-center h-screen max-w-6 m-auto">
      <Logo />
      <Login />
    </div>
  );
};

export default Signin;
