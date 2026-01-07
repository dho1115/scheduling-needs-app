import React, {useContext, useState, useEffect} from 'react'
import { Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import { ShiftContext } from '../../../App';
import { auth } from '../../../firebase';

import { fb_userLogin } from '../../../functions/firebase/authorization';
fb_userLogin
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

import "../Registration.styles.css";


const Login = ({ isOpen, toggle, loginIsOpen }) => {
   const navigate = useNavigate();
   const [loginData, setLoginData] = useState({ id: '', password: '' });
   const [validationAlert, setValidationAlert] = useState({ userNotFound: false });
   const [postError, setPostError] = useState("");
   const shiftcontext = useContext(ShiftContext);
   const { employees, currentUser, setCurrentUser } = shiftcontext;

   const onHandleLogin = async e => {
      e.preventDefault()
      try {
         const findMatch = employees.find(({ password, id }) => (loginData.id == id) && (loginData.password == password));

         if (!findMatch) {
            throw new Error(`Your login of ${JSON.stringify(loginData)} did NOT match any of our employees... DAMN YOU!!!`);
         } else {
            const userCredential = await signInWithEmailAndPassword(auth, `${loginData.id}@email.com`, loginData.password);
            const user = userCredential.user;
            setCurrentUser(findMatch);
         }
      } catch (error) {
         setValidationAlert(prv => ({...prv, userNotFound: true }));
         console.error({ message: 'LOGIN ERROR!!!', error, errorMessage: error.message, errorCode: error.code });
         return { message: 'LOGIN ERROR!!!', error, errorMessage: error.message };
      }
   }
   
   useEffect(() => {
      if (!loginIsOpen) {
         setPostError("");
         setValidationAlert(prv => ({ ...prv, userNotFound: false }));
         setLoginData(prv => ({ ...prv, id: '', password: '' }));
      }
      return () => {
         setValidationAlert(prv => ({ ...prv, userNotFound: false }));
         setPostError("");
      };
   }, [loginIsOpen]) //cleanup. resets the state to original & removes <Alert />.

   useEffect(() => {
      onAuthStateChanged(auth, user => {
         console.log("Inside onAuthStateChanged:")
         console.log({ ...currentUser });
         if (user && (currentUser.id && currentUser.role)) {
            if (currentUser.role == "supervisor") navigate(`/supervisor/welcome/${currentUser.id}/`)
         } else {
         navigate(`/candidate/welcome/${currentUser.id}/`)}
      });
   }, [auth.currentUser, currentUser.id, currentUser.role]);

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
            {postError && postError}
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