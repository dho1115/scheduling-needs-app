import React, { useState, useEffect, useContext, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

//Components
import Registration from '../../components/registration/Registration';
import Login from '../../components/registration/Forms/Login';
import Register from '../../components/registration/Forms/Register';

//Dependencies.
import { Container } from 'reactstrap';
import { ShiftContext } from '../../App';

import './Homepage.styles.css';

const Homepage = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(ShiftContext);
  const [registrationMode, setRegistrationMode] = useState({ register: false, login: false });
  const registerToggle = () => setRegistrationMode(prvMode => ({...prvMode, register: !prvMode.register, login: false}));
  const loginToggle = () => setRegistrationMode(prvMode => ({ ...prvMode, register: false, login: !prvMode.login }));

  useEffect(() => {
    if (currentUser.id && currentUser.name) navigate('/supervisor');
    return () => setRegistrationMode({ register: false, login: false });
  }, [Object.keys(currentUser).length])

  return (
    <div className='homepage-div'>
      <Suspense fallback={<h3 style={{color: 'red', backgroundColor: 'lightseagreen'}}>LOADING... PLEASE WAIT.</h3>}>
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
      </Suspense>
    </div>
  )
}

export default Homepage