import React from 'react'

import './Registration.styles.css';

const Registration = ({ text }) => {
   const bgColor = text.toLowerCase() == 'login' ? 'login' : 'signup'
   return (
      <div className={`registration-div ${bgColor}`}>
         <h1 style={{textAlign: 'center'}}>{text}</h1>
      </div>
   )
}

export default Registration