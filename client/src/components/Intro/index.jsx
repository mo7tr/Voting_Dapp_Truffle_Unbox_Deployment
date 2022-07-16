import Welcome from "./Welcome";
import Connected from "./Connected";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
//import Desc from "./Desc";
import useEth from "../../contexts/EthContext/useEth";
import { useState, useEffect } from "react";

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
  console.log("whitelist =>", whitelist);

  useEffect(() => {
    async function getDetails() {
      let currentWorkflowStatus;
      let owner;
      let wlAddresses = [];

      let options1 = {
        fromBlock: 0, //Number || "earliest" || "pending" || "latest"
      };

      let options2 = {
        fromBlock: 0, //Number || "earliest" || "pending" || "latest"
        toBlock: "latest",
      };

      if (contract && accounts && address) {
        currentWorkflowStatus = await contract.methods.workflowStatus().call();

        owner = await contract.methods.owner().call();

        // wlAddresses = await contract.getPastEvents("VoterRegistered", options1);

        contract.events
          .VoterRegistered(options1)
          .on("data", (event) => wlAddresses.push(event));

        console.log("#", wlAddresses);

        setWhitelist(wlAddresses);
        setUserAddress(accounts);
        setContractAddress(address);
        setWorkflowStatus(currentWorkflowStatus);
        setAdminAddress(owner);
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
          //isWl={isWl}
          adminAddress={adminAddress}
        />
      )}
      {/* <Desc /> */}
    </div>
  );
}

export default Intro;
