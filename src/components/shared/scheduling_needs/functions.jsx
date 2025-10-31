import { DeleteRequestSetState } from "../../../functions/deleteRequest"
import { AddNewShiftToDBandState, PostRequestII, PostRequestSetState } from "../../../functions/postRequest"
AddNewShiftToDBandState

export const TransferApprovedShift = async (approvedShiftWithApplicant, applicant, shiftid, formattedDateApproved /* DateTime API */, currentUser, setStateWrapper, location=null) => {
   try {
      if (!approvedShiftWithApplicant) throw new Error(`*** NO APPROVED SHIFT WITH APPLICANT!!!\nThe function, approvedShiftWithApplicant returned:\n ${approvedShiftWithApplicant}. LOCATION OF ERROR => ${location}`);

      const approved_shift_updated = { ...approvedShiftWithApplicant, approvedOn: formattedDateApproved, approvedBy: currentUser.name, supervisorId: currentUser.id }; //approved shift bject be tranferred to shiftsPendingConfirmation.
      
      return await AddNewShiftToDBandState(
         "http://localhost:3003/shiftsPendingConfirmation", approved_shift_updated,
         setStateWrapper(approved_shift_updated)
      );
   } catch (error) {
      console.error({ message: "TransferShift function error!!!", error, errorStack: error.stack, errorName: error.name, errorMessage: error.message, errorCode: error.code });
   }
}

export const findShiftInArray = (id_of_shift, array) => {
   console.log(id_of_shift, array);
   return array.filter(({ shiftID }) => shiftID == id_of_shift)
};

export const didApplicantApplyForShift = (_currentUserID, shiftID, shiftsWithApplicants) => shiftsWithApplicants.find(({ id }) => (id.includes(_currentUserID)) && (id.includes(shiftID)))

export const youveGotApplicants = (shiftID_toFind, shiftsWithApplicants) => shiftsWithApplicants.filter(shiftWithApplicant => shiftWithApplicant.shiftID == shiftID_toFind)