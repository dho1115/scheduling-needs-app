import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import { ShiftContext } from '../../../../../App';

//functions.
import { DeleteFromAvailableShifts } from './functions';
import { AddToAwardedShifts } from './functions';

import "./Applied.styles.css";

const Applied = () => {
   const [appliedForShifts, setAppliedForShifts] = useState([])
   const { shiftsArray } = useContext(ShiftContext);
   
   useEffect(() => {
      const shiftsWithApplicants = shiftsArray.filter(({ applicants }) => applicants && applicants.length);
      shiftsWithApplicants.length && setAppliedForShifts([...shiftsWithApplicants]);

      return () => setAppliedForShifts([]);
   }, [])

   const onHandleAwardShift = (deleteURL, awardURL, jsonBody, id = null) => Promise.all(DeleteFromAvailableShifts(deleteURL, id), AddToAwardedShifts(awardURL, jsonBody))
      .then(res => {
         if (!res.ok) throw new Error(`Error in response!!! ${res.status}.`);
         console.log({ message: `Successfully transferred from available to awarded. Shift ${id} has been deleted from ${deleteURL} and added to ${awardURL}!!!`, res, resMessage: res.message });
      })
      .catch(error => console.error({ message: 'ERROR AWARDING SHIFT!!!', error, errorCode: error.code, errorMessage: error.message }));
   
   const onHandleAwardShift_temp = (name, id, shiftID, storeNumber) => alert(`About to send the following information for pharmacist ${name} (id# ${id}) to *** CONFIRM ***: ${JSON.stringify({shiftID, storeNumber})}.`);

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
                              applicants.map(({ id, name, base }) => (
                                 <div key={id} className='applicant-div p-1 m-1'>
                                    <h5>id: {id}</h5>
                                    <p><strong>name: {name}</strong></p>
                                    <p><strong>base: {base}</strong></p>
                                    <button
                                       className='w-100 btn btn-success'
                                       onClick={() => onHandleAwardShift_temp(name, id, shiftID, storeNumber)}
                                       // onClick={() => onHandleAwardShift(
                                       // `http://localhost:3003/availableShifts/${shiftID}`,
                                       // "http://localhost:3003/awardedShifts",
                                       // { _shiftID: shiftID, _candidateID: id },
                                       //    shiftID)}
                                    >
                                       ASSIGN SHIFT TO {name.toUpperCase()}!!!
                                    </button>
                                 </div>
                              ))
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