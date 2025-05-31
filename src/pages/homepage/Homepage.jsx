import React, { useState, useEffect } from 'react';

//Components
import Registration from '../../components/registration/Registration';
import Register from '../../components/registration/Forms/Register';

//Dependencies.
import { Container } from 'reactstrap';
import Login from '../../components/registration/Forms/Login';

import './Homepage.styles.css';

const Homepage = () => {
  const [registrationMode, setRegistrationMode] = useState({ register: false, login: false });
  const registerToggle = () => setRegistrationMode(prvMode => ({...prvMode, register: !prvMode.register, login: false}));
  const loginToggle = () => setRegistrationMode(prvMode => ({ ...prvMode, register: false, login: !prvMode.login }));

  useEffect(() => {
    return () => {
      setRegistrationMode({ register: false, login: false });
    };
  }, [])

  return (
    <div className='homepage-div'>
      {
        registrationMode.register
        &&
        <Register isOpen={registrationMode.register} toggle={registerToggle} />
      }
      {
        registrationMode.login
        &&
        <Login isOpen={registrationMode.login} toggle={loginToggle} />
      }
      <Container className='homepage-container'>        
        <Registration text="LOGIN" toggle={loginToggle} />
        <Registration text="SIGN UP" toggle={registerToggle} />
      </Container>
    </div>
  )
}

export default Homepage