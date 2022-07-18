import { useState, useEffect } from "react";

function AdminPanel(props) {
  const [voterAddress, setVoterAddress] = useState("");

  const handleOnClickRegisterVoterButton = async () => {
    console.log(
      "handleOnClickRegisterVoterButton voterAddress=>",
      voterAddress
    );
    const transac = await props.contract.methods
      .registerVoters(voterAddress)
      .send({ from: props.accounts[0] });
    console.log(
      "A new voter has been registered: ",
      transac.events.VoterRegistered.returnValues._voterAddress
    );

    setVoterAddress("");
  };

  return (
    <div>
      <h2>📱 Admin dashboard</h2>
      <div style={{ marginTop: 15 }}>
        <p style={{ fontWeight: "bold" }}>Register Voter</p>
        <input
          style={{ width: "60%" }}
          placeholder={"Set voter address..."}
          value={voterAddress}
          onChange={(e) => setVoterAddress(e.target.value)}
        />
        <button
          style={{ marginLeft: 10 }}
          onClick={() => {
            handleOnClickRegisterVoterButton();
          }}
        >
          Add new voter to whitelist
        </button>
      </div>
      <hr />
    </div>
  );
}

export default AdminPanel;
