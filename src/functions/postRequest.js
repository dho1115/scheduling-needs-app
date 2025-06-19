export const PostRequest = (url, jsonBody) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(jsonBody) })
   .then(response => {
      console.log(`Successfully posted ${JSON.stringify(response)}!!!`);
      return response
   })
   .then(data => console.log({ message: `SUCCESS!!! Data is ${JSON.stringify(data.json())}.`, data }))
   .catch(err => console.error({ message: 'POST request error!!!', err, errMessage: err.message, errCode: err.code, data: JSON.stringify(jsonBody) }));

export const PostCurrentUser = (url, jsonBody) => fetch(url, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify(jsonBody)
})
   .then(data => data)
   .then(response => console.log("RESPONSE:", response.json()))
   .catch(error => console.error({ message: 'PostCurrentUser (function) error!!!', error, status: error.status, code: error.code, errMessage: error.message }));