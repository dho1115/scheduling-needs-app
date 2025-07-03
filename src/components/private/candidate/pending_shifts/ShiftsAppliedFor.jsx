import React, { useContext } from 'react';

//dependencies.
import { ShiftContext } from '../../../../App'
import { Container } from 'reactstrap';

import "./ShiftsAppliedFor.styles.css";

const ShiftsAppliedFor = () => {
  const { currentUser } = useContext(ShiftContext);
  const { shiftsAppliedFor } = currentUser; //array of shifts.

  if (!shiftsAppliedFor) {
    return (
      <div>
        <Container className='no-shifts-container'>
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
          shiftsAppliedFor.map((val, idx) => {
            return (
              <div key={idx}>
                <strong>{JSON.stringify(val)}</strong>
              </div>
            )
          })
         }
      </Container>
    </div>
  )
}

export default ShiftsAppliedFor