import React, { useContext } from 'react';

//dependencies.
import { ShiftContext } from '../../../../App'
import { Container } from 'reactstrap';

import "./ShiftsAppliedFor.styles.css";

const ShiftsAppliedFor = () => {
  const { currentUser, shiftsArray } = useContext(ShiftContext);
  const { shiftsAppliedFor } = currentUser; //array of shifts.

  if (!shiftsAppliedFor) {
    return (
      <div>
        <Container className='p-1'>
          <h1>You Have Not Applied for any Shifts (yet)!!!</h1>
        </Container>
      </div>
    )
  }
  return (
    <div className='shiftsappliedfordiv p-1'>
      <header>
        <h1>SHIFTS I APPLIED FOR.</h1>
      </header>
      <Container>
         {
          shiftsArray
            .filter(({ id }) => shiftsAppliedFor.includes(id))
            .map(({ id, storeNumber, date, time }, idx) => (
              <div className={`p-1 my-3 ${idx%2==1 ? 'shift-cell-1' : 'shift-cell-2'}`} key={idx}>
                <h5>shift id:<span class='text-danger'>{id}</span></h5>
                <h5>store number:<span class='text-danger'>{storeNumber}</span></h5>
                <h5>shift schedule:<span class='text-danger'>{date}</span></h5>
                <h5>shift time:<span class='text-danger'>{time}</span></h5>
              </div>
            ))
         }
      </Container>
    </div>
  )
}

export default ShiftsAppliedFor