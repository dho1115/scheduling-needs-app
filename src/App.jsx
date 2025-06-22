import { createContext, useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, } from "react-router-dom";

//Components;
import SchedulingNeeds from "./components/scheduling_needs/SchedulingNeeds";

//Functions & dependencies.
import { fetchDataPromise } from "./functions/FetchHook";

//Pages;
import Homepage from "./pages/homepage/Homepage";
import SupervisorPage from "./pages/supervisor/SupervisorPage";
import CandidatePage from "./pages/candidate/CandidatePage";

export const ShiftContext = createContext();

function App() {
  const [shiftsArray, setShiftsArray] = useState([]);
  const [currentUser, setCurrentUser] = useState({ id: '', name: '', password: '', role: '' });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchDataPromise("http://localhost:3003/employees")
      .then(result => {
        console.log({ from: 'fetchDataPromise/employees call', message: 'SUCCESS!!!', result });
        setEmployees(prv => ([...prv, ...result]))
      })
      .catch(err => console.error({ from: 'fetchDataPromise/employees', err, errMessage: err.message, status: err.status }));

    fetchDataPromise("http://localhost:3003/currentUser")
      .then(result => {
        console.log({ from: 'fetchDataPromise/employees call', message: 'SUCCESS!!!', result });
        setCurrentUser(prv => ({ ...prv, ...result }));
      })
      .catch(err => console.error({ from: 'fetchDataPromise/currentUser', err, errMessage: err.message, status: err.status }));
    return () => {
      
    }
  }, []);
  
  return (
    <ShiftContext.Provider
      value={{ shiftsArray, setShiftsArray, currentUser, setCurrentUser, employees, setEmployees }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/supervisor/welcome/:id/*" element={<SupervisorPage />}>
            <Route path="available shifts" element={<SchedulingNeeds />} />
          </Route>
          <Route path="/candidate/welcome/:id/*" element={<CandidatePage />}>
            <Route path="available shifts" element={<SchedulingNeeds />} />
          </Route>
          <Route path="*" element={<Navigate replace to='/' />} />
        </Routes>
      </BrowserRouter>
    </ShiftContext.Provider>
  )
}

export default App
