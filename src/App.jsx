import React, { createContext, useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

//Components;
import AddShift from "./components/private/supervisor/add_shift/AddShift";
import SchedulingNeeds from "./components/shared/scheduling_needs/SchedulingNeeds";
import ShiftsAppliedFor from "./components/private/candidate/pending_shifts/ShiftsAppliedFor"; //For the candidate.
import ShiftsNeedingConfirmation from "./components/private/candidate/shifts_needing_confirmation/ShiftsNeedingConfirmation";
import UnconfirmedShifts from "./components/shared/unconfirmed_shifts/UnconfirmedShifts";
import UpcomingShifts from "./components/private/candidate/shifts_i_confirmed/UpcomingShifts";

//Functions & dependencies.
import { auth, db } from "./firebase"; //firebase, firestore.
import { BatchDelete } from "./functions/deleteRequest";
import { ConfirmApprovedShiftLogic } from "./functions/emailFunctions";
import { DateTime } from "luxon";
import { fetchAndAddtoFB } from "./functions/FetchHook"; //tx. array of data.
import { fetchOneAndAddToFB } from "./functions/FetchHook"; //tx. one object.
import { PatchRequest } from "./functions/patchRequest";
import { FetchDataSetState } from "./functions/FetchHook";
import emailjs from '@emailjs/browser';

//CustomHooks
import { useSignUp } from "./functions/custom_hooks";

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

  useEffect(() => {
    emailjs.init({ publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY });

    // fetchOneAndAddToFB("http://localhost:3003/currentUser", "Current User", "App.js")
    //   .then(result => console.log(result))
    //   .catch(error => console.error(error));

    // fetchAndAddtoFB("http://localhost:3003/employees", "Employees", "App.js").then(result => console.log(result)).catch(error => console.error({ error, from: location.pathname, errorMessage: error.message, errorStack: error.stack, errorName: error.name }));
    
    // BatchDelete(DateTime)
    //   .then(res => callFunctionDeclarations(functionDeclarations))
    //   .catch(error => ({ message: "BatchDelete ERROR on function call!!!", error, errorMessage: error.message, errorStack: error.stack, errorName: error.name }));
  }, []);

  //emailjs configuration keys.
  const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const PUBLIC_KEY_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const GENERAL_KEY_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const CONFIRM_SHIFT_KEY_ID = import.meta.env.VITE_EMAILJS_CONFIRM_SHIFT_ID;

  useEffect(() => {
    if (shiftStatuses.shiftsConfirmed.length) {
      shiftStatuses.shiftsConfirmed.forEach(shift => {
        const { id, date_of_shift, applicantName, storeNumber } = shift;

        const todaysDate = DateTime.now();
        const dateOfShift = DateTime.fromISO(date_of_shift);
        const difference = dateOfShift.diff(todaysDate, "days");

        if (((Number(difference.days.toFixed(3)) * 1) < 2) && (!shift.sentReminder)) {
          const daysRemainingTillShift = Number(difference.days.toFixed(3)) * 1
          
          ConfirmApprovedShiftLogic(id, date_of_shift, "http://localhost:3001/", applicantName, storeNumber, emailjs, SERVICE_ID, CONFIRM_SHIFT_KEY_ID, PUBLIC_KEY_ID, `*** REMINDER: YOUR SHIFT IS ${daysRemainingTillShift} DAY AWAY!!! ***`, "REMINDER: UPCOMING SHIFT!!!!!")
            .then(async response => {
              console.log({ message: "SUCCESS!!!", response, status: response.status, responseText: response.text });

              const reminderEmailSent = await PatchRequest(`http://localhost:3003/shiftsConfirmed/${id}`, { sentReminder: true });

              return reminderEmailSent;
            })
            .catch(error => console.error({ message: "ERROR sending the reminder email!!!", error, errorMessage: error.message, errorName: error.name, errorStack: error.stack })); //logic to send email reminder.
          
            async () => await FetchDataSetState("http://localhost:3003/shiftsConfirmed", data => setShiftStatuses(data)) //logic to reset shiftsConfirmed state.
        }
      })
    }
  }, [shiftStatuses.shiftsConfirmed.length])

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
