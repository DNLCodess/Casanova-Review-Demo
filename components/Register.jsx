"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import logo from "../public/assests/primay-logo.png";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"; // Importing Google OAuth provider and login

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    step1: {
      phone: "",
      username: "",
      password: "",
      city: "",
      country: "",
      ageRange: "",
      bodyType: "", // Add bodyType to form data
    },
  });
  const [formErrors, setFormErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBodyTypeModalOpen, setIsBodyTypeModalOpen] = useState(false); // Body type modal state

  const handleChange = (step, field, value) => {
    setFormData({
      ...formData,
      [step]: {
        ...formData[step],
        [field]: value,
      },
    });
  };

  const validateStep = () => {
    const errors = {};
    const currentData = formData[`step${currentStep}`];

    // Check for empty fields
    Object.keys(currentData).forEach((field) => {
      if (!currentData[field].trim()) {
        errors[field] = `${field} is required`;
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep() && currentStep < 2) {
      // Adjust step logic
      setCurrentStep(currentStep + 1);
    } else {
      setIsModalOpen(true); // Show modal on validation failure
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const closeModal = () => setIsModalOpen(false);

  // Handle Google Login
  const handleGoogleLogin = (response) => {
    console.log("Google login response: ", response);
    // Here you can handle the response from Google, and possibly create a user in your database
  };

  const openBodyTypeModal = () => setIsBodyTypeModalOpen(true); // Open body type modal
  const closeBodyTypeModal = () => setIsBodyTypeModalOpen(false); // Close body type modal

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-red-500">
              Please complete all required fields!
            </h2>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Body Type Modal */}
      {isBodyTypeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4">
            <h2 className="text-xl font-bold text-pink-500 mb-4">
              Select Your Body Type
            </h2>
            <div className="flex overflow-x-auto space-x-4">
              {/* Add placeholders for body types */}
              {["Body Type 1", "Body Type 2", "Body Type 3", "Body Type 4"].map(
                (bodyType, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 bg-gray-300 p-6 rounded-lg w-40 text-center"
                    onClick={() => {
                      handleChange("step1", "bodyType", bodyType);
                      closeBodyTypeModal();
                    }}
                  >
                    {/* Placeholder for images */}
                    <div className="h-32 bg-gray-500 mb-4"></div>
                    <p className="font-semibold">{bodyType}</p>
                  </div>
                )
              )}
            </div>
            <button
              onClick={closeBodyTypeModal}
              className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Form Container */}
      <div className="relative w-full max-w-lg bg-gray-800 rounded-lg shadow-2xl p-8 z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="mb-6">
            <Image
              src={logo}
              alt="Casanova Logo"
              className="w-24 h-auto mx-auto"
              priority
            />
          </Link>
        </div>

        {/* Form Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="space-y-6"
        >
          {currentStep === 1 && (
            <div>
              {/* Step 1: Account Details */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-2xl font-bold mb-4 text-pink-500">
                  Create Your Account
                </h2>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={formData.step1.phone}
                  onChange={(e) =>
                    handleChange("step1", "phone", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-lg bg-gray-600 border border-gray-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 transition duration-300 ${
                    formErrors.phone ? "border-red-500" : ""
                  }`}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-sm">{formErrors.phone}</p>
                )}
              </div>

              {/* Other form fields */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg mb-6">
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.step1.username}
                  onChange={(e) =>
                    handleChange("step1", "username", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-lg bg-gray-600 border border-gray-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 transition duration-300 ${
                    formErrors.username ? "border-red-500" : ""
                  }`}
                />
                {formErrors.username && (
                  <p className="text-red-500 text-sm">{formErrors.username}</p>
                )}
              </div>

              <div className="bg-gray-700 p-6 rounded-lg shadow-lg mb-6">
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.step1.password}
                  onChange={(e) =>
                    handleChange("step1", "password", e.target.value)
                  }
                  className={`w-full px-4 py-3 rounded-lg bg-gray-600 border border-gray-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500 transition duration-300 ${
                    formErrors.password ? "border-red-500" : ""
                  }`}
                />
                {formErrors.password && (
                  <p className="text-red-500 text-sm">{formErrors.password}</p>
                )}
              </div>

              {/* Body Type Selection Button */}
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg mb-6">
                <button
                  onClick={openBodyTypeModal}
                  className="w-full px-4 py-3 rounded-lg bg-gray-600 border border-gray-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500"
                >
                  Select Body Type
                </button>
                {formData.step1.bodyType && (
                  <p className="mt-2 text-pink-500">
                    {formData.step1.bodyType}
                  </p>
                )}
              </div>
            </div>
          )}
        </motion.div>
        {/* Google Sign-Up Button */}
        <div className="mb-6">
          <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={(error) => console.error("Google Login Error: ", error)}
              useOneTap
              shape="rectangular"
              theme="outline"
            />
          </GoogleOAuthProvider>
        </div>
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg"
            >
              Previous
            </button>
          )}
          {currentStep < 2 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-pink-500 text-white rounded-lg"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;
