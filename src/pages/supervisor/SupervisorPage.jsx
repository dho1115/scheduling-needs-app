import { Suspense, useContext } from 'react';
import { Outlet, Link } from 'react-router-dom';
import NavigationBar from '../../components/shared/navigation-bar/NavigationBar';
import { ShiftContext } from '../../App';
import { Container } from 'reactstrap';

import "./SupervisorPage.styles.css";

const SupervisorPage = () => {
  //Scheduling Needs list.
  //Scheduling Needs applicants.
  //Scheduling Needs award/rejection.

  const { currentUser, setCurrentUser, shiftsArray, setShiftsArray } = useContext(ShiftContext);
  
  return (
    <div>
      <Suspense fallback={<h1>Loading data... please wait while we load {JSON.stringify(currentUser)}.</h1>}>
        <NavigationBar />
        <div className='p-1'>
          <h3>Welcome to your page, <span style={{color: 'red'}}>{currentUser.name}</span>!!!</h3>
        </div>
        <Container>
          <Outlet />
        </Container>
      </Suspense>      
    </div>
  )
}

export default SupervisorPage