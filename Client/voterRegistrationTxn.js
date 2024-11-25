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
    "voterRegistration",
    "Election-02",
    "Voter-002",
    "Geethu"
  )
  .then((result) => {
    console.log(new TextDecoder().decode(result));
    console.log("Voters Registered Successfully");
  });
