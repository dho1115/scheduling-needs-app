import React, { useContext } from 'react'
import { Container } from 'reactstrap';
import { ShiftContext } from '../../../../App';

import AssignedShiftsList from './AssignedShiftsList';

import "./AssignedShifts.styles.css";

const AssignedShifts = () => {
   const { shiftStatuses:{shiftsAssigned}, currentUser } = useContext(ShiftContext);
   const { name } = currentUser;

   return (
      <div>
         <header className='assigned-shifts-header'>
            <h3>{name}'s assigned shift(s).</h3>
         </header>
         <Container className='assigned-shifts-container p-3 m-1'>
            {
               !shiftsAssigned.length ? <h1 color='danger'>YOU HAVE NO ASSIGNED SHIFTS (YET).</h1> : <AssignedShiftsList />
            }
         </Container>
      </div>
   )
}

export default AssignedShifts