import { collection, getDoc, getDocs } from "firebase/firestore";
import { fb_signOut, fb_signUpNewUser, fb_userLogin } from "./authorization";
import { fb_addOneDocument, fb_deleteOneDocument } from "./crud_basic";
import { auth, db } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

export const setCurrentUserState = async(currentUser, setCurrentUser_fn_declaration, location=null) => {
   let snapshot_result = {};
   try {
      const currentUserSnapshot = await getDocs(collection(db, "Current User"))

      currentUserSnapshot.docs.forEach(async document => {
         if (auth?.currentUser?.uid) {
            setCurrentUser_fn_declaration({ ...document.data() }); //setCurrentUser({...document.data});
            snapshot_result = { ...snapshot_result, authCurrentUser: auth.currentUser, uid: auth.currentUser.uid, currentUser };
         } else {
            const deleteCurrentUser = await fb_deleteOneDocument("Current User", currentUser.id, location, currentUser,);

            snapshot_result = { ...snapshot_result, authCurrentUser: auth.currentUser, currentUser, deleteCurrentUser_msg: deleteCurrentUser };
         }
      })

      return snapshot_result;
   } catch (error) {
      console.error({ message: "ERROR in setCurrentUserState (miscellaneious.jsx)!!!", location, error, errorName: error.name, errorMessage: error.message });
   }
}

export const fb_fs_NewUserRegistration = async (signUp_details, location=null) => {
   const fake_email = `${signUp_details.name.split(" ").join("") + signUp_details.id}@email.com`
   try {
      return await Promise.all([
         fb_signUpNewUser(fake_email, signUp_details.password, location),
         fb_addOneDocument("Current User", signUp_details, signUp_details.id, location),
         fb_addOneDocument("Employees", signUp_details, signUp_details.id, location)
      ])
   } catch (error) {
      console.error({location, fake_email, error, errorMessage: error.message, errorName: error.name})
   }
}

export const fb_fs_ExistingUserLogin = async (signUp_details, location) => {
   const fake_email = `${signUp_details.name.split(" ").join("") + signUp_details.id}@email.com`;
   try {
      console.log({ fake_email, password: signUp_details.password });
      debugger;

      return await Promise.all([
         // fb_userLogin(fake_email, signUp_details.password, location),
         signInWithEmailAndPassword(auth, fake_email, signUp_details.password),
         fb_addOneDocument('Current User', signUp_details, signUp_details.id, location)
      ]);
   } catch (error) {
      console.error({ message: "ERROR inside fb_fs_ExistingUserLogin (miscellaneous.jsx)!!!", location, error, fake_email, errorStack: error.stack, errorName: error.name, errorCode: error.code, errorMessage: error.message })
      
      return { message: "ERROR inside fb_fs_ExistingUserLogin (miscellaneous.jsx)!!!", location, error, fake_email, errorStack: error.stack, errorName: error.name, errorCode: error.code, errorMessage: error.message }
   }
}

export const fb_fs_get_docID = async (collection) => {
   return await getDoc(collection)
}

export const fb_fs_SignOutProcess = async (_currentUserID, setCurrentUserDeclaration, currentUser, location) => {
   try {
      const set_current_user = () => new Promise((res, rej) => {
         setCurrentUserDeclaration();
         res({ message: "Successully set currentUser!!!", currentUser });
         rej({ error_message: `currentUser is still ${JSON.stringify(currentUser)}!!!` })
      });

      return await Promise.all([
         await fb_signOut(_currentUserID, location),
         await fb_deleteOneDocument("Current User", _currentUserID, location),
         await set_current_user()
            .then(result => console.log("result after set_current_user:", result))
            .catch(error => console.error({ message: `ERROR logging off ${JSON.stringify(currentUser)} (miscellaneous.jsx)!!!`, location, error, errorMessage: error.message, errorName: error.name }))
      ])
   } catch (error) {
      console.error({ message: "Error in fb_fs_SignOutProcess (miscellaneous.jsx)", location, error, errorMessage: error.message, errorStack: error.stack, errorName: error.name });
   }
}