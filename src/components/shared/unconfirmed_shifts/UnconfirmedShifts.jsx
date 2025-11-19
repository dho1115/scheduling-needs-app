//Shifts the supervisor approved but the candidate has YET to confirm.
import React, { useContext } from 'react'

//Dependencies.
import { ShiftContext } from '../../../App';
import { DateTime } from 'luxon';

import './UnconfirmedShifts.styles.css';
import { Button, Container } from 'reactstrap';

import "./UnconfirmedShifts.styles.css";

const UnconfirmedShifts = () => {
  const { currentUser, shiftStatuses: { shiftsPendingConfirmation } } = useContext(ShiftContext);
  
  const upcomingWorkShifts = shiftsPendingConfirmation.filter(({date}) => {
    const currentDate = DateTime.now();
    const dateOfShift = DateTime.fromISO(date);

    return dateOfShift.diff(currentDate, ['days']).values.days < 3.75
  })

  return (
    <div className='py-5'>
      <header>
        <h1>UNCONFIRMED SHIFTS</h1>
      </header>
      <div>
        <h3>The Following Shift(s) With <u>Upcoming Work Dates</u>...</h3>
        <h3 className='text-danger'><i>HAVE NOT BEEN CONFIRMED YET!!!</i></h3>
        <Container style={{display: 'grid', gridTemplateColumns: '31% 31% 31%'}}>
          {
            upcomingWorkShifts.map((val, idx) => (
              <div className='m-3 p-1' style={{ border: '3px solid black', overflowWrap: 'anywhere', overflow: 'hidden', backgroundColor: idx%2==1 ? 'whitesmoke':'lightpink' }}>
                <h5>{JSON.stringify(val)}</h5>
              </div>
            ))
          }
        </Container>
      </div>
      {
        shiftsPendingConfirmation.length ?
          <Container className='to-be-confirmed-container'>
            {
              shiftsPendingConfirmation.map((val, idx) => {
                return (
                  <div key={idx} className={idx%2==0 ? "unconfirmed-shift-div my-1 p-1" : "unconfirmed-shift-div_v2 my-1 p-1"}>
                    <h5><span>_shiftID:</span><span className='text-danger'>{val.id}</span></h5>
                    <h5><span>SCHEDULED TO WORK ON: </span><span className='text-danger'>{val.date}</span></h5>
                    <h5><span>store number:</span><span className='text-danger'>{val.storeNumber}</span></h5>
                    <h5><span>Awaiting confirmation from:</span><span className='text-danger'>{val.applicant.name} ({val.applicant.id}).</span></h5>
                    {
                      currentUser.role == "supervisor" && (<Button color='danger' size='md' onClick={() => alert(`message sent to ${val.applicant.name} to confirm shift# ${val.id} (store# ${val.storeNumber}) in which ${val.applicant.name} is scheduled to work on ${val.date}!!!`)}>SEND REMINDER TO {val.applicant.name.toUpperCase()} TO CONFIRM DAMN SHIFT!!!</Button>)
                    }
                  </div>
                )
              })
            }            
          </Container>          
          :
          <h1 className='text-danger'>YOU DO NOT HAVE ANY UNCONFIRMED SHIFTS.</h1>
      }
    </div>
  )
}

export default UnconfirmedShifts