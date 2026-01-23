import React, { createContext, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

//Components;
import AddShift from "./components/private/supervisor/add_shift/AddShift";
import SchedulingNeeds from "./components/shared/scheduling_needs/SchedulingNeeds";
import ShiftsAppliedFor from "./components/private/candidate/pending_shifts/ShiftsAppliedFor"; //For the candidate.
import ShiftsNeedingConfirmation from "./components/private/candidate/shifts_needing_confirmation/ShiftsNeedingConfirmation";
import UnconfirmedShifts from "./components/shared/unconfirmed_shifts/UnconfirmedShifts";
import UpcomingShifts from "./components/private/candidate/shifts_i_confirmed/UpcomingShifts";

//Functions & dependencies.
import { BatchDelete } from "./functions/deleteRequest";
import { ConfirmApprovedShiftLogic } from "./functions/emailFunctions";
import { DateTime } from "luxon";
import { PatchRequest } from "./functions/patchRequest";
import { FetchDataSetState } from "./functions/FetchHook";
import emailjs from '@emailjs/browser';

//CustomHooks
import { useFetchFirestoreAndSetState, useSignUp } from "./functions/custom_hooks";

//Pages;
import Homepage from "./pages/homepage/Homepage";
import SupervisorPage from "./pages/supervisor/SupervisorPage";
import CandidatePage from "./pages/candidate/CandidatePage";
import ShiftCandidatesPage from "./pages/supervisor/shift/ShiftCandidatesPage";

export const ShiftContext = createContext();

function App() {
  const [currentUser, setCurrentUser, shiftStatuses, setShiftStatuses, employees, setEmployees] = useFetchFirestoreAndSetState(["Current User", "Employees", "Shifts Available", "Shifts With Applicants", "Shifts Pending Confirmation", "Shifts Confirmed"], "App.jsx");

  useEffect(() => {
    emailjs.init({ publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY });
  }, []);

  //emailjs configuration keys.
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const PUBLIC_KEY_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const GENERAL_KEY_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const CONFIRM_SHIFT_KEY_ID = import.meta.env.VITE_EMAILJS_CONFIRM_SHIFT_ID;

  return (
    <ShiftContext.Provider
      value={{ customHooks: { useSignUp }, currentUser, setCurrentUser, employees, setEmployees, shiftStatuses, setShiftStatuses, emailjs_keys: { SERVICE_ID, PUBLIC_KEY_ID, GENERAL_KEY_ID, CONFIRM_SHIFT_KEY_ID } }}
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
                <Route path="shifts/assigned to work" element={<UpcomingShifts />} />
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