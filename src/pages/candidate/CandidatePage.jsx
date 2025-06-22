import React, {useContext} from 'react'
import { ShiftContext } from '../../App';

import "./CandidatePage.styles.css";

const CandidatePage = () => {
  const { currentUser } = useContext(ShiftContext);
  const { id, name } = currentUser;

  return (
    <div className='candidate-page-div'>
      <h1>Welcome to the Candidate Homepage, {name}!!!</h1>
    </div>
  )
}

export default CandidatePage