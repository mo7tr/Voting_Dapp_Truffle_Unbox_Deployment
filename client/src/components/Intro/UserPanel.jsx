import { useState } from "react";
import PopupVoter from "./Popup/PopupVoter";
import PopupProposal from "./Popup/PopupProposal";

function UserPanel(props) {
  const [description, setDescription] = useState("");
  const [ID, setID] = useState("");
  const [voterAddress, setVoterAddress] = useState("");
  const [isOpenGetVoter, setIsOpenGetVoter] = useState(false);
  const [isOpenGetProposal, setIsOpenGetProposal] = useState(false);
  const [isVoterWl, setIsVoterWl] = useState(null);
  const [hasVoted, setHasVoted] = useState(null);
  const [whichProposal, setWhichProposal] = useState("");
  const [isEthAddress, setIsEthAddress] = useState(null);
  const [oneProposal, setOneProposal] = useState("");
  const [isProposalValid, setIsProposalValid] = useState(null);
  const [proposalDescription, setProposalDescription] = useState("");
  const [voteCount, setVoteCount] = useState("");

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

  const handleClickRegisterProposals = async () => {
    if (typeof description === "string") {
      const transac = await props.contract.methods
        .addProposal(description)
        .send({ from: props.accounts[0] });
      console.log(
        "A new proposition has been registered: ",
        transac.events.ProposalRegistered.returnValues._proposalId,
        transac.events.ProposalRegistered.returnValues._description
      );
      setDescription("");
    }
  };

  const handleClickVote = async () => {
    const transac = await props.contract.methods
      .setVote(ID)
      .send({ from: props.accounts[0] });
    console.log(
      "A new vote has been set: ",
      transac.events.Voted.returnValues._voterAddress,
      transac.events.Voted.returnValues._proposalId
    );
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
    console.log(Number(oneProposal));
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
          Add new proposal to vote
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
    </div>
  );
}

export default UserPanel;
