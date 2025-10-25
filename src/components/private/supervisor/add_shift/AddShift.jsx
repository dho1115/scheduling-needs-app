import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { ShiftContext } from '../../../../App';
import { AddNewShiftToDBandState } from '../../../../functions/postRequest';
import uniqid from 'uniqid';
import "./AddShift.styles.css";

const AddShift = () => {
   const { pathname } = useLocation();
   const navigate = useNavigate();
   const shiftID = uniqid('shift-');
   const [shiftDetails, setShiftDetails] = useState({id: shiftID, storeNumber: '', date: '', time: ''});
   const { currentUser, shiftStatuses: {shiftsAvailable}, setShiftStatuses } = useContext(ShiftContext);

   const handleSubmit = async e => {
      e.preventDefault();
      try {
         const addToDBandSetState = await AddNewShiftToDBandState('http://localhost:3003/shiftsAvailable', shiftDetails, shiftDetails => setShiftStatuses(prv => ({ ...prv, shiftsAvailable: [...shiftsAvailable, shiftDetails] })), pathname)
            .then(() => navigate(`/supervisor/welcome/${currentUser.id}/available shifts`));

      } catch (error) {
         console.error({ message: "handleSubmit ERRROR!!!", location: pathname, error, errorCode: error.code, errorMessage: error.message });
      }
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