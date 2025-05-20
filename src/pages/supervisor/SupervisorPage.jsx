import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';

//Components.
import SchedulingNeeds from '../../components/scheduling_needs/SchedulingNeeds';

import { ShiftContext } from '../../App';

import "./SupervisorPage.styles.css";

const SupervisorPage = () => {
  //Scheduling Needs list.
  //Scheduling Needs applicants.
  //Scheduling Needs award/rejection.

  const shift = useContext(ShiftContext);

  return (
    <div>
      <nav className='SupervisorPage-nav'>
        <strong>View Available Shifts</strong>
        <strong>Add Shift</strong>
        <strong>Cancel Available Shift</strong>
      </nav>

      <Outlet />
    </div>
  )
}

export default SupervisorPage