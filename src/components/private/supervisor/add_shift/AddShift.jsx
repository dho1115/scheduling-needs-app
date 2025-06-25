import React, {useContext, useEffect, useState} from 'react'
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { ShiftContext } from '../../../../App';
import { PostRequest } from '../../../../functions/postRequest';
import uniqid from 'uniqid';

import "./AddShift.styles.css";


const AddShift = () => {
   const shiftID = uniqid('shift-')
   const [shiftDetails, setShiftDetails] = useState({id: shiftID, storeNumber: '', date: '', time: ''});
   const { shiftsArray, setShiftsArray } = useContext(ShiftContext);

   const handleSubmit = e => {
      e.preventDefault();
      const setShiftsPromise = () => new Promise((res, rej) => {
         const shiftsArrayInitialLength = shiftsArray.length;
         setShiftsArray(prv => ([...prv, { ...shiftDetails }]));
         
         if (shiftsArray.length > shiftsArrayInitialLength) res({ message: `Successfully setShiftsArray: ${JSON.stringify(shiftsArray)}.` });
         else rej({ message: `ERROR!!! UNABLE TO ADD NEW SHIFT TO SHIFTS ARRAY: ${JSON.stringify(shiftsArray)}.` });
      });

      Promise.all(
         [
            setShiftsPromise(),
            PostRequest(
               "http://localhost:3003/availableShifts",
               { ...shiftDetails }
            )
         ]
      )
         .then(result => console.log({ result }))
         .catch(error => console.error({ message: "setShifts Error in Promise.all!!!", error, errorMessage: error.message, errorCode: error.code }));
   };

   useEffect(() => {
      return () => {
         setShiftDetails({id: '', storeNumber: '', date: '', time: ''})
      };
   }, [])
  return (
   <Form onSubmit={handleSubmit} className='add-shift-form p-3 m-1'>
      <FormGroup>
         <Label for='storeNumber'>STORE NUMBER</Label>
         <Input type='number' id='storeNumber' value={shiftDetails.storeNumber} placeholder='store number' required onChange={e => setShiftDetails(prv => ({...prv, storeNumber: e.target.value}))} />
      </FormGroup>
      <FormGroup>
         <Label for='location'>DATE</Label>
         <Input type='date' id='location' value={shiftDetails.location} placeholder='location' required onChange={e => setShiftDetails(prv => ({...prv, date: e.target.value}))} />
      </FormGroup>
      <FormGroup>
         <Label for='time'>TIME</Label>
         <Input type='text' id='time' value={shiftDetails.time} required onChange={e => setShiftDetails(prv => ({...prv, time: e.target.value}))} />
      </FormGroup>
      <FormGroup>
         <button type="submit" className="btn btn-danger btn-lg btn-block w-100">SUBMIT</button>
      </FormGroup>
   </Form>
  )
}

export default AddShift