import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ModernTree from "./components/ModernTree";

const App = () => {

  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<ModernTree />} />

        </Routes>
      
    </BrowserRouter>
  );
};

export default App;
