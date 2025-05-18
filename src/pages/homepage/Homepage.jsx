import React from 'react';

//Components
import Registration from '../../components/registration/Registration';

//Dependencies.
import { Container } from 'reactstrap';

import './Homepage.styles.css';

const Homepage = () => {
  return (
    <div className='homepage-div'>
      <Container className='homepage-container'>
         <Registration text="LOGIN" />
         <Registration text="SIGN UP" />
      </Container>
    </div>
  )
}

export default Homepage