import { Link } from 'react-router-dom';

//Dependencies.
import { PostCurrentUser } from '../../functions/postRequest';

import './NavigationBar.styles.css';


const NavigationBar = () => {
  const handleLogoff = () => PostCurrentUser(
    'http://localhost:3003/currentUser',
    { id: '', name: '', password: '', role: '', base: '' }
  );

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