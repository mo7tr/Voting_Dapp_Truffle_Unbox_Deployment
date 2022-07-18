import { useState, useEffect } from "react";

function Connected(props) {
  const [workflowStatus, setWorkflowStatus] = useState("");
  const [isWl, setIsWl] = useState(false);

  useEffect(() => {
    let isWL = false;
    for (let i = 0; i < props.whitelist.length; i++) {
      if (props.whitelist[i] === props.userAddress.toString()) {
        isWL = true;
      }
      setIsWl(isWL);
    }

    switch (props.workflowStatus) {
      case "0":
        setWorkflowStatus("Registering voters");
        break;
      case "1":
        setWorkflowStatus("Proposals registration started");
        break;
      case "2":
        setWorkflowStatus("Proposals registration ended");
        break;
      case "3":
        setWorkflowStatus("Voting session started");
        break;
      case "4":
        setWorkflowStatus("Voting session ended");
        break;
      default:
        setWorkflowStatus("not sync to voting contract");
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
