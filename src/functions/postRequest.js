export const PostRequest = (url, body) => {
   return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

export const AddNewShiftToDBandState = (url, data, setStateWrapperFunction /*  (data) => setState(...) */, location = null, ...args) => PostRequest(url, data)
   .then(resultOfPost => {
      console.log({ message: "AddNewShiftToDBandState SUCCESSFULL!!!", resultOfPost_json: resultOfPost.json, status: resultOfPost.status });

      setStateWrapperFunction(data);

      return {data, resultOfPost, resultOfPost_json: resultOfPost.json()}
   })
   .catch(error => console.error({ location, message: "Error with AddNewShiftToDBandState!!!", error, errorCode: error.code, errorMessage: error.message }));

export const PostRequestII = async (url, data, id = null) => {
   console.log(`About to POST ${JSON.stringify(data)} to ${url}...`)
   try {
      const post = await fetch(url, { method: 'POST', headers: { 'Content-Type': "application/json" }, body: JSON.stringify(data) });

      return data;
   } catch (error) {
      console.error({ message: "PostRequest Error!!!", error, errorMessage: error.message, errorStack: error.stack });
   }
}

export const PostRequestSetState = (url, data, setStateWrapper) => PostRequestII(url, data)
   .then(data => {
      setStateWrapper();
      return data;
   })
   .catch(error => console.error({ message: "PostRequestSetState ERROR!!!", error, errorMessage: error.message, errorStack: error.stack, errorCode: error.code }));

