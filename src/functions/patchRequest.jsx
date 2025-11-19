export const PatchRequest = async (url, newData) => await fetch(url, {
   method: 'PATCH',
   headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept': 'application/json'
   },
   body: JSON.stringify(newData)
})

export const PatchDBandState = async (PatchRequest, setStateWrapper, url, newDataObject, ...args) => {
   try {
      const patchDB = await PatchRequest(url, newDataObject)
      setStateWrapper();
      return { message: "PATCH SUCCESS!!!", patchDB, url, newDataObject, setStateWrapper };
   } catch (error) {
      console.error({ message: 'PatchDBandState ERROR!!!', error, errorCode: error.code, errorMessage: error.message });
   }
}