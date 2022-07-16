//import { useState } from "react";
import Title from "./Title";
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

  return (
    <div className="demo">
      <Title />
      {demo}
    </div>
  );
}

export default Demo;
