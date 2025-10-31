import React, { useContext } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { DateTime } from 'luxon';

//components.
import { Button, Container } from 'reactstrap';

//context.
import { ShiftContext } from '../../../App'

//functions.
import { AddNewShiftToDBandState } from '../../../functions/postRequest';
import { DeleteRequest } from '../../../functions/deleteRequest';
import { FetchDataSetState } from '../../../functions/FetchHook';
import { DeleteApprovedShift, findShiftInArray, TransferApprovedShift } from '../../../components/shared/scheduling_needs/functions';

import "./ShiftCandidatesPage.styles.css"

const ShiftCandidatesPage = () => {
  const { pathname } = useLocation();
  const { currentUser, setShiftStatuses, shiftStatuses } = useContext(ShiftContext);
  const { _shiftID } = useParams();

  const { shiftsWithApplicants, shiftsAvailable} = shiftStatuses;

  const dateApproved = DateTime.local()
  const formattedDateApproved = dateApproved.toFormat("yyyy-MM-dd");

  const applicantsForThisShift = shiftsWithApplicants.filter(({ shiftID }) => shiftID == _shiftID).map(({ applicant }) => applicant);

  const thisShiftWithApplicants = findShiftInArray(_shiftID, shiftsWithApplicants);

  const onApproveRequest = async (shiftID, shiftWithApplicantObject) => {
    const { id, _shiftID:shiftid, applicant } = shiftWithApplicantObject;

    try {
      if (!id && !shiftid && !applicant && !applicant.id) throw new Error(`ERROR INSIDE => ${pathname}. ERROR IS: Your shiftObject (2nd argument) MUST have an id, _shiftID and applicant object!!! Your shiftObject has: ${JSON.stringify(shiftWithApplicantObject)}`);

      const approvedShiftWithApplicant = shiftsWithApplicants.find(shiftWithApplicant => (shiftWithApplicant.id == `${applicant.id}-${shiftid}`));

      const setShiftStatusesState = (approved_shift_updated) => setShiftStatuses(prv => ({ ...prv, shiftsPendingConfirmation: [...prv.shiftsPendingConfirmation, approved_shift_updated] }));

      const SetAvailableShifts = () => setShiftStatuses(prv => ({ ...prv, shiftsAvailable: shiftsAvailable.filter(({ id }) => id != shiftid) }))
      
      const transfer_shift_logic = await TransferApprovedShift(approvedShiftWithApplicant, applicant, shiftid, formattedDateApproved, currentUser, setShiftStatusesState, pathname)

      const delete_approved_shift = await DeleteApprovedShift(`http://localhost:3003/shiftsAvailable/${shiftid}`, shiftsAvailable, approvedShiftWithApplicant, shiftid, SetAvailableShifts, pathname)

      const filter_shiftIDfromShiftsWithApplicants = shiftsWithApplicants.filter(shiftWithApplicant => shiftWithApplicant.shiftID == _shiftID);

      const deleteShiftIDsFromShiftsWithApplicants = await Promise.all(filter_shiftIDfromShiftsWithApplicants.map(async ({ id }) => await DeleteRequest(`http://localhost:3003/shiftsWithApplicants/${id}`)));

      const setStateForShiftsWithApplicants = await FetchDataSetState("http://localhost:3003/shiftsWithApplicants", data => setShiftStatuses(prv => ({ ...prv, shiftsWithApplicants: [...data] }))) //resets shiftWithApplicants state.
      
      return { transfer_shift_logic, delete_approved_shift, deleteShiftIDsFromShiftsWithApplicants, setStateForShiftsWithApplicants };
    } catch (error) {
      console.error({ message: "ERROR with onApproveRequest function!!!", location: pathname, error, errorStack: error.stack, errorMessage: error.message, name: error.name });
    }
  }

  return (
    <div>
      <header className='my-5'>
        <h3>CANDIDATES FOR SHIFT <span className='text-danger'>{JSON.stringify(thisShiftWithApplicants)}</span>:</h3>
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
                  <Button className='w-100' size='md' color={idx % 2 == 1 ? 'success' : 'danger'} onClick={() => onApproveRequest(_shiftID, {})}>
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