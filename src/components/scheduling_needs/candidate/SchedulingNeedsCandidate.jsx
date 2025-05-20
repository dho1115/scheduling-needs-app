import React, { useContext } from 'react'
import { Button, Form, FormGroup } from 'reactstrap'

import { ShiftContext } from '../../../App';

import "./SchedulingNeedsCandidate.styles.css";

const SchedulingNeedsCandidate = ({ _shiftID }) => {
  const shift = useContext(ShiftContext);
  
  return (
    <div>
      <Form>
         <FormGroup>
            <Button color='danger'>SELECT THIS SHIFT!!!</Button>
         </FormGroup>
         <FormGroup>
            <Button color='success'>ONLY DO PARTIAL!!!</Button>
         </FormGroup>
      </Form>
    </div>
  )
}

export default SchedulingNeedsCandidate