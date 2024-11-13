"use client";
import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaUsers,
  FaLock,
  FaBars,
  FaTimes,
  FaCog,
  FaSignOutAlt,
  FaVideo,
} from "react-icons/fa";
import Image from "next/image";
import logo from "../public/assests/primay-logo.png";
import ConnectTab from "@/components/Connect";
import VideosTab from "@/components/VideosTab";
import PrivateGroupChat from "@/components/PrivateGroupChat";
import Link from "next/link";

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState("Videos");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
  }, [sidebarOpen]);

  const isUserLoggedIn = () => {
    return localStorage.getItem("isLoggedIn") === "true";
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/Login";
  };

  return (
    <div className="min-h-screen flex bg-slate-950 overflow-y-auto text-white">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 border-r border-gray-700 shadow-lg z-30 transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:w-1/5 lg:w-[18%]`}
      >
        <nav className="flex flex-col h-full p-4">
          {/* Logo */}
          <Link href="/" className="mb-6">
            <Image
              src={logo}
              alt="Casanova Logo"
              className="w-24 h-auto mx-auto"
              priority
            />
          </Link>

          {/* Navigation items */}
          <div className="flex-1 space-y-3">
            {[
              { label: "Videos", icon: FaVideo },
              { label: "Community", icon: FaUsers },
              { label: "Private Group", icon: FaLock },
            ].map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`w-full p-3 flex items-center space-x-3 rounded-lg transition-all duration-300 ${
                  activeTab === label
                    ? "bg-pink-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <Icon className="text-2xl" />
                <span className="text-lg font-semibold">{label}</span>
              </button>
            ))}
            {!isUserLoggedIn() && (
              <button
                className="w-full p-3 flex items-center space-x-3 rounded-lg hover:bg-gray-700 text-gray-300 transition-colors duration-300"
                onClick={() => (window.location.href = "/Login")}
              >
                <FaUser className="text-2xl" />
                <span className="text-lg font-semibold">Login</span>
              </button>
            )}
          </div>

          {/* User-specific actions */}
          {isUserLoggedIn() && (
            <div className="space-y-3 mt-4">
              <button
                className="w-full p-3 rounded-lg flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors duration-300"
                onClick={() => (window.location.href = "/settings")}
              >
                <FaCog className="text-2xl" />
                <span className="text-lg font-semibold">Settings</span>
              </button>
              <button
                className="w-full p-3 rounded-lg flex items-center space-x-3 bg-red-600 hover:bg-red-700 text-white shadow-md transition-colors duration-300"
                onClick={handleSignOut}
              >
                <FaSignOutAlt className="text-2xl" />
                <span className="text-lg font-semibold">Sign Out</span>
              </button>
            </div>
          )}
        </nav>
      </aside>
      <div className="absolute  top-4 left-4 z-40 md:hidden">
        <button onClick={toggleSidebar} className="text-white">
          {sidebarOpen ? (
            <FaTimes className="text-3xl" />
          ) : (
            <FaBars className="text-3xl" />
          )}
        </button>
      </div>
      {/* Main content */}
      <main className="flex-grow flex flex-col md:ml-1/5 lg:ml-[18%] overflow-y-auto">
        {/* Mobile sidebar toggle */}

        {/* Content */}
        <div className="flex-grow flex justify-center items-center p-4 md:p-6 h-screen">
          {activeTab === "Videos" && (
            <div className="w-full md:w-[80%] lg:w-[60%] xl:w-[40%]">
              <VideosTab />
            </div>
          )}
          {activeTab === "Community" && (
            <div className="w-full md:w-[80%] lg:w-[60%] xl:w-[90%]">
              <ConnectTab />
            </div>
          )}
          {activeTab === "Private Group" && (
            <div className="w-full md:w-[80%] lg:w-[60%] xl:w-[90%]">
              <PrivateGroupChat />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
