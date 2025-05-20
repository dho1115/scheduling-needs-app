import React from 'react'
import { Button, Form, FormGroup } from 'reactstrap'

import "./SchedulingNeedsCandidate.styles.css"
const SchedulingNeedsCandidate = ({_shiftID}) => {
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