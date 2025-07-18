//Dependencies.
import { useContext, useEffect } from 'react'
import { ShiftContext } from '../../../App';
import { Button, Container } from 'reactstrap';
import { putRequest } from '../../../functions/putRequest';

import "./SchedulingNeeds.styles.css";

const SchedulingNeeds = () => {
   const { shiftsArray, setShiftsArray, currentUser, setCurrentUser, setEmployees, employees } = useContext(ShiftContext);
   const { role } = currentUser;

   const customButtons = {
      candidate: [
         {
            name: "APPLY FOR SHIFT!!!",
            function: (shiftID, store, ...args/* [candidate, shift] */) => {
               const updatedCandidateData = Array.from(args)[0]; //currentUser.
               const { id: candidateID } = updatedCandidateData;
               updatedCandidateData.shiftsAppliedFor ? //Add/update shiftsAppliedFor.
                  updatedCandidateData.shiftsAppliedFor = [...updatedCandidateData.shiftsAppliedFor, shiftID]
                  :
                  updatedCandidateData.shiftsAppliedFor = [shiftID]; //Ternary operator to see if there is a property called shiftsAppliedFor.

               const updatedShiftData = Array.from(args)[1]; //returns a {...shift} from this argument: shiftsArray.filter(val => val.id == id)[0])

               updatedShiftData.applicants ?
                  updatedShiftData.applicants = [...updatedShiftData.applicants, updatedCandidateData] //If there are applicants.
                  :
                  updatedShiftData.applicants = [updatedCandidateData] //If there are NO applicants.
               
               const updatedEmployees = [...employees.filter(val => val.id != candidateID), updatedCandidateData]; //database of employees with the target employee having the new property (shiftsAppliedFor).

               const updatedShifts = [...shiftsArray.filter(val => val.id != shiftID), updatedShiftData]

               console.log({ typeof: typeof (updatedShiftData), shiftID, updatedShiftData, candidateID });
               debugger;

               putRequest("http://localhost:3003/currentUser", candidateID, updatedCandidateData)
                  .then(result => {
                     console.log({ message: "/currentUser PUT request successful!!!", updatedCandidateData, result });
                     setCurrentUser(prv => ({ ...prv, ...updatedCandidateData }));
                  })
                  .then(result => console.log({ message: 'setCurrentUser successful!!!', currentUser, result }))
                  .catch(error => console.error({ message: 'PUT request error while updating currentUser', error, status: error.status, errMessage: error.message }));

               putRequest(`http://localhost:3003/employees/${candidateID}`, candidateID, updatedCandidateData)
                  .then(result => {
                     console.log({ message: "/employees PUT request successful!!!", updatedEmployees, result });
                     setEmployees(updatedEmployees);
                  })
                  .then(result => console.log({ message: 'setEmployees successful!!!', currentUser, result }))
                  .catch(error => console.error({ message: 'PUT request error while updating employees', error, status: error.status, errMessage: error.message }))

               putRequest(`http://localhost:3003/availableShifts/${shiftID}`, shiftID, updatedShiftData)
                  .then(result => {
                     console.log({ message: "/employees PUT request successful!!!", updatedEmployees, result });
                     setShiftsArray(updatedShifts)
                  })
                  .then(result => console.log({ message: 'setEmployees successful!!!', currentUser, result }))
                  .catch(error => console.error({ message: 'PUT request error while updating employees', error, status: error.status, errMessage: error.message }))

               console.log("===== HERE IS YOUR DATA!!! =====");
               console.log({ updatedCandidateData, updatedShiftData, updatedEmployees, updatedShifts, state: { currentUser, employees, shiftsArray }, args });
               console.log("================================");
            }
         },
         {
            name: "QUESTION ABOUT SHIFT",
            function: (id, store) => console.log({type: '*** EMAIL ***', header: `I have a question about shift id ${id}, `, body: `Regading store ${store}... I have a question...`})
         }
      ],
      supervisor: [
         {
            name: "CANCEL THIS SHIFT!!!",
            function: (id, store) => console.log(`INSERT LOGIC TO CANCEL SHIFT ${id}. store ${store}`)
         },
         {
            name: "VIEW CANDIDATES",
            function: (id, store) => console.log(`INSERT LOGIC TO VIEW ALL CANDIDATES FOR shift id ${id} - store ${store}.`)
         }
      ]
   } //custom buttons that will be used for shitsArray.map.

   return (
      <div>
         <header>
            <h1>SCHEDULING NEEDS.</h1>
         </header>
         <Container className='p-3 scheduling-needs-container'>
            {
               shiftsArray.map(({id, date, time, storeNumber}, idx) => (
                  <div key={idx} className='shift-div p-1 m-3' style={{backgroundColor: idx%2==1 ? 'lightpink' : 'lightyellow'}}>
                     <h5>shift id: {id}</h5>
                     <h3>date: {date}</h3>
                     <h3>time: {time}</h3>
                     <h3>CVS# {storeNumber}</h3>
                     <div className='customButtons p-3'>
                        {
                           customButtons[role]
                              .map((val, idx) => (
                                 <Button key={idx} color= {idx%2==1 ? 'danger' : 'success'} size='sm' onClick={() => val.function(id, storeNumber, {...currentUser}, shiftsArray.filter(val => val.id == id)[0])}><strong>{val.name}</strong></Button>
                              ))
                        }
                     </div>
                  </div>
               ))
            }
         </Container>
      </div>
   )
}

export default SchedulingNeeds