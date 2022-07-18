import { useEffect, useState } from "react";

function Events(props) {
  const [workflowListToDisplay, setWorkflowListToDisplay] = useState(null);

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

    setWorkflowListToDisplay(workflowStatusChangeEvents);
  }, [props.workflowStatusChangeEvents]);

  let workflowStatusEventsDisplay = (
    <p>No change done by the admin ➡️ Still in voter registration process!</p>
  );

  if (workflowListToDisplay && workflowListToDisplay.length > 0) {
    workflowStatusEventsDisplay = (
      <ol>
        {workflowListToDisplay.map((workflowEvent, i) => (
          <li key={i}>
            {workflowEvent.returnValues._previousStatus} ➡️{" "}
            {workflowEvent.returnValues._newStatus}
          </li>
        ))}
      </ol>
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
        <summary>Truffle</summary>
        <p>
          Keep Ganache running and open another terminal. Let's compile and
          deploy our contracts to Ganache.
        </p>
        <code>
          {`$ cd truffle\n`}
          {`$ truffle migrate --network development\n`}
          <span className="dim-color">
            # The `development` network points to Ganache, it's configured in
            truffle/truffle-config.js on line 45.
          </span>
        </code>
      </details>
    </>
  );
}

export default Events;
