export const PostRequest = (url, jsonBody) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(jsonBody) })

