import { useLocation } from 'react-router-dom';
import { Button, Container, Form, FormGroup } from 'reactstrap';

//Components
import ErrorBoundary from '../ErrorBoundary';
import SchedulingNeedsCandidate from './candidate/SchedulingNeedsCandidate';

import './SchedulingNeeds.styles.css';

const SchedulingNeeds = ({shiftsArray, role}) => {
   const location = useLocation();

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
                           <ErrorBoundary fallback={<h3>Something went wrong trying to render Candidate component in SchedulingNeeds.jsx</h3>}>
                              {
                                 role == 'candidate' && <SchedulingNeedsCandidate _shiftID={_shiftID} />
                              } {/* Component visible only to candidate. */}
                           </ErrorBoundary>                           
                        </div>
                     ))
                  }
               </div>
            </Container>
         </ErrorBoundary>
      </div>
   )
}

export default SchedulingNeeds