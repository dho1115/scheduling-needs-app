import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

//Dependencies.
import { PostRequest } from '../../../functions/postRequest';
import { ShiftContext } from '../../../App';
import { NavigationLinks } from './NavigationLinks';
import ErrorBoundary from '../../ErrorBoundary';
import { fb_fs_SignOutProcess } from '../../../functions/firebase/miscellaneous';

import './NavigationBar.styles.css';

const NavigationBar = () => {
  const { currentUser, setCurrentUser, shiftStatuses, setShiftStatuses } = useContext(ShiftContext);
  const { shiftsWithApplicants, shiftsAvailable, shiftsPendingConfirmation } = shiftStatuses;
  const { id, role } = currentUser;  
  const navigate = useNavigate();
  const location = useLocation();
  
  const [navigationLinks, setNavigationLinks] = useState([]);
  const [candidatesPendingShifts, setCandidatesPendingShifts] = useState([])
  
  useEffect(() => setNavigationLinks(NavigationLinks({ id, role }, shiftsWithApplicants.length ? `candidates` : '')), []);

  useEffect(() => {
    const pendingshifts = shiftsPendingConfirmation.filter(({ applicant: { id } }) => id == currentUser.id);

    pendingshifts.length && setCandidatesPendingShifts(pendingshifts);
    return () => {
      setCandidatesPendingShifts([])
    };
  }, [candidatesPendingShifts.length, currentUser.id])

  return (
    <nav className='navigation p-3'>
      <ErrorBoundary fallback={<h1>COMPILE TIME ERROR IN NavigationBar.jsx!!!</h1>}>
        {
          navigationLinks.length ?
            navigationLinks
            .filter(({ restrictions }) => restrictions == role || !restrictions)
            .map(({ name, to }, idx) => {
              if (name == 'unconfirmed shifts') {
                if (shiftsPendingConfirmation.length > 0) name = "FOLLOW UP ON UNCONFIRMED SHIFTS!!!"
              }
              
              return (
                <Link to={to} key={idx} className='navlink'>
                  {
                    name == "YOU'VE GOT CANDIDATES!!!" ?
                      <h3 className='text-danger' style={{WebkitTextStrokeColor: 'lightgreen', WebkitTextStrokeWidth: '.5px'}}>{name}</h3>
                      :
                      <strong>{name}</strong>
                  }
                </Link>
              ) //1. Filter out links based on restrictions (see NavigationLinks.jsx for the restrictions). 2. .map() out the results into links.
            })
            : 
            ["No...", "NavigationLinks", "Yet!!!"]
        }
        <strong className='logoff' onClick={() => fb_fs_SignOutProcess(
          currentUser.id,
          () => setCurrentUser({ id: '', name: '', password: '', role: '' }),
          currentUser,
          location.pathname
        )}>LOG OUT!!!</strong>
      </ErrorBoundary>
    </nav>
  )
}

export default NavigationBar