import { Routes, Route } from "react-router-dom";
import About from "./components/About";
import Header from "./components/Header";
import "./App.css";
import PowerMap from "./components/PowerMap";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<PowerMap />} />
        <Route path="/power-map" element={<PowerMap />} />
        <Route path="/about" element={<About />} />
        <Route path="/power-map/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
