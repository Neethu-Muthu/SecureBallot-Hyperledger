const { clientApplication } = require("./client");

let userClient = new clientApplication();

// Define the published candidate details as an example
const publishedVoterDetails = [
  {
    voterId: "Voter-002",
    candidateName: "Doe",
    electionId: "Election-02",
  },
  {
    voterId: "Voter-001",
    candidateName: "Smith",
    electionId: "Election-02",
  },
];

// Define the necessary parameters
const electionId = "Election-02";
const commissionerId = "Commissioner-01";

// Submit the transaction to publish the candidate list
userClient
  .submitTxn(
    "voterRegistrationAuthority", // MSP ID of the user (voterRegistrationAuthority)
    "votingchannel", // The name of the channel
    "vote-contract", // The name of the chaincode
    "VotingContract", // The name of the function (transaction) being invoked
    "invokeTxn", // Specify "invokeTxn" as it is used for invoking transactions
    "", // This is the argument for function, leave empty if not required
    "publishVoterList", // Function name defined in the chaincode
    electionId, // Pass the electionId as argument
    commissionerId, // Pass the commissionerId as argument
    JSON.stringify(publishedVoterDetails) // Pass published candidate details as JSON string
  )
  .then((result) => {
    console.log("Transaction result: ", new TextDecoder().decode(result));
    console.log(
      "Voter List Published Successfully for Election: " + electionId
    );
  })
  .catch((error) => {
    console.error("Error publishing candidate list: ", error);
  });
