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
    "openVoting",
    "Election-02"
  )
  .then((result) => {
    console.log(new TextDecoder().decode(result));
    console.log("Voting Open");
  });
