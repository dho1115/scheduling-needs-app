import React from 'react'
import { Modal, ModalBody, ModalHeader } from 'reactstrap'
import QuestionForm from './QuestionForm'

import "./QuestionFormModal.styles.css";

const QuestionformModal = ({ shiftID, currentUser, modal, toggle, ...args }) => {
   const { name, id: _userID } = currentUser;
   
   return (
      <Modal className='modal-wrapper' isOpen={modal} toggle={toggle}>
         <ModalHeader toggle={toggle} style={{textAlign: 'center', borderBottom: '3px solid black', backgroundColor: 'bisque'}}>
            <strong>Question about Shift# {shiftID}.</strong>
         </ModalHeader>
         <div style={{textAlign: 'center'}}>
            <h3>User: {name}.</h3>
            <h3>_userID: {_userID}.</h3>
         </div>
         <ModalBody className='m-1 modalbody'>
            <QuestionForm {...{...currentUser, shiftID}} />
         </ModalBody>
      </Modal>
   )
}

export default QuestionformModal