const PopupSuccess = (props) => {
  let popupDisplay;
  if (props.isSuccessUser) {
    popupDisplay = (
      <div style={{ textAlign: "center", fontSize: "2.2rem" }}>
        <p>{props.successUser}</p>
      </div>
    );
  } else if (props.isSuccessAdmin) {
    popupDisplay = (
      <div style={{ textAlign: "center", fontSize: "2.2rem" }}>
        <p> {props.successAdmin}</p>
      </div>
    );
  }

  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.togglePopupSuccess}>
          x
        </span>
        <div className="popup-title-transaction">
          <strong>🎉 Transaction success 🎉</strong>
        </div>
        <hr className="popup-hr" />
        {popupDisplay}
      </div>
    </div>
  );
};

export default PopupSuccess;
