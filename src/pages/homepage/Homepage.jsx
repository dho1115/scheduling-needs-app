import React, { useState, useEffect, useContext, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

//Components
import Registration from '../../components/registration/Registration';
import Login from '../../components/registration/Forms/Login';
import Register from '../../components/registration/Forms/Register';

//Dependencies.
import { Button, Container } from 'reactstrap';
import { ShiftContext } from '../../App';
import { fb_signOut } from '../../functions/firebase/authorization';
import { fb_fs_SignOutProcess } from '../../functions/firebase/miscellaneous';

import './Homepage.styles.css';

const Homepage = () => {
  const navigate = useNavigate();
  const location = useLocation();  
  const { currentUser, setCurrentUser, employees } = useContext(ShiftContext);
  const [registrationMode, setRegistrationMode] = useState({ register: false, login: false });
  const registerToggle = () => setRegistrationMode(prvMode => ({...prvMode, register: !prvMode.register, login: false}));
  const loginToggle = () => setRegistrationMode(prvMode => ({ ...prvMode, register: false, login: !prvMode.login }));

  useEffect(() => {    
    if (currentUser.id && currentUser.name) navigate(`/${currentUser.role}/welcome/${currentUser.id}`);
    return () => setRegistrationMode({ register: false, login: false });
  }, [currentUser.id])

  return (
    <div className='homepage-div'>
      <Suspense fallback={<h3 style={{color: 'red', backgroundColor: 'lightseagreen'}}>LOADING... PLEASE WAIT.</h3>}>
        <Container className='homepage-container'>
          {/* <Button size='lg' color='bg bg-light' onClick={async () => await fb_fs_SignOutProcess(
            currentUser.id,
            () => setCurrentUser({ id: '', name: '', password: '', role: '' }),
            currentUser,
            location.pathname
          )}>SIGN OUT (TEST)!!!</Button> */}
          <Registration
            text="LOGIN"
            toggle={loginToggle}
          />
          <Registration
            text="SIGN UP"
            toggle={registerToggle}
          />
        </Container>
        {/* ======= MODALS FOR LOGIN - SIGNUP ======= */}
        <Register
          isOpen={registrationMode.register}
          toggle={registerToggle} 
        />
        <Login
          isOpen={registrationMode.login}
          toggle={loginToggle}
          loginIsOpen={registrationMode.login}
        />
        {/* ========================================= */}
      </Suspense>
    </div>
  )
}

export default Homepage