export const PostRequest = (url, body) => {
   return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

export const AddNewShiftToDBandState = (url, data, setStateWrapperFunction /*  (data) => setState(...) */, location = null, ...args) => PostRequest(url, data)
   .then(resultOfPost => {
      console.log({ message: "AddNewShiftToDBandState SUCCESSFULL!!!", resultOfPost });

      return setStateWrapperFunction(data);
   })
   .catch(error => console.error({ location, message: "Error with AddNewShiftToDBandState!!!", error, errorCode: error.code, errorMessage: error.message }));

