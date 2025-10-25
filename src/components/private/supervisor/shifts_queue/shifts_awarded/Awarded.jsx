import React, { useContext, useEffect, useState } from 'react';

//Dependencies.
import { ShiftContext } from '../../../../../App';

import "./Awarded.styles.css";
import { Container } from 'reactstrap';

const Awarded = () => {
   const {shiftStatuses: {shiftsAssigned} } = useContext(ShiftContext);
   const [assignedShifts, setAssignedShifts] = useState([]);

   useEffect(() => {
      setAssignedShifts([...shiftsAssigned]);

      return () => setAssignedShifts([])
   }, [])
  return (
    <div>
      <header>AWARDED SHIFTS!!!</header>
      <Container>
         <strong>{JSON.stringify(assignedShifts)}.</strong>
      </Container>
    </div>
  )
}

export default Awarded