import React, { useContext } from 'react'
import { Button, Form, FormGroup } from 'reactstrap'

import { ShiftContext } from '../../../App';

import "./SchedulingNeedsCandidate.styles.css";

const SchedulingNeedsCandidate = ({ _shiftID }) => {
  const shift = useContext(ShiftContext);
  
  return (
    <div>
      <Form onSubmit={e => {
        e.preventDefault();
        console.log("shift applied for.")
      }}>
         <FormGroup>
            <Button type='submit' color='danger'>SELECT THIS SHIFT!!!</Button>
         </FormGroup>
      </Form>
    </div>
  )
}

export default SchedulingNeedsCandidate