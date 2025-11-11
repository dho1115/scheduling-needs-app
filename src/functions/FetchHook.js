export const fetchDataPromise = async url => {
   try {
      const rawData = await fetch(url);
      if (!rawData.ok) throw new Error(`Error fetching ${url}. Status Code: ${rawData.status}.`)
      const jsonData = await rawData.json();
      return jsonData;
   } catch (error) {
      console.error({ from: 'useFetch inside FetchHook.js', status: error.status, message: error.message, errCode: error.code });

      return { message: 'Error Fetching data!!!', error, errorCode: error.code, errorMessage: error.message };
   }
}

export const FetchDataSetState = async (url, setStateWrapper) => {
   try {
      const fetchData = await fetchDataPromise(url);
      setStateWrapper(fetchData);
   } catch (error) {
      console.error({ message: "FetchDateSetState error!!!", error, errorMessage: error.message, errorCode: error.code, errorStack: error.stack });
   }
}

export const FetchShiftStatuses = async () => {
   try {
      const shiftsAvailable = await fetch("http://localhost:3003/shiftsAvailable");
      const shiftsWithApplicants = await fetch("http://localhost:3003/shiftsWithApplicants");
      const shiftsPendingConfirmation = await fetch("http://localhost:3003/shiftsPendingConfirmation");
      const shiftsConfirmed = await fetch("http://localhost:3003/shiftsConfirmed");

      return [{ shiftsAvailable }, { shiftsWithApplicants }, { shiftsPendingConfirmation }, { shiftsConfirmed }];
   } catch (error) {
      console.error({ message: "fetchShiftStatuses function call error!!!", error, errorMessage: error.message, errorName: error.name, errorStack: error.stack });
   }
}
