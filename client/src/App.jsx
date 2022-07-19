import { EthProvider } from "./contexts/EthContext";
import Main from "./components/Main";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <div className="container">
          <Main />
          <hr />
          <Footer />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
