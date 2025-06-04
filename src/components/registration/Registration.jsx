import React from 'react'
import { useLocation } from 'react-router-dom';
import ErrorBoundary from '../ErrorBoundary';

import './Registration.styles.css';

const Registration = ({ text, toggle }) => {
   const bgColor = text.toLowerCase() == 'login' ? 'login' : 'signup';
   const location = useLocation();

   try {
      return (
         <ErrorBoundary fallback={<h1>Oops... something went wrong in {location.pathname}.</h1>}>
            <div style={{width: '50%'}}>
               <div className={`registration-div ${bgColor}`} onClick={toggle}>
                  <h1 style={{textAlign: 'center'}}>{text}</h1>
               </div>
            </div>            
         </ErrorBoundary>
      )
   } catch (error) {
      return (
         <div>
            <h1>ERROR INSIDE {location.pathname}: {JSON.stringify({error, errorCode: error.code, errorMessage: error.message})}</h1>
         </div>
      )
   }

   
}

export default Registration