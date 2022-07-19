import { useState } from "react";

function AdminPanel(props) {
  const [voterAddress, setVoterAddress] = useState("");

  const handleClickAddVoterButton = async () => {
    if (props.web3.utils.isAddress(voterAddress)) {
      const transac = await props.contract.methods
        .addVoter(voterAddress)
        .send({ from: props.accounts[0] });
      console.log(
        "A new voter has been registered: ",
        transac.events.VoterRegistered.returnValues._voterAddress
      );

      setVoterAddress("");
    }
  };

  const handleClickStartProposalsRegistration = async () => {
    const transac = await props.contract.methods
      .startProposalsRegistering()
      .send({ from: props.accounts[0] });
    console.log(
      "Workflow status change to: ",
      transac.events.WorkflowStatusChange.returnValues._newStatus
    );
  };

  const handleClickEndProposalsRegistration = async () => {
    const transac = await props.contract.methods
      .endProposalsRegistering()
      .send({ from: props.accounts[0] });
    console.log(
      "Workflow status change to: ",
      transac.events.WorkflowStatusChange.returnValues._newStatus
    );
  };

  const handleClickStartVotingSession = async () => {
    const transac = await props.contract.methods
      .startVotingSession()
      .send({ from: props.accounts[0] });
    console.log(
      "Workflow status change to: ",
      transac.events.WorkflowStatusChange.returnValues._newStatus
    );
  };

  const handleClickEndVotingSession = async () => {
    const transac = await props.contract.methods
      .endVotingSession()
      .send({ from: props.accounts[0] });
    console.log(
      "Workflow status change to: ",
      transac.events.WorkflowStatusChange.returnValues._newStatus
    );
  };

  return (
    <div>
      <h2>🕹 Admin dashboard</h2>
      <div style={{ marginTop: 15 }}>
        <p style={{ fontWeight: "bold" }}>Register Voter:</p>
        <input
          style={{ width: "60%" }}
          placeholder={"Set voter address..."}
          value={voterAddress}
          onChange={(e) => setVoterAddress(e.target.value)}
        />
        <button
          style={{ marginLeft: 10, width: "30%" }}
          onClick={() => {
            handleClickAddVoterButton();
          }}
        >
          Add new voter to whitelist
        </button>
      </div>
      <div style={{ marginTop: 15 }}>
        <p style={{ fontWeight: "bold" }}>Start proposals registration:</p>
        <button
          style={{ width: "30%" }}
          onClick={() => {
            handleClickStartProposalsRegistration();
          }}
        >
          Start proposals registration
        </button>
      </div>

      <div style={{ marginTop: 15 }}>
        <p style={{ fontWeight: "bold" }}>End proposals registration:</p>
        <button
          style={{ width: "30%" }}
          onClick={() => {
            handleClickEndProposalsRegistration();
          }}
        >
          End proposals registration
        </button>
      </div>

      <div style={{ marginTop: 15 }}>
        <p style={{ fontWeight: "bold" }}>Start voting session:</p>
        <button
          style={{ width: "30%" }}
          onClick={() => {
            handleClickStartVotingSession();
          }}
        >
          Start voting session
        </button>
      </div>
      <div style={{ marginTop: 15 }}>
        <p style={{ fontWeight: "bold" }}>End voting session:</p>
        <button
          style={{ width: "30%" }}
          onClick={() => {
            handleClickEndVotingSession();
          }}
        >
          End voting session
        </button>
      </div>
      <hr />
    </div>
  );
}

export default AdminPanel;
