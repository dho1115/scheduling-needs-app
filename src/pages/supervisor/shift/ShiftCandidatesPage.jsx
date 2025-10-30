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

  const applicantsForThisShift = shiftsWithApplicants.filter(({ shiftID }) => shiftID == _shiftID).map(({ applicant }) => applicant);

  const thisShiftDetails = findShiftInArray(_shiftID, shiftsWithApplicants);

  const onApproveRequest = (shiftID, name) => console.log(`REQUEST FOR SHIFT# ${shiftID} APPROVED!!!\n TRANSFERRING TO shiftsPendingConfirmation.\n WAITING FOR ${name}'S LAZY ASS TO CONFIRM IT!!!`)

  return (
    <div>
      <header className='my-5'>
        <h3>CANDIDATES FOR SHIFT <span className='text-danger'>{_shiftID}</span>:</h3>
      </header>
      <Container>
        <div className='all-applicants-div'>
          {
            applicantsForThisShift.map(({ id, name, base }, idx) => (
              <div className= {idx%2==0 ? 'candidate-detail p-3 mx-5' : 'candidate-detail-ii p-3 mx-5'} key={idx}>
                <h1>NAME: <span className='text-danger'>{name}</span></h1>
                <h3>EMPLOYEE_ID: <span className='text-danger'>{id}</span></h3>
                <h3>BASE STORE: <span className='text-danger'>{base}</span></h3>
                <div className='w-100'>
                  <Button className='w-100' size='md' color={idx % 2 == 1 ? 'success' : 'danger'} onClick={() => onApproveRequest(_shiftID, name)}>
                    <strong>APPROVE {name}'S REQUEST FOR SHIFT #{_shiftID}!!!</strong>
                  </Button>
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