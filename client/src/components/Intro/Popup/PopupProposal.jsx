const PopupProposal = (props) => {
  let popupDisplay;
  if (props.isProposalValid) {
    popupDisplay = (
      <>
        <strong className="popup-title">
          Informations about proposal n°{props.oneProposal} 🔦
        </strong>
        <hr className="popup-hr" />
        <p>
          Description?{" "}
          <span
            style={{ fontWeight: "bold" }}
          >{`${props.proposalDescription}`}</span>
        </p>
        <p>
          Number of votes?{" "}
          <span style={{ fontWeight: "bold" }}>{props.voteCount}</span>
        </p>
      </>
    );
  } else if (!props.isProposalValid) {
    popupDisplay = (
      <div style={{ textAlign: "center", fontSize: "2.2rem" }}>
        <p>🧨 Proposal ID invalid 🧨</p>
        <p>Must be between 0 and {props.proposalRegisteredEvents.length}</p>
      </div>
    );
  }

  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.togglePopupGetProposal}>
          x
        </span>
        {popupDisplay}
      </div>
    </div>
  );
};

export default PopupProposal;
