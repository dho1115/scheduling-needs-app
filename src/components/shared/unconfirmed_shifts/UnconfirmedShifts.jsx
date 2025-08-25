//Shifts the supervisor approved but the candidate has YET to confirm.
import React, { useContext } from 'react'

//Dependencies.
import { ShiftContext } from '../../../App';

import './UnconfirmedShifts.styles.css';
import { Button } from 'reactstrap';

const UnconfirmedShifts = () => {
  const { currentUser, unconfirmedShifts } = useContext(ShiftContext);

  const handleUnconfirmedShifts = () => {
    console.log("LOGIC TO CHANGE unconfirmedShifts STATUS.")
    console.log("setUnconfirmedShifts( logic goes here. )")
  }

  return (
    <div>
      <header>
        <h1>UNCONFIRMED SHIFTS</h1>
      </header>
      {
        unconfirmedShifts.length ?
          unconfirmedShifts.map((val, idx) => {
            return (
              <div key={idx} className='unconfirmed-shift-div m-3'>
                <h5><span>_shiftID:</span><span className='text-danger'>{val.id}</span></h5>
                <h5><span>store number:</span><span className='text-danger'>{val.storeNumber}</span></h5>
                <h5><span>Awaiting confirmation from:</span><span className='text-danger'>{val._candidateID}</span></h5>
                {
                  currentUser.role == "candidate" && (<Button color='success' size='md' onClick={handleUnconfirmedShifts}>CONFIRM THIS SHIFT!!!</Button>)
                }
              </div>
            )
          })
          :
          <h1 className='text-danger'>YOU DO NOT HAVE ANY UNCONFIRMED SHIFTS.</h1>
      }
    </div>
  )
}

export default UnconfirmedShifts