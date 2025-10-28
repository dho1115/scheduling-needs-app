//Dependencies.
import { useContext, useEffect } from 'react'
import { ShiftContext } from '../../../App';
import Shift from './shift_component/Shift';
import { Container } from 'reactstrap';

import "./SchedulingNeeds.styles.css";

const SchedulingNeeds = () => {
   const { shiftStatuses, shiftStatuses: { shiftsAvailable } } = useContext(ShiftContext);

   useEffect(() => {
      console.log({ shiftStatuses });
   }, [])

   return (
      <div>
         <header>
            <h1>SCHEDULING NEEDS.</h1>
         </header>
         <Container className='p-3 scheduling-needs-container'>
            {
               shiftsAvailable.map((val, idx) => <Shift key={idx} {...val} idx={idx}/>)
            }
         </Container>
      </div>
   )
}

export default SchedulingNeeds