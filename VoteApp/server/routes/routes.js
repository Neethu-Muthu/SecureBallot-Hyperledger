const express = require("express");
const router = express.Router();
const { clientApplication } = require("./client");

router.post("/readelection", async (req, res) => {
  try {
    const { electionId } = req.body;
    if (!electionId) {
      return res.status(400).json({
        success: false,
        message: "Election ID is required",
      });
    }

    let userClient = new clientApplication();
    let election = await userClient.submitTxn(
      "commissioner",
      "votingchannel",
      "vote-contract",
      "VotingContract",
      "queryTxn",
      "",
      "getElectionData",
      electionId
    );

    const data = new TextDecoder().decode(election);
    const value = JSON.parse(data);

    res.status(200).json({
      success: true,
      message: "Election data read successfully!",
      data: { value },
    });
  } catch (error) {
    console.error("Error reading election:", error);
    res.status(500).json({
      success: false,
      message: "Please check the Election ID!",
      data: { error: error.message },
    });
  }
});

router.post("/declareelection", async (req, res) => {
  try {
    const { electionId, commissionerName, electionName, startDate, endDate, description } =
      req.body;

    if (
      !electionId ||
      !commissionerName ||
      !electionName ||
      !startDate ||
      !endDate ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let userClient = new clientApplication();

    const result = await userClient.submitTxn(
      "commissioner",
      "votingchannel",
      "vote-contract",
      "VotingContract",
      "invokeTxn",
      "",
      "declareElection",
      electionId,
      commissionerName,
      electionName,
      startDate, 
      endDate,
      description
    );

    res.status(201).json({
      success: true,
      message: "Election declared successfully!",
      data: { result },
    });
  } catch (error) {
    console.error("Error declaring  election:", error);
    res.status(500).json({
      success: false,
      message: "Please check the Election ID!",
      data: { error: error.message },
    });
  }
});

router.post("/read-candidate", async (req, res) => {
  try {
    const { candidateId } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required",
      });
    }

    const userClient = new clientApplication();
    const candidate = await userClient.submitTxn(
      "voterRegistrationAuthority",
      "votingchannel",
      "vote-contract",
      "VotingContract",
      "queryTxn",
      "",
      "getCandidateData",
      candidateId
    );

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate data not found.",
      });
    }

    try {
      const decodedData = new TextDecoder().decode(candidate);
      const parsedData = JSON.parse(decodedData);

      return res.status(200).json({
        success: true,
        message: "Candidate data retrieved successfully!",
        data: { value: parsedData },
      });
    } catch (err) {
      console.error("Error decoding or parsing candidate data:", err);
      return res.status(500).json({
        success: false,
        message: "Error decoding or parsing candidate data.",
      });
    }
  } catch (error) {
    console.error("Error reading candidate data:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching candidate data.",
      error: error.message,
    });
  }
});



router.post("/register-candidate", async (req, res) => {
  try {
    const {
      candidateId,
      candidateName,
      electionId,
    
    } = req.body;

    if (
      !candidateId ||
      !candidateName ||
      !electionId 
     
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let userClient = new clientApplication();

    const result = await userClient.submitTxn(
      "voterRegistrationAuthority",
      "votingchannel",
      "vote-contract",
      "VotingContract",
      "invokeTxn",
      "",
      "candidateRegistration",
      candidateId,
      candidateName,
      electionId
      
    );

    res.status(201).json({
      success: true,
      message: "Registered successfully!",
      data: { result },
    });
  } catch (error) {
    console.error("Error registering:", error);
    res.status(500).json({
      success: false,
      message: "Please check the ID!",
      data: { error: error.message },
    });
  }
});

router.post("/read-verifiedcandidate", async (req, res) => {
  try {
    const { candidateId } = req.body;
    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "ID is required",
      });
    }

    let userClient = new clientApplication();
    let election = await userClient.submitTxn(
      "voterRegistrationAuthority",
      "votingchannel",
      "vote-contract",
      "VotingContract",
      "queryTxn",
      "",
      "getVerifiedCandidates",
      candidateId
    );

    const data = new TextDecoder().decode(candidate);
    const value = JSON.parse(data);

    res.status(200).json({
      success: true,
      message: "data read successfully!",
      data: { value },
    });
  } catch (error) {
    console.error("Error reading :", error);
    res.status(500).json({
      success: false,
      message: "Please check the ID!",
      data: { error: error.message },
    });
  }
});

router.post("/verify-candidate", async (req, res) => {
  try {
    const { candidateId, electionId, verificationStatus } = req.body;

    if (!candidateId || !electionId || !verificationStatus) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let userClient = new clientApplication();

    const result = await userClient.submitTxn(
      "voterRegistrationAuthority",
      "votingchannel",
      "vote-contract",
      "VotingContract",
      "invokeTxn",
      "",
      "verifyCandidateApplication",
      candidateId,   
      electionId,
      verificationStatus
    );

    res.status(201).json({
      success: true,
      message: "Registered successfully!",
      data: { result },
    });
  } catch (error) {
    console.error("Error registering:", error);
    res.status(500).json({
      success: false,
      message: "Please check the ID!",
      data: { error: error.message },
    });
  }
});
router.post("/complete-candidate-verification", async (req, res) => {
  try {
    const { electionId } = req.body;

    if (!electionId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    let userClient = new clientApplication();

    const result = await userClient.submitTxn(
      "voterRegistrationAuthority",
      "votingchannel",
      "vote-contract",
      "VotingContract",
      "invokeTxn",
      "",
      "completeCandidateVerification",

      electionId
    );

    res.status(201).json({
      success: true,
      message: "Candidate Verification Completed!",
      data: { result },
    });
  } catch (error) {
    console.error("Error completing the verification :", error);
    res.status(500).json({
      success: false,
      message: "Please check the ID!",
      data: { error: error.message },
    });
  }
});
// Smart contract functions in your chaincode

router.post("/publish-candidate-list", async (req, res) => {
  try {
    const { electionId, commissionerId, publishedCandidateDetails } = req.body;
    if (!electionId || !commissionerId || !publishedCandidateDetails) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }

    let userClient = new clientApplication();

    const result = await userClient.submitTxn(
      "voterRegistrationAuthority",
      "votingchannel",
      "vote-contract",
      "VotingContract",
      "invokeTxn",
      "",
      "publishCandidateList",
      electionId,
      commissionerId,
      JSON.stringify(publishedCandidateDetails)
    );

    res.status(201).json({
      success: true,
      message: "Candidate list published successfully!",
      data: { result },
    });
  } catch (error) {
    console.error("Error publishing candidate list:", error);
    res.status(500).json({
      success: false,
      message: "Error publishing candidate list",
      data: { error: error.message },
    });
  }
});



module.exports = router;
