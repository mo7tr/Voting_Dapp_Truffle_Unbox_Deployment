import { useState, useEffect } from "react";

function Connected(props) {
  const [workflowStatus, setWorkflowStatus] = useState("");
  const [isWl, setIsWl] = useState(null);

  useEffect(() => {
    console.log("props.whitelist", props.whitelist);
    for (let i = 0; i < props.whitelist.length; i++) {
      if (
        props.whitelist[i].returnValues._voterAddress ===
        props.userAddress.toString()
      ) {
        setIsWl(true);
      } else {
        setIsWl(false);
      }
    }

    switch (props.workflowStatus) {
      case "0":
        setWorkflowStatus("Registering Voters");
        break;
      case "1":
        setWorkflowStatus("Proposals Registration Started");
        break;
      case "2":
        setWorkflowStatus("Proposals Registration Ended");
        break;
      case "3":
        setWorkflowStatus("Voting Session Started");
        break;
      case "4":
        setWorkflowStatus("VotingSessionEnded");
        break;
      default:
        setWorkflowStatus("not sync");
    }
  }, [props.workflowStatus, props.whitelist, props.userAddress]);

  return (
    <div>
      <ul>
        <li>Your address is: {props.userAddress}</li>
        <li>Are you Wl? {`${isWl}`}</li>
        <li>Voting contract address: {props.contractAddress}</li>
        <li>Admin address: {props.adminAddress}</li>
        <li>State of the voting process: {workflowStatus}</li>
      </ul>
    </div>
  );
}

export default Connected;
