import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from 'reactstrap';
import { ShiftContext } from '../../../../../App';

//functions.
import { PutRequest } from '../../../../../functions/putRequest';
import { DeleteRequest } from '../../../../../functions/deleteRequest';
import { PostRequest } from '../../../../../functions/postRequest';
import { AddToAwardedShifts, DeleteShift, setStateBatch, updateDbAndState, updateEmployeeState } from './functions';

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
   
   const onHandleAwardShift = (name, id, shiftID, storeNumber) => {
      const updatedEmployees = updateEmployeeState(employees, shiftID) //remove shift from employee.
      const updateAvailableShifts = shiftsArray.filter(({ id }) => id != shiftID); //remove from available shift.

      PostRequest('http://localhost:3003/shiftsPendingEmployeeConfirm', { id: shiftID, storeNumber, _candidateID: id, candidate: name })
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

      // Promise.all([ PostRequest('http://localhost:3003/shiftsPendingEmployeeConfirm', shiftID), PutRequest('http://localhost:3003/employees', updatedEmployees), DeleteShift(`http://localhost:3003/availableShifts/${shiftID}`, shiftID) ])
      //    .then(result => {
      //       console.log({ message: 'PROMISE.ALL SUCCESS!!!', result });
      //       setEmployees(updatedEmployees);
      //       setShiftsArray(updateAvailableShifts);
      //       setUnconfirmedShifts(prv => [...prv, shiftID]);
      //       return { message: "Finished setting state for employees ShiftsArray, UnfonfirmedShifts", result, updatedState: { unconfirmedShifts, employees, shiftsArray } }
      //    }).then(message => {
      //       console.log(message);
      //       navigate(`http://localhost:3001/supervisor/welcome/${currentUser.id}/shifts/unconfirmed-shifts`);
      //    })
      //    .catch(error => console.error({ message: "PROMISE.ALL ERROR!!!", error, errorCode: error.code, errorMessage: error.message }));
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

                                    return (
                                       <div key={id} className='applicant-div p-1 m-1'>
                                          <h5>id: {id}</h5>
                                          <p><strong>name: {employee.name}</strong></p>
                                          <p><strong>base: {employee.base}</strong></p>
                                          <button
                                             className='w-100 btn btn-success'
                                             onClick={() => onHandleAwardShift(employee.name, id, shiftID, storeNumber)}
                                          >
                                             ASSIGN SHIFT TO {employee.name.toUpperCase()}!!!
                                          </button>
                                       </div>
                                    )
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