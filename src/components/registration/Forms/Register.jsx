import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import uniqid from 'uniqid';
import { Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { ShiftContext } from '../../../App';
import { PostCurrentUser, PostRequest } from '../../../functions/postRequest';

import "../Registration.styles.css";

const Register = ({ isOpen, toggle }) => {
   const formRef = useRef();
   const navigate = useNavigate();
   const shiftcontext = useContext(ShiftContext);
   const { currentUser, setCurrentUser } = shiftcontext;
   const { name, password } = currentUser;

   function handleRegistration(e) {
      e.preventDefault()
      const _id = uniqid(currentUser.role == 'candidate' ? 'c-' : 's-');
      const currentUserDetails = { ...currentUser, id: _id };
      PostRequest('http://localhost:3003/employees', currentUserDetails);
      PostCurrentUser('http://localhost:3003/currentUser', currentUserDetails);
      toggle();
      setCurrentUser({ id: '', name: '', password: '', role: '' });
   }

   useEffect(() => {
      return () => setCurrentUser({ id: '', name: '', password: '', role: '' });
   }, [])

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
            <Form onSubmit={handleRegistration} className='registration-form' ref={formRef}>
               <FormGroup>
                  <Label for='employeeID'>name</Label>
                  <Input type='text' value={name} placeholder='employee name' id='employee name' onChange={e => setCurrentUser(prvData => ({...prvData, name: e.target.value}))} />
               </FormGroup>
               <FormGroup>
                  <Label for='password'>PASSWORD</Label>
                  <Input type='password' value={password} placeholder='password' id='password' onChange={e => setCurrentUser(prvData => ({...prvData, password: e.target.value}))} required />
               </FormGroup>
               <FormGroup tag="fieldset">
                  <legend>WHAT IS YOUR ROLE?</legend>
                  <Input type='radio' name='radio1' value='candidate' onChange={e => setCurrentUser(prv => ({...prv, role: e.target.value}))} />{' '}<Label check>PHARMACIST.</Label>
                  <Input type='radio' name='radio1' value='supervisor' onChange={e => setCurrentUser(prv => ({...prv, role: e.target.value}))} />{' '}<Label check>SHIFT SUPERVISOR.</Label>
               </FormGroup>
               {
                  currentUser.role == 'candidate'
                  &&
                  <>
                     <Label for='baseStore'>Enter Your Base Store</Label>
                     <Input type='number' id='baseStore' placeholder='Your Base Store' onChange={e => setCurrentUser(prv => ({...prv, base: e.target.value}))} required />
                  </>
               }
               <FormGroup>
                  <button type="submit" className="btn btn-danger btn-lg btn-block">SUBMIT</button>
               </FormGroup>
            </Form>
         </ModalBody>
      </Modal>
   )
}

export default Register