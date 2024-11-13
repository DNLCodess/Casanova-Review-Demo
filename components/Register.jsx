"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import logo from "../public/assests/primay-logo.png";
import Link from "next/link"; // Your logo here
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase"; // Import auth

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    country: "",
    state: "",
    localGovernment: "",
    bodyType: "",
    phoneNumber: "+234",
    username: "",
    password: "",
    otp: "",
    verified: false,
    sexting: false,
    quickHook: false,
    avatar: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [imageError, setImageError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    if (value.startsWith("+234")) {
      setFormData((prev) => ({ ...prev, phoneNumber: value }));
    } else {
      setFormData((prev) => ({ ...prev, phoneNumber: "+234" + value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setImageError("");
    } else {
      setImageError("Please upload an image file less than 5MB.");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create user with email and password in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.username,
        formData.password
      );
      const user = userCredential.user;

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        age: formData.age,
        country: formData.country,
        state: formData.state,
        localGovernment: formData.localGovernment,
        bodyType: formData.bodyType,
        phoneNumber: formData.phoneNumber,
        verified: formData.verified,
        sexting: formData.sexting,
        quickHook: formData.quickHook,
        avatar: formData.avatar,
        createdAt: new Date(),
      });

      console.log("User registration and data storage successful");
    } catch (error) {
      console.error("Error during registration:", error.message);
    }
  };

  const sendOtp = async () => {
    if (!isValidNigerianPhoneNumber(formData.phoneNumber)) {
      setPhoneError("Please enter a valid Nigerian phone number.");
      return;
    }
    setPhoneError("");
    try {
      const response = await fetch("/api/sendOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: formData.phoneNumber }),
      });
      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        alert("OTP sent. Please check your phone.");
      } else {
        setPhoneError("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP", error);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch("/api/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          otp: formData.otp,
        }),
      });
      const data = await response.json();
      if (data.verified) {
        setOtpVerified(true);
        alert("OTP verified successfully!");

        // Update the user in Firestore to set verified status
        const user = auth.currentUser;
        await setDoc(
          doc(db, "users", user.uid),
          { verified: true },
          { merge: true }
        );
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP", error);
    }
  };

  const isValidNigerianPhoneNumber = (phone) => {
    const nigerianPhoneRegex = /^\+234[789]\d{9}$/;
    return nigerianPhoneRegex.test(phone);
  };

  const bodyTypes = [
    {
      id: 1,
      label: "Slim - Small Bust, Small Backside",
      src: "/path/to/slim_small_bust_small_backside.png",
    },
    {
      id: 2,
      label: "Slim - Small Bust, Medium Backside",
      src: "/path/to/slim_small_bust_medium_backside.png",
    },
    {
      id: 3,
      label: "Slim - Small Bust, Big Backside",
      src: "/path/to/slim_small_bust_big_backside.png",
    },
    {
      id: 4,
      label: "Slim - Medium Bust, Small Backside",
      src: "/path/to/slim_medium_bust_small_backside.png",
    },
    {
      id: 5,
      label: "Slim - Medium Bust, Medium Backside",
      src: "/path/to/slim_medium_bust_medium_backside.png",
    },
    {
      id: 6,
      label: "Slim - Medium Bust, Big Backside",
      src: "/path/to/slim_medium_bust_big_backside.png",
    },
    {
      id: 7,
      label: "Slim - Big Bust, Small Backside",
      src: "/path/to/slim_big_bust_small_backside.png",
    },
    {
      id: 8,
      label: "Slim - Big Bust, Medium Backside",
      src: "/path/to/slim_big_bust_medium_backside.png",
    },
    {
      id: 9,
      label: "Slim - Big Bust, Big Backside",
      src: "/path/to/slim_big_bust_big_backside.png",
    },

    {
      id: 10,
      label: "Medium - Small Bust, Small Backside",
      src: "/path/to/medium_small_bust_small_backside.png",
    },
    {
      id: 11,
      label: "Medium - Small Bust, Medium Backside",
      src: "/path/to/medium_small_bust_medium_backside.png",
    },
    {
      id: 12,
      label: "Medium - Small Bust, Big Backside",
      src: "/path/to/medium_small_bust_big_backside.png",
    },
    {
      id: 13,
      label: "Medium - Medium Bust, Small Backside",
      src: "/path/to/medium_medium_bust_small_backside.png",
    },
    {
      id: 14,
      label: "Medium - Medium Bust, Medium Backside",
      src: "/path/to/medium_medium_bust_medium_backside.png",
    },
    {
      id: 15,
      label: "Medium - Medium Bust, Big Backside",
      src: "/path/to/medium_medium_bust_big_backside.png",
    },
    {
      id: 16,
      label: "Medium - Big Bust, Small Backside",
      src: "/path/to/medium_big_bust_small_backside.png",
    },
    {
      id: 17,
      label: "Medium - Big Bust, Medium Backside",
      src: "/path/to/medium_big_bust_medium_backside.png",
    },
    {
      id: 18,
      label: "Medium - Big Bust, Big Backside",
      src: "/path/to/medium_big_bust_big_backside.png",
    },

    {
      id: 19,
      label: "Thick - Small Bust, Small Backside",
      src: "/path/to/thick_small_bust_small_backside.png",
    },
    {
      id: 20,
      label: "Thick - Small Bust, Medium Backside",
      src: "/path/to/thick_small_bust_medium_backside.png",
    },
    {
      id: 21,
      label: "Thick - Small Bust, Big Backside",
      src: "/path/to/thick_small_bust_big_backside.png",
    },
    {
      id: 22,
      label: "Thick - Medium Bust, Small Backside",
      src: "/path/to/thick_medium_bust_small_backside.png",
    },
    {
      id: 23,
      label: "Thick - Medium Bust, Medium Backside",
      src: "/path/to/thick_medium_bust_medium_backside.png",
    },
    {
      id: 24,
      label: "Thick - Medium Bust, Big Backside",
      src: "/path/to/thick_medium_bust_big_backside.png",
    },
    {
      id: 25,
      label: "Thick - Big Bust, Small Backside",
      src: "/path/to/thick_big_bust_small_backside.png",
    },
    {
      id: 26,
      label: "Thick - Big Bust, Medium Backside",
      src: "/path/to/thick_big_bust_medium_backside.png",
    },
    {
      id: 27,
      label: "Thick - Big Bust, Big Backside",
      src: "/path/to/thick_big_bust_big_backside.png",
    },
  ];

  const [isBodyTypeDropdownOpen, setIsBodyTypeDropdownOpen] = useState(false);

  const toggleBodyTypeDropdown = () => {
    setIsBodyTypeDropdownOpen(!isBodyTypeDropdownOpen);
  };

  const handleBodyTypeSelect = (bodyType) => {
    setFormData((prev) => ({ ...prev, bodyType: bodyType.label }));
    setIsBodyTypeDropdownOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-max bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="w-full max-w-md h-full relative p-4 rounded-lg shadow-lg bg-gray-800">
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
        <h2 className="text-2xl font-bold text-center mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              className="w-full p-3 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              className="w-full p-3 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
              onChange={handleChange}
              required
            />
            <select
              name="age"
              className="w-full p-3 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
              onChange={handleChange}
              required
            >
              <option value="">Select Age Range</option>
              <option value="18-21">18 - 21</option>
              <option value="22-25">22 - 25</option>
              <option value="26-29">26 - 29</option>
              <option value="30-33">30 - 33</option>
              <option value="34-37">34 - 37</option>
              <option value="38-41">38 - 41</option>
              <option value="42-45">42 - 45</option>
              <option value="46-50">46 - 50</option>
            </select>
            <input
              type="text"
              name="country"
              placeholder="Country"
              className="w-full p-3 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              className="w-full p-3 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
              onChange={handleChange}
              required
            />

            <div className="relative">
              <input
                type="text"
                name="bodyType"
                placeholder="Select Body Type"
                className="w-full p-3 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300 cursor-pointer"
                value={formData.bodyType}
                onClick={toggleBodyTypeDropdown}
                readOnly
              />

              {isBodyTypeDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-gray-800 border border-gray-700 rounded shadow-lg max-h-48 overflow-y-auto">
                  {bodyTypes.map((type) => (
                    <div
                      key={type.id}
                      className="flex items-center p-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleBodyTypeSelect(type)}
                    >
                      <Image
                        src={type.src}
                        alt={type.label}
                        width={80}
                        height={80}
                        className="mr-2 rounded-full"
                      />
                      <span className="text-white">{type.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar Image Upload */}
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                className="w-full p-3 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
                onChange={handleFileChange}
                required
              />
              {imageError && (
                <p className="text-red-500 text-sm">{imageError}</p>
              )}
            </div>
          </div>

          {/* Phone Number Input with +234 prefix */}
          <div className="relative">
            <label className="block text-sm mb-2">
              Phone Number (Nigerian)
            </label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="+234 XXX XXX XXXX"
              value={formData.phoneNumber}
              className={`w-full p-3 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300 ${
                phoneError ? "border-red-500" : ""
              }`}
              onChange={handlePhoneChange}
              required
            />
            {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
          </div>

          {/* OTP Section */}
          {!otpSent ? (
            <button
              type="button"
              onClick={sendOtp}
              className="w-full py-3 bg-pink-500 rounded hover:bg-pink-600 transition duration-300 ease-in-out"
            >
              Send OTP
            </button>
          ) : (
            <div className="flex flex-col space-y-2">
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                className="w-full p-3 bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-pink-500 transition duration-300"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={verifyOtp}
                className="w-full py-3 bg-pink-500 rounded hover:bg-pink-600 transition duration-300 ease-in-out"
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={requestNewOtp}
                className="w-full py-3 bg-gray-600 rounded hover:bg-gray-700 transition duration-300 ease-in-out"
              >
                Resend OTP
              </button>
            </div>
          )}

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
              <span
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-3 cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <input
            type="checkbox"
            name="verified"
            className="mr-2 leading-tight"
            checked={formData.verified}
            onChange={handleChange}
          />
          <label className="text-sm">Would you like to be Verified?</label>

          <input
            type="checkbox"
            name="sexting"
            className="mr-2 leading-tight"
            checked={formData.sexting}
            onChange={handleChange}
          />
          <label className="text-sm">
            Would you like to participate in Sexting?
          </label>

          <input
            type="checkbox"
            name="quickHook"
            className="mr-2 leading-tight"
            checked={formData.quickHook}
            onChange={handleChange}
          />
          <label className="text-sm">
            Would you like to be a QuickHook Participant?
          </label>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="verified"
              className="mr-2 leading-tight"
              checked={formData.verified}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  verified: e.target.checked,
                }))
              }
            />
            <label className="text-sm">
              I agree to the terms and conditions
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-pink-500 rounded hover:bg-pink-600 transition duration-300 ease-in-out"
            disabled={!otpVerified} // Disable button until OTP is verified
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
