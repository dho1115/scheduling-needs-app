import {useContext} from 'react'
import { ShiftContext } from '../../../App';

import "./SchedulingNeeds.styles.css";
import { Button, Container } from 'reactstrap';

const SchedulingNeeds = () => {
   const { shiftsArray, currentUser } = useContext(ShiftContext);
   const { role } = currentUser;

   const customButtons = {
      candidate: [
         {
            name: "APPLY FOR SHIFT!!!",
            function: (id, store) => console.log(`Create logic to send notice to supervisor for ${id}, store ${store}.`)
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
   }

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
                                 <Button key={idx} color= {idx%2==1 ? 'danger' : 'success'} size='sm' onClick={() => val.function(id, storeNumber)}><strong>{val.name}</strong></Button>
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