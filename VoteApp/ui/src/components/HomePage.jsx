// src/components/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaGavel, FaUserShield, FaEye, FaVoteYea } from "react-icons/fa"; // Import the icon for VotingBooth
import backgroundImage from "../assets/images/voting.webp"; // Adjust path as needed

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-center text-white py-10 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-5xl font-extrabold mb-4">SecureVote</h1>
        <p className="text-lg mb-12 max-w-lg text-center">
          A modern digital voting platform for Cooperative Banks. Ensuring
          secure, transparent, and efficient voting.
        </p>
        <div className="bg-white text-gray-900 rounded-3xl shadow-lg p-8 w-full max-w-md relative z-10">
          <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">
            Choose Your Role
          </h2>
          <div className="space-y-6">
            <button
              onClick={() => navigate("/commissioner")}
              className="w-full flex items-center justify-between px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none transition transform hover:scale-105"
            >
              <span className="flex items-center">
                <FaGavel className="mr-3" />
                Commissioner
              </span>
              <span className="text-sm">Manage Elections</span>
            </button>
            <button
              onClick={() => navigate("/voter-registration-authority")}
              className="w-full flex items-center justify-between px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none transition transform hover:scale-105"
            >
              <span className="flex items-center">
                <FaUserShield className="mr-3" />
                Registration Authority
              </span>
              <span className="text-sm">Register Voters</span>
            </button>
            <button
              onClick={() => navigate("/auditor")}
              className="w-full flex items-center justify-between px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none transition transform hover:scale-105"
            >
              <span className="flex items-center">
                <FaEye className="mr-3" />
                Auditor
              </span>
              <span className="text-sm">Review and Audit</span>
            </button>
            <button
              onClick={() => navigate("/voting-booth")}
              className="w-full flex items-center justify-between px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none transition transform hover:scale-105"
            >
              <span className="flex items-center">
                <FaVoteYea className="mr-3" />
                VotingBooth
              </span>
              <span className="text-sm">Cast Your Vote</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
