import { createContext, useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, } from "react-router-dom";
import { useFetch } from "./functions/FetchHook";

export const ShiftContext = createContext();

//Components;
import SchedulingNeeds from "./components/scheduling_needs/SchedulingNeeds";

//Pages;
import Homepage from "./pages/homepage/Homepage";
import SupervisorPage from "./pages/supervisor/SupervisorPage";

function App() {
  const [shiftsArray, setShiftsArray] = useState([]);
  const [currentUser, setCurrentUser] = useState({ id: '', name: '', password: '', role: '' });
  const [employees, setEmployees] = useState([]);

  useFetch("http://localhost:3003/employees", data => setEmployees(prvEmployees => ([...prvEmployees, ...data])));
  useFetch("http://localhost:3003/currentUser", data => setCurrentUser(prvUser => ({ ...prvUser, ...data })));

  
  return (
    <ShiftContext.Provider
      value={{ shiftsArray, setShiftsArray, currentUser, setCurrentUser, employees, setEmployees }}
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
