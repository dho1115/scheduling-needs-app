import React from 'react'
import { Button, Form, FormGroup, Input, Label } from 'reactstrap'

const QuestionForm = () => {
   
   return (
      <Form>
         <FormGroup>
            <Label for='title'>TITLE</Label>
            <Input type='text' id='title' placeholder='TITLE OF YOUR QUESTION.' />
         </FormGroup>
         <FormGroup>
            <Label for='body'>MESSAGE</Label>
            <Input type='textarea' id='body' placeholder='Your Message Here.' max={195} />
         </FormGroup>
         <FormGroup>
            <Button size='md' className='w-100' color='danger'>SUBMIT!!!</Button>
         </FormGroup>
      </Form>
   )
}

export default QuestionForm