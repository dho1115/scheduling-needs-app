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

   const getIDsOfApplicantsWithShifts = findApplicantsWithShifts.map(({ id }) => id);//[...id].

   const updateShiftsAppliedFor = findApplicantsWithShifts.map(applicant => {
      let { shiftsAppliedFor } = applicant;
      shiftsAppliedFor = shiftsAppliedFor.filter(_shiftID => _shiftID != removeShiftID) //[remaining _shiftIDs];
      if (shiftsAppliedFor.length) {
         applicant = { ...applicant, shiftsAppliedFor };
      }
      else delete applicant.shiftsAppliedFor;

      return applicant;
   }); //Remove selected shift from Applicants with shifts.

   const applicantsWithoutShifts = array.filter(applicant => !getIDsOfApplicantsWithShifts.includes(applicant.id)); //[employees with no shiftsAppliedFor property].
   
   return [...applicantsWithoutShifts, ...updateShiftsAppliedFor]
}

export const updateItemInArray = (array, idToFind, newProp) => array.map(value => {
   if (value.id == idToFind) {
      return { ...value, ...newProp };
   }
   return value;
})

export const setStateBatch = (...args) => {
   Array.from(args).forEach(arg => arg());
}