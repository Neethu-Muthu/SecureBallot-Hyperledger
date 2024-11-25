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
    "candidateRegistration",
    "Candidate-1",
    "Candidate1",
    "Election-02"
     )
  .then((result) => {
    console.log(new TextDecoder().decode(result));
    console.log("Candidate Registered Successfully");
  });
