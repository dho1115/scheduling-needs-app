//Dependencies.
import { useContext } from 'react'
import { ShiftContext } from '../../../App';
import { Button, Container } from 'reactstrap';
import { PutRequest } from '../../../functions/putRequest';
import { DateTime } from 'luxon';

import "./SchedulingNeeds.styles.css";

const SchedulingNeeds = () => {
   const { shiftsArray, setShiftsArray, currentUser, setCurrentUser, setEmployees, employees } = useContext(ShiftContext);
   const { role } = currentUser;

   const customButtons = {
      candidate: [
         {
            name: "APPLY FOR SHIFT!!!",
            onApply: (shiftID, store, ...args/* [candidate, shift] */) => {
               let { id: candidateID, shiftsAppliedFor, ...rest } = Array.from(args)[0]; //currentUser.

               const shiftData = Array.from(args)[1] //This shift's data.

               if (shiftsAppliedFor) shiftsAppliedFor = [...shiftsAppliedFor, shiftID];
               
               else shiftsAppliedFor = [shiftID];

               let {applicants} = Array.from(args)[1]; //returns a {...shift} from this argument: shiftsArray.filter(val => val.id == id)[0])

               applicants ?
                  applicants = [...applicants, candidateID] //If there are applicants.
                  :
                  applicants = [candidateID] //If there are NO applicants.
               
               const updatedCandidateData = { ...currentUser, shiftsAppliedFor };
               
               const updatedEmployees = [...employees.filter(val => val.id != candidateID), { id: candidateID, shiftsAppliedFor, ...rest }]; //database of employees with the target employee having the new property (shiftsAppliedFor).

               const updatedShifts = [...shiftsArray.filter(val => val.id != shiftID), { ...shiftData, applicants }];

               PutRequest("http://localhost:3003/currentUser", candidateID, updatedCandidateData)
                  .then(result => {
                     console.log({ message: "/currentUser PUT request successful!!!", updatedCandidateData, result });
                     setCurrentUser(prv => ({ ...prv, ...updatedCandidateData }));
                  })
                  .catch(error => console.error({ message: 'PUT request error while updating currentUser', error, status: error.status, errMessage: error.message }));

               PutRequest(`http://localhost:3003/employees/${candidateID}`, candidateID, updatedCandidateData)
                  .then(result => {
                     console.log({ message: "/employees PUT request successful!!!", updatedEmployees, result });
                     setEmployees(updatedEmployees);
                  })
                  .catch(error => console.error({ message: 'PUT request error while updating employees', error, status: error.status, errMessage: error.message }))

               PutRequest(`http://localhost:3003/availableShifts/${shiftID}`, shiftID, { ...shiftData, applicants })
                  .then(result => {
                     console.log({ message: "/employees PUT request successful!!!", updatedEmployees, result });
                     setShiftsArray(updatedShifts)
                  })
                  .catch(error => console.error({ message: 'PUT request error while updating employees', error, status: error.status, errMessage: error.message }))
            }
         },
         {
            name: "QUESTION ABOUT SHIFT",
            onApply: (id, store) => console.log({type: '*** EMAIL ***', header: `I have a question about shift id ${id}, `, body: `Regading store ${store}... I have a question...`})
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
               shiftsArray.map(({id, date, time, storeNumber, applicants}, idx) => (
                  <div key={idx} className='shift-div p-1 m-3' style={{backgroundColor: idx%2==1 ? 'lightpink' : 'lightyellow'}}>
                     <h5>shift id: {id}</h5>
                     <h3>date: {date}</h3>
                     <h3>time: {time}</h3>
                     <h3>CVS# {storeNumber}</h3>
                     <div className='customButtons p-3'>
                        {
                           customButtons[role]
                              .map((val, idx) => (
                                 <Button
                                    key={idx} color={idx % 2 == 1 ? 'danger' : 'success'} size='sm'
                                    onClick={() => val.onApply(id, storeNumber, { ...currentUser }, shiftsArray.find(val => val.id == id))}
                                    disabled={applicants.includes(currentUser.id) && (val.name == "APPLY FOR SHIFT!!!")}
                                 >
                                    <strong>{applicants.includes(currentUser.id) && (val.name == "APPLY FOR SHIFT!!!") ? "APPLIED!!!" : val.name}</strong>
                                 </Button>
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