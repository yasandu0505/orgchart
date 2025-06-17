import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrgChart from "./components/orgchart";
import ModernView from "./components/modernView";
import Home from "./components/home";
import Error404 from "./components/404Error";
import Navbar from "./components/NavBar";
import './animations.css';

const App = () => {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orgchart" element={<Navbar/>} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

export default App
