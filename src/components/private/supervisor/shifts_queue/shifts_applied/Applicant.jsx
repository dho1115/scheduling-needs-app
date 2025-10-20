import React from 'react'

import "./Applied.styles.css";

const Applicant = (props) => {
   const { shiftID, name, base, id: employeeID, storeNumber, onHandleAssignShift } = props;
   return (
      <div className='applicant-div p-1 m-1'>
         <h5>id: {employeeID}</h5> {/* id here is shift id */}
         <p><strong>name: {name}</strong></p>
         <p><strong>base: {base}</strong></p>
         <button
            className='w-100 btn btn-success'
            onClick={() => onHandleAssignShift(name, employeeID, shiftID, storeNumber)}
         >
            ASSIGN SHIFT TO {name.toUpperCase()}!!!
         </button>
      </div>
   )
}

export default Applicant