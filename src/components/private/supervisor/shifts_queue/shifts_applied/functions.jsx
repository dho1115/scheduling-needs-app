import { DeleteRequest } from "../../../../../functions/deleteRequest";
import { PostRequest } from "../../../../../functions/postRequest";

export const DeleteShift = (url, id = null) => DeleteRequest(url, id);
export const AddToAwardedShifts = (url, jsonBody) => PostRequest(url, jsonBody);

export const updateDbAndState = (db_fn, setStatefn) => {
   setStatefn();
   return db_fn();
}

export const updateEmployeeState = (array, removeShiftID) => {
   //Removes the taken shift from each applicant that has a 'shiftAppiedFor' property and returns the updated employee state.
   const findApplicantsWithShifts = array.filter(val => val['shiftsAppliedFor']); //[];
   const getIDsOfApplicantsWithShifts = findApplicantsWithShifts.map(({ id }) => id);//[...id]. This will be used below to find all applicants WITHOUT shifts using .includes().
   const updateApplicantsWithShifts = findApplicantsWithShifts['map'](val => {
      val.shiftsAppliedFor = val.shiftsAppliedFor.filter(val => val != removeShiftID)
      return val;
   }); //Remove selected shift from Applicants with shifts.
   const applicantsWithoutShifts = array.filter(val => !getIDsOfApplicantsWithShifts.includes(val.id)); //Find remaining applicants (those without shifts or shiftsAppliedFor)
   return [...applicantsWithoutShifts, ...updateApplicantsWithShifts]
}

export const setStateBatch = (...args) => {
   Array.from(args).forEach(arg => arg());
}