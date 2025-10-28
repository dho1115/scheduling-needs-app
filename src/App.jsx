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
    
    return () => {
      setShiftStatuses({ shiftsAvailable: [], shiftsWithApplicants: [], shiftsAssigned: [], shiftsPendingConfirmation: [], shiftsConfirmed: [] })
    };
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
