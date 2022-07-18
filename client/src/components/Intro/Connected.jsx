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
        <li>
          Your address is:{" "}
          <span style={{ fontWeight: "bold" }}>{props.userAddress}</span>
        </li>
        <li>
          Are you Wl? <span style={{ fontWeight: "bold" }}>{`${isWl}`}</span>
        </li>
        <li>
          Voting contract address:{" "}
          <span style={{ fontWeight: "bold" }}>{props.contractAddress}</span>
        </li>
        <li>
          Admin address:{" "}
          <span style={{ fontWeight: "bold" }}>{props.adminAddress}</span>
        </li>
        <li>
          State of the voting process:{" "}
          <span style={{ fontWeight: "bold" }}>{workflowStatus}</span>
        </li>
      </ul>
    </div>
  );
}

export default Connected;
