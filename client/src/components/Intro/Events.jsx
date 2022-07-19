import { useEffect, useState } from "react";

function Events(props) {
  const [workflowList, setWorkflowList] = useState([]);
  const [proposalList, setProposalList] = useState([]);
  const [votesList, setVotesList] = useState([]);

  useEffect(() => {
    let workflowStatusChangeEvents = props.workflowStatusChangeEvents;

    if (workflowStatusChangeEvents && workflowStatusChangeEvents.length === 1) {
      workflowStatusChangeEvents[0].returnValues._previousStatus =
        "Registering voters";
      workflowStatusChangeEvents[0].returnValues._newStatus =
        "Proposals registration started";
    } else if (
      workflowStatusChangeEvents &&
      workflowStatusChangeEvents.length === 2
    ) {
      workflowStatusChangeEvents[0].returnValues._previousStatus =
        "Registering voters";
      workflowStatusChangeEvents[0].returnValues._newStatus =
        "Proposals registration started";
      workflowStatusChangeEvents[1].returnValues._previousStatus =
        "Proposals registration started";
      workflowStatusChangeEvents[1].returnValues._newStatus =
        "Proposals registration ended";
    } else if (
      workflowStatusChangeEvents &&
      workflowStatusChangeEvents.length === 3
    ) {
      workflowStatusChangeEvents[0].returnValues._previousStatus =
        "Registering voters";
      workflowStatusChangeEvents[0].returnValues._newStatus =
        "Proposals registration started";
      workflowStatusChangeEvents[1].returnValues._previousStatus =
        "Proposals registration started";
      workflowStatusChangeEvents[1].returnValues._newStatus =
        "Proposals registration ended";
      workflowStatusChangeEvents[2].returnValues._previousStatus =
        "Proposals registration ended";
      workflowStatusChangeEvents[2].returnValues._newStatus =
        "Voting session started";
    } else if (
      workflowStatusChangeEvents &&
      workflowStatusChangeEvents.length === 4
    ) {
      workflowStatusChangeEvents[0].returnValues._previousStatus =
        "Registering voters";
      workflowStatusChangeEvents[0].returnValues._newStatus =
        "Proposals registration started";
      workflowStatusChangeEvents[1].returnValues._previousStatus =
        "Proposals registration started";
      workflowStatusChangeEvents[1].returnValues._newStatus =
        "Proposals registration ended";
      workflowStatusChangeEvents[2].returnValues._previousStatus =
        "Proposals registration ended";
      workflowStatusChangeEvents[2].returnValues._newStatus =
        "Voting session started";
      workflowStatusChangeEvents[3].returnValues._previousStatus =
        "Voting session started";
      workflowStatusChangeEvents[3].returnValues._newStatus =
        "Voting session ended";
    }

    let allAboutProposals = [];
    const gatheredDetailsProposals = async () => {
      for (
        let index = 0;
        index < props.proposalRegisteredEvents.length;
        index++
      ) {
        let blockNumber = props.proposalRegisteredEvents[index].blockNumber;
        let timestamp = (await props.web3.eth.getBlock(blockNumber)).timestamp;
        let date = new Date(timestamp * 1000).toUTCString();
        let from = (
          await props.web3.eth.getTransaction(
            props.proposalRegisteredEvents[index].transactionHash
          )
        ).from;
        let object = {
          _proposalId:
            props.proposalRegisteredEvents[index].returnValues._proposalId,
          _description:
            props.proposalRegisteredEvents[index].returnValues._description,
          dateUTC: date,
          sender: from,
        };
        allAboutProposals.push(object);
      }
      setProposalList(allAboutProposals);
    };

    let allAboutVotes = [];
    const gatheredDetailsVotes = async () => {
      for (let index2 = 0; index2 < props.votedEvents.length; index2++) {
        let blockNumber = props.votedEvents[index2].blockNumber;
        let timestamp = (await props.web3.eth.getBlock(blockNumber)).timestamp;
        let date = new Date(timestamp * 1000).toUTCString();
        let object = {
          _proposalId: props.votedEvents[index2].returnValues._proposalId,
          _voterAddress: props.votedEvents[index2].returnValues._voterAddress,
          dateUTC: date,
        };
        allAboutVotes.push(object);
      }
      setVotesList(allAboutVotes);
    };

    if (props.proposalRegisteredEvents.length > 0) {
      gatheredDetailsProposals();
    }

    if (props.votedEvents.length > 0) {
      gatheredDetailsVotes();
    }

    setWorkflowList(workflowStatusChangeEvents);
  }, [
    props.workflowStatusChangeEvents,
    props.proposalRegisteredEvents,
    props.whitelist,
    props.votedEvents,
    props.web3,
  ]);

  let workflowStatusEventsDisplay = (
    <p>
      No change done by the admin ➡️ Still in{" "}
      <span style={{ fontWeight: "bold" }}>voter registration </span> process!
    </p>
  );

  if (workflowList && workflowList.length > 0) {
    workflowStatusEventsDisplay = (
      <ol>
        {workflowList.map((workflowEvent, i) => (
          <li style={{ fontWeight: "bold" }} key={i}>
            {workflowEvent.returnValues._previousStatus} ➡️{" "}
            {workflowEvent.returnValues._newStatus}
          </li>
        ))}
      </ol>
    );
  }

  let proposalsDisplay = <p>No proposal has been submitted yet!</p>;

  if (proposalList.length > 0) {
    proposalsDisplay = (
      <ul>
        {proposalList.map((proposal, k) => (
          <li style={{ fontWeight: "bold" }} key={k}>
            {proposal._proposalId} ➡️ {proposal._description}
            <details style={{ padding: 0 }}>
              <summary
                style={{ fontWeight: "normal", fontSize: 14, padding: 5 }}
              >
                Details:
              </summary>
              <p style={{ fontWeight: "normal" }}>From: {proposal.sender}</p>
              <p style={{ fontWeight: "normal" }}>Date: {proposal.dateUTC}</p>
            </details>
          </li>
        ))}
      </ul>
    );
  }

  let votesDisplay = <p>No vote has been submitted yet!</p>;

  if (votesList.length > 0) {
    votesDisplay = (
      <ul>
        {votesList.map((vote, l) => (
          <li style={{ fontWeight: "bold" }} key={l}>
            {vote._voterAddress} ➡️ {vote._proposalId}
            <details style={{ padding: 0 }}>
              <summary
                style={{ fontWeight: "normal", fontSize: 14, padding: 5 }}
              >
                Details:
              </summary>
              <p style={{ fontWeight: "normal" }}>Date: {vote.dateUTC}</p>
            </details>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <h2>✍️ Events listing</h2>
      <p>We have no secret for you!</p>

      <details>
        <summary>Voting process progress</summary>
        <p>Follow the progress of the voting process:</p>
        {workflowStatusEventsDisplay}
      </details>

      <details>
        <summary>Whitelist</summary>
        <p>Here are all the whitelisted addresses:</p>
        <ul>
          {props.whitelist.map((address, j) => (
            <li key={j}>{address}</li>
          ))}
        </ul>
      </details>

      <details>
        <summary>Proposals</summary>
        <p>
          Find the <span style={{ fontWeight: "bold" }}>ID</span> of the
          proposal you want to vote for:
        </p>
        {proposalsDisplay}
      </details>

      <details>
        <summary>Votes</summary>
        <p>
          Summary of the <span style={{ fontWeight: "bold" }}>votes</span>:
        </p>
        {votesDisplay}
      </details>
    </>
  );
}

export default Events;
