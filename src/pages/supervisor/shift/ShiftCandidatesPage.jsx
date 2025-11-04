import React, { useContext, useEffect } from 'react'
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
  const { shiftsWithApplicants, shiftsAvailable } = shiftStatuses;
  
  const { _shiftID } = useParams();

  const dateApproved = DateTime.local()
  const formattedDateApproved = dateApproved.toFormat("yyyy-MM-dd");
 
  const applicantsForThisShift = shiftsWithApplicants.filter(({ shiftID }) => shiftID == _shiftID)
  const thisShiftWithApplicants = findShiftInArray(_shiftID, shiftsWithApplicants);

  const onApproveRequest = async (_shiftID, shiftWithApplicantObject) => {
    try {
      if (!shiftWithApplicantObject.id && !_shiftID && !applicant && !applicant.id) throw new Error(`ERROR INSIDE => ${pathname}. ERROR IS: Your shiftObject (2nd argument) MUST have an id, _shiftID and applicant object!!! Your shiftObject has: ${JSON.stringify(shiftWithApplicantObject)}`);

      const { id, applicant } = shiftWithApplicantObject;

      const approvedShiftWithApplicant = shiftsWithApplicants.find(shiftWithApplicant => (shiftWithApplicant.id == id));
      
      const transfer_shift_logic = await TransferApprovedShift(approvedShiftWithApplicant, shiftsWithApplicants, formattedDateApproved, currentUser, pathname)

      console.log({ transfer_shift_logic });

      return transfer_shift_logic;
    } catch (error) {
      console.error({ message: "ERROR with onApproveRequest function!!!", location: pathname, error, errorStack: error.stack, errorMessage: error.message, name: error.name });
    }
  }

  useEffect(() => {
    console.log(shiftStatuses);
  }, [shiftsWithApplicants.length, shiftsAvailable.length])
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
                {
                  applicant.name.length > 11 ?
                    <h3 className='text-danger'>{applicant.name}</h3>
                    :
                    <h1 className='text-danger'>{applicant.name}</h1>
                }
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