import React, { useState, useEffect } from 'react';
import $ from 'jquery';

// import logo from './logo.svg';
import './App.css';

import { Switch, BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import myjotbot from './assets/myjotbot-signin-main.jpeg'

import {
  Container,
  makeStyles,
  ThemeProvider
} from '@material-ui/core'
import styled from 'styled-components';

import theme from './utils/theme';

import { Auth, Hub } from 'aws-amplify';

import SignUp from './components/Authentication/SignUp';
import ConfirmSignUp from './components/Authentication/ConfirmSignUp';
import SignIn from './components/Authentication/SignIn';
import SignOut from './components/Authentication/SignOut';

import logo from './assets/SFSA-06.png';

import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AddUser from './pages/AddUser'
import AddPlant from './pages/AddPlant'
import Search from './pages/Search'
import Transcribe from './Transcribe'
import Chatbot from './components/Chatbot/Chatbot'
import Scheduler from './components/Scheduler/Scheduler'

const initialFormState = {
  username: '',
  password: '',
  firstname: '',
  lastname: '',
  // email: '',
  authCode: '',
  formType: 'signUp'
}


const useStyles = makeStyles({
    root: {
      textAlign: 'center',
      padding: '40px',
      marginTop: '10px'
    },
    heading: {
      textAlign: 'center',
      fontSize: '80px',
      color: 'white',
      marginBottom: '50px',
      padding: '100px 80px',
      // backgroundImage: `url(${process.env.PUBLIC_URL + '/assets/small-plant.jpeg'})`,
      backgroundImage: `url('./assets/myjotbot-signin-main.jpeg')`,
      // backgroundImage: `url(${'./assets/myjotbot-signin-cropped.png'})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    },
    icon: {
      height: '100%',
      width: '90%',
      paddingLeft: '100px',
      // alignItems: 'center',
      marginTop: '50px',
      marginBottom: '50px'
    },
    container: {
      paddingLeft: '1em',
      paddingRight: '1em',
    },
    SignInContainer: {
      paddingLeft: '12em',
      paddingRight: '12em'
    }
});

const Home = () => {
  return (
    <h1>Home</h1>
  )
}

function App() {

  const [formState, updateFormState] = useState(initialFormState);
  const [user, updateUser] = useState(null);

  const history = useHistory()

  const classes = useStyles();

  useEffect(() => {
    checkUser();
    setAuthListener();
  }, [])

  async function setAuthListener() {
    Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signOut':
          console.log(data);
          updateFormState(() => ({ ...formState, formType: "signUp" }));
          break;
        default:
          break;
      }
    })
  }


  async function checkUser() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      console.log('user: ', user);
      updateUser(user);
      updateFormState(() => ({ ...formState, formType: "signedIn" }));
    } catch(err) {
    }
  }

  const onChange = e => {
    e.persist()
    updateFormState(() => ({ ...formState, [e.target.name]: e.target.value }))
  }

  const { formType } = formState

  async function signUp() {
    const { username, password, firstname, lastname } = formState;
    console.log(`username: ${username}`);
    console.log(`password: ${password}`);
    console.log(`firstname: ${firstname}`);
    console.log(`lastname: ${lastname}`);
    await Auth.signUp({ username, password, attributes: { 'custom:firstname': firstname, 'custom:lastname': lastname } }).then(res => console.log(res))
    updateFormState(() => ({ ...formState, formType: "confirmSignUp" }))
  }

  async function confirmSignUp() {
    const { username, authCode } = formState;
    await Auth.confirmSignUp(username, authCode);
    updateFormState(() => ({ ...formState, formType: "signIn" }));
  }

  async function signIn() {
    const { username, password } = formState;
    await Auth.signIn(username, password);
    updateFormState(() => ({ ...formState, formType: "signedIn" }));
    history.push("/")
  }


  return (
    <>
    
    <div className="App">
      <Container maxWdith="md" className={classes.container}>
      {/* <img src={logo} className={classes.icon}/> */}
      {
        formType === 'signUp' && (
          <>
            {/* <h1 className={classes.heading}>My JotBot</h1> */}
            <img src={myjotbot} className={classes.icon} alt='myjotbot'/>
            <div className={classes.SignInContainer}>
            <SignUp 
              signUp={signUp}
              onChange={onChange}
              formState={formState}
              updateFormState={updateFormState}
            />
            </div>
          </>
        )
      }

      {
        formType === 'confirmSignUp' && (
          <>
          {/* <h1 className={classes.heading}>My JotBot</h1> */}
          <img src={myjotbot} className={classes.icon} alt='myjotbot'/>
          <div className={classes.SignInContainer}>
          <ConfirmSignUp
            onChange={onChange}
            confirmSignUp={confirmSignUp}
          />
          </div>
          </>

        )
      }

      {
        formType === 'signIn' && (
          <>
          {/* <h1 className={classes.heading}>My JotBot</h1> */}
          <img src={myjotbot} className={classes.icon} alt='myjotbot'/>
          <div className={classes.SignInContainer}>
          <SignIn
            signIn={signIn}
            onChange={onChange}
            formState={formState}
            updateFormState={updateFormState}
          />
          </div>
          </>
        )
      }
      </Container>
      {
        formType === 'signedIn' && (
          <>
            <ThemeProvider theme={theme}>
                <Layout>
                  <Switch>
                    <Route exact path="/" >
                      <HomePage />
                    </Route>
                    <Route exact path="/adduser" >
                      <AddUser />
                    </Route>  
                    <Route exact path="/addplant" >
                      <AddPlant />
                    </Route> 
                    <Route exact path="/search" >
                      <Search />
                    </Route>
                    <Route exact path="/transcribe" >
                      <Transcribe />
                    </Route>
                    <Route exact path="/chatbot">
                      <Chatbot />
                    </Route>
                    <Route exact path="/scheduler">
                      <Scheduler />
                    </Route>
                  </Switch>
                </Layout>
            </ThemeProvider>
          </>
        )
      } 

    </div>
    
    </>
  );
}

export default App;
