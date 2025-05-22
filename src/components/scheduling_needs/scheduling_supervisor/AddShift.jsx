import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label } from 'reactstrap';
import uniqid from 'uniquid';

const AddShift = ({modal, toggle}) => {
  return (
    <Modal
      isOpen={modal}
      backdrop='static'
      toggle={toggle}
    >
      <ModalHeader toggle={toggle}>
         <h1>ADD NEW SHIFT</h1>
      </ModalHeader>
      <ModalBody>
         <Form onSubmit={e => {
            e.preventDefault();
            console.log("New Shift Added!!!")
         }}>
            <FormGroup>
               <Label for='shiftdate'>SHIFT DATE</Label>
               <Input type='date' id='shiftdate' />
            </FormGroup>
            <FormGroup>
               <Label for='shifttime'>SHIFT TIME</Label>
               <Input type='text' id='shifttime' placeholder='enter the time' />
            </FormGroup>
            <FormGroup>
               <Label for='storenumber'>STORE NUMBER</Label>
               <Input type='number' id='storenumber' placeholder='store number' />
            </FormGroup>
            <FormGroup>
               <Label for='supervisorcomments'>COMMENTS</Label>
               <Input type='textarea' id='supervisorcomments' maxlength={175} />
            </FormGroup>
            <FormGroup>
               <button type="submit" className="btn btn-danger btn-lg btn-block">SUBMIT SHIFT</button>
            </FormGroup>
         </Form>
      </ModalBody>
    </Modal>
  )
}

export default AddShift