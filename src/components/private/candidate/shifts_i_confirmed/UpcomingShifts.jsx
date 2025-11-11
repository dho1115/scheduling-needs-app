import React, { useContext } from 'react'

//Contexts.
import { ShiftContext } from '../../../../App.jsx';

//Dependencies.
import { Container } from 'reactstrap';
import { DateTime } from 'luxon';

import "./UpcomingShifts.styles.css"


const UpcomingShifts = () => {
   const { currentUser, shiftStatuses: { shiftsConfirmed } } = useContext(ShiftContext);

  const MyUpcomingShifts = shiftsConfirmed
    .filter(({ applicantID }) => applicantID == currentUser.id)
    .sort((a, b) => {
      const dt_a = DateTime.fromISO(a.date_of_shift);
      const dt_b = DateTime.fromISO(b.date_of_shift);
      
      return dt_a - dt_b;
    });

  return (
    <div className='m-1 p-1'>
      <header style={{textAlign: 'center'}}>
         <h1>Upcoming Shifts (earliest to latest) for <span className='text-danger'>{currentUser.name}</span>.</h1>
      </header>
      <Container className='upcoming-shifts-container p-5'>
        {
          MyUpcomingShifts.map((shift, idx) => (
            <div className={idx % 2 == 1 ? 'my-shifts-cell-1 p-1 m-1' : 'my-shifts-cell-2 m-1'} key={idx}>
              <h5 className='py-3 px-1'>Scheduled To Work: <strong className='text-success p-0' style={{backgroundColor: 'white'}}>{shift.date_of_shift}</strong>.</h5>
              <strong className='mx-3'>{JSON.stringify(shift)}</strong>
            </div>
          ))
         }
      </Container>
    </div>
    
  )
}

export default UpcomingShifts