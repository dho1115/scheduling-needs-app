export const ConfirmApprovedShiftLogic = async (_shiftID, shiftDate, url, username, storeNumber, emailjs, SERVICE_ID=null, CONFIRM_SHIFT_KEY_ID=null, PUBLIC_KEY=null, comments="", title="YOUR SHIFT HAS BEEN APPROVED!!!") => {
   try {
      if (!(SERVICE_ID && CONFIRM_SHIFT_KEY_ID && PUBLIC_KEY)) throw new Error(`ERROR in ConfirmApprovedShiftLogic function. Missing SERVICE_ID (you have ${SERVICE_ID}) AND/OR TEMPLATE ID (you have ${CONFIRM_SHIFT_KEY_ID}).`);

      const templateParams = { email: import.meta.env.VITE_EMAILJS_DEFAULT_EMAIL, comments, _shiftID, storeNumber, shiftDate, url, username, title /* candidate name. */ };

      const sendEmail = await emailjs.send(SERVICE_ID, CONFIRM_SHIFT_KEY_ID, templateParams);

      return { message: "sendEmail is SUCCESSFUL!!!", sendEmail, status: sendEmail.status, text: sendEmail.text, templateParams };
   } catch (error) {
      console.error({ message: 'ConfirmApprovedShiftLogic ERROR!!!', error, errorName: error.name, errorMessage: error.message });
   }
}