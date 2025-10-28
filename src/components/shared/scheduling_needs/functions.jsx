import { DeleteRequestSetState } from "../../../functions/deleteRequest"
import { PostRequestII, PostRequestSetState } from "../../../functions/postRequest"

export const TransferShift = async (fromURL, toURL, postData, postStateWrapper, deleteStateWrapper) => {
   try {
      const postDataLogic = await PostRequestSetState(toURL, postData, postStateWrapper);
      const deleteDataLogic = await DeleteRequestSetState(fromURL, deleteStateWrapper);

      return postData;
   } catch (error) {
      console.error({ message: "ERROR inside TransferShift function!!!", error, errorMessage: error.message, errorCode: error.code, errorStack: error.stack });
   }
}

export const findShiftInShiftStatus = (id_of_shift, shiftStatus) => shiftStatus.find(({ shiftID }) => shiftID == id_of_shift);