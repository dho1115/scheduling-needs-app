export const DeleteRequest = (url, id=null) => {
   return fetch(url, { method: 'DELETE' });
}