export const PostRequest = (url, jsonBody) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(jsonBody) })
   .then(response => {
      console.log(`Successfully posted ${JSON.stringify(response)}!!!`);
      return response
   })
   .then(data => console.log({ message: `SUCCESS!!! Data is ${JSON.stringify(data.json())}.`, data }))
   .catch(err => console.error({ message: 'POST request error!!!', err, errMessage: err.message, errCode: err.code, data: JSON.stringify(jsonBody) }));