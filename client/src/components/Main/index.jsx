import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Welcome from "./Welcome";
import Connected from "./Connected";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import Events from "./Events";
import AdminPanel from "./AdminPanel";
import UserPanel from "./UserPanel";

function Intro() {
  const {
    state,
    state: { contract, accounts, address, web3 },
  } = useEth();

  const [userAddress, setUserAddress] = useState(null);
  const [contractAddress, setContractAddress] = useState(null);
  const [adminAddress, setAdminAddress] = useState(null);
  const [workflowStatus, setWorkflowStatus] = useState(null);
  const [workflowStatusChangeEvents, setWorkflowStatusChangeEvents] = useState(
    []
  );
  const [whitelist, setWhitelist] = useState([]);
  const [proposalRegisteredEvents, setProposalRegisteredEvents] = useState([]);
  const [votedEvents, setVotedEvents] = useState([]);

  useEffect(() => {
    async function getDetails() {
      let owner;
      let workflowEvents;
      let voterRegisteredEvents;
      let proposalEvents;
      let votes;

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

        proposalEvents = await contract.getPastEvents(
          "ProposalRegistered",
          options1
        );

        contract.events.ProposalRegistered(options2).on("data", (event) => {
          proposalEvents.push(event);
          console.log("proposal listener proposalEvents =>", proposalEvents);
          setProposalRegisteredEvents(proposalEvents);
          console.log("### proposal events listener");
        });

        votes = await contract.getPastEvents("Voted", options1);

        contract.events.Voted(options2).on("data", (event) => {
          votes.push(event);
          console.log("vote listener votes =>", votes);
          setVotedEvents(votes);
          console.log("### vote events listener");
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
        setProposalRegisteredEvents(proposalEvents);
        setVotedEvents(votes);
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
        <AdminPanel contract={contract} accounts={accounts} web3={web3} />
      ) : (
        <div></div>
      )}

      <UserPanel
        contract={contract}
        accounts={accounts}
        web3={web3}
        proposalRegisteredEvents={proposalRegisteredEvents}
        workflowStatus={workflowStatus}
      />
      <hr />
      <Events
        whitelist={whitelist}
        workflowStatusChangeEvents={workflowStatusChangeEvents}
        proposalRegisteredEvents={proposalRegisteredEvents}
        votedEvents={votedEvents}
        web3={web3}
      />
    </div>
  );
}

export default Intro;
