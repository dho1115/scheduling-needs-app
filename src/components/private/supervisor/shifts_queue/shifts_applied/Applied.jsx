import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import { ShiftContext } from '../../../../../App';
import { DateTime } from 'luxon';

//Components.
import Applicant from './Applicant';

//functions.
import { addShiftToShiftsPendingConfirmation, findSelectedEmployee, removeShiftID } from './functions';

import "./Applied.styles.css";

const Applied = () => {
   const [appliedForShifts, setAppliedForShifts] = useState([]);
   const navigate = useNavigate();
   const { shiftsArray, setShiftsArray, employees, setEmployees, currentUser, unconfirmedShifts, setUnconfirmedShifts } = useContext(ShiftContext);
   
   useEffect(() => {
      const shiftsWithApplicants = shiftsArray.filter(({ applicants }) => applicants && applicants.length);
      shiftsWithApplicants.length && setAppliedForShifts([...shiftsWithApplicants]);

      return () => setAppliedForShifts([]);
   }, [])
   
   const onHandleAssignShift = (name, employeeID, shiftID, storeNumber) => {
      /*
         Inside employees array:
         1. For the target employee: (1a) remove shiftID from .shiftsAppliedFor. (1b) add that shift to .shiftsPendingConfirmation.
         2. Set the appropriate state.

         Inside shiftsPendingConfirmation array:
         1. Add that shift OBJECT to [shiftsPendingConfirmation].
         2. Set the appropriate state.
       */

      const candidate = findSelectedEmployee(employeeID, employees);

      const remove_shift_id = removeShiftID(shiftID, candidate);

      const add_to_pending = addShiftToShiftsPendingConfirmation({ name, shiftID, employeeID, storeNumber }, candidate);
   }

   return (
      <div>
         <header className='applied-for-header p-1'>
            <h1>SHIFT(S) WITH CANDIDATES!!!</h1>
         </header>

         <Container className='applied-for-shifts p-3 m-3'>
            {
               appliedForShifts.length ?
                  appliedForShifts.map(({ id, date, time, storeNumber, applicants }, idx) => {
                     const shiftID = id;
                     return (
                        <div className='p-3 m-1' style={{ border: '1.5px solid black', backgroundColor: idx % 2 == 1 ? 'lightyellow' : 'antiquewhite' }} key={idx}>
                           <h5>id: <span style={{color: 'firebrick'}}>{shiftID}</span></h5>
                           <h5>date: <span style={{color: 'firebrick'}}>{date}</span></h5>
                           <h5>time: <span style={{color: 'firebrick'}}>{time}</span></h5>
                           <h3>store: <span style={{ color: 'firebrick' }}>{storeNumber}</span></h3>
                           <hr />
                           <h5>APPLICANTS:</h5>
                           {
                              applicants.map(id => {
                                 const employee = employees.find(val => id == val.id);
                                 
                                 return <Applicant shiftID={shiftID} key={id} {...employee} onHandleAssignShift = {onHandleAssignShift} storeNumber={storeNumber} />
                              })
                           }
                        </div>
                     )
                  })
                  :
                  <>
                     <h1>SORRY... NOBODY HAS APPLIED FOR <i>ANY</i> SHIFT...</h1>
                     <h5>Bunch of fucking lazy asses!!!</h5>
                     <h5>Either that, or they're just too busy coding, writing screenplays or... fuckin' lazy asses!!!</h5>
                  </>
            }
         </Container>
      </div>
   )
}

export default Applied