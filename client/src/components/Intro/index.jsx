import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Welcome from "./Welcome";
import Connected from "./Connected";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import Events from "./Events";
//import Desc from "./Desc";

function Intro() {
  const {
    state,
    state: { contract, accounts, address },
  } = useEth();

  const [userAddress, setUserAddress] = useState(null);

  const [contractAddress, setContractAddress] = useState(null);

  const [adminAddress, setAdminAddress] = useState(null);

  const [workflowStatus, setWorkflowStatus] = useState(null);

  const [whitelist, setWhitelist] = useState([]);

  useEffect(() => {
    async function getDetails() {
      let owner;
      let WorkflowStatusChangeEvents;
      let voterRegisteredEvents;

      let options1 = {
        fromBlock: 0, //Number || "earliest" || "pending" || "latest"
        toBlock: "latest",
      };

      let options2 = {
        fromBlock: "latest",
      };

      if (contract && accounts && address) {
        owner = await contract.methods.owner().call();

        WorkflowStatusChangeEvents = await contract.getPastEvents(
          "WorkflowStatusChange",
          options1
        );

        contract.events.WorkflowStatusChange(options2).on("data", (event) => {
          WorkflowStatusChangeEvents.push(event);
          setWorkflowStatus(
            WorkflowStatusChangeEvents[WorkflowStatusChangeEvents.length - 1]
              .returnValues._newStatus
          );
        });

        console.log("WorkflowStatusChangeEvents", WorkflowStatusChangeEvents);

        voterRegisteredEvents = await contract.getPastEvents(
          "VoterRegistered",
          options1
        );

        let wlAddresses = voterRegisteredEvents.map(
          (object) => object.returnValues._voterAddress
        );

        contract.events.VoterRegistered(options2).on("data", (event) => {
          wlAddresses.push(event.returnValues._voterAddress);
          setWhitelist(wlAddresses);
        });

        setWhitelist(wlAddresses);
        setUserAddress(accounts);
        setContractAddress(address);
        setAdminAddress(owner);
        if (WorkflowStatusChangeEvents.length > 0) {
          setWorkflowStatus(
            WorkflowStatusChangeEvents[WorkflowStatusChangeEvents.length - 1]
              .returnValues._newStatus
          );
        } else {
          setWorkflowStatus("0");
        }
      }
    }
    getDetails();
  }, [contract, accounts, address]);

  return (
    <div>
      <Welcome />
      {!state.artifact ? (
        <NoticeNoArtifact />
      ) : !state.contract ? (
        <NoticeWrongNetwork />
      ) : (
        <Connected
          userAddress={userAddress}
          workflowStatus={workflowStatus}
          contractAddress={contractAddress}
          whitelist={whitelist}
          adminAddress={adminAddress}
        />
      )}
      <hr />
      <Events whitelist={whitelist} />
      {/* <Desc /> */}
    </div>
  );
}

export default Intro;
