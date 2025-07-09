import React, { useContext, useEffect, useState } from 'react';

//Dependencies.
import { ShiftContext } from '../../../../../App';

import "./Awarded.styles.css";
import { Container } from 'reactstrap';

const Awarded = () => {
   const { shiftsAwarded } = useContext(ShiftContext);
   const [awarded, setAwarded] = useState([]);

   useEffect(() => {
      setAwarded([...shiftsAwarded]);

      return () => setAwarded([])
   }, [])
  return (
    <div>
      <header>AWARDED SHIFTS!!!</header>
      <Container>
         <strong>{JSON.stringify(awarded)}.</strong>
      </Container>
    </div>
  )
}

export default Awarded