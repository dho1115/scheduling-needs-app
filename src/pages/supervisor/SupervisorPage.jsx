import React, { useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';

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
        <strong><Link to="/">Login Page</Link></strong>
        <strong><Link to="/supervisor/available shifts">View Available Shifts</Link></strong>
        <strong>Add Shift</strong>
        <strong>Cancel Available Shift</strong>
      </nav>

      <Outlet />
    </div>
  )
}

export default SupervisorPage