import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

export const signUpNewUser = async (email, password, location=null) => {
   try {
      const currentUser_credential = await createUserWithEmailAndPassword(auth, email, password);
      const userCredential = currentUser_credential.user;
      console.log(`Successfully signed up ${JSON.stringify(userCredential)}!!!`);
      return userCredential;
   } catch (error) {
      console.error({ message: "createNewUser error (authorization.jsx)", location, error, errorMessage: error.message, errorName: error.name });
   }
}

export const userLogin = async (email, password, location=null) => {
   try {
      const login_credential = await signInWithEmailAndPassword(auth, email, password);
      const currentUser = login_credential.user;
      console.log(`Successfully logged in ${JSON.stringify(currentUser)}.`);
      return currentUser;      
   } catch (error) {
      console.error({ message: "userLogin error (authorization.jsx)", location, error, errorMessage: error.message, errorName: error.name });
   }
}

export const checkAuthStatus = (currentUser) => onAuthStateChanged(auth, (user = currentUser) => {
   if (user) {
      const { uid, email } = user;
      console.log(`Currently logged in with _id ${uid} and email of ${email}.`)
   } else console.log("*** USER SIGNED OUT. ***");
})