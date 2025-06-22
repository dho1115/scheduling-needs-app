import React, { useContext } from 'react'

//Dependencies.
import { ShiftContext } from '../../App';

//Components:
import NavigationBar from '../../components/navigation-bar/NavigationBar';

import "./CandidatePage.styles.css";

const CandidatePage = () => {
  const { currentUser } = useContext(ShiftContext);
  const { id, name, role } = currentUser;

  return (
    <div className='candidate-page-div'>
      <NavigationBar />
      <h1>Welcome to the Candidate Homepage, {name}!!!</h1>
      <h3>ROLE: <span className='text-danger'>{role}</span>.</h3>
    </div>
  )
}

export default CandidatePage