export const PostRequest = (url, jsonBody) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(jsonBody) })

// export const PostCurrentUser = (url, jsonBody) => fetch(url, {
//    method: 'POST',
//    headers: { 'Content-Type': 'application/json' },
//    body: JSON.stringify(jsonBody)
// }) //Commented out this duplicate post request.