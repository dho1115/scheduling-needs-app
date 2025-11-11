import React, { Suspense, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { ShiftContext } from '../../../../App'
import { Button, Container } from 'reactstrap';
import { DateTime } from 'luxon';
import { TransferFromPendingConfirmation } from './functions';
import LoadingComponent from '../../../LoadingComponent';

import "./ShiftsNeedingConfirmation.styles.css";

const ShiftsNeedingConfirmation = () => {
   const { pathname } = useLocation();
   const { id } = useParams();
   const navigate = useNavigate();
   const { shiftStatuses: {shiftsPendingConfirmation}, setShiftStatuses  } = useContext(ShiftContext);

   const handleShiftConfirmation = async val => {
      try {
         const dateConfirmed = DateTime.now().toFormat('yyyy-MM-dd');
         const shift_object = { ...val, dateConfirmed };
         const TransferShift = TransferFromPendingConfirmation(`http://localhost:3003/shiftsPendingConfirmation/${val.shiftWithApplicantID}`, shift_object, pathname)

         return { TransferShift, val, shift_object, urlDeleted: `http://localhost:3003/shiftsPendingConfirmation/${val.shiftWithApplicantID}`};
      } catch (error) {
         console.error({ message: "ERROR from handleShiftConfirmation!!!", error, errorMessage: error.message, errorStack: error.stack, errorType: error.type, val, shiftNeedingConfirmation_id: val.shiftWithApplicantID});

         return { message: "ERROR from handleShiftConfirmation!!!", error, errorMessage: error.message, errorStack: error.stack, errorType: error.type, val, shiftWithApplicantID: val.id }
      }      
   }

   return (
      <Container style={{display: 'grid', gridTemplateColumns: '33% 33% 33%'}}>
         {
            shiftsPendingConfirmation.filter(shiftNeedingConfirmation => shiftNeedingConfirmation.applicant.id == id).map((val, idx) => {
               const { id, shiftID, date, time, storeNumber, approvedOn, applicant: { id: applicantID, name, role } } = val;
               
               return (
                  <div key={idx} className='m-1 p-1' style={{ overflowWrap: 'break-word', overflow: 'hidden', border: '5px solid firebrick', backgroundColor: 'lightgreen' }}>
                     <Suspense fallback={<LoadingComponent />}>
                        <h5>shiftWithApplicant ID: <span className='text-danger'>{id}</span> was approved on <span className='text-danger'>{approvedOn}</span>.</h5>
                        <h5>ID for this shift: <span className='text-danger'>{shiftID}</span>.</h5>
                        <h5>Store Number: {storeNumber}.</h5>
                        <h5>Date for this shift: <span className='text-danger'>{date}</span>.</h5>
                        <h5>Time(s) for this shift: <span className='text-danger'>{time}</span>.</h5>
                        <hr />
                        <h5>APPLICANT ASSIGNED TO WORK SHIFT # {shiftID}:</h5>
                        <h5>Applicant Name/applicant id: {name} - {applicantID}.</h5>
                        <Button color='danger' size='xl' className='w-100' onClick={() => handleShiftConfirmation({ id, shiftWithApplicantID: id, shiftID, applicantName: name, applicantID, date_of_shift: date, storeNumber, time })
                           .then(() => navigate(`/candidate/welcome/${id}/available shifts`))
                           .catch(error => console.error({ error, errorMessage: error.message }))}>PLEASE CONFIRM THIS DAMN SHIFT!!!</Button>
                     </Suspense>
                  </div>
               )
            })
         }
      </Container>
   )
}

export default ShiftsNeedingConfirmation