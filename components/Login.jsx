"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import logo from "../public/assests/primay-logo.png";
import Link from "next/link"; // Your logo here
import { auth } from "../lib/firebase"; // Import auth
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(
        auth,
        loginData.username,
        loginData.password
      );
      console.log("Login successful");
    } catch (error) {
      console.error("Error logging in", error.message);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Retrieve user data from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User data retrieved:", userData);
      } else {
        console.log("No user data found!");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="w-full max-w-md h-max relative p-4 rounded-lg shadow-lg bg-gray-800">
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src={logo}
              alt="Casanova Logo"
              className="w-24 h-auto"
              priority
            />
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full p-3 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
              onChange={handleChange}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                className="w-full p-3 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-2"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-400" />
                ) : (
                  <FaEye className="text-gray-400" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-pink-500 rounded hover:bg-pink-600 transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-4">
          <span className="text-gray-400">Don't have an account?</span>
          <Link href="/Register">
            <p className="text-pink-500 ml-2 hover:underline">Register</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
