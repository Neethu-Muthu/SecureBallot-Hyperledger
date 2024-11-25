const { clientApplication } = require("./client");

let userClient = new clientApplication();
userClient
  .submitTxn(
    "voterRegistrationAuthority",
    "votingchannel",
    "vote-contract",
    "VotingContract",
    "invokeTxn",
    "",
    "verifyCandidateApplication",
    "Candidate-1",
    "Election-02",
    "Verified"
  )
  .then((result) => {
    console.log(new TextDecoder().decode(result));
    console.log("Election Declared Successfully");
  });
