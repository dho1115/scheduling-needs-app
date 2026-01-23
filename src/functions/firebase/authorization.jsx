import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { fb_deleteOneDocument } from "./crud_basic";
import { auth } from "../../firebase";

export const fb_signUpNewUser = async (email, password, location=null) => {
   try {
      const currentUser_credential = await createUserWithEmailAndPassword(auth, email, password);
      const userCredential = currentUser_credential.user;
      return userCredential;
   } catch (error) {
      console.error({ message: "createNewUser error (authorization.jsx)", location, error, errorMessage: error.message, errorName: error.name });
   }
}

export const fb_userLogin = async (email, password, location = null) => {
   console.log("logging in with the following:", { email, password });
   try {
      const login_credential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = login_credential.user;
      console.log(`Successfully logged in ${JSON.stringify(currentUser)}.`);

      if (!currentUser) throw new Error(`ERROR in fb_userLogin (authorization.jsx), located in ${location}!!!\ncurrentUser = ${currentUser}!!!`)
      
      return login_credential
   } catch (error) {
      console.error({ message: "userLogin error (authorization.jsx)", location, error, errorMessage: error.message, errorName: error.name });
   }
}

export const fb_signOut = async (location=null) => {
   try {
      const sign_out = await signOut(auth);

      return { message: "Successfully signed out of Firebase Auth.", sign_out_credential: sign_out };
   } catch (error) {
      console.error({message: "ERROR in fb_signOut.", location, error, errorMessage: error.message, errorName: error.name})
   }
}

export const checkAuthStatus = (currentUser) => onAuthStateChanged(auth, (user = currentUser) => {
   if (user) {
      const { uid, email } = user;
      console.log(`Currently logged in with _id ${uid} and email of ${email}.`)
   } else console.log("*** USER SIGNED OUT. ***");
})