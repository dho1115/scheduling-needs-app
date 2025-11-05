import { DeleteRequest } from "../../../../functions/deleteRequest"
import { PostRequestII } from "../../../../functions/postRequest";


export const TransferFromPendingConfirmation = async (url, shift_object, location=null) => {
   try {
      if (typeof (shift_object) != 'object') throw new Error(`WARNING FROM removeFromShiftsPendingConfirmation!!! shift_object MUST be of type 'object'. Your shift_object is of type ${typeof (shift_object)}!!!`)
      
      const DeleteFromPendingConf = await DeleteRequest(url, shift_object.shiftWithApplicantID);
      
      const AddToPendingConf = await PostRequestII("http://localhost:3003/shiftsConfirmed", shift_object, shift_object.shiftWithApplicantID);

      return { shift_object, deleted: DeleteFromPendingConf, posted: AddToPendingConf };
   } catch (error) {
      console.error({from: location, error, errorMessage: error.message, errorName: error.name, errorStack: error.stack, shift_object, url_to_delete: url})
   }
}