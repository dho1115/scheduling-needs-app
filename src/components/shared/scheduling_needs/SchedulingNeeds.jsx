//Dependencies.
import { Suspense } from 'react';
import { useContext } from 'react'
import { ShiftContext } from '../../../App';
import Shift from './shift_component/Shift';
import { Container } from 'reactstrap';
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
               shiftsAvailable.map((val, idx) => <Shift {...val} idx={idx}/>)
            }
         </Container>
      </div>
   )
}

export default SchedulingNeeds