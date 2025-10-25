import { createContext, useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, } from "react-router-dom";

//Components;
import AddShift from "./components/private/supervisor/add_shift/AddShift";
import Applied from "./components/private/supervisor/shifts_queue/shifts_applied/Applied"; //For the supervisor.
import AssignedShifts from "./components/private/candidate/my_assigned_shifts/AssignedShifts";
import Awarded from "./components/private/supervisor/shifts_queue/shifts_awarded/Awarded";
import SchedulingNeeds from "./components/shared/scheduling_needs/SchedulingNeeds";
import ShiftsAppliedFor from "./components/private/candidate/pending_shifts/ShiftsAppliedFor"; //For the candidate.
import ShiftsNeedingConfirmation from "./components/private/candidate/shifts_needing_confirmation/ShiftsNeedingConfirmation";
import UnconfirmedShifts from "./components/shared/unconfirmed_shifts/UnconfirmedShifts";

//Functions & dependencies.
import { fetchDataPromise } from "./functions/FetchHook";

//Pages;
import Homepage from "./pages/homepage/Homepage";
import SupervisorPage from "./pages/supervisor/SupervisorPage";
import CandidatePage from "./pages/candidate/CandidatePage";

export const ShiftContext = createContext();

function App() {
  const [currentUser, setCurrentUser] = useState({ id: '', name: '', password: '', role: '' });

  const [shiftStatuses, setShiftStatuses] = useState({ shiftsAvailable: [], shiftsWithApplicants: [], shiftsAssigned: [], shiftsPendingConfirmation: [], shiftsConfirmed: [] });

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchDataPromise("http://localhost:3003/employees")
      .then(result => setEmployees(prv => ([...prv, ...result])))
      .catch(err => console.error({ from: 'fetchDataPromise/employees', err, errMessage: err.message, status: err.status }));

    fetchDataPromise("http://localhost:3003/currentUser")
      .then(result => {
        setCurrentUser(prv => ({ ...prv, ...result }));
      })
      .catch(err => console.error({ from: 'fetchDataPromise/currentUser', err, errMessage: err.message, status: err.status }));
    
    fetchDataPromise("http://localhost:3003/shiftsAvailable")
      .then(result => {
        setShiftStatuses(prv => ({...prv, shiftsAvailable: [...result]}))
      })
      .catch(error => console.error({ from: 'fetchDataPromise/currentUser', error, errorMessage: error.message, status: error.status }));
    
    fetchDataPromise("http://localhost:3003/shiftsConfirmed")
      .then(result => {
        setShiftStatuses(prv => ({ ...prv, shiftsAssigned: [...prv.shiftsAssigned, ...result] }));
      })
      .catch(error => console.error({ message: "Something went wrong with fetching awarded shifts!!!", error, errorCode: error.code, errorMessage: error.message }));
    
    fetchDataPromise("http://localhost:3003/shiftsPendingConfirmation")
      .then(result => {
        setShiftStatuses(prv => ({ ...prv, shiftsPendingConfirmation: [...result] }));
      })
      .catch(error => console.error({ message: "Something went wrong with fetch shiftsPendingConfirmation!!!", error, errorMessage: error.message, errorCode: error.code }));
    
    return () => {
      //This resets the array to prevent the data from being duplicated and added.
      setShiftStatuses({ shiftsAvailable: [], shiftsWithApplicants: [], shiftsAssigned: [], shiftsPendingConfirmation: [], shiftsConfirmed: [] })
    }
  }, []);
  
  return (
    <ShiftContext.Provider
      value={{ currentUser, setCurrentUser, employees, setEmployees, shiftStatuses, setShiftStatuses }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/available shifts" element={<SchedulingNeeds />} />
          {
            (currentUser.id && currentUser.name)
            &&
            <>
              <Route path="/supervisor/welcome/:id/*" element={<SupervisorPage />}>
                <Route path="add shift" element={<AddShift />} />
                <Route path="available shifts" element={<SchedulingNeeds />} />
                <Route path="shifts/applied" element={<Applied />} />
                <Route path="shifts/awarded" element={<Awarded />} />
                <Route path="shifts/unconfirmed-shifts" element={<UnconfirmedShifts />} />
              </Route>
              <Route path="/candidate/welcome/:id/*" element={<CandidatePage />}>
                <Route path="available shifts" element={<SchedulingNeeds />} />
                <Route path="shifts/applied" element={<ShiftsAppliedFor />} />
                <Route path="shifts/awarded" element={<AssignedShifts />} />
                <Route path="shifts/pending confirmation" element={<ShiftsNeedingConfirmation />} />
              </Route>
            </>
          }
          <Route path="*" element={<Navigate replace to='/' />} />
        </Routes>
      </BrowserRouter>
    </ShiftContext.Provider>
  )
}

export default App
