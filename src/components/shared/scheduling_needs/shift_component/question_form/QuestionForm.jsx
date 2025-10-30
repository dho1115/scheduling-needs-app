import React, { useState } from 'react'
import { Button, Form, FormGroup, Input, Label } from 'reactstrap'

import "./QuestionFormModal.styles.css";

const QuestionForm = (props) => {
   const [questionForm, setQuestionForm] = useState({submitted_by: `${props.name} (id# ${props.id})`, shiftID: props.shiftID, store: props.storeNumber, title: '', body: '' });

   const onHandleSubmit = e => {
      e.preventDefault();
      try {
         console.log("===== YOUR QUESTION DETAILS: =====");
         console.log(JSON.stringify(questionForm));
         console.log("==================================")
         alert(`Your Question:\n ${JSON.stringify(questionForm)}.`)
      } catch (error) {
         console.error({ message: "QuestionForm Error!!!", error, errorMessage: error.message });
      }
   }
   return (
      <Form className='question-form p-3' onSubmit={onHandleSubmit}>
         <FormGroup>
            <Label for='title'>TITLE</Label>
            <Input type='text' id='title' value={questionForm.title} placeholder='TITLE OF YOUR QUESTION.' onChange={e => setQuestionForm(prv => ({...prv, title: e.target.value}))}/>
         </FormGroup>
         <FormGroup>
            <Label for='body'>MESSAGE</Label>
            <Input type='textarea' id='body' value={questionForm.body} placeholder='Your Message Here.' max={195} onChange={e => setQuestionForm(prv => ({...prv, body: e.target.value}))} />
         </FormGroup>
         <FormGroup>
            <Button type='submit' size='md' className='w-100' color='danger'>SUBMIT!!!</Button>
         </FormGroup>
      </Form>
   )
}

export default QuestionForm