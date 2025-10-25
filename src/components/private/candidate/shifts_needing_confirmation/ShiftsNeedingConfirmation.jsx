import React, { Suspense, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShiftContext } from '../../../../App'
import { Button, Container } from 'reactstrap';
import { DateTime } from 'luxon';
import LoadingComponent from '../../../LoadingComponent';

import { DeleteRequest } from '../../../../functions/deleteRequest';
import { PostRequest } from '../../../../functions/postRequest';
import { PutRequest } from '../../../../functions/putRequest';

import "./ShiftsNeedingConfirmation.styles.css";

const ShiftsNeedingConfirmation = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const { shiftStatuses: {shiftsPendingConfirmation}, setShiftStatuses  } = useContext(ShiftContext);

   const handleShiftConfirmation = async val => {
      const dateConfirmed = DateTime.now().toFormat('yyyy-MM-dd');

   }

   return (
      <Container>
         {
            shiftsPendingConfirmation.filter(({ _candidateID }) => _candidateID == id).map((val, idx) => (
               <div key={idx} className='m-1 p-1' style={{ overflowWrap: 'break-word', overflow: 'hidden', border: '5px solid firebrick', backgroundColor: 'burlywood' }}>
                  <Suspense fallback={<LoadingComponent />}>
                     <h5>{JSON.stringify(val)}</h5>
                     <hr />
                     <Button color='danger' size='xl' className='w-100' onClick={() => handleShiftConfirmation(val)}>PLEASE CONFIRM THIS DAMN SHIFT!!!</Button>
                  </Suspense>
               </div>
            ))
         }
      </Container>
   )
}

export default ShiftsNeedingConfirmation