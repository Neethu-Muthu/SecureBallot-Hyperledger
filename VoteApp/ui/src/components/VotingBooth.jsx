// src/components/VotingBoothDashboard.jsx
import React, { useState } from "react";
import { FaVoteYea, FaSearch, FaTimesCircle } from "react-icons/fa";

const VotingBooth = ({ castVotes, getVotes, endVoting }) => {
  const [voteId, setVoteId] = useState("");
  const [voterId, setVoterId] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [electionId, setElectionId] = useState("");
  const [result, setResult] = useState(null);
  const [voteDetails, setVoteDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCastVote = async () => {
    setLoading(true);
    try {
      const response = await castVotes(
        voteId,
        voterId,
        candidateId,
        electionId
      );
      setResult(response);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const handleGetVote = async () => {
    setLoading(true);
    try {
      const response = await getVotes(voteId);
      setVoteDetails(response);
    } catch (error) {
      setVoteDetails(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const handleEndVoting = async () => {
    setLoading(true);
    try {
      const response = await endVoting(electionId);
      setResult(response);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 to-indigo-900 p-10 text-white">
      <h1 className="text-4xl font-bold text-center mb-8">
        VotingBooth Dashboard
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cast Vote Section */}
        <div className="bg-blue-700 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Cast Vote</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Vote ID"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
              value={voteId}
              onChange={(e) => setVoteId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Voter ID"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Candidate ID"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Election ID"
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white"
              value={electionId}
              onChange={(e) => setElectionId(e.target.value)}
            />
            <button
              onClick={handleCastVote}
              className="w-full py-3 mt-4 bg-green-600 rounded-lg flex items-center justify-center hover:bg-green-700 transition transform hover:scale-105"
            >
              <FaVoteYea className="mr-2" /> Cast Vote
            </button>
          </div>
        </div>

        {/* View Vote Section */}
        <div className="bg-purple-700 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">View Vote Details</h2>
          <input
            type="text"
            placeholder="Vote ID"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white mb-4"
            value={voteId}
            onChange={(e) => setVoteId(e.target.value)}
          />
          <button
            onClick={handleGetVote}
            className="w-full py-3 bg-indigo-600 rounded-lg flex items-center justify-center hover:bg-indigo-700 transition transform hover:scale-105"
          >
            <FaSearch className="mr-2" /> View Vote
          </button>
          {voteDetails && (
            <div className="mt-4 bg-gray-800 p-4 rounded-lg">
              <h3 className="text-lg font-bold">Vote Details</h3>
              <p>
                {typeof voteDetails === "string"
                  ? voteDetails
                  : JSON.stringify(voteDetails)}
              </p>
            </div>
          )}
        </div>

        {/* End Voting Section */}
        <div className="bg-red-700 rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">End Voting</h2>
          <input
            type="text"
            placeholder="Election ID"
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white mb-4"
            value={electionId}
            onChange={(e) => setElectionId(e.target.value)}
          />
          <button
            onClick={handleEndVoting}
            className="w-full py-3 bg-red-600 rounded-lg flex items-center justify-center hover:bg-red-800 transition transform hover:scale-105"
          >
            <FaTimesCircle className="mr-2" /> End Voting
          </button>
        </div>
      </div>

      {/* Display result or error message */}
      {result && (
        <div className="mt-8 bg-black bg-opacity-50 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-bold">Result</h3>
          <p>{result}</p>
        </div>
      )}
      {loading && <p className="text-center text-lg mt-4">Loading...</p>}
    </div>
  );
};

export default VotingBooth;
