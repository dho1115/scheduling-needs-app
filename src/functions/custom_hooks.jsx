import { useEffect, useState } from "react"
import { fb_addOneDocument, fb_BatchDelete, fb_deleteOneDocument, fb_fetchAllDocs } from "./firebase/crud_basic";
import { fb_signUpNewUser } from "./firebase/authorization";
import { collection, doc, getDocs, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

export const useFetchFirestoreAndSetState = (allFirestoreCollections, location=null) => {
   if (!Array.isArray(allFirestoreCollections)) throw new Error(`The arguement, allFirestoreCollections has to be an array!!! You have ${JSON.stringify(allFirestoreCollections)} which is a ${typeof (allFirestoreCollections)}.`);

   fb_BatchDelete(location)
      .then(result => console.log(result))
      .catch(error => console.error(error)) //Deletes any expired shifts.
   
   getDocs(collection(db, "Current User"))
      .then(snapshot => {
         snapshot.docs.forEach(document => {
            const snapshot_doc = { id: document.id, docID: document.data().id, docName: document.data().name };

            console.log("snapshot_doc:", snapshot_doc);

            if (!(snapshot_doc.docID && snapshot_doc.docName)) return fb_deleteOneDocument("Current User", snapshot_doc.id)
         });
      })
      .then(deleteConfirmation => console.log(deleteConfirmation))
      .catch(error => console.error(error)) //Delete logic to execute IF there is no id and name property in Current User collection.
   
   //===== state/set state =====
   const [currentUser, setCurrentUser] = useState({ id: '', name: '', password: '', role: '' });

   const [shiftStatuses, setShiftStatuses] = useState({ shiftsAvailable: [], shiftsWithApplicants: [], shiftsPendingConfirmation: [], shiftsConfirmed: [] });

   const [employees, setEmployees] = useState([]);
   //============================

   const MapDatabaseToState = {
      "Current User": setCurrentUser,
      "Employees": setEmployees,
      "Shifts Available": documents => setShiftStatuses(prv => ({ ...prv, shiftsAvailable: documents })),
      "Shifts With Applicants": documents => setShiftStatuses(prv => ({ ...prv, shiftsWithApplicants: documents })),
      "Shifts Pending Confirmation": documents => setShiftStatuses(prv => ({ ...prv, shiftsPendingConfirmation: documents })),
      "Shifts Confirmed": documents => setShiftStatuses(prv => ({...prv, shiftsWithApplicants: documents}))
   }

   useEffect(() => {
      allFirestoreCollections.forEach(async collection_name => {
         const documents = await fb_fetchAllDocs(collection_name, location)
         MapDatabaseToState[collection_name](documents);
         console.log({collection_name: MapDatabaseToState[collection_name](documents)})
      })
      return () => {
         setShiftStatuses({ shiftsAvailable: [], shiftsWithApplicants: [], shiftsPendingConfirmation: [], shiftsConfirmed: [] });
         console.log("About to leave App.js. ")
      };
   }, [])

   return [currentUser, setCurrentUser, shiftStatuses, setShiftStatuses, employees, setEmployees];
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