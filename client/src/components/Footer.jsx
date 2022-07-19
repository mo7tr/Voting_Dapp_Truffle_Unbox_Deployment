function Link({ uri, text }) {
  return (
    <a href={uri} target="_blank" rel="noreferrer">
      {text}
    </a>
  );
}

function Footer() {
  return (
    <footer>
      <h2>More resources</h2>
      <Link uri={"https://alyra.fr/"} text={"Alyra"} />
      <Link
        uri={"https://github.com/mo7tr/Voting_Dapp_Truffle_Unbox_Deployment"}
        text={"Project GitHub"}
      />
      <Link uri={"https://trufflesuite.com"} text={"Truffle"} />
      <Link uri={"https://reactjs.org"} text={"React"} />
      <Link uri={"https://soliditylang.org"} text={"Solidity"} />
      <Link uri={"https://ethereum.org"} text={"Ethereum"} />
    </footer>
  );
}

export default Footer;
