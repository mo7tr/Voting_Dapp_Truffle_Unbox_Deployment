import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Welcome from "./Welcome";
import Connected from "./Connected";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import Events from "./Events";
import AdminPanel from "./AdminPanel";
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

  const [workflowStatusChangeEvents, setWorkflowStatusChangeEvents] =
    useState(null);

  console.log("workflowStatusChangeEvent =>", workflowStatusChangeEvents);

  const [whitelist, setWhitelist] = useState([]);
  console.log("whitelist =>", whitelist);

  useEffect(() => {
    async function getDetails() {
      let owner;
      let workflowEvents;
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

        workflowEvents = await contract.getPastEvents(
          "WorkflowStatusChange",
          options1
        );

        console.log("workflowEvents =>", workflowEvents);

        contract.events.WorkflowStatusChange(options2).on("data", (event) => {
          workflowEvents.push(event);
          setWorkflowStatusChangeEvents(workflowEvents);
          setWorkflowStatus(
            workflowEvents[workflowEvents.length - 1].returnValues._newStatus
          );
          console.log("### workflow events listener");
        });

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
          console.log("### whitelist events listener");
        });

        setWhitelist(wlAddresses);
        setUserAddress(accounts.toString());
        setContractAddress(address);
        setAdminAddress(owner);
        setWorkflowStatusChangeEvents(workflowEvents);
        if (workflowEvents.length > 0) {
          setWorkflowStatus(
            workflowEvents[workflowEvents.length - 1].returnValues._newStatus
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
      {userAddress === adminAddress ? (
        <AdminPanel contract={contract} accounts={accounts} />
      ) : (
        <div></div>
      )}
      <Events
        whitelist={whitelist}
        workflowStatusChangeEvents={workflowStatusChangeEvents}
        // accounts={accounts}
      />
      {/* <Desc /> */}
    </div>
  );
}

export default Intro;
