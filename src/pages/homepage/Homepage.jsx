import React, { useState, useEffect } from 'react';

//Components
import Registration from '../../components/registration/Registration';
import Login from '../../components/registration/Forms/Login';
import Register from '../../components/registration/Forms/Register';

//Dependencies.
import { Container, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader } from 'reactstrap';

import './Homepage.styles.css';

const Homepage = () => {
  const [registrationMode, setRegistrationMode] = useState({ register: true, login: false });
  const registerToggle = () => setRegistrationMode(prvMode => ({...prvMode, register: !prvMode.register, login: false}));
  const loginToggle = () => setRegistrationMode(prvMode => ({ ...prvMode, register: false, login: !prvMode.login }));

  useEffect(() => {
    return () => {
      setRegistrationMode({ register: false, login: false });
    };
  }, [])

  return (
    <div>
      <Container className='homepage-container'>        
        <Registration
          text="LOGIN"
          toggle={loginToggle}
        />
        <Registration
          text="SIGN UP"
          toggle={registerToggle}
        />
      </Container>
      <Register isOpen={registrationMode.register} toggle={registerToggle} />
      <Login isOpen={registrationMode.login} toggle={loginToggle} />
    </div>
  )
}

export default Homepage