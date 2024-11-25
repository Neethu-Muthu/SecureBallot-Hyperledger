const { clientApplication } = require("./client");

let userClient = new clientApplication();
userClient
  .submitTxn(
    "auditor",
    "votingchannel",
    "vote-contract",
    "VotingContract",
    "invokeTxn",
    "",
    "declareWinner",
    "Election-02",
    "Commissioner-01"
  )
  .then((result) => {
    console.log(new TextDecoder().decode(result));
    console.log("Winner Declared");
  });
