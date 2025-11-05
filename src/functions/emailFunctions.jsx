export const ConfirmApprovedShiftLogic = (_shiftID, shiftDate, url, username, storeNumber, emailjs, SERVICE_ID=null, CONFIRM_SHIFT_KEY_ID=null, PUBLIC_KEY=null) => {
   try {
      if (!(SERVICE_ID && CONFIRM_SHIFT_KEY_ID && PUBLIC_KEY)) throw new Error(`ERROR in ConfirmApprovedShiftLogic function. Missing SERVICE_ID (you have ${SERVICE_ID}) AND/OR TEMPLATE ID (you have ${CONFIRM_SHIFT_KEY_ID}).`);

      const templateParams = { _shiftID, storeNumber, shiftDate, url, username /* candidate name. */ };

      const sendEmail = emailjs.send(SERVICE_ID, CONFIRM_SHIFT_KEY_ID, templateParams, PUBLIC_KEY);

      return { message: "sendEmail is SUCCESSFUL!!!", sendEmail, status: sendEmail.status, text: sendEmail.text, templateParams };
   } catch (error) {
      console.error({ message: 'ConfirmApprovedShiftLogic ERROR!!!', error, errorName: error.name, errorMessage: error.message });
   }
}