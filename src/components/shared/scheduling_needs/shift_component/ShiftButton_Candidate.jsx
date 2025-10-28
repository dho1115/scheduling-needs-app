import React, { useContext } from 'react';

//context providers.
import { ShiftContext } from '../../../../App';

//dependencies.
import { Button } from 'reactstrap';

//functions.
import { findShiftInShiftStatus, TransferShift } from '../functions';
import { PostRequestSetState } from '../../../../functions/postRequest';

import "./Shift.styles.css";

const CandidateShiftButtons = (props) => {
  const { shiftStatuses, setShiftStatuses } = useContext(ShiftContext);
  const { shiftsWithApplicants, shiftsAvailable } = shiftStatuses;
  
  const { id: _currentUserID, name } = props.currentUser;

  const onSelectShift = async () => {
    const { password, ...otherProps } = props;
    try {
      const addToShiftsWithApplicants = await PostRequestSetState("http://localhost:3003/shiftsWithApplicants", { ...otherProps }, () => setShiftStatuses(prv => ({ ...prv, shiftsWithApplicants: [...prv.shiftsWithApplicants, { ...otherProps }] })));

      return { message: "POST IS SUCCESSFUL!!!", data: { ...otherProps } };
    } catch (error) {
      console.error({ message: "onSelectShift ERROR!!!", error, errorMessage: error.message, errorStack: error.stack, errorCode: error.code });
    }
  }

  const onQuestionAboutShift = () => {
    console.log("FORM TO ASK QUESTION.")
  }

  return (
    <div className='shiftButton_div_candidate'>
      <Button size='lg' className='m-1' color={findShiftInShiftStatus(props.shiftID, shiftsWithApplicants) ? 'secondary' : 'danger'} onClick={onSelectShift} disabled={ findShiftInShiftStatus(props.shiftID, shiftsWithApplicants) }>{ findShiftInShiftStatus(props.shiftID, shiftsWithApplicants) ? "SELECTED" : "SELECT"}</Button>
      
      <Button size='sm' className='p-0' color='success'>QUESTION ABOUT SHIFT</Button>
    </div>
  )
}

export default CandidateShiftButtons