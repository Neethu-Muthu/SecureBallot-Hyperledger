let profile = {
  commissioner: {
    cryptoPath:
      "../../Fabric-network-Voting/organizations/peerOrganizations/commissioner.voting.com",
    keyDirectoryPath:
      "../../Fabric-network-Voting/organizations/peerOrganizations/commissioner.voting.com/users/User1@commissioner.voting.com/msp/keystore/",
    certPath:
      "../../Fabric-network-Voting/organizations/peerOrganizations/commissioner.voting.com/users/User1@commissioner.voting.com/msp/signcerts/cert.pem",
    tlsCertPath:
      "../../Fabric-network-Voting/organizations/peerOrganizations/commissioner.voting.com/peers/peer0.commissioner.voting.com/tls/ca.crt",
    peerEndpoint: "localhost:7051",
    peerHostAlias: "peer0.commissioner.voting.com",
    mspId: "commissionerMSP",
  },
  voterRegistrationAuthority: {
    cryptoPath:
      "../../Fabric-network-Voting/organizations/peerOrganizations/voterRegistrationAuthority.voting.com",
    keyDirectoryPath:
      "../../Fabric-network-Voting/organizations/peerOrganizations/voterRegistrationAuthority.voting.com/users/User1@voterRegistrationAuthority.voting.com/msp/keystore/",
    certPath:
      "../../Fabric-network-Voting/organizations/peerOrganizations/voterRegistrationAuthority.voting.com/users/User1@voterRegistrationAuthority.voting.com/msp/signcerts/cert.pem",
    tlsCertPath:
      "../../Fabric-network-Voting/organizations/peerOrganizations/voterRegistrationAuthority.voting.com/peers/peer0.voterRegistrationAuthority.voting.com/tls/ca.crt",
    peerEndpoint: "localhost:8051",
    peerHostAlias: "peer0.voterRegistrationAuthority.voting.com",
    mspId: "voterRegistrationAuthorityMSP",
  },
  votingBooth: {
    cryptoPath:
      "../../Fabric-network-Voting/organizations/peerOrganizations/votingBooth.voting.com",
    keyDirectoryPath:
      "../../Fabric-network-Voting/organizations/peerOrganizations/votingBooth.voting.com/users/User1@votingBooth.voting.com/msp/keystore/",
    certPath:
      "../../Fabric-network-Voting/organizations/peerOrganizations/votingBooth.voting.com/users/User1@votingBooth.voting.com/msp/signcerts/cert.pem",
    tlsCertPath:
      "../../Fabric-network-Voting/organizations/peerOrganizations/votingBooth.voting.com/peers/peer0.votingBooth.voting.com/tls/ca.crt",
    peerEndpoint: "localhost:9051",
    peerHostAlias: "peer0.votingBooth.voting.com",
    mspId: "votingBoothMSP",
  },
  auditor: {
    cryptoPath:
      "../../Fabric-network-Voting/organizations/peerOrganizations/auditor.voting.com",
    keyDirectoryPath:
      "../../Fabric-network-Voting/organizations/peerOrganizations/auditor.voting.com/users/User1@auditor.voting.com/msp/keystore/",
    certPath:
      "../../Fabric-network-Voting/organizations/peerOrganizations/auditor.voting.com/users/User1@auditor.voting.com/msp/signcerts/cert.pem",
    tlsCertPath:
      "../../Fabric-network-Voting/organizations/peerOrganizations/auditor.voting.com/peers/peer0.auditor.voting.com/tls/ca.crt",
    peerEndpoint: "localhost:11051",
    peerHostAlias: "peer0.auditor.voting.com",
    mspId: "auditorMSP",
  },
};
module.exports = { profile };
