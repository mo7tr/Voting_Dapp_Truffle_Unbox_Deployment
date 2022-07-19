const PopupWinner = (props) => {
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.togglePopupWinner}>
          x
        </span>
        <div className="popup-title-transaction">
          <strong>🎉 Transaction success 🎉</strong>
        </div>
        <hr className="popup-hr" />

        <p style={{ textAlign: "center" }}>
          Proposal Id n° {props.winnerProposalId}
        </p>
        <hr className="popup-hr" />
        <p style={{ textAlign: "center" }}>
          The Winner is{" "}
          <span style={{ fontWeight: "bold" }}>
            {props.winnerDescription} 😎
          </span>
        </p>
        <p style={{ textAlign: "center" }}>
          with a number of{" "}
          <span style={{ fontWeight: "bold" }}>{props.winnerVoteCount}</span>{" "}
          votes!
        </p>
      </div>
    </div>
  );
};

export default PopupWinner;
