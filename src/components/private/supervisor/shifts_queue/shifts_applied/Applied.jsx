import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import { ShiftContext } from '../../../../../App';
import { DateTime } from 'luxon';

//Components.
import Applicant from './Applicant';

//functions.
import { addShiftToShiftsPendingConfirmation, findSelectedEmployee, removeShiftID } from './functions';

import "./Applied.styles.css";

const Applied = () => {
   const [appliedForShifts, setAppliedForShifts] = useState([]);
   const navigate = useNavigate();
   
   useEffect(() => {

      return () => setAppliedForShifts([]);
   }, [])
   
   const onHandleAssignShift = () => {

   }

   return (
      <div>
         <header className='applied-for-header p-1'>
            <h1>SHIFT(S) WITH CANDIDATES!!!</h1>
         </header>

         <Container className='applied-for-shifts p-3 m-3'>
            
         </Container>
      </div>
   )
}

export default Applied