import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShiftContext } from '../../../../App'
import { Button, Container } from 'reactstrap';
import { DateTime } from 'luxon';

import { DeleteRequest } from '../../../../functions/deleteRequest';
import { PostRequest } from '../../../../functions/postRequest';
import { PutRequest } from '../../../../functions/putRequest';

import "./ShiftsNeedingConfirmation.styles.css";

const ShiftsNeedingConfirmation = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const { employees, setEmployees, setShiftsAwarded, unconfirmedShifts, setUnconfirmedShifts } = useContext(ShiftContext);

   const handleShiftConfirmation = async val => {
      const dateConfirmed = DateTime.now().toFormat('yyyy-MM-dd');

      try {
         const deleteFromDB = await DeleteRequest(`http://localhost:3003/shiftsPendingEmployeeConfirm/${val.id}`);

         setUnconfirmedShifts(unconfirmedShifts.filter(ShiftObject => ShiftObject.id != val.id));

         const addToAwardShiftDB = await PostRequest("http://localhost:3003/shiftsConfirmed", { ...val, dateConfirmed });

         setShiftsAwarded(prv => [...prv, { ...val, dateConfirmed }]);

         const updateAllEmployees = employees.map(employee => {
            if (employee.shiftsAppliedFor) {
               console.log(employee.shiftsAppliedFor);
               debugger;
               const shiftsAppliedFor = employee.shiftsAppliedFor.filter(shiftID => shiftID != val.id)
               console.log("shiftsAppliedFor:",shiftsAppliedFor);
               debugger;
               return { ...employee, shiftsAppliedFor };
            }
            return employee;
         })
         
         const updateAllEmployeesDB = await PutRequest("http://localhost:3003/employees", null, updateAllEmployees);

         setEmployees(updateAllEmployees);

         navigate(`/candidate/welcome/${id}/shifts/awarded`);

      } catch (err) {
         console.error({err, errMessage: err.message, code: err.code})
      }
   }

   return (
      <Container>
         {
            unconfirmedShifts.filter(({ _candidateID }) => _candidateID == id).map((val, idx) => (
               <div key={idx} className='m-1 p-1' style={{ overflowWrap: 'break-word', overflow: 'hidden', border: '5px solid firebrick', backgroundColor: 'burlywood' }}>
                  <h5>{JSON.stringify(val)}</h5>
                  <hr />
                  <Button color='danger' size='xl' className='w-100' onClick={() => handleShiftConfirmation(val)}>PLEASE CONFIRM THIS DAMN SHIFT!!!</Button>
               </div>
            ))
         }
      </Container>
   )
}

export default ShiftsNeedingConfirmation