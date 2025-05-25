import { useEffect, useState } from "react";

export function useFetch(url) {
   const [employeeData, setEmployeeData] = useState({})

   useEffect(() => {
      fetch(url).then(res => {
         if (!res.ok) {
            throw new Error(`Error!!! ${res.status}. ERROR MESSAGE: ${res.message}.`)
         }
         return res.json()
      }).then(data => {
         console.log("SUCCESS!!! ", data);
         setEmployeeData(prvData => ({ ...prvData, ...data }));
      }).catch(err => console.error({err, errCode: err.code, errMessage: err.message}))
      return () => {
       
      };
   }, []);

   return [employeeData, setEmployeeData]
}