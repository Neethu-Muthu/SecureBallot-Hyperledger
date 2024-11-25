/*
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Contract } = require("fabric-contract-api");

async function getCollectionName(ctx) {
  const collectionName = "VoterCollection";
  return collectionName;
}
class VotingContract extends Contract {
  async electionExists(ctx, electionId) {
    const asset = await ctx.stub.getState(electionId); // Check if election exists in the state
    return asset && asset.length > 0; // Return true if the asset exists
  }

  async declareElection(
    ctx,
    electionId,
    commissionerName,
    electionName,
    startDate,
    endDate,
    description
  ) {
    const mspID = ctx.clientIdentity.getMSPID();
    if (mspID === "commissionerMSP") {
      const exists = await this.electionExists(ctx, electionId);
      if (exists) {
        throw new Error(`The election ${electionId} already exists`);
      }
      const asset = {
        electionId,
        commissionerName,
        electionName,
        startDate,
        endDate,
        description,
        status: "Open for Candidate Applications", // Status to track the election stage
        assetType: "election", // Asset type to differentiate from other records on the blockchain
      };
      const buffer = Buffer.from(JSON.stringify(asset));
      await ctx.stub.putState(electionId, buffer);

      let addElectionEventData = {
        Type: "Election Declared",
        Model: electionId,
      };
      await ctx.stub.setEvent(
        "addElectionEvent",
        Buffer.from(JSON.stringify(addElectionEventData))
      );
    } else {
      return `User under the following MSP: ${mspID} cannot perform this action`;
    }
  }

  async getElectionData(ctx, electionId) {
    const exists = await this.electionExists(ctx, electionId);
    if (!exists) {
      throw new Error(`The election ${electionId} declared does not exist`);
    }
    const buffer = await ctx.stub.getState(electionId);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  async candidateExists(ctx, candidateId) {
    const asset = await ctx.stub.getState(candidateId); // Check if election exists in the state
    return asset && asset.length > 0; // Return true if the asset exists
  }

  async candidateRegistration(ctx, candidateId, candidateName, electionId) {
    const mspID = ctx.clientIdentity.getMSPID();
    if (mspID === "voterRegistrationAuthorityMSP") {
      const exists = await this.candidateExists(ctx, candidateId);
      if (exists) {
        throw new Error(`The candidate ${candidateId} already exists`);
      }

      // Create candidate asset
      const candidate = {
        candidateId,
        candidateName,
        electionId,
        voteCount: 0, // Initialize vote count to 0
        status: "Verification pending", // Track status of the candidate
        assetType: "candidate",
      };
      const buffer = Buffer.from(JSON.stringify(candidate));
      await ctx.stub.putState(candidateId, buffer);

      // Fetch the election and add this candidate to its candidates array
      const electionAsBytes = await ctx.stub.getState(electionId);
      if (!electionAsBytes || electionAsBytes.length === 0) {
        throw new Error(`Election with ID ${electionId} does not exist`);
      }
      const election = JSON.parse(electionAsBytes.toString());

      // Ensure election has a candidates array and push new candidate
      election.candidates = election.candidates || [];
      election.candidates.push({
        candidateId: candidateId,
        candidateName: candidateName,
        voteCount: 0,
      });

      // Update the election record in the ledger
      const updatedElectionBuffer = Buffer.from(JSON.stringify(election));
      await ctx.stub.putState(electionId, updatedElectionBuffer);
    } else {
      return `User under the following MSP: ${mspID} cannot perform this action`;
    }
  }

  async getCandidateData(ctx, candidateId) {
    const exists = await this.candidateExists(ctx, candidateId);
    if (!exists) {
      throw new Error(`The election ${candidateId} declared does not exist`);
    }
    const buffer = await ctx.stub.getState(candidateId);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }
  async verifyCandidateApplication(
    ctx,
    candidateId,
    electionId,
    verificationStatus
  ) {
    const mspID = ctx.clientIdentity.getMSPID();

    // Only auditorMSP can perform this action
    if (mspID === "voterRegistrationAuthorityMSP") {
      // Retrieve candidate's application
      const candidateAsBytes = await ctx.stub.getState(candidateId);
      if (!candidateAsBytes || candidateAsBytes.length === 0) {
        throw new Error(`Candidate with ID ${candidateId} does not exist`);
      }

      const candidate = JSON.parse(candidateAsBytes.toString());

      // Check if the candidate is part of the given election
      if (candidate.electionId !== electionId) {
        throw new Error(
          `Candidate ${candidateId} is not part of Election ${electionId}`
        );
      }

      // Update the candidate's status based on verification result
      candidate.status = verificationStatus; // "Verified" or "Rejected"

      // Store updated candidate information
      const buffer = Buffer.from(JSON.stringify(candidate));
      await ctx.stub.putState(candidateId, buffer);

      // Emit an event for candidate verification
      let verifyCandidateEventData = {
        Type: "Candidate Verified",
        CandidateId: candidateId,
        ElectionId: electionId,
        Status: verificationStatus,
      };
      await ctx.stub.setEvent(
        "verifyCandidateEvent",
        Buffer.from(JSON.stringify(verifyCandidateEventData))
      );

      return `Candidate ${candidateId} has been ${verificationStatus.toLowerCase()}.`;
    } else {
      return `User under the following MSP: ${mspID} is not authorized to perform this action.`;
    }
  }
  async getVerifiedCandidates(ctx, candidateId) {
    const exists = await this.candidateExists(ctx, candidateId);
    if (!exists) {
      throw new Error(`The election ${candidateId} declared does not exist`);
    }
    const buffer = await ctx.stub.getState(candidateId);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  async completeCandidateVerification(ctx, electionId) {
    const mspID = ctx.clientIdentity.getMSPID();

    // Only commissionerMSP or another authorized MSP should perform this action
    if (mspID !== "voterRegistrationAuthorityMSP") {
      throw new Error(`User under MSP: ${mspID} cannot perform this action`);
    }

    // Fetch the election details from the ledger
    const electionAsBytes = await ctx.stub.getState(electionId);
    if (!electionAsBytes || electionAsBytes.length === 0) {
      throw new Error(`Election with ID ${electionId} does not exist`);
    }

    const election = JSON.parse(electionAsBytes.toString());

    // Ensure the election is in the correct state to complete verification
    if (election.status !== "Open for Candidate Applications") {
      throw new Error(
        `Election ${electionId} is not accepting candidate applications`
      );
    }

    // Update the election status to Candidate Verification Complete
    election.status = "Candidate Verification Complete";

    // Store the updated election details in the ledger
    const buffer = Buffer.from(JSON.stringify(election));
    await ctx.stub.putState(electionId, buffer);

    // Emit an event for election status update
    const eventData = {
      Type: "Candidate Verification Complete",
      ElectionId: electionId,
    };
    await ctx.stub.setEvent(
      "candidateVerificationCompleteEvent",
      Buffer.from(JSON.stringify(eventData))
    );

    return `Candidate verification for election ${electionId} is now complete.`;
  }

  async publishCandidateList(
    ctx,
    electionId,
    commissionerId,
    publishedCandidateDetails
  ) {
    const mspID = ctx.clientIdentity.getMSPID();
    if (mspID !== "voterRegistrationAuthorityMSP") {
      throw new Error(`User under MSP: ${mspID} cannot perform this action`);
    }

    // Fetch the election details from the ledger
    const electionAsBytes = await ctx.stub.getState(electionId);
    if (!electionAsBytes || electionAsBytes.length === 0) {
      throw new Error(`Election with ID ${electionId} does not exist`);
    }

    const election = JSON.parse(electionAsBytes.toString());

    if (election.status !== "Candidate Verification Complete") {
      throw new Error(
        `Cannot publish candidate list. The current status of election ${electionId} is ${election.status}`
      );
    }

    // Published candidate list should contain details like candidateId, candidateName, etc.
    // Assuming publishedCandidateDetails is an array of objects [{candidateId, candidateName, electionId, ...}, {...}]
    election.publishedCandidateList = publishedCandidateDetails;
    election.status = "Candidates Published";

    // Update the election with the published candidate list
    const updatedElectionAsBytes = Buffer.from(JSON.stringify(election));
    await ctx.stub.putState(electionId, updatedElectionAsBytes);

    // Emit an event indicating that the candidate list has been published
    let eventData = {
      Type: "Candidate List Published",
      ElectionId: electionId,
      PublishedCandidates: publishedCandidateDetails,
    };
    await ctx.stub.setEvent(
      "publishCandidateEvent",
      Buffer.from(JSON.stringify(eventData))
    );

    return `Candidate list for election ${electionId} has been successfully published by ${commissionerId}`;
  }

  async getPublishedCandidateList(ctx, electionId) {
    // Fetch the election details from the ledger using the electionId
    const electionAsBytes = await ctx.stub.getState(electionId);
    if (!electionAsBytes || electionAsBytes.length === 0) {
      throw new Error(`Election with ID ${electionId} does not exist`);
    }

    const election = JSON.parse(electionAsBytes.toString());

    // Check if the candidate list has been published
    if (!election.publishedCandidateList) {
      throw new Error(
        `The candidate list for election ${electionId} has not been published yet.`
      );
    }

    // Return the published candidate list
    return election.publishedCandidateList;
  }

  async voterExists(ctx, voterId) {
    const asset = await ctx.stub.getState(voterId); // Check if election exists in the state
    return asset && asset.length > 0; // Return true if the asset exists
  }

  async voterRegistration(ctx, electionId, voterId, voterName) {
    const mspID = ctx.clientIdentity.getMSPID();

    // Only votingBoothMSP can register to participate in the election
    if (mspID !== "voterRegistrationAuthorityMSP") {
      throw new Error(`User under MSP: ${mspID} cannot perform this action`);
    }

    // Check if the election exists
    const electionAsBytes = await ctx.stub.getState(electionId);
    if (!electionAsBytes || electionAsBytes.length === 0) {
      throw new Error(`Election with ID ${electionId} does not exist`);
    }

    const election = JSON.parse(electionAsBytes.toString());

    // Check if the election is in the "Candidates Published" stage
    if (election.status !== "Candidates Published") {
      throw new Error(
        `Election ${electionId} is not open for voter registration. Current status: ${election.status}`
      );
    }

    // Check if the voter is already registered
    const voterAsBytes = await ctx.stub.getState(voterId);
    if (voterAsBytes && voterAsBytes.length > 0) {
      throw new Error(`Voter with ID ${voterId} is already registered`);
    }

    // Register the voter by adding them to the ledger with the election ID reference
    const voter = {
      voterId,
      voterName,
      electionId,
      hasVoted: false, // Track if the voter has already voted in this election
      assetType: "voter",
    };

    const buffer = Buffer.from(JSON.stringify(voter));
    await ctx.stub.putState(voterId, buffer);

    // Emit an event for voter registration
    let voterRegistrationEventData = {
      Type: "Voter Registered",
      VoterId: voterId,
      ElectionId: electionId,
    };
    await ctx.stub.setEvent(
      "voterRegistrationEvent",
      Buffer.from(JSON.stringify(voterRegistrationEventData))
    );

    return `Voter ${voterId} has been successfully registered for election ${electionId}`;
  }

  async getVoterData(ctx, voterId) {
    const exists = await this.voterExists(ctx, voterId);
    if (!exists) {
      throw new Error(`The voter with ${voterId} declared does not exist`);
    }
    const buffer = await ctx.stub.getState(voterId);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  async verifyVoter(ctx, voterId, electionId, verificationStatus) {
    const mspID = ctx.clientIdentity.getMSPID();

    // Only auditorMSP can perform this action
    if (mspID === "voterRegistrationAuthorityMSP") {
      // Retrieve candidate's application
      const voterAsBytes = await ctx.stub.getState(voterId);
      if (!voterAsBytes || voterAsBytes.length === 0) {
        throw new Error(`Voter with ID ${voterId} does not exist`);
      }

      const voter = JSON.parse(voterAsBytes.toString());

      // Check if the candidate is part of the given election
      if (voter.electionId !== electionId) {
        throw new Error(
          `Voters ${voterId} is not part of Election ${electionId}`
        );
      }

      // Update the candidate's status based on verification result
      voter.status = verificationStatus; // "Verified" or "Rejected"

      // Store updated candidate information
      const buffer = Buffer.from(JSON.stringify(voter));
      await ctx.stub.putState(voterId, buffer);

      // Emit an event for candidate verification
      let verifyVoterEventData = {
        Type: "Voter Verified",
        VoterId: voterId,
        ElectionId: electionId,
        Status: verificationStatus,
      };
      await ctx.stub.setEvent(
        "verifyVoterEvent",
        Buffer.from(JSON.stringify(verifyVoterEventData))
      );

      return `Voter ${voterId} has been ${verificationStatus.toLowerCase()}.`;
    } else {
      return `User under the following MSP: ${mspID} is not authorized to perform this action.`;
    }
  }

  async getVoterStatus(ctx, voterId) {
    const exists = await this.voterExists(ctx, voterId);
    if (!exists) {
      throw new Error(`The election ${voterId} declared does not exist`);
    }
    const buffer = await ctx.stub.getState(voterId);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  async completeVotersVerification(ctx, electionId) {
    const mspID = ctx.clientIdentity.getMSPID();
    if (mspID !== "voterRegistrationAuthorityMSP") {
      throw new Error(`User under MSP: ${mspID} cannot perform this action`);
    }

    // Fetch the election details from the ledger
    const electionAsBytes = await ctx.stub.getState(electionId);
    if (!electionAsBytes || electionAsBytes.length === 0) {
      throw new Error(`Election with ID ${electionId} does not exist`);
    }

    const election = JSON.parse(electionAsBytes.toString());

    if (election.status !== "Candidates Published") {
      throw new Error(
        `Cannot complete publication. The current status of election ${electionId} is ${election.status}`
      );
    }

    // Update the election status to Voters Verification Complete
    election.status = "Voters Verification Complete";

    // Store the updated election details in the ledger
    const buffer = Buffer.from(JSON.stringify(election));
    await ctx.stub.putState(electionId, buffer);

    return `Candidate publication completed for election ${electionId}. Voter verification can now proceed.`;
  }

  async publishVoterList(
    ctx,
    electionId,
    commissionerId,
    publishedVoterDetails
  ) {
    const mspID = ctx.clientIdentity.getMSPID();
    if (mspID !== "voterRegistrationAuthorityMSP") {
      throw new Error(`User under MSP: ${mspID} cannot perform this action`);
    }

    // Fetch the election details from the ledger
    const electionAsBytes = await ctx.stub.getState(electionId);
    if (!electionAsBytes || electionAsBytes.length === 0) {
      throw new Error(`Election with ID ${electionId} does not exist`);
    }

    const election = JSON.parse(electionAsBytes.toString());

    if (election.status !== "Voters Verification Complete") {
      throw new Error(
        `Cannot publish voter list. The current status of election ${electionId} is ${election.status}`
      );
    }

    // Published candidate list should contain details like candidateId, candidateName, etc.
    // Assuming publishedCandidateDetails is an array of objects [{candidateId, candidateName, electionId, ...}, {...}]
    election.publishedVoterList = publishedVoterDetails;
    election.status = "Voters Published";

    // Update the election with the published candidate list
    const updatedElectionAsBytes = Buffer.from(JSON.stringify(election));
    await ctx.stub.putState(electionId, updatedElectionAsBytes);

    // Emit an event indicating that the candidate list has been published
    let eventData = {
      Type: "Voters List Published",
      ElectionId: electionId,
      PublishedVoters: publishedVoterDetails,
    };
    await ctx.stub.setEvent(
      "publishVoterEvent",
      Buffer.from(JSON.stringify(eventData))
    );

    return `Voter list for election ${electionId} has been successfully published by ${commissionerId}`;
  }

  async getPublishedVoterList(ctx, electionId) {
    // Fetch the election details from the ledger using the electionId
    const electionAsBytes = await ctx.stub.getState(electionId);
    if (!electionAsBytes || electionAsBytes.length === 0) {
      throw new Error(`Election with ID ${electionId} does not exist`);
    }

    const election = JSON.parse(electionAsBytes.toString());

    // Check if the candidate list has been published
    if (!election.publishedVoterList) {
      throw new Error(
        `The Voter list for election ${electionId} has not been published yet.`
      );
    }

    // Return the published candidate list
    return election.publishedVoterList;
  }

  async openVoting(ctx, electionId) {
    const mspID = ctx.clientIdentity.getMSPID();
    if (mspID !== "voterRegistrationAuthorityMSP") {
      throw new Error(`User under MSP: ${mspID} cannot perform this action`);
    }

    const electionAsBytes = await ctx.stub.getState(electionId);
    if (!electionAsBytes || electionAsBytes.length === 0) {
      throw new Error(`Election with ID ${electionId} does not exist`);
    }

    const election = JSON.parse(electionAsBytes.toString());

    if (election.status !== "Voters Published") {
      throw new Error(
        `Cannot open voting. Current status of election ${electionId} is ${election.status}`
      );
    }

    election.status = "Voting Active";

    const updatedElectionAsBytes = Buffer.from(JSON.stringify(election));
    await ctx.stub.putState(electionId, updatedElectionAsBytes);

    await ctx.stub.setEvent(
      "openVotingEvent",
      Buffer.from(
        JSON.stringify({ Type: "Voting Opened", ElectionId: electionId })
      )
    );

    return `Voting for election ${electionId} is now active.`;
  }

  async voteExists(ctx, voteId) {
    const buffer = await ctx.stub.getState(voteId);
    return !!buffer && buffer.length > 0;
  }

  async castVotes(ctx, voteId, voterId, candidateId, electionId) {
    const mspID = ctx.clientIdentity.getMSPID();
    if (mspID !== "votingBoothMSP") {
      throw new Error(
        `User under the following MSP: ${mspID} cannot perform this action`
      );
    }

    // Check if the vote with this ID already exists
    const voteExists = await this.voteExists(ctx, voteId);
    if (voteExists) {
      throw new Error(`The vote with ID ${voteId} already exists`);
    }

    // Create a new vote asset
    const voteAsset = {
      voterId,
      candidateId,
      electionId,
      status: "Voted",
      ownedBy: voterId,
      assetType: "vote",
    };
    const voteBuffer = Buffer.from(JSON.stringify(voteAsset));
    await ctx.stub.putState(voteId, voteBuffer);

    // Retrieve the candidate record by candidateId to increment the vote count
    const candidateAsBytes = await ctx.stub.getState(candidateId);
    if (!candidateAsBytes || candidateAsBytes.length === 0) {
      throw new Error(`Candidate with ID ${candidateId} does not exist`);
    }
    const candidate = JSON.parse(candidateAsBytes.toString());

    // Increment the candidate's vote count
    candidate.voteCount = (candidate.voteCount || 0) + 1;

    // Update the candidate record with the incremented vote count
    const updatedCandidateBuffer = Buffer.from(JSON.stringify(candidate));
    await ctx.stub.putState(candidateId, updatedCandidateBuffer);

    // Optionally emit an event indicating a vote was cast for a specific candidate
    let addVoteEventData = {
      Type: "Vote Cast",
      CandidateId: candidateId,
      ElectionId: electionId,
      VoterId: voterId,
    };
    await ctx.stub.setEvent(
      "voteCastEvent",
      Buffer.from(JSON.stringify(addVoteEventData))
    );

    return `Vote for candidate ${candidateId} in election ${electionId} by voter ${voterId} has been recorded.`;
  }

  async getVotes(ctx, voteId) {
    const exists = await this.voteExists(ctx, voteId);
    if (!exists) {
      throw new Error(`The car ${voteId} does not exist`);
    }
    const buffer = await ctx.stub.getState(voteId);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }

  async endVoting(ctx, electionId) {
    const mspID = ctx.clientIdentity.getMSPID();
    if (mspID !== "votingBoothMSP") {
      throw new Error(`User under MSP: ${mspID} cannot perform this action`);
    }

    const electionAsBytes = await ctx.stub.getState(electionId);
    if (!electionAsBytes || electionAsBytes.length === 0) {
      throw new Error(`Election with ID ${electionId} does not exist`);
    }

    const election = JSON.parse(electionAsBytes.toString());

    if (election.status !== "Voting Active") {
      throw new Error(
        `Cannot end voting. Current status of election ${electionId} is ${election.status}`
      );
    }

    election.status = "Voting Ended";
    await ctx.stub.putState(electionId, Buffer.from(JSON.stringify(election)));

    await ctx.stub.setEvent(
      "endVotingEvent",
      Buffer.from(
        JSON.stringify({ Type: "Voting Ended", ElectionId: electionId })
      )
    );

    return `Voting for election ${electionId} is now ended.`;
  }

  async declareWinner(ctx, electionId, commissionerId) {
    const mspID = ctx.clientIdentity.getMSPID();
    if (mspID !== "auditorMSP") {
      throw new Error(`User under MSP: ${mspID} cannot perform this action`);
    }

    // Retrieve the election data
    const electionAsBytes = await ctx.stub.getState(electionId);
    if (!electionAsBytes || electionAsBytes.length === 0) {
      throw new Error(`Election with ID ${electionId} does not exist`);
    }

    const election = JSON.parse(electionAsBytes.toString());

    // Check if the election status is "Voting Ended"
    if (election.status !== "Voting Ended") {
      throw new Error(
        `Election ${electionId} is not ready for winner declaration. Current status: ${election.status}`
      );
    }

    let highestVoteCount = 0;
    let winner = null;
    const iterator = await ctx.stub.getStateByRange("", "");
    while (true) {
      const candidateResult = await iterator.next();
      if (candidateResult.value && candidateResult.value.value.toString()) {
        const candidate = JSON.parse(candidateResult.value.value.toString());
        if (
          candidate.assetType === "candidate" &&
          candidate.electionId === electionId
        ) {
          if ((candidate.voteCount || 0) > highestVoteCount) {
            highestVoteCount = candidate.voteCount;
            winner = candidate;
          }
        }
      }
      if (candidateResult.done) {
        await iterator.close();
        break;
      }
    }

    if (!winner) {
      throw new Error(
        `No winner could be determined for election ${electionId}.`
      );
    }

    election.status = "Winner Declared";
    election.winner = {
      candidateId: winner.candidateId,
      candidateName: winner.candidateName,
      voteCount: highestVoteCount,
    };

    await ctx.stub.putState(electionId, Buffer.from(JSON.stringify(election)));

    await ctx.stub.setEvent(
      "declareWinnerEvent",
      Buffer.from(
        JSON.stringify({
          Type: "Winner Declared",
          ElectionId: electionId,
          Winner: election.winner,
        })
      )
    );

    return `Winner of election ${electionId} is ${winner.candidateName} with ${highestVoteCount} votes, declared by ${commissionerId}`;
  }

  async getCandidateHistory(ctx, candidateId) {
    let resultIterator = await ctx.stub.getHistoryForKey(candidateId);
    let result = await this._getAllResults(resultIterator, true);
    return JSON.stringify(result);
  }

  async _getAllResults(iterator, isHistory) {
    let allResult = [];

    let res = await iterator.next();
    while (!res.done) {
      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.txId;
          jsonRes.Timestamp = res.value.timestamp;
          jsonRes.Record = JSON.parse(res.value.value.toString());
        } else {
          jsonRes.Key = res.value.key;
          jsonRes.Record = JSON.parse(res.value.value.toString());
        }
        allResult.push(jsonRes);
      }
      res = await iterator.next();
    }
    await iterator.close();
    return allResult;
  }

  async getWinnerData(ctx, electionId) {
    const exists = await this.electionExists(ctx, electionId);
    if (!exists) {
      throw new Error(`The winner declared with  ${electionId} does not exist`);
    }
    const buffer = await ctx.stub.getState(electionId);
    const asset = JSON.parse(buffer.toString());
    return asset;
  }
  async displayVotersCount(ctx) {
    const mspID = ctx.clientIdentity.getMSPID();
    if (mspID === "voterRegistrationAuthorityMSP") {
      // Adjust this condition as needed for relevant MSP
      const collectionName = await getCollectionName(ctx); // Assume getCollectionName gets the correct PDC name

      // Check if voters count exists in the private data collection
      const votersCountBuffer = await ctx.stub.getPrivateData(
        collectionName,
        "votersCount"
      );

      if (!votersCountBuffer || votersCountBuffer.length === 0) {
        // Hardcode a voters count and store it in the PDC if it doesn't already exist
        const votersCount = 10;
        await ctx.stub.putPrivateData(
          collectionName,
          "votersCount",
          Buffer.from(votersCount.toString())
        );
        return `Current voters count is: ${votersCount}`;
      }

      // If it exists, retrieve and return it
      const votersCount = parseInt(votersCountBuffer.toString(), 10);
      return `Current voters count is: ${votersCount}`;
    } else {
      return `User under the following MSP: ${mspID} cannot view the voters count.`;
    }
  }
  // Function to read the voters count from the private data collection
  async readVotersCount(ctx) {
    const mspID = ctx.clientIdentity.getMSPID();

    // Check if the client identity's MSP is either auditorMSP or voterRegistrationAuthorityMSP
    if (mspID === "voterRegistrationAuthorityMSP" || mspID === "auditorMSP") {
      const collectionName = await getCollectionName(ctx); // Retrieve collection name

      // Retrieve the voters count from the private data collection
      const votersCountBuffer = await ctx.stub.getPrivateData(
        collectionName,
        "votersCount"
      );

      if (!votersCountBuffer || votersCountBuffer.length === 0) {
        // If the voters count doesn't exist in the collection, return a message
        return "Voters count has not been set yet.";
      }

      // If voters count exists, parse and return it
      const votersCount = parseInt(votersCountBuffer.toString(), 10);
      return `Current voters count is: ${votersCount}`;
    } else {
      // Return a message if the current MSP doesn't have the right access
      return `User under the following MSP: ${mspID} cannot view the voters count.`;
    }
  }
  // async queryAllVoters(ctx) {
  //   const queryString = {
  //     selector: {
  //       assetType: "voter",
  //     },
  //   };
  //   const collectionName = await getCollectionName(ctx);
  //   let resultIterator = await ctx.stub.getPrivateDataQueryResult(
  //     collectionName,
  //     JSON.stringify(queryString)
  //   );
  //   let result = await this._getAllResults(resultIterator.iterator);
  //   return JSON.stringify(result);
  // }

  async queryAllCandidate(ctx) {
    const queryString = {
      selector: {
        assetType: "candidate",
      },
    };

    let resultIterator = await ctx.stub.getQueryResult(
      JSON.stringify(queryString)
    );
    let result = await this._getAllResults(resultIterator);
    return JSON.stringify(result);
  }
 
}

module.exports = VotingContract;
