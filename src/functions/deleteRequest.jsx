export const DeleteRequest = (url, id = null) => {
   return fetch(url, { method: 'DELETE' })
      .then(() => {
         console.log(`Successfully deleted ${url} with DeleteRequest.`)
         return `Successfully deleted ${url} with DeleteRequest.`;
      })
      .catch(error => console.error({ message: "DeleteRequest error (deleteRequest.jsx).", error, errorMessage: error.message, errorName: error.name }));
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

export const DeleteRequestSetState = async (url, setStateWrapper, data, location=null) => {
   try {
      const DeleteDataFromDB = await DeleteRequest(url);
      setStateWrapper();
      return { deleted: data };
   } catch (error) {
      console.error({ message: "DeleteRequestSetState ERROR!!!", location, error, errorMessage: error.message, errorStack: error.stack, errorCode: error.code });
   }
}