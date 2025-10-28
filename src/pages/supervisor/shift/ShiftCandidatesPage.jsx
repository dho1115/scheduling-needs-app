import React, { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

//components.
import { Container } from 'reactstrap';

//context.
import { ShiftContext } from '../../../App'

import "./ShiftCandidates.styles.css"

const ShiftCandidatesPage = (props) => {
  const { shiftStatuses: { shiftsWithApplicants } } = useContext();
  const { _shiftID } = useParams();

  const applicantsForThisShift = shiftsWithApplicants.filter(({ id }) => id == _shiftID).map(({ currentUser }) => currentUser);

  return (
    <div>
      <header>CANDIDATES FOR SHIFT </header>
      <Container>
         
      </Container>
    </div>
  )
}

export default ShiftCandidatesPage