//Dependencies.
import { useContext, useEffect } from 'react'
import { ShiftContext } from '../../../App';
import Shift from './shift_component/Shift';
import { Container } from 'reactstrap';
import ErrorBoundary from '../../ErrorBoundary';

import "./SchedulingNeeds.styles.css";

const SchedulingNeeds = () => {
   const { shiftStatuses, shiftStatuses: { shiftsAvailable } } = useContext(ShiftContext);

   return (
      <div>
         <header>
            <h1>SCHEDULING NEEDS.</h1>
         </header>
         <Container className='p-3 scheduling-needs-container'>
            {
               shiftsAvailable.map((val, idx) => (
                  <ErrorBoundary fallback={<h3 className='text-danger'>ERROR!!!</h3>}>
                     <Shift key={idx} {...val} idx={idx} />
                  </ErrorBoundary>)
               )
            }
         </Container>
      </div>
   )
}

export default SchedulingNeeds