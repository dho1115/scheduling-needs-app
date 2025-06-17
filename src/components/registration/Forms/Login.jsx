import React, {useContext, useState, useEffect} from 'react'
import { Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';

import { ShiftContext } from '../../../App';

import "../Registration.styles.css";

const Login = ({ isOpen, toggle, loginIsOpen }) => {
   const [loginData, setLoginData] = useState({ id: '', password: '' });
   const [validationAlert, setValidationAlert] = useState({ userNotFound: false });
   const shiftcontext = useContext(ShiftContext);
   const { employees, setEmployees, currentUser, setCurrentUser } = shiftcontext;

   const onHandleLogin = e => {
      e.preventDefault()
      try {
         const findMatch = employees.filter(({ password, id }) => ((loginData.password == password) && (loginData.id == id)));
         if (!findMatch.length) {
            throw new Error(`Your login of ${JSON.stringify(loginData)} did NOT match any of our employees... DAMN YOU!!!`);
         } else {
            setValidationAlert(prv => ({ ...prv, userNotFound: false }));
            toggle();
         }
      } catch (error) {
         setValidationAlert(prv => ({...prv, userNotFound: true }));
         console.error({ message: 'LOGIN ERROR!!!', error, errorMessage: error.message, errorCode: error.code });
         return { message: 'LOGIN ERROR!!!', error, errorMessage: error.message };
      }
   }
   
   useEffect(() => {
      if (!loginIsOpen) {
         setValidationAlert(prv => ({ ...prv, userNotFound: false }));
         setLoginData(prv => ({ ...prv, id: '', password: '' }));
      }
      return () => setValidationAlert(prv => ({ ...prv, userNotFound: false }));
   }, [loginIsOpen]) //cleanup. resets the state to original.

   return (
      <Modal
         isOpen={isOpen}
         backdrop='static'
         toggle={toggle}
         size='lg'
      >
         <ModalHeader toggle={toggle}>
            {
               !(validationAlert.userNotFound) ?
                  <strong>EXISTING USERS: LOGIN</strong>
                  :
                  <Alert color='danger' className='w-100'><strong>NO SUCH USER EXISTS!!!</strong></Alert>
            }
         </ModalHeader>
         <ModalBody>
            <Form onSubmit={onHandleLogin} className='registration-form'>
               <FormGroup>
                  <Label for='employeeID'>EMPLOYEE ID</Label>
                  <Input type='text' placeholder='employee id' value={loginData.id} id='employeeID' onChange={e => setLoginData(prv => ({...prv, id: e.target.value}))} required />
               </FormGroup>
               <FormGroup>
                  <Label for='password'>PASSWORD</Label>
                  <Input type='password' placeholder='password' value={loginData.password} id='password' onChange={e => setLoginData(prv => ({...prv, password: e.target.value}))} required />
               </FormGroup>
               <FormGroup>
                  <button type="submit" className="btn btn-danger btn-lg btn-block w-100">SUBMIT</button>
               </FormGroup>
            </Form>
         </ModalBody>
      </Modal>
   )
}

export default Login