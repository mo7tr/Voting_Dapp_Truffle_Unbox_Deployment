import { useState, useEffect } from "react";
import useEth from "../../contexts/EthContext/useEth";

function Details() {
  const {
    state: { contract, accounts, address },
  } = useEth();
  // console.log("state =>", state);
  // console.log("contract =>", contract);
  // console.log("accounts =>", accounts);
  // console.log("address =>", address);

  const [userAddress, setUserAddress] = useState(null);
  //console.log("userAddress =>", userAddress);

  const [isWl, setIsWl] = useState(false);
  // console.log("isWl =>", isWl);

  const [contractAddress, setContractAddress] = useState(null);
  // console.log("contractAddress =>", contractAddress);

  const [adminAddress, setAdminAddress] = useState(null);
  console.log("adminAddress =>", adminAddress);

  const [workflowStatus, setWorkflowStatus] = useState(null);
  // console.log("workflowStatus =>", workflowStatus);

  let options1 = {
    fromBlock: 0, //Number || "earliest" || "pending" || "latest"
  };

  let options2 = {
    fromBlock: 0, //Number || "earliest" || "pending" || "latest"
    toBlock: "latest",
  };

  let wlAddresses2 = [];

  if (contract) {
    contract.events
      .VoterRegistered(options1)
      .on("data", (event) => wlAddresses2.push(event));

    if (wlAddresses2.length > 0) {
      console.log("wlAddresses 2", wlAddresses2);
    }
  }

  useEffect(() => {
    async function getDetails() {
      let currentWorkflowStatus;
      let wlAddresses1;

      if (contract !== null && accounts !== null && address) {
        currentWorkflowStatus = await contract.methods.workflowStatus().call();
        // console.log("currentWorkflowStatus 1=>", currentWorkflowStatus);
        switch (currentWorkflowStatus) {
          case "0":
            currentWorkflowStatus = "Registering Voters";
            break;
          case "1":
            currentWorkflowStatus = "Proposals Registration Started";
            break;
          case "2":
            currentWorkflowStatus = "Proposals Registration Ended";
            break;
          case "3":
            currentWorkflowStatus = "Voting Session Started";
            break;
          case "4":
            currentWorkflowStatus = "VotingSessionEnded";
            break;
          default:
            currentWorkflowStatus = "not sync";
        }

        // contract.events
        //   .VoterRegistered(options)
        //   .on("data", (event) => wlAddresses.push(event));

        wlAddresses1 = await contract.getPastEvents(
          "VoterRegistered",
          options2
        );
        console.log("wlAddresses 1", wlAddresses1);

        for (let i = 0; i < wlAddresses1.length; i++) {
          if (
            wlAddresses1[i].returnValues._voterAddress === accounts.toString()
          ) {
            setIsWl(true);
          } else {
            setIsWl(false);
          }
        }

        // contract.events
        //   .VoterRegistered(options1)
        //   .on("data", (event) => wlAddresses2.push(event));

        // if (wlAddresses2.length > 0) {
        //   console.log("wlAddresses 2", wlAddresses2);
        // }

        setUserAddress(accounts);
        setContractAddress(address);
        setWorkflowStatus(currentWorkflowStatus);
      }
    }
    getDetails();
  }, [contract, accounts, address]);

  return (
    <div>
      <ul>
        <li>Your address is: {userAddress}</li>
        <li>Are you Wl? {`${isWl}`}</li>
        <li>Voting contract address: {contractAddress}</li>
        <li>Admin address: {}</li>
        <li>State of the voting process: {workflowStatus}</li>
      </ul>
    </div>
  );
}

export default Details;
