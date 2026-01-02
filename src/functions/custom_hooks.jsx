import { useEffect, useState } from "react"
import { fb_addOneDocument, fb_fetchOneDoc } from "./firebase/crud_basic";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export const useSignUp = (collection_name, signUp_details, location=null) => {
   const [currentUser, setCurrentUser] = useState({ id: '', name: '', password: '', role: '' });
   const [loading, setLoading] = useState(true);

   const addAndFetchSignUp = async () => {
      try {
         const newSignUp = await fb_addOneDocument(collection_name, signUp_details, "current_user", location); //Adds the sign up.

         const collectionRef = collection(db, collection_name);

         const fetchSignUp = onSnapshot(
            collectionRef,
            snapshot => {
               if (snapshot.exists()) {
                  console.log("snapshot: ", { id: snapshot.id, ...snapshot.data() });
                  setCurrentUser({ id: snapshot.id, ...snapshot.data() }) //setState with signup.
                  setLoading(false)
               } else {
                  console.error(`Unable to fetch logged in user, which returned ${JSON.stringify(snapshot)}. snapshot.exists() returned ${snapshot.exists}.`)
               }
            },
            error => console.error({ message: "From fetchSignUp error handler", location, error, errorMessage: error.message, errorStack: error.stack, errorName: error.name, errorCause: error.cause })
         ); //Provides setCurrentUser and setLoading logic when firebase listener changes.

         return fetchSignUp(); //removes the listener.
      } catch (error) {
         console.error({location, error, errorMessage: error.message, errorName: error.name})
      }
   }

   useEffect(() => {
      addAndFetchSignUp()
         .then(result => console.log(result))
         .catch(error => console.error({ message: "addAndFetchSignUp ERROR (custom_hooks.jsx)", error, errorMessage: error.message, errorName: error.name }));
   }, [])

   return [currentUser, loading]
}