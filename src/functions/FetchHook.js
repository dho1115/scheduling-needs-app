import { useEffect, useState } from "react";

export const useFetch = async (url) => {
   try {
      const rawData = await fetch(url);
      if (!rawData.ok) throw new Error(`Error fetching ${url} - ${rawData.status}.`)
      const jsonData = await rawData.json();
      return jsonData;
   } catch (error) {
      console.error({ from: 'useFetch inside FetchHook.js', status: error.status, message: error.message, errCode: error.code });
      
      return { message: 'Error Fetching data!!!', error, errorCode: error.code, errorMessage: error.message };
   }
}

// export function useFetch(url, setStateFn = () => console.log('setState Function goes here.'), cleanupFunction = null) {
//    useEffect(() => {
//       fetch(url).then(res => {
//          cleanupFunction && cleanupFunction()
//          if (!res.ok) {
//             throw new Error(`Error!!! ${res.status}. ERROR MESSAGE: ${res.message}.`)
//          }
//          return res.json()
//       }).then(data => {
//          setStateFn(data);
//          console.log("From useFetch: SUCCESS!!! ", data);
//       }).catch(err => console.error({ err, errCode: err.code, errMessage: err.message }))
      
//       return () => cleanupFunction ? cleanupFunction() : null
//    });
// }

