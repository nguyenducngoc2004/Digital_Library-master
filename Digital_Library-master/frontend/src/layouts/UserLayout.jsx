import React from "react";
import Navbar from "../components/Navbar";

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar role="user" />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default UserLayout;
