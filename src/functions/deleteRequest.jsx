import { DateTime } from "luxon";
import { fetchDataPromise, FetchDataSetState } from "./FetchHook";

export const DeleteRequest = async (url, id = null) => {
   return await fetch(url, { method: 'DELETE' })
      .then(() => {
         console.log(`Successfully deleted ${url} with DeleteRequest.`)
         return `Successfully deleted ${url} with DeleteRequest.`;
      })
      .catch(error => console.error({ message: "DeleteRequest error (deleteRequest.jsx).", error, errorMessage: error.message, errorName: error.name }));
}

export const BatchDelete = async (DateTime) => {
   const BASE = 'http://localhost:3003/'
   const ENDPOINTS = ['shiftsAvailable', 'shiftsWithApplicants', 'shiftsPendingConfirmation', 'shiftsConfirmed'];
   try {
      ENDPOINTS.forEach(async endpoint => {
         const FetchShiftStatus = await fetchDataPromise(`${BASE}${endpoint}`) //[shift]

         FetchShiftStatus.forEach(shift => {
            if (shift.date_of_shift) {
               const currentDate = DateTime.local();
               const shiftDate = DateTime.fromISO(shift.date_of_shift);
               (currentDate > shiftDate) && DeleteRequest(`${BASE}${endpoint}/${shift.id}`)
            } else {
               const currentDate = DateTime.local();
               const shiftDate = DateTime.fromISO(shift.date);
               (currentDate > shiftDate) && DeleteRequest(`${BASE}${endpoint}/${shift.id}`)
            }
         }) // iterate through each shift in [shift] and deletes expired shift using DeleteRequest.
      })
      return { message: "Batch Delete Successful!!!", BASE, ENDPOINTS, FetchDataSetState };
   } catch (error) {
      console.error({ message: "ERROR with BatchDelete Function!!!", error, errorMessage: error.message, errorName: error.name });
   }
}
export const DeleteRequestSetState = async (url, setStateWrapper, data, location=null) => {
   try {
      const DeleteDataFromDB = await DeleteRequest(url);
      setStateWrapper();
      return { deleted: data };
   } catch (error) {
      console.error({ message: "DeleteRequestSetState ERROR!!!", location, error, errorMessage: error.message, errorStack: error.stack, errorCode: error.code });
   }
}