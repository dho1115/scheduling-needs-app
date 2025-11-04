import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

//context providers.
import { ShiftContext } from '../../../../App';

//dependencies.
import { Button } from 'reactstrap';

//functions.
import { didApplicantApplyForShift } from '../functions';
import { PostRequestSetState } from '../../../../functions/postRequest';

import "./Shift.styles.css";

const CandidateShiftButtons = (props) => {
  const navigate = useNavigate();
  const { setModal, toggle, currentUser: { password, ...otherUserDetails }, ...otherProps } = props;
  const { id, shiftID, ...remainingProps } = otherProps;
  const { shiftStatuses, setShiftStatuses } = useContext(ShiftContext);
  const { shiftsWithApplicants } = shiftStatuses;
  
  const { id: _currentUserID, name } = props.currentUser;

  const alreadyApplied = didApplicantApplyForShift(_currentUserID, shiftID, shiftsWithApplicants) //true or false;

  const onSelectShift = async () => {
    const shiftWithApplicantID = `${_currentUserID}-${shiftID}`
    const shiftAndCandidate = { id: shiftWithApplicantID, shiftID, applicant: otherUserDetails, ...remainingProps };

    try {
      const addToShiftsWithApplicants = await PostRequestSetState("http://localhost:3003/shiftsWithApplicants", { ...shiftAndCandidate }, () => setShiftStatuses(prv => ({ ...prv, shiftsWithApplicants: [...prv.shiftsWithApplicants, { ...shiftAndCandidate }] })));

      console.log({ message: "POST IS SUCCESSFUL!!!", data: { ...otherProps, candidate: otherUserDetails, shiftsWithApplicants } });
      
      navigate(`/candidate/welcome/${_currentUserID}/available shifts`)

      return { message: "POST IS SUCCESSFUL!!!", data: { ...otherProps, candidate: otherUserDetails } };
    } catch (error) {
      console.error({ message: "onSelectShift ERROR!!!", error, errorMessage: error.message, errorStack: error.stack, errorCode: error.code });
    }
  } 

  return (
    <div className='shiftButton_div_candidate'>
      <Button size='lg' className='m-1' color={alreadyApplied ? 'secondary' : 'danger'} onClick={onSelectShift} disabled={alreadyApplied}>{ alreadyApplied ? "APPLIED" : "APPLY"}</Button>
      
      <Button size='sm' className='m-1' color='success' onClick={toggle}>QUESTION ABOUT SHIFT</Button>
    </div>
  )
}

export default CandidateShiftButtons