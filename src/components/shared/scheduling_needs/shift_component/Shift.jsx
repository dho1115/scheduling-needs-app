import React, { Suspense, useContext } from 'react'

//component.
import CandidateShiftButtons from './ShiftButton_Candidate';
import SupervisorShiftButtons from './ShiftButton_Supervisor';

//dependencies.
import { ShiftContext } from '../../../../App';

import "./Shift.styles.css";

const SuspenseComponent = () => {
   return (
      <div className='p-1 m-1' style={{width: '100%', backgroundColor: 'antiquewhite', border: '1.5px solid maroon'}}>
         <h1>LOADING... PLEASE WAIT.</h1>
      </div>
   )
}

const Shift = ({ id, idx, date, time, storeNumber, ...rest }) => {
   const { currentUser } = useContext(ShiftContext);
   const shiftDetails = { id, shiftID: id, date, time, storeNumber, currentUser };

   return (
      <Suspense fallback={<SuspenseComponent />}>
         <div key={idx} className='shift-div p-1 m-3' style={{backgroundColor: idx%2==1 ? 'lightpink' : 'lightyellow'}}>
            <h5>shift id: {id}</h5>
            <h3>date: {date}</h3>
            <h3>time: {time}</h3>
            <h3>CVS# {storeNumber}</h3>
            {
               currentUser.role == 'candidate' ?
                  <CandidateShiftButtons {...shiftDetails} /> : <SupervisorShiftButtons {...shiftDetails} />
            }
         </div>
      </Suspense>
   )
}

export default Shift