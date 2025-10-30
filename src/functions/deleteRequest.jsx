export const DeleteRequest = (url, id = null) => {
   return fetch(url, { method: 'DELETE' });
}

export const DeleteBatch = (...args_to_delete) => {
   try {
      const convertArrayToItems = Array.from(args_to_delete).forEach(item => {
         if (typeof (item) == 'object' && item.length) throw new Error(`${JSON.stringify(item)} is an array!!! please enter all arrays as spread operators!!!`)
         
         return Promise.all(Array.from(args_to_delete).map(async item => await DeleteRequest(item)));
      });
   } catch (error) {
      console.error({ message: "ERROR DELETING BATCH!!!", error, errorMessage: error.message, errorStack: error.stack, errorCode: error.code });
      
      return error;
   }
}

export const DeleteRequestSetState = async (url, setStateWrapper, data) => {
   try {
      const DeleteDataFromDB = await DeleteRequest(url);
      setStateWrapper(data);
      return data;
   } catch (error) {
      console.error({ message: "DeleteRequestSetState ERROR!!!", error, errorMessage: error.message, errorStack: error.stack, errorCode: error.code });
   }
}