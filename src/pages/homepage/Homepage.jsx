import React, { useState, useEffect, useContext, Suspense } from 'react';

//Components
import Registration from '../../components/registration/Registration';
import Login from '../../components/registration/Forms/Login';
import Register from '../../components/registration/Forms/Register';

//Dependencies.
import { Container } from 'reactstrap';
import { ShiftContext } from '../../App';

import './Homepage.styles.css';

const Homepage = () => {
  const { currentUser } = useContext(ShiftContext);
  const [registrationMode, setRegistrationMode] = useState({ register: false, login: false });
  const registerToggle = () => setRegistrationMode(prvMode => ({...prvMode, register: !prvMode.register, login: false}));
  const loginToggle = () => setRegistrationMode(prvMode => ({ ...prvMode, register: false, login: !prvMode.login }));

  useEffect(() => {
    if (currentUser) console.log(`WELCOME TO YOUR HOMEPAGE, ${JSON.stringify(currentUser)}!!!`);
    else console.log(`Nobody is logged in because currentUser is ${JSON.stringify(currentUser)}.`)
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