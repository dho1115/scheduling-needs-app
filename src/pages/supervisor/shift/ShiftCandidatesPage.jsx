import React, { useContext } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { DateTime } from 'luxon';

//components.
import { Button, Container } from 'reactstrap';

//context.
import { ShiftContext } from '../../../App'

//functions.
import { DeleteRequest } from '../../../functions/deleteRequest';
import { FetchDataSetState } from '../../../functions/FetchHook';
import { DeleteApprovedShift, findShiftInArray, TransferApprovedShift } from '../../../components/shared/scheduling_needs/functions';

import "./ShiftCandidatesPage.styles.css"

const ShiftCandidatesPage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { currentUser, setShiftStatuses, shiftStatuses } = useContext(ShiftContext);
  const { _shiftID } = useParams();

  const { shiftsWithApplicants, shiftsAvailable} = shiftStatuses;

  const dateApproved = DateTime.local()
  const formattedDateApproved = dateApproved.toFormat("yyyy-MM-dd");

  const applicantsForThisShift = shiftsWithApplicants.filter(({ shiftID }) => shiftID == _shiftID)

  const thisShiftWithApplicants = findShiftInArray(_shiftID, shiftsWithApplicants);

  const onApproveRequest = async (_shiftID, shiftWithApplicantObject) => {
    const { id, applicant } = shiftWithApplicantObject;

    try {
      if (!id && !_shiftID && !applicant && !applicant.id) throw new Error(`ERROR INSIDE => ${pathname}. ERROR IS: Your shiftObject (2nd argument) MUST have an id, _shiftID and applicant object!!! Your shiftObject has: ${JSON.stringify(shiftWithApplicantObject)}`);

      const approvedShiftWithApplicant = shiftsWithApplicants.find(shiftWithApplicant => (shiftWithApplicant.id == `${applicant.id}-${_shiftID}`));

      const setShiftStatusesState = (approved_shift_updated) => setShiftStatuses(prv => ({ ...prv, shiftsPendingConfirmation: [...prv.shiftsPendingConfirmation, approved_shift_updated] }));

      const SetAvailableShifts = () => setShiftStatuses(prv => ({ ...prv, shiftsAvailable: shiftsAvailable.filter(({ id }) => id != _shiftID) }))
      
      const transfer_shift_logic = await TransferApprovedShift(approvedShiftWithApplicant, applicant, _shiftID, formattedDateApproved, currentUser, setShiftStatusesState, pathname)

      const delete_approved_shift = await DeleteApprovedShift(`http://localhost:3003/shiftsAvailable/${_shiftID}`, shiftsAvailable, approvedShiftWithApplicant, _shiftID, SetAvailableShifts, pathname)

      const filter_shiftIDfromShiftsWithApplicants = shiftsWithApplicants.filter(shiftWithApplicant => shiftWithApplicant.shiftID == _shiftID);

      const deleteShiftIDsFromShiftsWithApplicants = await Promise.all(filter_shiftIDfromShiftsWithApplicants.map(async ({ id }) => await DeleteRequest(`http://localhost:3003/shiftsWithApplicants/${id}`)));

      const setStateForShiftsWithApplicants = await FetchDataSetState("http://localhost:3003/shiftsWithApplicants", data => setShiftStatuses(prv => ({ ...prv, shiftsWithApplicants: [...data] }))) //resets shiftWithApplicants state.
      
      console.log({ transfer_shift_logic, delete_approved_shift, deleteShiftIDsFromShiftsWithApplicants, setStateForShiftsWithApplicants });

      return
    } catch (error) {
      console.error({ message: "ERROR with onApproveRequest function!!!", location: pathname, error, errorStack: error.stack, errorMessage: error.message, name: error.name });
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
            applicantsForThisShift.map(({ id, applicant }, idx) => (
              <div className={idx % 2 == 0 ? 'candidate-detail p-3 mx-5' : 'candidate-detail-ii p-3 mx-5'} key={idx}>
                <h5>_shiftWithApplicantID: <span className='text-danger'>{id}</span>.</h5>
                <h1>NAME: <span className='text-danger'>{applicant.name}</span></h1>
                <h3>EMPLOYEE_ID: <span className='text-danger'>{applicant.id}</span></h3>
                <h3>BASE STORE: <span className='text-danger'>{applicant.base}</span></h3>
                <div className='w-100'>
                  <Button className='w-100' size='md' color={idx % 2 == 1 ? 'success' : 'danger'} onClick={() => onApproveRequest(_shiftID, { applicant, id })
                    .then(navigate(`/supervisor/welcome/${currentUser.id}/available shifts`))
                    .catch(error => console.error({ message: "navigate error!!!", error, errorMessage: error.message }))}
                  >
                    <strong>APPROVE {applicant.name}'S REQUEST FOR SHIFT #{_shiftID}!!!</strong>
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