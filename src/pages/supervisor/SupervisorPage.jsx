import { createContext, Suspense, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../../components/shared/navigation-bar/NavigationBar';
import { ShiftContext } from '../../App';
import { Container } from 'reactstrap';

import "./SupervisorPage.styles.css";

export const SupervisorPageContext = createContext();

const SupervisorPage = () => {
  const { currentUser } = useContext(ShiftContext);
  const [newShiftAdded, setNewShiftAdded] = useState(false);
  
  return (
    <div>
      <SupervisorPageContext.Provider value={{newShiftAdded, setNewShiftAdded}}>
        <Suspense fallback={<h1>Loading data... please wait while we load {JSON.stringify(currentUser)}.</h1>}>
          <NavigationBar />
          <div className='p-1'>
            <h3>Welcome to your page, <span style={{color: 'red'}}>{currentUser.name}</span>!!!</h3>
          </div>
          <Container>
            <Outlet />
          </Container>
        </Suspense>
      </SupervisorPageContext.Provider>
            
    </div>
  )
}

export default SupervisorPage