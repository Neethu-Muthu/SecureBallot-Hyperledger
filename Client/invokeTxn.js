const { clientApplication } = require("./client");

let userClient = new clientApplication();
userClient
  .submitTxn(
    "commissioner",
    "votingchannel",
    "vote-contract",
    "VotingContract",
    "invokeTxn",
    "",
    "declareElection",
    "Election-02",
    "Commission1",
    "Election1",
    "19/05/2023",
    "22/05/2023",
    "Election1 is opened"
  )
  .then((result) => {
    console.log(new TextDecoder().decode(result));
    console.log("Election Declared Successfully");
  });
