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
    "readVotersCount",
    "Election-01"
  )
  .then((result) => {
    // Decode the Uint8Array to a string
    const decodedString = new TextDecoder().decode(result);

    // Parse the string as JSON
    const jsonObject = JSON.parse(decodedString);

    console.log("Election details: ");
    // Log the JSON object
    console.log(jsonObject);
  });
