// src/components/AuditorPage.jsx
import React, { useState } from "react";
import { FaVoteYea, FaListOl, FaClipboardCheck } from "react-icons/fa";

const AuditorPage = () => {
  const [activeTab, setActiveTab] = useState("viewElectionStatus");
  const [electionId, setElectionId] = useState("");
  const [candidateVotes, setCandidateVotes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock functions (replace these with real API calls)
  const handleViewElectionStatus = () => {
    setLoading(true);
    // Simulate fetching candidate votes
    setTimeout(() => {
      setCandidateVotes([
        { candidateId: "C1", candidateName: "Alice", voteCount: 120 },
        { candidateId: "C2", candidateName: "Bob", voteCount: 95 },
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleDeclareVoteCount = () => {
    alert(`Vote count declared for election ${electionId}.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 to-indigo-700 flex flex-col items-center py-10 px-4 text-white">
      <h2 className="text-4xl font-bold mb-8">Auditor Dashboard</h2>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-10">
        <button
          className={`px-5 py-2 rounded-lg font-semibold transition ${
            activeTab === "viewElectionStatus"
              ? "bg-white text-purple-700 shadow-md transform scale-105"
              : "bg-purple-600 hover:bg-opacity-80"
          }`}
          onClick={() => setActiveTab("viewElectionStatus")}
        >
          View Election Status
        </button>
        <button
          className={`px-5 py-2 rounded-lg font-semibold transition ${
            activeTab === "declareVoteCount"
              ? "bg-white text-purple-700 shadow-md transform scale-105"
              : "bg-purple-600 hover:bg-opacity-80"
          }`}
          onClick={() => setActiveTab("declareVoteCount")}
        >
          Declare Vote Count
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white text-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
        {activeTab === "viewElectionStatus" && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-700 flex items-center">
              <FaListOl className="text-purple-500 mr-2" /> View Election Status
            </h3>
            <input
              type="text"
              name="electionId"
              placeholder="Enter Election ID"
              value={electionId}
              onChange={(e) => setElectionId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-300"
              required
            />
            <button
              onClick={handleViewElectionStatus}
              className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              disabled={loading}
            >
              {loading ? "Loading..." : "View Status"}
            </button>
            {candidateVotes.length > 0 && (
              <div className="mt-6 space-y-4">
                <h4 className="text-xl font-semibold text-gray-700">
                  Candidate Vote Counts
                </h4>
                {candidateVotes.map((candidate) => (
                  <div
                    key={candidate.candidateId}
                    className="flex justify-between items-center px-4 py-2 bg-gray-100 rounded-lg"
                  >
                    <span>{candidate.candidateName}</span>
                    <span className="font-semibold text-indigo-700">
                      {candidate.voteCount} votes
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "declareVoteCount" && (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-700 flex items-center">
              <FaClipboardCheck className="text-indigo-500 mr-2" /> Declare Vote
              Count
            </h3>
            <input
              type="text"
              name="electionId"
              placeholder="Enter Election ID"
              value={electionId}
              onChange={(e) => setElectionId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-300"
              required
            />
            <button
              onClick={handleDeclareVoteCount}
              className="w-full bg-indigo-500 text-white py-2 rounded-lg font-semibold hover:bg-indigo-600 transition"
            >
              Declare Vote Count
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditorPage;
