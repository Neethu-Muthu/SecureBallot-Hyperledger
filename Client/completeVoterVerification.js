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
    "completeVotersVerification",
    "Election-02"
     )
  .then((result) => {
    console.log(new TextDecoder().decode(result));
    console.log(" Voter Verification Successfully Completed");
  });
