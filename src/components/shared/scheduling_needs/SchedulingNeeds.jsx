//Dependencies.
import { useContext } from 'react'
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
               const updatedCandidateData = Array.from(args)[0];
               const { id: candidateID } = updatedCandidateData;
               updatedCandidateData.shiftsAppliedFor ?
                  updatedCandidateData.shiftsAppliedFor = [...updatedCandidateData.shiftsAppliedFor, shiftID]
                  :
                  updatedCandidateData.shiftsAppliedFor = [shiftID]; //Ternary operator to see if there is a property called shiftsAppliedFor.

               const updatedShiftData = Array.from(args)[1];
               updatedShiftData.applicants ?
                  updatedShiftData.applicants = [...updatedCandidateData.applicants, updatedCandidateData]
                  :
                  updatedShiftData.applicants = [updatedCandidateData] //Ternary operator to see if there is an applicants property.
               
               const updatedEmployees = [...employees.filter(val => val.id != candidateID), updatedCandidateData];

               const updatedShifts = [...shiftsArray.filter(val => val.id != shiftID), updatedShiftData]

               console.log("===== HERE IS YOUR DATA!!! =====");
               console.log({ shiftID, candidateID, store, updatedCandidateData, updatedShiftData, updatedEmployees, updatedShifts, args });
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