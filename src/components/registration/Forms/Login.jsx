import React, {useContext} from 'react'
import { Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody } from 'reactstrap';

import { ShiftContext } from '../../../App';

const Login = ({ isOpen, toggle }) => {
   const shiftcontext = useContext(ShiftContext);
   const { role, setRole, employee, setEmployee } = shiftcontext;

   return (
      <Modal
         isOpen={isOpen}
         backdrop='static'
         toggle={toggle}
         fullscreen={true}
         size='lg'
      >
         <ModalHeader toggle={toggle}>
            <h1>Existing User - LOGIN.</h1>
         </ModalHeader>
         <ModalBody>
            <Form onSubmit={() => console.log("submitted")} className='registration-form'>
               <FormGroup>
                  <Label for='employeeID'>EMPLOYEE ID</Label>
                  <Input type='number' placeholder='employee id' id='employeeID' onChange={e => e.target.value} required />
               </FormGroup>
               <FormGroup>
                  <Label for='password'>PASSWORD</Label>
                  <Input type='password' placeholder='password' id='password' onChange={e => e.target.value} required />
               </FormGroup>
               <FormGroup>
                  <button type="button" className="btn btn-danger btn-lg btn-block">SUBMIT</button>
               </FormGroup>
            </Form>
         </ModalBody>
      </Modal>
   )
}

export default Login