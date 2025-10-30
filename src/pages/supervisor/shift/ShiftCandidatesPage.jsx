import React, { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DateTime } from 'luxon';

//components.
import { Button, Container } from 'reactstrap';

//context.
import { ShiftContext } from '../../../App'

//functions.
import { AddNewShiftToDBandState } from '../../../functions/postRequest';
import { DeleteBatch } from '../../../functions/deleteRequest';
import { DeleteRequestSetState } from '../../../functions/deleteRequest';
import { findShiftInArray } from '../../../components/shared/scheduling_needs/functions';

import "./ShiftCandidatesPage.styles.css"

const ShiftCandidatesPage = (props) => {
  const { currentUser, setShiftStatuses, shiftStatuses } = useContext(ShiftContext);
  const { _shiftID } = useParams();

  const { shiftsWithApplicants, shiftsAvailable, shiftsPendingConfirmation } = shiftStatuses;

  const dateApproved = DateTime.local()
  const formattedDateApproved = dateApproved.toFormat("yyyy-MM-dd");

  const applicantsForThisShift = shiftsWithApplicants.filter(({ shiftID }) => shiftID == _shiftID).map(({ applicant }) => applicant);

  const thisShiftDetails = findShiftInArray(_shiftID, shiftsWithApplicants);

  // const onApproveRequest = (shiftID, name) => alert(`REQUEST FOR SHIFT# ${shiftID} APPROVED!!!\n TRANSFERRING TO shiftsPendingConfirmation.\n WAITING FOR ${name}'S LAZY ASS TO CONFIRM IT!!!`)

  const onApproveRequest = async (shiftID, shiftObject) => {
    const { id, _shiftID, applicant } = shiftObject;

    try {
      if (!id && !_shiftID && !applicant) throw new Error(`Your shiftObject (2nd argument) MUST have an id, _shiftID and applicant object!!! Your shiftObject has: ${JSON.stringify(shiftObject)}`);

      const findApprovedID = shiftsWithApplicants.filter(shift => shift.id == shiftID == id);

      const approved_shift_updated = { ...findApprovedID, approvedOn: formattedDateApproved, approvedBy: currentUser.name, supervisorId: currentUser.id }; //To be tranferred to shiftsPendingConfirmation.

      const findThisShiftInShiftsAvailable = shiftsAvailable.find(shift => shift.id == shiftID); //find shift to be deleted.

      const DeleteFromShiftsAvaiable = await DeleteRequestSetState(
        "http://localhost:3003/shiftsAvailable",
        () => setShiftStatuses(prv => ({ ...prv, shiftsAvailable: shiftStatuses.shiftsAvailable.filter(({ id }) => id == shiftID) })),
        findThisShiftInShiftsAvailable
      ); //delete findThisShiftInShiftsAvailable and set state.

      const transferApprovedShift = AddNewShiftToDBandState(
        "http://localhost:3003/shiftsPendingConfirmation", approved_shift_updated,
        () => setShiftStatuses(prv => ({ ...prv, shiftsPendingConfirmation: [...prv.shiftsPendingConfirmation, approved_shift_updated] }))
      );


    } catch (error) {
      console.error({ message: "ERROR with onApproveRequest function!!!", error, errorStack: error.stack, errorMessage: error.message, name: error.name });
    }
  }

  return (
    <div>
      <header className='my-5'>
        <h3>CANDIDATES FOR SHIFT <span className='text-danger'>{_shiftID}</span>:</h3>
      </header>
      <Container>
        <div className='all-applicants-div'>
          {
            applicantsForThisShift.map(({ id, name, base }, idx) => (
              <div className={idx % 2 == 0 ? 'candidate-detail p-3 mx-5' : 'candidate-detail-ii p-3 mx-5'} key={idx}>
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