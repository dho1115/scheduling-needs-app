import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Form, FormGroup, Input, Label } from 'reactstrap';
import { ShiftContext } from '../../../../App';
import { SupervisorPageContext } from '../../../../pages/supervisor/SupervisorPage';
import { DateTime } from 'luxon';
import { fb_addOneDocument } from '../../../../functions/firebase/crud_basic';
import uniqid from 'uniqid';
import "./AddShift.styles.css";

const AddShift = () => {
   const navigate = useNavigate();
   const { pathname } = useLocation();
   const shiftID = uniqid('shift-');
   const [shiftDetails, setShiftDetails] = useState({ id: shiftID, storeNumber: '', date: '', time: {start: '', end: ''} });
   const { currentUser, shiftStatuses: { shiftsAvailable }, setShiftStatuses } = useContext(ShiftContext);
   const { newShiftAdded, setNewShiftAdded } = useContext(SupervisorPageContext);
   
   const minDate = DateTime.now().toFormat('yyyy-MM-dd');

   const handleSubmit = async e => {
      e.preventDefault();
      try {
         const new_shift = shiftDetails;
         const { _documentID: _id, newDataObject } = await fb_addOneDocument("Shifts Available", new_shift, new_shift.id, pathname)
         newDataObject && setNewShiftAdded(true);
         newDataObject && setShiftStatuses(prv => ({ ...prv, shiftsAvailable: [...prv.shiftsAvailable, newDataObject] }));
         navigate(`/supervisor/welcome/${currentUser.id}/`);
      } catch (error) {
         console.error({ message: "handleSubmit ERRROR!!!", location: pathname, error, errorCode: error.code, errorMessage: error.message });
      }
   };

   useEffect(() => {
      return () => {
         setShiftDetails({ id: '', storeNumber: '', date: '', time: '' })
         setNewShiftAdded(false);
      };
   }, [])
  return (
   <Form onSubmit={handleSubmit} className='add-shift-form p-3 m-1'>
      <FormGroup>
         <Label for='storeNumber'>STORE NUMBER</Label>
         <Input type='number' id='storeNumber' value={shiftDetails.storeNumber} placeholder='store number' required onChange={e => setShiftDetails(prv => ({...prv, storeNumber: e.target.value}))} />
      </FormGroup>
      <FormGroup>
         <Label for='shift_date'>DATE</Label>
         <Input type='date' id='shift_date' value={shiftDetails.date} min={minDate} placeholder='date of shift' required onChange={e => setShiftDetails(prv => ({...prv, date: e.target.value}))} />
      </FormGroup>
      <FormGroup>
         <Label for='start_time'>START TIME</Label>
         <Input type='time' id='start_time' value={shiftDetails.time.start} required onChange={e => setShiftDetails(prv => ({...prv, time: {...prv.time, start: e.target.value}}))} />
      </FormGroup>
      <FormGroup>
         <Label for='end_time'>END TIME</Label>
         <Input type='time' id='end_time' value={shiftDetails.time.end} required onChange={e => setShiftDetails(prv => ({...prv, time: {...prv.time, end: e.target.value}}))} />
      </FormGroup>
      <FormGroup>
         <button type="submit" className="btn btn-danger btn-lg btn-block w-100">SUBMIT</button>
      </FormGroup>
   </Form>
  )
}

export default AddShift