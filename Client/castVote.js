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
    "castVotes",
    "Vote-002",
    "Voter-002",
    "Candidate-1",
    "Election-02"
  )
  .then((result) => {
    console.log(new TextDecoder().decode(result));
    console.log("Voted Successfully");
  });
