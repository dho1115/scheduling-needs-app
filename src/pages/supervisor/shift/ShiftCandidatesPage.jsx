import React, { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

//components.
import { Button, Container } from 'reactstrap';

//context.
import { ShiftContext } from '../../../App'

//functions.
import { findShiftInArray, TransferShift } from '../../../components/shared/scheduling_needs/functions';

import "./ShiftCandidatesPage.styles.css"

const ShiftCandidatesPage = (props) => {
  const { shiftStatuses: { shiftsWithApplicants } } = useContext(ShiftContext);
  const { _shiftID } = useParams();

  const applicantsForThisShift = shiftsWithApplicants.filter(({ id }) => id == _shiftID).map(({ applicant }) => applicant);

  const thisShiftDetails = findShiftInArray(_shiftID, shiftsWithApplicants);

  return (
    <div>
      <header className='my-5'>
        <h3>CANDIDATES FOR SHIFT <span className='text-danger'>{_shiftID}</span>:</h3>
        <div className='p-1' style={{overflow: 'hidden', overflowWrap: 'anywhere', border: '3px solid red'}}>
          <section><strong>SHIFT DETAILS:</strong></section>
          <strong>{JSON.stringify(thisShiftDetails)}</strong>
        </div>
      </header>
      <Container>
        <div className='all-applicants-div'>
          {
            applicantsForThisShift.map(({ id, name, base }) => (
              <div className="candidate-detail p-3">
                <h1>NAME: <span className='text-danger'>{name}</span></h1>
                <h3>EMPLOYEE_ID: <span className='text-danger'>{id}</span></h3>
                <h3>BASE STORE: <span className='text-danger'>{base}</span></h3>
                <div className='w-100'>
                  <Button className='w-100' size='md' color='danger'>SELECT THIS EMPLOYEE FOR SHIFT #{_shiftID}</Button>
                </div>
              </div>
            ))
          }
        </div>
      </Container>
    </div>
  )
}

export default ShiftCandidatesPage