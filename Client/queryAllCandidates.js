const { clientApplication } = require("./client");

let userClient = new clientApplication();
userClient
  .submitTxn(
    "voterRegistrationAuthority",
    "votingchannel",
    "vote-contract",
    "VotingContract",
    "queryTxn",
    "",
    "queryAllCandidate",
    
  )
  .then((result) => {
    // Decode the Uint8Array to a string
    const decodedString = new TextDecoder().decode(result);

    // Parse the string as JSON
    const jsonObject = JSON.parse(decodedString);

    console.log("Candidate details: ");
    // Log the JSON object
    console.log(jsonObject);
  });
