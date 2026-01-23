import { fb_signOut, fb_signUpNewUser, fb_userLogin } from "./authorization";
import { fb_addOneDocument, fb_deleteOneDocument } from "./crud_basic";

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
      return await Promise.all([
         await fb_userLogin(fake_email, signUp_details.password, location),
         await fb_addOneDocument('Current User', signUp_details, signUp_details.id, location)
      ]);
   } catch (error) {
      console.error({ message: "ERROR inside fb_fs_ExistingUserLogin (miscellaneous.jsx)!!!", location, error, fake_email, errorStack: error.stack, errorName: error.name, errorCode: error.code, errorMessage: error.message })
      
      return { message: "ERROR inside fb_fs_ExistingUserLogin (miscellaneous.jsx)!!!", location, error, fake_email, errorStack: error.stack, errorName: error.name, errorCode: error.code, errorMessage: error.message }
   }
}

export const fb_fs_SignOutProcess = async (_currentUserID, setCurrentUserDeclaration, currentUser, location) => {
   try {
      const set_current_user = () => new Promise((res, rej) => {
         console.log("currentUser was", currentUser)
         setCurrentUserDeclaration();
         res({ message: "Successully set currentUser!!!", currentUser });
         rej({ error_message: `currentUser is still ${JSON.stringify(currentUser)}!!!` })
      });

      return await Promise.all([
         fb_signOut(_currentUserID, location),
         fb_deleteOneDocument("Current User", _currentUserID), set_current_user()
            .then(result => console.log(result))
            .catch(error => console.error(error))
      ])
   } catch (error) {
      console.error({ message: "Error in fb_fs_SignOutProcess (miscellaneous.jsx)", location, error, errorMessage: error.message, errorStack: error.stack, errorName: error.name });
   }
}