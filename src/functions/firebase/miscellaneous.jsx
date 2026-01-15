import { fb_signUpNewUser, fb_userLogin } from "./authorization";
import { fb_addOneDocument } from "./crud_basic";

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
         fb_userLogin(fake_email, signUp_details.password, location), fb_addOneDocument('Current User', signUp_details, signUp_details.id, location),
         fb_addOneDocument('Employees', signUp_details, location)
      ]);
   } catch (error) {
      console.error({ message: "ERROR inside fb_fs_ExistingUserLogin (miscellaneous.jsx)!!!", location, error, fake_email, errorStack: error.stack, errorName: error.name, errorCode: error.code, errorMessage: error.message })
      
      return {message: "ERROR inside fb_fs_ExistingUserLogin (miscellaneous.jsx)!!!", location, error, fake_email, errorStack: error.stack, errorName: error.name, errorCode: error.code, errorMessage: error.message}
   }
}