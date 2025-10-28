import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from 'reactstrap';

import "./Shift.styles.css";

const SupervisorShiftButtons = () => {
   const onSeeCandidates = () => {

   }

   return (
      <div className='shiftButton_supervisor'>
         <Button className='w-100' color='danger'>SEE CANDIDATES!!!</Button>
      </div>
   )
}

export default SupervisorShiftButtons