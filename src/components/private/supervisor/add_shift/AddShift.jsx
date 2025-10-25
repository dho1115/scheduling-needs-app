import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { ShiftContext } from '../../../../App';
import { PostRequest } from '../../../../functions/postRequest';
import uniqid from 'uniqid';

import "./AddShift.styles.css";

const AddShift = () => {
   const navigate = useNavigate();
   const shiftID = uniqid('shift-');
   const [shiftDetails, setShiftDetails] = useState({id: shiftID, storeNumber: '', date: '', time: ''});
   const { currentUser, shiftsArray, setShiftsArray } = useContext(ShiftContext);

   const setShiftsPromise = () => new Promise((res, rej) => {
      const shiftsArrayInitialLength = shiftsArray.length;
      setShiftsArray(prv => ([...prv, { ...shiftDetails }]));
      
      res({ message: `Successfully setShiftsArray: ${JSON.stringify(shiftsArray)}.` });
      rej({ message: `ERROR!!! UNABLE TO ADD NEW SHIFT TO SHIFTS ARRAY: ${JSON.stringify(shiftsArray)}.` });
   });

   const handleSubmit = e => {
      e.preventDefault();
      Promise.all(
         [
            setShiftsPromise(),
            PostRequest(
               "http://localhost:3003/availableShifts",
               { ...shiftDetails }
            )
         ]
      )
         .then(result => {
            console.log(result);
            navigate(`/supervisor/welcome/${currentUser.id}/available shifts`);
         })
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