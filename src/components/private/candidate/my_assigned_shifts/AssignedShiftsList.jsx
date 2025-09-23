import React, { useContext } from 'react'
import { Container } from 'reactstrap';

import { ShiftContext } from '../../../../App'

import "./AssignedShifts.styles.css";

const AssignedShiftsList = () => {
   const { shiftsAwarded } = useContext(ShiftContext);

   return (
      <Container>
         {
            shiftsAwarded.map((shift, idx) => {
               return (
                  <div className={`awarded-shift ${idx % 2 == 0 ? 'awarded-shift-even' : 'awarded-shift-odd'}`}>
                     <h3>{JSON.stringify(shift)}.</h3>
                  </div>
               )
            })
         }
      </Container>
   )
}

export default AssignedShiftsList