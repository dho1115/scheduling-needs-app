import { createContext, useState } from "react";
import { BrowserRouter, Route, Routes, } from "react-router-dom";

export const ShiftContext = createContext();

//Components;
import SchedulingNeeds from "./components/scheduling_needs/SchedulingNeeds";

//Pages;
import Homepage from "./pages/homepage/Homepage";
import SupervisorPage from "./pages/supervisor/SupervisorPage";

function App() {
  const [shiftsArray, setShiftsArray] = useState([]);
  const [role, setRole] = useState({});

  return (
    <ShiftContext.Provider
      value={{ shiftsArray, setShiftsArray, role, setRole }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/supervisor/*" element={<SupervisorPage />}>
            <Route path="available shifts" element={<SchedulingNeeds />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ShiftContext.Provider>
  )
}

export default App
