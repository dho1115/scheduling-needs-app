import { fetchDataPromise } from "./FetchHook";

export const DeleteRequest = async (url, id = null) => {
   return await fetch(url, { method: 'DELETE' })
      .then(() => {
         console.log(`Successfully deleted ${url} with DeleteRequest.`)
         return `Successfully deleted ${url} with DeleteRequest.`;
      })
      .catch(error => console.error({ message: "DeleteRequest error (deleteRequest.jsx).", error, errorMessage: error.message, errorName: error.name }));
}

export const BatchCleanup = async (DateTime) => {
   const BASE = 'http://localhost:3003/'
   const ENDPOINTS = ['shiftsAvailable', 'shiftsWithApplicants', 'shiftsPendingConfirmation'];

   const BATCH_DELETE_FUNCTION = () => ENDPOINTS
      .map(async endpoint => {
         const CURRENT_DATE = DateTime.local();
         const FETCH_DATA = await fetchDataPromise(BASE + endpoint); //[{data}]
         const EXPIRED_IDS = FETCH_DATA
            .filter(({ date }) => DateTime.fromISO(date) > CURRENT_DATE).map(({ id }) => id); //[id]
         
         return EXPIRED_IDS.map(id => DeleteRequest(`${BASE}${endpoint}/${id}`));
      })
   
   const BATCH_DELETE_SHIFTS_CONFIRMED = () => ["shiftsConfirmed"].map(async endpoint => {
      const CURRENT_DATE = DateTime.local();
      const FETCH_DATA = await fetchDataPromise(BASE + endpoint) //[{data}].
      
      return FETCH_DATA
         .filter(({ date_of_shift }) => DateTime.fromISO(date_of_shift) > CURRENT_DATE)
         .map(({ id }) => id)
         .map(id => DeleteRequest(`${BASE}${endpoint}/${id}`));
   })
   
   return await Promise.all([
      ...BATCH_DELETE_FUNCTION(),
      ...BATCH_DELETE_SHIFTS_CONFIRMED()
   ])
      .then(response => console.log({ message: "Promse.all BATCH DELETE SUCCESS!!!", response }))
      .catch(error => console.error({ message: "Promise.all BATCH_DELETE_FUNCTION Error!!!", error, errorMessage: error.message }));
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