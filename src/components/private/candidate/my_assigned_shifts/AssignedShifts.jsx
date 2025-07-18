import React, { useContext } from 'react'
import { Container } from 'reactstrap';
import { ShiftContext } from '../../../../App';
import "./AssignedShifts.styles.css";

const AssignedShifts = () => {
   const { shiftsAwarded, currentUser } = useContext(ShiftContext);
   const { name } = currentUser;

   return (
      <div>
         <header className='assigned-shifts-header'>
            <h3>{name}'s assigned shift(s).</h3>
         </header>
         <Container className='assigned-shifts-container p-3 m-1'>
            {
               !shiftsAwarded.length && <h1 color='danger'>YOU HAVE NO ASSIGNED SHIFTS (YET).</h1>
            }
         </Container>
      </div>
   )
}

export default AssignedShifts