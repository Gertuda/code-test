import React, { Component } from 'react';
import { Button, ButtonGroup, Input, FormGroup, Label, Form, FormFeedback } from 'reactstrap';
import axios from 'axios'
import {connect} from 'react-redux'
import { addInputs } from '../../redux/actions'

import bg from '../../img/bg-login.jpg'


import './LoginPage.css'

class LoginPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
        loginType: 'login',
        email: null,
        password: null,
        error: false
    }
  }

  onRadioBtnClick = (loginType) => {
    this.setState({ loginType });
  }

  handleEmail = (e) => {
    const email = e.target.value
    this.setState({email, error: false})
  }

  
  handlePassword = (e) => {
    const password = e.target.value
    this.setState({password, error: false})
  }

  submit = (e) => {
    e.preventDefault()
    const email = this.state.email;
    const password = this.state.password
    
    if (!email || !password) {
        return
    }

    if (this.state.loginType === 'registration') {
        axios.post('/users/registration', {password, email})
        .then((res) => {
            localStorage.setItem('authToken', res.headers.authtoken);
            this.props.dispatch(addInputs(false))
            this.props.history.push('/TodoList')
        })
        .catch(e => console.log('something wrong'))
    } else {
        axios.post('/users/login', {password, email})
        .then(res => {
            localStorage.setItem('authToken', res.headers.authtoken);
            this.props.dispatch(addInputs(res.data.inputs))
            this.props.history.push('/TodoList')
        })
        .catch(e => this.setState({error: true}))
    }
  }

  render() {
    return (
      <div style={{backgroundImage: `url(${bg})`}} className="login-page">
        <div className="login-page-box">
            <Form>
                <ButtonGroup className="login-option">
                    <Button color="primary" onClick={() => this.onRadioBtnClick('registration')} active={this.state.rSelected === 1}>Registration</Button>
                    <Button color="primary" onClick={() => this.onRadioBtnClick('login')} active={this.state.rSelected === 2}>Login</Button>
                </ButtonGroup>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input invalid={this.state.error} onChange={this.handleEmail} type="email" name="email" id="email" placeholder="@email.com" />
                    <FormFeedback>Something Wrong</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="password">Password</Label>
                    <Input onChange={this.handlePassword} type="password" name="password" id="password" placeholder="password" />
                </FormGroup>
                    <Button onClick={this.submit}>
                        {this.state.loginType === "login" ? "Login" : "Registration"}
                    </Button>
            </Form>
        </div>
      </div>
    );
  }
}

  
  export default connect()(LoginPage);