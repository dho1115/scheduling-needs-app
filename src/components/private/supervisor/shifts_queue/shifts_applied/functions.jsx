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
   const findApplicantsWithShifts = array.filter(val => val.shiftsAppliedFor); //[employees with shiftsAppliedFor property];

   const getIDsOfApplicantsWithShifts = findApplicantsWithShifts.map(({ id }) => id);//[...id]. This will be used below to find all applicants WITHOUT shifts using .includes().

   const updateApplicantsWithShifts = findApplicantsWithShifts.map(applicant => {
      let { shiftsAppliedFor } = applicant;
      shiftsAppliedFor = shiftsAppliedFor.filter(_shiftID => _shiftID != removeShiftID) //array;
      if (shiftsAppliedFor.length) applicant.shiftsAppliedFor = shiftsAppliedFor;
      else delete applicant.shiftsAppliedFor;

      return applicant;
   }); //Remove selected shift from Applicants with shifts.

   const applicantsWithoutShifts = array.filter(val => !getIDsOfApplicantsWithShifts.includes(val.id)); //employees whose ids are NOT included in getIDsOfApplicantsWithShifts.
   
   return [...applicantsWithoutShifts, ...updateApplicantsWithShifts]
}

export const setStateBatch = (...args) => {
   Array.from(args).forEach(arg => arg());
}