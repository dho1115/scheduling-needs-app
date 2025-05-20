import { createContext, useState } from "react";
import { BrowserRouter, Route, Routes, } from "react-router-dom";

export const ShiftContext = createContext();

//Pages;
import Homepage from "./pages/homepage/Homepage";
import SupervisorPage from "./pages/supervisor/SupervisorPage";

function App() {
  const [shifts, setShifts] = useState({});

  return (
    <ShiftContext.Provider value={{shifts, setShifts}}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/supervisor" element={<SupervisorPage />} />
        </Routes>
      </BrowserRouter>
    </ShiftContext.Provider>
  )
}

export default App
