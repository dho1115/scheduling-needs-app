import React, { Suspense, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShiftContext } from '../../../../App'
import { Button, Container } from 'reactstrap';
import { DateTime } from 'luxon';
import LoadingComponent from '../../../LoadingComponent';

import "./ShiftsNeedingConfirmation.styles.css";

const ShiftsNeedingConfirmation = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const { shiftStatuses: {shiftsPendingConfirmation}, setShiftStatuses  } = useContext(ShiftContext);

   const handleShiftConfirmation = async val => {
      const dateConfirmed = DateTime.now().toFormat('yyyy-MM-dd');
      const confirmationDetails = {...val, dateConfirmed };
      console.log(confirmationDetails);

      alert(`${val.shiftID} (store number ${val.storeNumber}) has just been confirmed by ${val.applicantName} on ${dateConfirmed}!!!`);
   }

   return (
      <Container style={{display: 'grid', gridTemplateColumns: '33% 33% 33%'}}>
         {
            shiftsPendingConfirmation.filter(shiftNeedingConfirmation => shiftNeedingConfirmation.applicant.id == id).map((val, idx) => {
               const { id, shiftID, date, time, storeNumber, approvedOn, applicant: { id: applicantID, name, role } } = val;
               
               return (
                  <div key={idx} className='m-1 p-1' style={{ overflowWrap: 'break-word', overflow: 'hidden', border: '5px solid firebrick', backgroundColor: 'bisque' }}>
                     <Suspense fallback={<LoadingComponent />}>
                        <h5>shiftWithApplicant ID: <span className='text-danger'>{id}</span> was approved on <span className='text-danger'>{approvedOn}</span>.</h5>
                        <h5>ID for this shift: <span className='text-danger'>{shiftID}</span>.</h5>
                        <h5>Store Number: {storeNumber}.</h5>
                        <h5>Date for this shift: <span className='text-danger'>{date}</span>.</h5>
                        <h5>Time(s) for this shift: <span className='text-danger'>{time}</span>.</h5>
                        <hr />
                        <h5>APPLICANT ASSIGNED TO WORK SHIFT # {shiftID}:</h5>
                        <h5>Applicant Name/applicant id: {name} - {applicantID}.</h5>
                        <Button color='danger' size='xl' className='w-100' onClick={() => handleShiftConfirmation({ shiftWithApplicantID: id, shiftID, applicantName: name, applicantID, date_of_shift: date, storeNumber, time })}>PLEASE CONFIRM THIS DAMN SHIFT!!!</Button>
                     </Suspense>
                  </div>
               )
            })
         }
      </Container>
   )
}

export default ShiftsNeedingConfirmation