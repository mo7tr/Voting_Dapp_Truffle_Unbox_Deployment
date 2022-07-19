const PopupError = (props) => {
  let popupDisplay;
  if (props.isErrorUser) {
    popupDisplay = (
      <div style={{ textAlign: "center", fontSize: "2.2rem" }}>
        <p>{props.errorUser} </p>
        {/* <p>Must be between 0 and {props.proposalRegisteredEvents.length}</p> */}
      </div>
    );
  } else if (props.isErrorAdmin) {
    popupDisplay = (
      <div style={{ textAlign: "center" }}>
        <p> {props.errorAdmin} </p>
      </div>
    );
  }

  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.togglePopupError}>
          x
        </span>
        <div className="popup-title-transaction">
          <strong>🧨 Error 🧨</strong>
        </div>
        {popupDisplay}
      </div>
    </div>
  );
};

export default PopupError;
