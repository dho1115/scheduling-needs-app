import React, {useContext, useState, useEffect} from 'react'
import { Form, FormGroup, Label, Input, Modal, ModalHeader, ModalBody, Alert } from 'reactstrap';
import { useNavigate } from 'react-router-dom';

import { ShiftContext } from '../../../App';
import { PostCurrentUser } from '../../../functions/postRequest';
import { fetchDataPromise } from '../../../functions/FetchHook';

import "../Registration.styles.css";

const Login = ({ isOpen, toggle, loginIsOpen }) => {
   const navigate = useNavigate();
   const [loginData, setLoginData] = useState({ id: '', password: '' });
   const [validationAlert, setValidationAlert] = useState({ userNotFound: false });
   const [postError, setPostError] = useState("");
   const shiftcontext = useContext(ShiftContext);
   const { employees, currentUser, setCurrentUser } = shiftcontext;

   const onHandleLogin = e => {
      e.preventDefault()
      try {
         const findMatch = employees.find(({ password, id }) => ((loginData.password == password) && (loginData.id == id)));
         if (!findMatch) {
            throw new Error(`Your login of ${JSON.stringify(loginData)} did NOT match any of our employees... DAMN YOU!!!`);
         } else {
            PostCurrentUser('http://localhost:3003/currentUser', { ...findMatch })
               .then(result => {
                  console.log({ message: 'From Login.jsx: PostCurrentUser success!!!', result });
                  return fetchDataPromise('http://localhost:3003/currentUser').then(data => {
                     console.log({ from: 'fetchDataPromise/currentUser', message: 'SUCCESS!!!', data });
                     setCurrentUser(prvCurrentUser => ({ ...prvCurrentUser, ...data }));
                     if (!(currentUser.id && currentUser.name)) throw new Error(`NO CURRENT USER (at least, not yet): ${JSON.stringify(currentUser)}!!!`)
                     else {
                        toggle();
                        navigate(`/${findMatch.role}/welcome/${currentUser.id}`);
                     }
                  }).catch(error => console.error({ from: 'fetchDataPromise/currentUser', errorCode: error.code, errorMessage: error.message, status: error.status }));
               })
               .catch(error => {
                  console.error({ message: 'From Login.jsx on PostCurrentUser... ERROR!!!', error, errorMessage: error.message, errorCode: error.code });
                  setPostError(`There is no currentUser (at least not yet), as currentUser is currently ${JSON.stringify(currentUser)}.`);
               })
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

   console.log(currentUser)
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