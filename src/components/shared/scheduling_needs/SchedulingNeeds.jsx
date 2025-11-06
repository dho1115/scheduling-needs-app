//Dependencies.
import { Suspense, useContext, useEffect } from 'react'
import { ShiftContext } from '../../../App';
import Shift from './shift_component/Shift';
import { Container } from 'reactstrap';
import ErrorBoundary from '../../ErrorBoundary';

import "./SchedulingNeeds.styles.css";

const SchedulingNeeds = () => {
   const { shiftStatuses, shiftStatuses: { shiftsAvailable } } = useContext(ShiftContext);

   useEffect(() => {
      if (!shiftsAvailable || !shiftsAvailable.length) console.error("*** WARNING!!! *** shiftsAvailable returned: ", shiftsAvailable);
   }, [])
   
   return (
      <div>
         <header>
            <h1>SCHEDULING NEEDS.</h1>
         </header>
         <Container className='p-3 scheduling-needs-container'>
            <Suspense fallback={<h5>Loading shiftsAvailable...</h5>}>
               {
                  shiftsAvailable.map((val, idx) => ( /* shiftsAvailable is not a function??? */
                     <ErrorBoundary fallback={<h3 className='text-danger'>ERROR!!!</h3>}>
                        <Suspense fallback={<h3 className='text-danger'>LOADING...</h3>}>
                           <Shift key={idx} {...val} idx={idx} />
                        </Suspense>
                     </ErrorBoundary>)
                  )
               }
            </Suspense>
         </Container>
      </div>
   )
}

export default SchedulingNeeds