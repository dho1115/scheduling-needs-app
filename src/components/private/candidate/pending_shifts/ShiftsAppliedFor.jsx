import React, { useContext } from 'react';

//dependencies.
import { ShiftContext } from '../../../../App'
import { Container } from 'reactstrap';

import "./ShiftsAppliedFor.styles.css";

const ShiftsAppliedFor = () => {
  const { currentUser, shiftStatuses: {shiftsWithApplicants} } = useContext(ShiftContext);
  
  const myShifts = shiftsWithApplicants.filter(({ applicant }) => applicant.id == currentUser.id)

  if (!myShifts.length) {
    return (
      <div>
        <Container className='p-1'>
          <h1>You Have Not Applied for any Shifts (yet)!!!</h1>
        </Container>
      </div>
    )
  }

  const onCandidateConfirm = (id, storeNumber, date, time) => {
    alert(`Shift# ${id} has been confirmed:${'\n'}${JSON.stringify({ id, storeNumber, date, time })}.`);
  }

  return (
    <div className='shiftsappliedfordiv p-1'>
      <header>
        <h1>SHIFTS I APPLIED FOR (AND PENDING APPROVAL).</h1>
      </header>
      <Container style={{border: '3px solid black', backgroundColor: 'blanchedalmond', display: 'grid', gridTemplateColumns: '19% 19% 19% 19% 19%'}}>
         {
          myShifts.map(({ shiftID, date, time, storeNumber }) => (
            <div style={{backgroundColor: 'lightgreen', border: '3.5px solid firebrick', overflowWrap: 'anywhere'}} className='m-3 p-3'>
              <h5>shiftID: <span className='text-danger'>{shiftID}</span>.</h5>
              <h5>Date of Shift: <span className='text-danger'>{date}</span> Time: <span className='text-danger'>{time}</span>.</h5>
              <h5>CVS# {storeNumber}.</h5>
            </div>
          ))
         }
      </Container>
    </div>
  )
}

export default ShiftsAppliedFor