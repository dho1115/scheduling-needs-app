import React, { useContext, useEffect } from 'react';
import uniqid from 'uniqid';
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
      const currentUserDetails = { ...currentUser, _id: uniqid(currentUser.role == 'candidate' ? 'c-' : 's-') };
      console.log("SUBMITTED: ", currentUserDetails);
   }

   return (
      <Modal
         isOpen={isOpen}
         toggle={toggle}
         backdrop='static'
      >
         <ModalHeader toggle={toggle}>
            <strong>New User - Register.</strong>
         </ModalHeader>
         <ModalBody>
            <Form onSubmit={handleRegistration} className='registration-form'>
               <FormGroup>
                  <Label for='employeeID'>name</Label>
                  <Input type='text' placeholder='employee name' id='employee name' onChange={e => setCurrentUser(prvData => ({...prvData, name: e.target.value}))} />
               </FormGroup>
               <FormGroup>
                  <Label for='password'>PASSWORD</Label>
                  <Input type='password' placeholder='password' id='password' onChange={e => setCurrentUser(prvData => ({...prvData, password: e.target.value}))} required />
               </FormGroup>
               <FormGroup tag="fieldset">
                  <legend>WHAT IS YOUR ROLE?</legend>
                  <Input type='radio' name='radio1' value='candidate' onChange={e => setCurrentUser(prv => ({...prv, role: e.target.value}))} />{' '}<Label check>PHARMACIST.</Label>
                  <Input type='radio' name='radio1' value='supervisor' onChange={e => setCurrentUser(prv => ({...prv, role: e.target.value}))} />{' '}<Label check>SHIFT SUPERVISOR.</Label>
               </FormGroup>
               <FormGroup>
                  <button type="submit" className="btn btn-danger btn-lg btn-block">SUBMIT</button>
               </FormGroup>
            </Form>
         </ModalBody>
      </Modal>
   )
}

export default Register