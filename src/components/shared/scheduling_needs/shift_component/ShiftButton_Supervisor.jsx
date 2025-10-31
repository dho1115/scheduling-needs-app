import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'reactstrap';

//context.
import { ShiftContext } from '../../../../App';

//functions.
import { youveGotApplicants } from '../functions';

import "./Shift.styles.css";

const SupervisorShiftButtons = (props) => {
   const { id } = props;
   const { currentUser: { id: _currentUserID, name }, shiftStatuses } = useContext(ShiftContext);
   const navigate = useNavigate();
   const onViewCandidatesForThisShift = () => navigate(`/supervisor/welcome/${_currentUserID}/shifts/shift/${id}/candidates`)

   return (
      <div className='shiftButton_supervisor'>
         <Button className='w-100' color='danger' onClick={onViewCandidatesForThisShift}>YOU'VE GOT { youveGotApplicants(id, shiftStatuses.shiftsWithApplicants).length } CANDIDATE(S)!!!</Button>
      </div>
   )
}

export default SupervisorShiftButtons