import React, { useContext, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import uniqid from 'uniqid';
import { Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap';
import { ShiftContext } from '../../../App';
import { signUpNewUser } from '../../../functions/firebase/authorization';
import { fb_addOneDocument } from '../../../functions/firebase/crud_basic';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

import "../Registration.styles.css";

const Register = ({ isOpen, toggle }) => {
   const location = useLocation();
   const formRef = useRef();
   const navigate = useNavigate();
   const { currentUser, setCurrentUser } = useContext(ShiftContext);
   const { name, password } = currentUser;

   async function handleRegistration(e) {
      e.preventDefault()
      try {
         const _id = uniqid(currentUser.role == 'candidate' ? 'c-' : 's-');
         const UserEmail = `${currentUserDetails.name.split(' ').join('') + currentUserDetails.id}@email.com`
         const currentUserDetails = { ...currentUser, id: _id };
         const newUserAuth = await signUpNewUser(UserEmail, currentUserDetails.password, location.pathname)
         const addUserToFB = await fb_addOneDocument("Employees", currentUserDetails, currentUserDetails.id, location.pathname)
         setCurrentUser(currentUserDetails);

         const docReference = doc(db, "Employees", currentUserDetails.id);
         const documentSnapshot = await getDoc(docReference);

         if (documentSnapshot.exists()) navigate("/");
         else console.error(`documentSnapshot.exists() for ${_id} returned ${documentSnapshot.exists()}.`)
      } catch (error) {
         console.error({ message: "Error in handleRegistration function!!!", location: location.pathname, error, errorMessage: error.message, errorName: error.name });
      }
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