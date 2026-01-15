import React, {useContext, useState, useEffect} from 'react'
import { Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShiftContext } from '../../../App';
import { auth } from '../../../firebase';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { fb_addOneDocument } from '../../../functions/firebase/crud_basic';
import { fb_fs_ExistingUserLogin } from '../../../functions/firebase/miscellaneous';

import "../Registration.styles.css";


const Login = ({ isOpen, toggle, loginIsOpen }) => {
   const navigate = useNavigate();
   const location = useLocation();
   const [loginData, setLoginData] = useState({ id: '', password: '' });
   const [validationAlert, setValidationAlert] = useState({ userNotFound: false });
   const [postError, setPostError] = useState("");
   const shiftcontext = useContext(ShiftContext);
   const { employees, currentUser, setCurrentUser } = shiftcontext;

   const findMatch = employees.find(({ password, id }) => (loginData.id == id) && (loginData.password == password));

   const onHandleLogin = async e => {
      e.preventDefault()
      try {
         if (!findMatch) {
            throw new Error(`Your login of ${JSON.stringify(loginData)} did NOT match any of our employees. findMatch returned ${findMatch}... DAMN YOU!!!`);
         } else {
            const UserLogin = await fb_fs_ExistingUserLogin(findMatch, location.pathname)
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
      const subscribe = onAuthStateChanged(auth, user => {
         console.log("Inside onAuthStateChanged:")
         console.log({ currentUser, id: currentUser.id, user, userUID: user?.uid });
         if (user?.uid && (currentUser.id && currentUser.role)) {
            if (currentUser.role == "supervisor") navigate(`/supervisor/welcome/${currentUser.id}/`)
            else navigate(`/candidate/welcome/${currentUser.id}/`)
         }
      });

      return () => subscribe()
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