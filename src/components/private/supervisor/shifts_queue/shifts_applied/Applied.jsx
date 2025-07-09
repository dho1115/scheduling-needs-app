import React, { useContext, useEffect, useState } from 'react';
import { Container } from 'reactstrap';

import { ShiftContext } from '../../../../../App';

import "./Applied.styles.css";

const Applied = () => {
   const [appliedForShifts, setAppliedForShifts] = useState([])
   const { shiftsArray } = useContext(ShiftContext);
   
   useEffect(() => {
      const shiftsWithApplicants = shiftsArray.filter(({ applicants }) => applicants && applicants.length);
      shiftsWithApplicants.length && setAppliedForShifts([...shiftsWithApplicants]);

      return () => setAppliedForShifts([]);
   }, [])

   return (
      <div>
         <header className='applied-for-header p-1'>
            <h1>SHIFT(S) WITH CANDIDATES!!!</h1>
         </header>

         <Container className='applied-for-shifts p-3 m-3'>
            {
               appliedForShifts.length ?
                  appliedForShifts.map((val, idx) => (
                     <div className='p-3 m-1' style={{ border: '1.5px solid black', backgroundColor: idx % 2 == 1 ? 'lightyellow' : 'antiquewhite' }} key={idx}>
                        <strong>{JSON.stringify(val)}</strong>
                     </div>
                  ))
                  :
                  <>
                     <h1>SORRY... NOBODY HAS APPLIED FOR <i>ANY</i> SHIFT...</h1>
                     <h5>Bunch of fucking lazy asses!!!</h5>
                     <h5>Either that, or they're just too busy coding, writing screenplays or... fuckin' lazy asses!!!</h5>
                  </>
            }
         </Container>
      </div>
   )
}

export default Applied