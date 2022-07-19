//import { useState } from "react";
import Cta from "./Cta";
//import Contract from "./Contract";
//import ContractBtns from "./ContractBtns";
import Desc from "./Desc";

function Demo() {
  //const [value, setValue] = useState("?");

  const demo = (
    <>
      <Cta />
      <div className="contract-container">
        {/* <Contract value={value} />
        <ContractBtns setValue={setValue} /> */}
      </div>
      <Desc />
    </>
  );

  return <div className="demo">{demo}</div>;
}

export default Demo;
