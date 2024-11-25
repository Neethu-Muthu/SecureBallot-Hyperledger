import React, { useState } from "react";

const CommissionerPage = () => {
  const [electionId, setElectionId] = useState("");
  const [commissionerName, setCommissionerName] = useState("");
  const [electionName, setElectionName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [electionData, setElectionData] = useState(null);
  const [showElectionIdInput, setShowElectionIdInput] = useState(false);

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);
  const openElectionIdInput = () => setShowElectionIdInput(true);
  const closeElectionIdInput = () => setShowElectionIdInput(false);

  const submitForm = (e) => {
    e.preventDefault();

    const newElection = {
      electionId,
      commissionerName,
      electionName,
      startDate,
      endDate,
      description,
    };

    declareElection(newElection);
  };

  const declareElection = async (newElection) => {
    try {
      const res = await fetch("/api/declareelection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newElection),
      });

      const result = await res.json();

      if (result.success) {
        setMessage(`Success: ${result.message}`);
        setElectionId("");
        setCommissionerName("");
        setElectionName("");
        setStartDate("");
        setEndDate("");
        setDescription("");
        closeForm();
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Request error:", error);
      setMessage("An error occurred while declaring the election.");
    }
  };

  // Function to fetch election data based on electionId
  const fetchElectionData = async (id) => {
    try {
      const res = await fetch("/api/readelection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ electionId: id }), // Send electionId in the request body
      });

      const result = await res.json();
      if (result.success) {
        setElectionData(result.data.value); // Assuming the returned data is inside `value`
        closeElectionIdInput(); // Close the input box after fetching data
      } else {
        setMessage("Election data not found.");
      }
    } catch (error) {
      console.error("Request error:", error);
      setMessage("An error occurred while fetching election data.");
    }
  };

  return (
    <>
      <section className="bg-white flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center mt-10 mb-6">
          Commissioner Dashboard
        </h1>

        <div className="flex space-x-4 mb-10">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={openForm}
          >
            Declare Election
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            onClick={openElectionIdInput}
          >
            Get Election Data
          </button>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.startsWith("Success")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full">
              <h2 className="text-2xl font-semibold text-center mb-6">
                Declare Election
              </h2>
              <form onSubmit={submitForm}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Election Id
                  </label>
                  <input
                    type="text"
                    className="border rounded w-full py-2 px-3"
                    placeholder="eg. Election-01"
                    required
                    value={electionId}
                    onChange={(e) => setElectionId(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Commissioner Name
                  </label>
                  <input
                    type="text"
                    className="border rounded w-full py-2 px-3"
                    placeholder="eg. Commissioner Name"
                    required
                    value={commissionerName}
                    onChange={(e) => setCommissionerName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Election Name
                  </label>
                  <input
                    type="text"
                    className="border rounded w-full py-2 px-3"
                    placeholder="eg. Election 2024"
                    required
                    value={electionName}
                    onChange={(e) => setElectionName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="border rounded w-full py-2 px-3"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="border rounded w-full py-2 px-3"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Description
                  </label>
                  <textarea
                    className="border rounded w-full py-2 px-3"
                    placeholder="Election description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Election ID Input Box */}
        {showElectionIdInput && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow-lg max-w-lg w-full">
              <h2 className="text-2xl font-semibold text-center mb-6">
                Enter Election ID
              </h2>
              <input
                type="text"
                className="border rounded w-full py-2 px-3 mb-4"
                placeholder="eg. Election-01"
                value={electionId}
                onChange={(e) => setElectionId(e.target.value)}
              />
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={closeElectionIdInput}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => fetchElectionData(electionId)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Fetch Data
                </button>
              </div>
            </div>
          </div>
        )}

        {electionData && (
          <div className="mt-10 p-4 border rounded shadow max-w-xl w-full">
            <h3 className="text-2xl font-semibold mb-4">Election Data</h3>
            <div>
              <p>
                <strong>Commissioner Name:</strong>{" "}
                {electionData.commissionerName}
              </p>
              <p>
                <strong>Election Name:</strong> {electionData.electionName}
              </p>
              <p>
                <strong>Election ID:</strong> {electionData.electionId}
              </p>
              <p>
                <strong>Description:</strong> {electionData.description}
              </p>
              <p>
                <strong>Start Date:</strong> {electionData.startDate}
              </p>
              <p>
                <strong>End Date:</strong> {electionData.endDate}
              </p>
              <p>
                <strong>Status:</strong> {electionData.status}
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default CommissionerPage;
