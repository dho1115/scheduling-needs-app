export const putRequest = (url, id, updatedData) => fetch(url, {
   method: 'PUT',
   headers: {
      'Content-Type': 'application/json; charset=UTF-8'
   },
   body: JSON.stringify(updatedData)
})
