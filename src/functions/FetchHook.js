import { useEffect, useState } from "react";

export function useFetch(url, setStateFn = () => console.log('setState Function goes here.'), cleanupFunction = null) {
   useEffect(() => {
      fetch(url).then(res => {
         cleanupFunction && cleanupFunction()
         if (!res.ok) {
            throw new Error(`Error!!! ${res.status}. ERROR MESSAGE: ${res.message}.`)
         }
         return res.json()
      }).then(data => {
         setStateFn(data);
         console.log("From useFetch: SUCCESS!!! ", data);
      }).catch(err => console.error({ err, errCode: err.code, errMessage: err.message }))
      
      return () => cleanupFunction ? cleanupFunction() : null
   }, []);
}

