import { useState } from "react";
import PopupError from "./Popup/PopupError";
import PopupSuccess from "./Popup/PopupSuccess";

function AdminPanel(props) {
  const [voterAddress, setVoterAddress] = useState("");
  const [isErrorAdmin, setIsErrorAdmin] = useState(null);
  const [errorAdmin, setErrorAdmin] = useState("");
  const [isSuccessAdmin, setIsSuccessAdmin] = useState(null);
  const [successAdmin, setSuccessAdmin] = useState("");
  const [isOpenError, setIsOpenError] = useState(false);
  const [isOpenSuccess, setIsOpenSuccess] = useState(false);

  const togglePopupError = () => {
    setIsOpenError(!isOpenError);
    if (isOpenError) {
      setIsErrorAdmin(null);
      setErrorAdmin("");
    }
  };

  const togglePopupSuccess = () => {
    setIsOpenSuccess(!isOpenSuccess);
    if (isOpenSuccess) {
      setIsSuccessAdmin(null);
      setSuccessAdmin("");
    }
  };

  const handleClickAddVoterButton = async () => {
    if (props.web3.utils.isAddress(voterAddress)) {
      try {
        const transac = await props.contract.methods
          .addVoter(voterAddress)
          .send({ from: props.accounts[0] });

        console.log(
          "A new voter has been registered: ",
          transac.events.VoterRegistered.returnValues._voterAddress
        );
        setIsSuccessAdmin(true);
        setSuccessAdmin(
          "A new voter has been registered: " +
            `${transac.events.VoterRegistered.returnValues._voterAddress}`
        );
        togglePopupSuccess();
      } catch (e) {
        console.log(e);
        setIsErrorAdmin(true);
        setErrorAdmin(
          "Transaction rejected: Voter might have already been added or wrong workflow status!"
        );
        togglePopupError();
      }
    } else {
      setIsErrorAdmin(true);
      setErrorAdmin("This is not a valid ethereum address");
      togglePopupError();
    }

    setVoterAddress("");
  };

  const handleClickStartProposalsRegistration = async () => {
    try {
      const transac = await props.contract.methods
        .startProposalsRegistering()
        .send({ from: props.accounts[0] });
      console.log(
        "Workflow status change to: ",
        transac.events.WorkflowStatusChange.returnValues._newStatus
      );
      setIsSuccessAdmin(true);
      setSuccessAdmin(
        "Workflow status change to: " +
          `${transac.events.WorkflowStatusChange.returnValues._newStatus}`
      );
      togglePopupSuccess();
    } catch (e) {
      console.log(e);
      setIsErrorAdmin(true);
      setErrorAdmin(
        "Transaction rejected: you might not change for this workflow status!"
      );
      togglePopupError();
    }
  };

  const handleClickEndProposalsRegistration = async () => {
    try {
      const transac = await props.contract.methods
        .endProposalsRegistering()
        .send({ from: props.accounts[0] });
      console.log(
        "Workflow status change to: ",
        transac.events.WorkflowStatusChange.returnValues._newStatus
      );
      setIsSuccessAdmin(true);
      setSuccessAdmin(
        "Workflow status change to: " +
          `${transac.events.WorkflowStatusChange.returnValues._newStatus}`
      );
      togglePopupSuccess();
    } catch (e) {
      console.log(e);
      setIsErrorAdmin(true);
      setErrorAdmin(
        "Transaction rejected: you might not change for this workflow status!"
      );
      togglePopupError();
    }
  };

  const handleClickStartVotingSession = async () => {
    try {
      const transac = await props.contract.methods
        .startVotingSession()
        .send({ from: props.accounts[0] });
      console.log(
        "Workflow status change to: ",
        transac.events.WorkflowStatusChange.returnValues._newStatus
      );
      setIsSuccessAdmin(true);
      setSuccessAdmin(
        "Workflow status change to: " +
          `${transac.events.WorkflowStatusChange.returnValues._newStatus}`
      );
      togglePopupSuccess();
    } catch (e) {
      console.log(e);
      setIsErrorAdmin(true);
      setErrorAdmin(
        "Transaction rejected: you might not change for this workflow status!"
      );
      togglePopupError();
    }
  };

  const handleClickEndVotingSession = async () => {
    try {
      const transac = await props.contract.methods
        .endVotingSession()
        .send({ from: props.accounts[0] });
      console.log(
        "Workflow status change to: ",
        transac.events.WorkflowStatusChange.returnValues._newStatus
      );
      setIsSuccessAdmin(true);
      setSuccessAdmin(
        "Workflow status change to: " +
          `${transac.events.WorkflowStatusChange.returnValues._newStatus}`
      );
      togglePopupSuccess();
    } catch (e) {
      console.log(e);
      setIsErrorAdmin(true);
      setErrorAdmin(
        "Transaction rejected: you might not change for this workflow status!"
      );
      togglePopupError();
    }
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
        {isOpenError && (
          <PopupError
            errorAdmin={errorAdmin}
            togglePopupError={togglePopupError}
            isErrorAdmin={isErrorAdmin}
          />
        )}
        {isOpenSuccess && (
          <PopupSuccess
            successAdmin={successAdmin}
            togglePopupSuccess={togglePopupSuccess}
            isSuccessAdmin={isSuccessAdmin}
          />
        )}
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
