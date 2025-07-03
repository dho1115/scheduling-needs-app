import React, { useContext, useEffect } from 'react'

//Dependencies.
import { ShiftContext } from '../../App';
import { Container } from 'reactstrap';
import { Outlet } from 'react-router-dom';

//Components:
import NavigationBar from '../../components/shared/navigation-bar/NavigationBar';

import "./CandidatePage.styles.css";

const CandidatePage = () => {
  const { currentUser } = useContext(ShiftContext);
  const { name, role } = currentUser;

  return (
    <div className='candidate-page-div'>
      <NavigationBar />
      <h1>Welcome to the Candidate Homepage, {name}!!!</h1>
      <h3>ROLE: <span className='text-danger'>{role}</span>.</h3>
      <Container>
        <Outlet />
      </Container>
    </div>
  )
}

export default CandidatePage