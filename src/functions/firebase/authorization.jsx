import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
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

export const fb_userLogin = async (email, password, location=null) => {
   try {
      const login_credential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = login_credential.user;
      console.log(`Successfully logged in ${JSON.stringify(currentUser)}.`);

      if (!currentUser) throw new Error(`ERROR in fb_userLogin (authorization.jsx), located in ${location}!!!\ncurrentUser = ${currentUser}!!!`)
      
      return currentUser;
   } catch (error) {
      console.error({ message: "userLogin error (authorization.jsx)", location, error, errorMessage: error.message, errorName: error.name });
   }
}

export const fb_signOut = async () => {
   try {
      const sign_out = await signOut(auth);
      console.log({ message: "fb_signOut SUCCESSFUL!!!", authCurrentUser: auth.currentUser, sign_out });
      
      return { message: "fb_signOut SUCCESSFUL!!!", authCurrentUser: auth.currentUser, sign_out };
   } catch (error) {
      console.error({message: "ERROR in fb_signOut.", error, errorMessage: error.message, errorName: error.name})
   }
}

export const checkAuthStatus = (currentUser) => onAuthStateChanged(auth, (user = currentUser) => {
   if (user) {
      const { uid, email } = user;
      console.log(`Currently logged in with _id ${uid} and email of ${email}.`)
   } else console.log("*** USER SIGNED OUT. ***");
})