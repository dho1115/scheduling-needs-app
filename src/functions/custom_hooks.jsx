import { useEffect, useState } from "react"
import { fb_addOneDocument, fb_BatchDeleteExpiredShifts, fb_deleteOneDocument, fb_fetchAllDocs, fb_fetchOneDoc } from "./firebase/crud_basic";
import { fb_signUpNewUser } from "./firebase/authorization";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import { fb_fs_get_docID, setCurrentUserState } from "./firebase/miscellaneous";

export const useFetchFirestoreAndSetState = (allFirestoreCollections, location=null) => {
   if (!Array.isArray(allFirestoreCollections)) throw new Error(`The arguement, allFirestoreCollections has to be an array!!! You have ${JSON.stringify(allFirestoreCollections)} which is a ${typeof (allFirestoreCollections)}.`);

   //========= Deleted Expired Shifts From Firestore!!! =========
   fb_BatchDeleteExpiredShifts(location)
      .then(result => console.log(result))
      .catch(error => console.error(error)) //Deletes any expired shifts.
   //=============================================================

      //===== state/set state =====
      const [currentUser, setCurrentUser] = useState({ id: '', name: '', password: '', role: '' });

      const [shiftStatuses, setShiftStatuses] = useState({ shiftsAvailable: [], shiftsWithApplicants: [], shiftsPendingConfirmation: [], shiftsConfirmed: [] });
   
      const [employees, setEmployees] = useState([]);
      //============================

   const MapDatabaseToState = {
      "Employees": setEmployees,
      "Shifts Available": documents => setShiftStatuses(prv => ({ ...prv, shiftsAvailable: documents })),
      "Shifts With Applicants": documents => setShiftStatuses(prv => ({ ...prv, shiftsWithApplicants: documents })),
      "Shifts Pending Confirmation": documents => setShiftStatuses(prv => ({ ...prv, shiftsPendingConfirmation: documents })),
      "Shifts Confirmed": documents => setShiftStatuses(prv => ({...prv, shiftsWithApplicants: documents}))
   }
   
   useEffect(() => {      
      setCurrentUserState(currentUser, setCurrentUser, location)
         .then(message => console.log({ message }))
         .catch(error => console.error({ error, location })); //new code that replaces previous getDocs(...) which was used to setCurrentUser.

      allFirestoreCollections.forEach(async collection_name => {
         console.log({ collection_name, authCurrentUser: auth.currentUser });

         const documents = await fb_fetchAllDocs(collection_name, location)
         MapDatabaseToState[collection_name](documents);

         console.log({ current_collection: collection_name, collection_name: MapDatabaseToState[collection_name](documents) }) // returns [ ]
      })
      return () => {
         setShiftStatuses({ shiftsAvailable: [], shiftsWithApplicants: [], shiftsPendingConfirmation: [], shiftsConfirmed: [] });
      };
   }, [])

   return [ currentUser, setCurrentUser, shiftStatuses, setShiftStatuses, employees, setEmployees ];
}

export const useSignUp = (signUp_details, location = null) => {
   const [loading, setLoading] = useState(true);

   const addAndFetchSignUp = async () => {
      try {
         const authenticateNewUser = await fb_signUpNewUser(`${signUp_details.name.split(" ").join("") + signUp_details.id}.email.com`, signUp_details.password, location); //firebase authentication.

         const addUserToCurrentUser = await fb_addOneDocument("Current User", signUp_details, signUp_details.id, location); //Add to Current User in FS

         const addUserToEmployees = await fb_addOneDocument("Employees", signUp_details, signUp_details.id, location); //Add to Employee in FS.

         const CurrentUserCollectionRef = collection(db, "current User");

         const fetchSignUp = onSnapshot(
            CurrentUserCollectionRef,
            snapshot => {
               if (snapshot.exists()) {
                  console.log("snapshot: ", { id: snapshot.id, ...snapshot.data() });
                  setLoading(false)
               }
               else {
                  console.error(`Unable to fetch logged in user, which returned ${JSON.stringify(snapshot)}. snapshot.exists() returned ${snapshot.exists}.`)
               }
            },
            error => console.error({ message: "From fetchSignUp error handler", currentUser: auth.currentUser, location, error, errorMessage: error.message, errorStack: error.stack, errorName: error.name, errorCause: error.cause })
         ); //Provides setCurrentUser and setLoading logic when firebase listener changes.

         fetchSignUp(); //removes the listener.

         return signUp_details
      } catch (error) {
         console.error({location, error, errorMessage: error.message, errorName: error.name})
      }
   } // promise to add to firebase and firestore.

   return [signUp_details, addAndFetchSignUp]
}