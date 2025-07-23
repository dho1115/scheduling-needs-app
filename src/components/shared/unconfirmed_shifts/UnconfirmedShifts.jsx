import React, { useContext } from 'react'

//Dependencies.
import { ShiftContext } from '../../../App';

import './UnconfirmedShifts.styles.css';
import { Button } from 'reactstrap';

const UnconfirmedShifts = () => {
  const { unconfirmedShifts, setUnconfirmedShifts } = useContext(ShiftContext);

  const handleUnconfirmedShifts = () => {
    console.log("LOGIC TO CHANGE unconfirmedShifts STATUS.")
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
              <div key={idx}>
                <strong>{JSON.stringify(val)}</strong>
                <Button color='success' size='md' onClick={handleUnconfirmedShifts}>CONFIRM THIS SHIFT!!!</Button>
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