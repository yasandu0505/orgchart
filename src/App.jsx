import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import OrgChart from "./components/OrgChart";

const App = () => {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<OrgChart />} />

        </Routes>
      
    </BrowserRouter>
  );
};

export default App;
