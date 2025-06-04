import React, {useContext, useEffect} from 'react'
import { Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { ShiftContext } from '../../../App';
import { useFetch } from '../../../functions/FetchHook';

import "../Registration.styles.css";

const Register = ({ isOpen, toggle }) => {
   const shiftcontext = useContext(ShiftContext);
   const { currentUser, setCurrentUser, employees, setEmployees } = shiftcontext;
   const [employeeData, setEmployeeData] = useFetch("http://localhost:3003/employees", [])

   function handleRegistration(e) {
      e.preventDefault()
      console.log("SUBMITTED: ", currentUser)
   }

   return (
      <Modal
         isOpen={isOpen}
         toggle={toggle}
         backdrop='static'
      >
         <ModalHeader toggle={toggle}>
            <h1>New User - Register.</h1>
         </ModalHeader>
         <ModalBody>
            <Form onSubmit={() => handleRegistration} className='registration-form'>
               <FormGroup>
                  <Label for='employeeID'>EMPLOYEE ID</Label>
                  <Input type='number' placeholder='employee id' id='employeeID' onChange={e => setCurrentUser(prvData => ({...prvData, employeeID: e.target.value}))} />
               </FormGroup>
               <FormGroup>
                  <Label for='password'>PASSWORD</Label>
                  <Input type='password' placeholder='password' id='password' onChange={e => setCurrentUser(prvData => ({...prvData, password: e.target.value}))} required />
               </FormGroup>
               <FormGroup>
                  <button type="button" className="btn btn-danger btn-lg btn-block">SUBMIT</button>
               </FormGroup>
            </Form>
         </ModalBody>
      </Modal>
   )
}

export default Register