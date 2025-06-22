import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

//Dependencies.
import { PostCurrentUser } from '../../functions/postRequest';
import { ShiftContext } from '../../App';
import { NavigationLinks } from './NavigationLinks';
import ErrorBoundary from '../ErrorBoundary';

import './NavigationBar.styles.css';

const NavigationBar = () => {
  const { currentUser, setCurrentUser } = useContext(ShiftContext);
  const { id, role } = currentUser;  
  const navigate = useNavigate();
  
  const handleLogoff = () => PostCurrentUser(
    'http://localhost:3003/currentUser',
    { id: '', name: '', password: '', role: '', base: '' }
  )
    .then(() => {
      setCurrentUser({ id: '', name: '', password: '', role: '' });
    })
    .then(() => navigate("/"))
    .catch(error => console.error({ message: 'error on handleLogoff function!!!', error, errorCode: error.code, errorStatus: error.status, errorMessage: error.message }));

  return (
    <nav className='navigation p-3'>
      <ErrorBoundary fallback={<h1>COMPILE TIME ERROR IN NavigationBar.jsx!!!</h1>}>
        {
          NavigationLinks({ id, role })
            .filter(({restrictions}) => restrictions == role || !restrictions)
            .map(({ name, to }, idx) => {
              return (
                <Link to={to} key={idx} className='navlink'>
                  <strong>{name}</strong>
                </Link>
              ) //1. Filter out links based on restrictions (see NavigationLinks.jsx for the restrictions). 2. .map() out the results into links.
            })
        }
        <strong className='logoff' onClick={handleLogoff}>LOG OUT!!!</strong>
      </ErrorBoundary>
    </nav>
  )
}

export default NavigationBar