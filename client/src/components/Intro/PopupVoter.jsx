const PopupVoter = (props) => {
  let popupDisplay;
  if (props.isEthAddress) {
    popupDisplay = (
      <>
        <strong className="popup-title">Voter informations 🔦</strong>
        <hr />
        <p>
          Is the voter Whitelisted?{" "}
          <span style={{ fontWeight: "bold" }}>{`${props.isVoterWl}`}</span>
        </p>
        <p>
          Did the voter vote?{" "}
          <span style={{ fontWeight: "bold" }}>{`${props.hasVoted}`}</span>
        </p>
        <p>
          Which proposal did the voter vote for?{" "}
          <span style={{ fontWeight: "bold" }}>{props.whichProposal}</span>
        </p>
      </>
    );
  } else if (!props.popupDisplay) {
    popupDisplay = (
      <p style={{ textAlign: "center", fontSize: "2.2rem" }}>
        🧨 This is not a valid ethereum address 🧨
      </p>
    );
  }

  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.togglePopup}>
          x
        </span>
        {popupDisplay}
      </div>
    </div>
  );
};

export default PopupVoter;
