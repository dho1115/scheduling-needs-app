import { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Container, Form, FormGroup } from 'reactstrap';

//Components
import ErrorBoundary from '../ErrorBoundary';
import SchedulingNeedsCandidate from './candidate/SchedulingNeedsCandidate';
import { ShiftContext } from '../../App';

import './SchedulingNeeds.styles.css';

const SchedulingNeeds = () => {
   const location = useLocation();
   const shiftContext = useContext(ShiftContext)
   const { role, setRole, shiftsArray, setShiftsArray } = shiftContext;

   try {
      if (shiftsArray.length) {
         return (
            <div className='scheduling-needs-div'>
               <ErrorBoundary fallback={<h3>Error Occurred inside {location.pathname}.</h3>}>
                  <Container className='available-shifts-container m-1'>
                     <header className='available-shifts-header'>
                        <h3>CURRENT SHIFTS AVAILABLE</h3>
                     </header>
                     <div className='availableShifts'>
                        {
                           shiftsArray.map(({_shiftID, storeNumber, location, date, time, urgent, comments}, idx) => (
                              <div key={idx}>
                                 <h3>Shift ID: {_shiftID}.</h3>
                                 {urgent && <h1 style={{color: 'red'}}>URGENT!!!</h1>}
                                 <h1>Store Number: {storeNumber}</h1>
                                 <h3>location: {location}</h3>
                                 <h3>Date: {date}</h3>
                                 <h3>Time: {time}</h3>
                                 {comments && <h5>Supervisor comments: {comments}</h5>}
                                 <hr />
                                 <ErrorBoundary fallback={<h3>Something went wrong trying to render <span color='danger'>Candidate</span> component in SchedulingNeeds.jsx</h3>}>
                                    {
                                       role == 'candidate' && <SchedulingNeedsCandidate _shiftID={_shiftID} />
                                    } {/* Component visible only to candidate. */}
                                 </ErrorBoundary>
                                 <ErrorBoundary fallback={<h3>Something went wrong trying to render <span color='danger'>Scheduling Supervisor</span> component in SchedulingNeeds.jsx</h3>}>
                                    {
                                       role === 'supervisor' && 
                                       <Button color='danger' size='lg' onClick={() => console.log("A dropdown menu of the APPLICANTS!!!")}>YOU HAVE APPLICANTS FOR THIS SHIFT!!!</Button>
                                    } {/* Component only visible to Supervisor. */}
                                 </ErrorBoundary>
                              </div>
                           ))
                        }
                     </div>
                  </Container>
               </ErrorBoundary>
            </div>
         )
      } else {
         return (
            <div>
               <Container>
                  <h1>Sorry... there are no available shifts.</h1>
               </Container>
            </div>
         )
      }
      
   } catch (error) {
      return (
         <div>
            <Container>
               <h1>Something went wrong inside {location.pathname}: {JSON.stringify(error)}</h1>
            </Container>
         </div>
      )
   }
}

export default SchedulingNeeds