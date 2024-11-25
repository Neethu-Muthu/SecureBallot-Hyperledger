const { clientApplication } = require("./client");

let userClient = new clientApplication();
userClient
  .submitTxn(
    "votingBooth",
    "votingchannel",
    "vote-contract",
    "VotingContract",
    "invokeTxn",
    "",
    "endVoting",
    "Election-02"
  )
  .then((result) => {
    console.log(new TextDecoder().decode(result));
    console.log("Voting Ended");
  });
