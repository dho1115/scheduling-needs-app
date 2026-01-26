import { useEffect, useState } from "react"
import { fb_addOneDocument, fb_BatchDeleteExpiredShifts, fb_fetchAllDocs, } from "./firebase/crud_basic";
import { fb_signUpNewUser } from "./firebase/authorization";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import { setCurrentUserState } from "./firebase/miscellaneous";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const useFetchFirestoreAndSetState = (allFirestoreCollections, location=null) => {
   if (!Array.isArray(allFirestoreCollections)) throw new Error(`The arguement, allFirestoreCollections has to be an array!!! You have ${JSON.stringify(allFirestoreCollections)} which is a ${typeof (allFirestoreCollections)}.`);

   const navigate = useNavigate();

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
      // "Shifts Confirmed": documents => setShiftStatuses(prv => ({...prv, shiftsConfirmed: documents}))
   }
   
   useEffect(() => {
      //========= Deleted Expired Shifts From Firestore!!! =========
      fb_BatchDeleteExpiredShifts(location)
      .then(result => console.log(result))
      .catch(error => console.error(error)) //Deletes any expired shifts.
      //=============================================================

      setCurrentUserState(currentUser, setCurrentUser, location)
         .then(message => console.log({ message }))
         .catch(error => console.error({ error, location })); //new code that replaces previous getDocs(...) which was used to setCurrentUser.

      allFirestoreCollections.forEach(async collection_name => {
         const documents = await fb_fetchAllDocs(collection_name, location)

         if (documents.length) MapDatabaseToState[collection_name](documents)
      })

      return () => {
         setCurrentUser({ id: '', name: '', password: '', role: '' });
         setShiftStatuses({ shiftsAvailable: [], shiftsWithApplicants: [], shiftsPendingConfirmation: [], shiftsConfirmed: [] });
         setEmployees([])
      };
   }, [])

   useEffect(() => {
      onAuthStateChanged(auth, function (user) {
          if (user) {
             console.log("currently signed in as: ", user.uid);
             fb_fetchAllDocs("Current User", location)
                .then(result => {
                   const currentUser_id = result[0].id;

                   if (currentUser_id.startsWith("s")) navigate(`/supervisor/welcome/${currentUser_id}`);
                   else navigate(`/candidate/welcome/${currentUser_id}/`);
                })
                .catch(error => console.error({ message: "Inside useFetchFirestoreAndSetState (custom_hooks.jsx)", location, error, errorMessage: error.message }));
          } else {
             console.log("No user. User is:", user);
          }
      })
   }, [auth.currentUser])

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