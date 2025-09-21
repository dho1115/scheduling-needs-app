import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShiftContext } from '../../../../App'
import { Button, Container } from 'reactstrap';

import "./ShiftsNeedingConfirmation.styles.css";

const ShiftsNeedingConfirmation = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const { unconfirmedShifts, setUnconfirmedShifts } = useContext(ShiftContext);

   const handleShiftConfirmation = val => {
      alert(`Confirmed: ${JSON.stringify(val)}.`);
      console.log("confirmed:", val);
   }

   return (
      <Container>
         {
            unconfirmedShifts.filter(({ _candidateID }) => _candidateID == id).map((val, idx) => (
               <div key={idx} className='m-1 p-1' style={{ overflowWrap: 'break-word', overflow: 'hidden', border: '5px solid firebrick', backgroundColor: 'burlywood' }}>
                  <h5>{JSON.stringify(val)}</h5>
                  <hr />
                  <Button color='danger' size='xl' className='w-100' onClick={() => handleShiftConfirmation(val)}>PLEASE CONFIRM THIS DAMN SHIFT!!!</Button>
               </div>
            ))
         }
      </Container>
   )
}

export default ShiftsNeedingConfirmation