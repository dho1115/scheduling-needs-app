import { createContext, useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, } from "react-router-dom";
//Components;
import AddShift from "./components/private/supervisor/add_shift/AddShift";
import Applied from "./components/private/supervisor/shifts_queue/shifts_applied/Applied_LEGACY"; //For the supervisor.
import SchedulingNeeds from "./components/shared/scheduling_needs/SchedulingNeeds";
import ShiftsAppliedFor from "./components/private/candidate/pending_shifts/ShiftsAppliedFor"; //For the candidate.
import ShiftsNeedingConfirmation from "./components/private/candidate/shifts_needing_confirmation/ShiftsNeedingConfirmation";
import UnconfirmedShifts from "./components/shared/unconfirmed_shifts/UnconfirmedShifts";

//Functions & dependencies.
import { fetchDataPromise, FetchDataSetState } from "./functions/FetchHook";

//Pages;
import Homepage from "./pages/homepage/Homepage";
import SupervisorPage from "./pages/supervisor/SupervisorPage";
import CandidatePage from "./pages/candidate/CandidatePage";
import ShiftCandidatesPage from "./pages/supervisor/shift/ShiftCandidatesPage";

export const ShiftContext = createContext();

function App() {
  const [currentUser, setCurrentUser] = useState({ id: '', name: '', password: '', role: '' });

  const [shiftStatuses, setShiftStatuses] = useState({ shiftsAvailable: [], shiftsWithApplicants: [], shiftsPendingConfirmation: [], shiftsConfirmed: [] });

  const [employees, setEmployees] = useState([]);

  const functionDeclarations = [
    async () => await FetchDataSetState("http://localhost:3003/currentUser", data => setCurrentUser(prv => ({ ...prv, ...data }))),

    async () => await FetchDataSetState("http://localhost:3003/employees", data => setEmployees(data)),

    async () => await FetchDataSetState("http://localhost:3003/shiftsAvailable", data => setShiftStatuses(prv => ({ ...prv, shiftsAvailable: [...data] }))),

    async () => await FetchDataSetState("http://localhost:3003/shiftsWithApplicants", data => setShiftStatuses(prv => ({ ...prv, shiftsWithApplicants: [...data] }))),

    async () => await FetchDataSetState("http://localhost:3003/shiftsPendingConfirmation", data => setShiftStatuses(prv => ({ ...prv, shiftsPendingConfirmation: [...data] }))),

    async () => await FetchDataSetState("http://localhost:3003/shiftsConfirmed", data => setShiftStatuses(prv => ({...prv, shiftsConfirmed: [...data]})))
  ]

  const callFunctionDeclarations = functionDeclarations => functionDeclarations.forEach(async f => await f())

  useEffect(() => callFunctionDeclarations(functionDeclarations), []);

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
                <Route path="shifts/unconfirmed-shifts" element={<UnconfirmedShifts />} />
                <Route path="shifts/shift/:_shiftID/candidates" element={<ShiftCandidatesPage />} />
              </Route>
              <Route path="/candidate/welcome/:id/*" element={<CandidatePage />}>
                <Route path="available shifts" element={<SchedulingNeeds />} />
                <Route path="shifts/applied" element={<ShiftsAppliedFor />} />
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
