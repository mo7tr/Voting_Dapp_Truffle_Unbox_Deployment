import { useState } from "react";
import PopupVoter from "./Popup/PopupVoter";
import PopupProposal from "./Popup/PopupProposal";
import PopupError from "./Popup/PopupError";
import PopupSuccess from "./Popup/PopupSuccess";
import PopupWinner from "./Popup/PopupWinner";

function UserPanel(props) {
  const [description, setDescription] = useState("");
  const [ID, setID] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const [isOpenGetVoter, setIsOpenGetVoter] = useState(false);
  const [isOpenGetProposal, setIsOpenGetProposal] = useState(false);
  const [isOpenError, setIsOpenError] = useState(false);
  const [isVoterWl, setIsVoterWl] = useState(null);
  const [hasVoted, setHasVoted] = useState(null);
  const [whichProposal, setWhichProposal] = useState("");
  const [isEthAddress, setIsEthAddress] = useState(null);
  const [oneProposal, setOneProposal] = useState("");
  const [isProposalValid, setIsProposalValid] = useState(null);
  const [proposalDescription, setProposalDescription] = useState("");
  const [voteCount, setVoteCount] = useState("");
  const [isErrorUser, setIsErrorUser] = useState(null);
  const [errorUser, setErrorUser] = useState("");
  const [isSuccessUser, setIsSuccessUser] = useState(null);
  const [successUser, setSuccessUser] = useState("");
  const [isOpenSuccess, setIsOpenSuccess] = useState(false);
  const [isOpenWinner, setIsOpenWinner] = useState(false);
  const [winnerDescription, setWinnerDescription] = useState("");
  const [winnerVoteCount, setWinnerVoteCount] = useState("");
  const [winnerProposalId, setWinnerProposalId] = useState("");
  const [isWinner, setIsWinner] = useState(false);

  const togglePopupWinner = () => {
    setIsOpenWinner(!isOpenWinner);
    if (isOpenGetVoter) {
      setWinnerVoteCount("");
      setWinnerProposalId("");
      setWinnerDescription("");
      setIsWinner(null);
    }
  };

  const togglePopupGetVoter = () => {
    setIsOpenGetVoter(!isOpenGetVoter);
    if (isOpenGetVoter) {
      setIsVoterWl(null);
      setHasVoted(null);
      setWhichProposal("");
      setIsEthAddress(null);
    }
  };

  const togglePopupGetProposal = () => {
    setIsOpenGetProposal(!isOpenGetProposal);
    if (isOpenGetProposal) {
      setProposalDescription("");
      setVoteCount("");
      setIsProposalValid(null);
      setOneProposal("");
    }
  };

  const togglePopupError = () => {
    setIsOpenError(!isOpenError);
    if (isOpenError) {
      setIsErrorUser(null);
      setErrorUser("");
    }
  };

  const togglePopupSuccess = () => {
    setIsOpenSuccess(!isOpenSuccess);
    if (isOpenSuccess) {
      setIsSuccessUser(null);
      setSuccessUser("");
    }
  };

  const handleClickRegisterProposals = async () => {
    if (description.length > 0) {
      try {
        const transac = await props.contract.methods
          .addProposal(description)
          .send({ from: props.accounts[0] });
        console.log(
          "A new proposition has been registered: ",
          transac.events.ProposalRegistered.returnValues._proposalId,
          transac.events.ProposalRegistered.returnValues._description
        );
        setIsSuccessUser(true);
        setSuccessUser("Proposal registered!");
        togglePopupSuccess();
      } catch (e) {
        console.log(e);
        setIsErrorUser(true);
        setErrorUser(
          "Transaction rejected: If you are whitelisted, it might be an inadequate workflow status!"
        );
        togglePopupError();
      }
    } else {
      setIsErrorUser(true);
      setErrorUser("description can't be an empty string");
      togglePopupError();
    }
    setDescription("");
  };

  const handleClickVote = async () => {
    if (Number(ID) < props.proposalRegisteredEvents.length && Number(ID) >= 0) {
      try {
        const transac = await props.contract.methods
          .setVote(ID)
          .send({ from: props.accounts[0] });
        console.log(
          "A new vote has been set: ",
          transac.events.Voted.returnValues._voterAddress,
          transac.events.Voted.returnValues._proposalId
        );
        setIsSuccessUser(true);
        setSuccessUser(
          `Vote registered for proposal ID n° ${transac.events.Voted.returnValues._proposalId}`
        );
        togglePopupSuccess();
      } catch (e) {
        console.log(e);
        setIsErrorUser(true);
        setErrorUser(
          "Transaction rejected: If you are whitelisted, it might be an inadequate workflow status or you already Voted!"
        );
        togglePopupError();
      }
    } else {
      setIsErrorUser(true);
      setErrorUser(
        `Proposal ID invalid, Must be between 0 and ${props.proposalRegisteredEvents.length}`
      );
      togglePopupError();
    }
    setID("");
  };

  const handleClickGetVoter = async () => {
    if (props.web3.utils.isAddress(voterAddress)) {
      const transac = await props.contract.methods
        .getVoter(voterAddress)
        .call({ from: props.accounts[0] });
      setIsEthAddress(true);
      setIsVoterWl(transac.isRegistered);
      setHasVoted(transac.hasVoted);
      setWhichProposal(transac.votedProposalId);
      togglePopupGetVoter();
    } else {
      setIsEthAddress(false);
      togglePopupGetVoter();
    }
    setVoterAddress("");
  };

  const handleClickGetOneProposal = async () => {
    if (
      Number(oneProposal) < props.proposalRegisteredEvents.length &&
      Number(oneProposal) >= 0
    ) {
      const transac = await props.contract.methods
        .getOneProposal(oneProposal)
        .call({ from: props.accounts[0] });
      console.log("transac.voteCount =>", transac.voteCount);
      setIsProposalValid(true);
      setVoteCount(transac.voteCount);
      setProposalDescription(transac.description);
      togglePopupGetProposal();
    } else {
      setIsProposalValid(false);
      togglePopupGetProposal();
    }
  };

  const handleClickGetWinner = async () => {
    console.log("workflowstatus =>", props.workflowStatus);
    if (props.workflowStatus === "4") {
      const winningProposal = await props.contract.methods
        .winningProposalID()
        .call({ from: props.accounts[0] });

      console.log("winning proposal =>", winningProposal);

      const winner = await props.contract.methods
        .getOneProposal(winningProposal)
        .call({ from: props.accounts[0] });

      console.log("winner => ", winner);
      setIsWinner(true);
      setWinnerDescription(winner.description);
      setWinnerVoteCount(winner.voteCount);
      setWinnerProposalId(winningProposal);
      togglePopupWinner();
    } else {
      setIsErrorUser(true);
      setErrorUser("Winner not decided Yet");
      togglePopupError();
    }
  };

  return (
    <div>
      <h2> 📲 User dashboard</h2>
      <p>⛔️ You must be whitelisted to use these functions ⛔️</p>

      <div style={{ marginTop: 15 }}>
        <p style={{ fontWeight: "bold" }}>Register your proposal:</p>
        <input
          style={{ width: "60%" }}
          placeholder={"Set your proposal description..."}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          style={{ marginLeft: 10, width: "30%" }}
          onClick={() => {
            handleClickRegisterProposals();
          }}
        >
          Register your proposal
        </button>
      </div>

      <div style={{ marginTop: 15 }}>
        <p style={{ fontWeight: "bold" }}>Vote for your proposal:</p>
        <input
          style={{ width: "60%" }}
          placeholder={"Set your proposal ID..."}
          value={ID}
          onChange={(e) => setID(e.target.value)}
        />
        <button
          style={{ marginLeft: 10, width: "30%" }}
          onClick={() => {
            handleClickVote();
          }}
        >
          Vote!
        </button>
        {isOpenError && (
          <PopupError
            errorUser={errorUser}
            togglePopupError={togglePopupError}
            isErrorUser={isErrorUser}
          />
        )}
        {isOpenSuccess && (
          <PopupSuccess
            successUser={successUser}
            togglePopupSuccess={togglePopupSuccess}
            isSuccessUser={isSuccessUser}
          />
        )}
      </div>

      <div style={{ marginTop: 15 }}>
        <p style={{ fontWeight: "bold" }}>Get informations about a Voter:</p>
        <input
          style={{ width: "60%" }}
          placeholder={"Set voter address..."}
          value={voterAddress}
          onChange={(e) => setVoterAddress(e.target.value)}
        />
        <button
          style={{ marginLeft: 10, width: "30%" }}
          onClick={() => {
            handleClickGetVoter();
          }}
        >
          getVoter
        </button>
        {isOpenGetVoter && (
          <PopupVoter
            isEthAddress={isEthAddress}
            isVoterWl={isVoterWl}
            hasVoted={hasVoted}
            whichProposal={whichProposal}
            togglePopupGetVoter={togglePopupGetVoter}
          />
        )}
      </div>

      <div style={{ marginTop: 15 }}>
        <p style={{ fontWeight: "bold" }}>Get informations about a Proposal:</p>
        <input
          style={{ width: "60%" }}
          placeholder={"Set proposal number..."}
          value={oneProposal}
          onChange={(e) => setOneProposal(e.target.value)}
        />
        <button
          style={{ marginLeft: 10, width: "30%" }}
          onClick={() => {
            handleClickGetOneProposal();
          }}
        >
          getProposal
        </button>
        {isOpenGetProposal && (
          <PopupProposal
            proposalRegisteredEvents={props.proposalRegisteredEvents}
            isProposalValid={isProposalValid}
            oneProposal={oneProposal}
            proposalDescription={proposalDescription}
            voteCount={voteCount}
            togglePopupGetProposal={togglePopupGetProposal}
          />
        )}
      </div>

      <div style={{ marginTop: 15, alignContent: "center" }}>
        <p style={{ fontWeight: "bold" }}>And the winner is ...</p>
        <button
          style={{ width: "30%" }}
          onClick={() => {
            handleClickGetWinner();
          }}
        >
          Get Winner
        </button>
        {isOpenWinner && (
          <PopupWinner
            isWinner={isWinner}
            winnerProposalId={winnerProposalId}
            winnerDescription={winnerDescription}
            winnerVoteCount={winnerVoteCount}
            togglePopupWinner={togglePopupWinner}
          />
        )}
      </div>
    </div>
  );
}

export default UserPanel;
