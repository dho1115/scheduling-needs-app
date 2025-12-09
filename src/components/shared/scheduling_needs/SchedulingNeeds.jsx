//Dependencies.
import { Suspense, useContext, useEffect } from 'react'
import { ShiftContext } from '../../../App';
import { SupervisorPageContext } from '../../../pages/supervisor/SupervisorPage';
import Shift from './shift_component/Shift';
import { Button, Container } from 'reactstrap';
import ErrorBoundary from '../../ErrorBoundary';
import emailjs from '@emailjs/browser';

//Functions.
import { DateTime } from 'luxon';
import { fetchDataPromise } from '../../../functions/FetchHook';
import { PatchRequest } from '../../../functions/patchRequest';

import "./SchedulingNeeds.styles.css";

const SchedulingNeeds = () => {
   const { currentUser, emailjs_keys, shiftStatuses: { shiftsAvailable } } = useContext(ShiftContext);
   const { newShiftAdded, setNewShiftAdded } = useContext(SupervisorPageContext);

   const { SERVICE_ID, PUBLIC_KEY_ID, GENERAL_KEY_ID, CONFIRM_SHIFT_KEY_ID } = emailjs_keys;

   useEffect(() => {
      if (!shiftsAvailable || !shiftsAvailable.length) console.error("*** WARNING!!! *** shiftsAvailable returned: ", shiftsAvailable);
   }, [])

   const handleSendSchedulingNeedsNotification = async (...args) => {
      alert("Notification has been sent!!!")
      console.log("NOTIFICATION HAS BEEN SENT!!!")
      const currentDateTime = DateTime.now();
      const currentDateTimeISO = DateTime.now().toISO();

      try {
         const fetchDate = await fetchDataPromise("http://localhost:3003/shiftsNotificationSent");

         if (fetchDate.date == "") {
            const initializeDateTime = await PatchRequest("http://localhost:3003/shiftsNotificationSent", { date: currentDateTimeISO });
         }

         const templateParams = { email: import.meta.env.VITE_EMAILJS_DEFAULT_EMAIL, comments: "SCHEULING NEEDS UPDATED!!! (SHIFTS HAVE BEEN ADDED/REMOVED)!!!", _shiftID:"N/A", storeNumber:"", shiftDate: currentDateTime, url:"ttp://localhost:3001/", username:"ALL CANDIDATES!!!" /* candidate name. */ };

         const sendEmail = await emailjs.send(SERVICE_ID, CONFIRM_SHIFT_KEY_ID, templateParams);

         const PatchNotificationSentDate = await PatchRequest("http://localhost:3003/shiftsNotificationSent", { date: currentDateTimeISO });

      } catch (error) {
         console.error({ message: "handleSendSchedulingNeedsNotification ERROR!!!", error, errorMessage: error.message, errorName: error.name });
      }
   } 
   
   return (
      <div>
         <header>
            <h1>SCHEDULING NEEDS.</h1>
         </header>
         
         {
            (currentUser.role == 'supervisor' && newShiftAdded)
            &&
            <div className='m-3 p-1' style={{float: "right"}}>
               <Button size='lg' color='danger' onClick={handleSendSchedulingNeedsNotification}>SEND SCHEDULING NEEDS NOTIFICATION!!!</Button>
            </div>
         }
         
         <Container className='p-3 scheduling-needs-container'>
            <Suspense fallback={<h5>Loading shiftsAvailable...</h5>}>
               {
                  shiftsAvailable.map((val, idx) => ( /* shiftsAvailable is not a function??? */
                     <ErrorBoundary fallback={<h3 className='text-danger'>ERROR!!!</h3>}>
                        <Suspense fallback={<h3 className='text-danger'>LOADING...</h3>}>
                           <Shift key={idx} {...val} idx={idx} />
                        </Suspense>
                     </ErrorBoundary>)
                  )
               }
            </Suspense>
         </Container>
      </div>
   )
}

export default SchedulingNeeds