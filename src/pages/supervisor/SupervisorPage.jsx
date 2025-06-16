import React, { useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';

import { ShiftContext } from '../../App';

import "./SupervisorPage.styles.css";

const SupervisorPage = () => {
  //Scheduling Needs list.
  //Scheduling Needs applicants.
  //Scheduling Needs award/rejection.

  const {currentUser, setCurrentUser, shiftsArray, setShiftsArray} = useContext(ShiftContext);

  return (
    <div>
      <nav className='SupervisorPage-nav p-3'>
        <strong><Link to="/">Login Page</Link></strong>
        <strong><Link to="/supervisor/available shifts">View Available Shifts</Link></strong>
        <strong>Add Shift</strong>
        <strong>Cancel Available Shift</strong>
        <strong>LOG OUT!!!</strong>
      </nav>
      <div>
        <h3>Welcome to your page, <span style={{color: 'red'}}>{currentUser.name}</span>!!!</h3>
      </div>
      <Outlet />
    </div>
  )
}

export default SupervisorPage