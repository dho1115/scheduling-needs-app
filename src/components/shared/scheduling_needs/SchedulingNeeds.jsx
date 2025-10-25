//Dependencies.
import { Suspense } from 'react';
import { useContext } from 'react'
import { ShiftContext } from '../../../App';
import { Button, Container } from 'reactstrap';
import { PutRequest } from '../../../functions/putRequest';
import { DateTime } from 'luxon';

import "./SchedulingNeeds.styles.css";

const SchedulingNeeds = () => {
   const { shiftStatuses: { shiftsAvailable } } = useContext(ShiftContext);

   return (
      <div>
         <header>
            <h1>SCHEDULING NEEDS.</h1>
         </header>
         <Container className='p-3 scheduling-needs-container'>
            {
               shiftsAvailable.map(({ id, date, time, storeNumber }, idx) => (
                  <Suspense fallback={<h1>LOADING... PLEASE WAIT.</h1>}>
                     <div key={idx} className='shift-div p-1 m-3' style={{backgroundColor: idx%2==1 ? 'lightpink' : 'lightyellow'}}>
                        <h5>shift id: {id}</h5>
                        <h3>date: {date}</h3>
                        <h3>time: {time}</h3>
                        <h3>CVS# {storeNumber}</h3>
                     </div>
                  </Suspense>
               ))
            }
         </Container>
      </div>
   )
}

export default SchedulingNeeds