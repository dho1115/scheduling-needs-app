import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//Dependencies.
import { PostCurrentUser } from '../../functions/postRequest';
import { ShiftContext } from '../../App';

import './NavigationBar.styles.css';

const NavigationBar = () => {
  const { currentUser } = useContext(ShiftContext);
  const navigate = useNavigate();
  
  const handleLogoff = () => PostCurrentUser(
    'http://localhost:3003/currentUser',
    { id: '', name: '', password: '', role: '', base: '' }
  )
    .then(result => {
      console.log(`Successfully logged out!!! currentUser is ${JSON.stringify(currentUser)}. Result is: ${result}.`)
      navigate("/")
    })
    .catch(error => console.error({ message: 'error on handleLogoff function!!!', error, errorCode: error.code, errorStatus: error.status, errorMessage: error.message }));

  return (
      <nav className='navigation p-3'>
         <strong><Link to="/" className='navlink'>Login Page</Link></strong>
         <strong><Link to="/supervisor/available shifts" className='navlink'>View Available Shifts</Link></strong>
         <strong>Add Shift</strong>
         <strong>Cancel Available Shift</strong>
         <strong className='logoff' onClick={handleLogoff}>LOG OUT!!!</strong>
      </nav>
  )
}

export default NavigationBar