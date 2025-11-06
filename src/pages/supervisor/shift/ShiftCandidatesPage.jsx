import React, { useContext, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { DateTime } from 'luxon';

//components.
import { Button, Container } from 'reactstrap';

//context and dependencies.
import { ShiftContext } from '../../../App';
import emailjs from '@emailjs/browser';

//functions.
import { FetchShiftStatuses } from '../../../functions/FetchHook';
import { TransferApprovedShift } from '../../../components/shared/scheduling_needs/functions';
import { ConfirmApprovedShiftLogic } from '../../../functions/emailFunctions';

import "./ShiftCandidatesPage.styles.css"

const ShiftCandidatesPage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { currentUser, setShiftStatuses, shiftStatuses, emailjs_keys } = useContext(ShiftContext);
  const { shiftsWithApplicants, shiftsAvailable } = shiftStatuses;
  
  const { _shiftID } = useParams();

  const dateApproved = DateTime.local()
  const formattedDateApproved = dateApproved.toFormat("yyyy-MM-dd");
 
  const applicantsForThisShift = shiftsWithApplicants.filter(({ shiftID }) => shiftID == _shiftID)

  const onApproveRequest = async (_shiftID, shiftWithApplicantObject) => {
    try {
      if (!shiftWithApplicantObject.id && !_shiftID && !applicant && !applicant.id && !shiftWithApplicantObject.date && !shiftWithApplicantObject.storeNumber) {
        throw new Error(`ERROR INSIDE => ${pathname}. Your shiftObject (2nd argument) MUST have an id, _shiftID, a shiftDate, a storeNumber and applicant object!!! Your shiftObject has: ${JSON.stringify(shiftWithApplicantObject)}`);
      }

      const { id, applicant, date, storeNumber } = shiftWithApplicantObject;

      const approvedShiftWithApplicant = shiftsWithApplicants.find(shiftWithApplicant => (shiftWithApplicant.id == id));
      
      const transfer_shift_logic = await TransferApprovedShift(approvedShiftWithApplicant, shiftsWithApplicants, formattedDateApproved, currentUser, pathname)

      FetchShiftStatuses()
        .then(arrayOfResponses => {
          const allResponsesOK = arrayOfResponses.filter(response => !response.ok);

          if (!allResponsesOK.length) {
            const jsonifyResponses = arrayOfResponses.reduce((accumulator, res) => {
              accumulator = { ...accumulator, [res]: { ...res.json() } };
              return accumulator;
            }, {});

            return jsonifyResponses
          }
          else {
            throw new Error(`Please wait while we resolve all responses. At least one returned !res.ok: Currently, the followning responses are NOT ok: ${JSON.stringify(allResponsesOK)}.`)
          }
        })
        .then(async shiftStatuses => {
          console.log("returning shiftStatuses...", shiftStatuses);
          setShiftStatuses(shiftStatuses);

          return await ConfirmApprovedShiftLogic(_shiftID, date, "http://localhost:3001/", applicant.name, storeNumber, emailjs, emailjs_keys.SERVICE_ID, emailjs_keys.CONFIRM_SHIFT_KEY_ID, emailjs_keys.PUBLIC_KEY_ID)
        })
        .then(response => {
          if (response.status == 200 || response.text) {
            console.log("Message send successfully!!!")
            console.log(response.templateParams);
          }
        })
        .catch(error => ({ message: "FetchShiftStatuses function call ERROR!!!", location: location.pathname, error, errorName: error.name, errorMessage: error.message, errorStack: error.stack }));

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
            applicantsForThisShift.map(({ id, applicant, date, storeNumber }, idx) => (
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
                <h3>SHIFT DATE: <span className='text-danger'>{date}</span></h3>
                <div className='w-100'>
                  <Button className='w-100' size='md' color={idx % 2 == 1 ? 'success' : 'danger'} onClick={() => onApproveRequest(_shiftID, { applicant, id, date, storeNumber })
                    .then(() => navigate(`/supervisor/welcome/${currentUser.id}/available shifts`))
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