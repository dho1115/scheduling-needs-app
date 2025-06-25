import {useContext} from 'react'
import { ShiftContext } from '../../../App';

import "./SchedulingNeeds.styles.css";
import { Container } from 'reactstrap';

const SchedulingNeeds = () => {
   const { shiftsArray } = useContext(ShiftContext);
  return (
    <div>
      <header>
         <h1>SCHEDULING NEEDS.</h1>
      </header>
      <Container className='p-3 scheduling-needs-container'>
         {
            shiftsArray.map(({id, date, time, storeNumber}, idx) => (
               <div key={idx} className='shift-div p-1 m-1' style={{backgroundColor: idx%2==1 ? 'lightpink' : 'lightyellow'}}>
                  <h5>shift id: {id}</h5>
                  <h3>date: {date}</h3>
                  <h3>time: {time}</h3>
                  <h3>CVS# {storeNumber}</h3>
               </div>
            ))
         }
      </Container>
    </div>
  )
}

export default SchedulingNeeds