import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import { ShiftContext } from '../../../../../App';
import { DateTime } from 'luxon';

//Components.
import Applicant from './Applicant';

//functions.
import { PutRequest } from '../../../../../functions/putRequest';
import { DeleteRequest } from '../../../../../functions/deleteRequest';
import { PostRequest } from '../../../../../functions/postRequest';
import { AddToAwardedShifts, DeleteShift, setStateBatch, updateDbAndState, updateEmployeeState, updateItemInArray } from './functions';
import { PatchDBandState, PatchRequest } from '../../../../../functions/patchRequest';

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
      console.log({name, employeeID, shiftID, storeNumber})
      const updatedEmployees = updateEmployeeState(employees, shiftID) //remove shift from employee.
      const updateAvailableShifts = shiftsArray.filter(({ id }) => id != shiftID); //remove from available shift.

      let selectedEmployee = employees.find(({ id }) => id == employeeID);
      const shiftsPendingConfirmation = selectedEmployee.shiftsPendingConfirmation ?
         [...selectedEmployee.shiftsPendingConfirmation, shiftID]
         :
         [shiftID];
      
      const dateApproved = DateTime.now().toFormat('yyyy-MM-dd')
      Promise.all([
         PatchDBandState(PatchRequest, () => setEmployees(updateItemInArray(employees, employeeID, { shiftsPendingConfirmation })), `http://localhost:3003/employees/${employeeID}`, { shiftsPendingConfirmation }) /*add new property ({shiftsPendingConfirmation})*/,
         PostRequest('http://localhost:3003/shiftsPendingEmployeeConfirm', { id: shiftID, dateApproved, storeNumber, _candidateID: employeeID, candidate: name, approvedBy: currentUser.id }), //Add to shiftsPendingEmployeeConfirm
         PutRequest('http://localhost:3003/employees', employeeID, updatedEmployees), //removes the assigned shift that the supervisor just assigned from shiftsAppliedFor property.
         DeleteShift(`http://localhost:3003/availableShifts/${shiftID}`, shiftID)
      ])
         .then(result => {
            console.log({ message: 'PROMISE.ALL SUCCESS!!!', result });
            setEmployees(updatedEmployees);
            setShiftsArray(updateAvailableShifts);
            setUnconfirmedShifts(prv => [...prv, shiftID]);
            return { message: "Finished setting state for employees ShiftsArray, UnfonfirmedShifts", result, updatedState: { unconfirmedShifts, employees, shiftsArray } }
         })
         .then(message => {
            console.log(message);
            navigate(`http://localhost:3001/supervisor/welcome/${currentUser.id}/shifts/unconfirmed-shifts`);
         })
         .catch(error => console.error({ message: "PROMISE.ALL ERROR!!!", error, errorCode: error.code, errorMessage: error.message }));
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