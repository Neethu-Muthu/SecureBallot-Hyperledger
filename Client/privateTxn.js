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
    "displayVotersCount"
  )
  .then((result) => {
    console.log(new TextDecoder().decode(result));
    // console.log("Order successfully created")
  });
