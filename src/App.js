import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { API_ENDPOINT } from './constants';

const styles = {
  title: {
    textAlign: 'center', 
    paddingTop: '18px'
  },
  row: {
    margin: 20, 
    marginBottom: 10
  },
  form: {
    width: '50%', 
    margin: 'auto', 
    background: '#fbf6f6', 
    borderRadius: 10, 
    padding: 35
  },
  container: {
    height: 350, 
    overflow: 'auto'
  }
}

function App() {
  const AUTH = 'AAAAAAAAAAAAAAAAAAAAAGPtVgEAAAAAY%2BrLwKlP7Q644eUys90YSMVsqvQ%3D4WgtgNooasdJWB9uBIRgBy5WzZRuvo362IIeWm0XK4ceHSHzuY';

  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [errors, setError] = useState("");

  const setValues = (event) => {
    setUserName(event.target.value);
  }

  // JUST for Demo purpose -> not handled all use cases
  const fetchUserData = () => {
    axios.get(`${API_ENDPOINT}/getUser?username=${userName}`, {
      headers: {
        authorization: AUTH
      }
    })
      .then((rsp) => {
        if (rsp.data.errors && rsp.data.errors[0].detail) {
          setError(rsp.data.errors);
        }
        setUserId(rsp.data.data.id);
      })
      .catch(err => {
        setUserId(null);
      });
  }

  // JUST for Demo purpose -> not handled all use cases
  const fetchTweetsData = () => {
    axios.get(`${API_ENDPOINT}/getTweets?id=${userId}&count=10`, {
      headers: {
        authorization: AUTH
      }
    })
      .then((rsp) => {
        setTweets(rsp.data.data);
      })
      .catch(err => {
        setTweets([]);
      });
  }

  const clear = () => {
    setUserId(null);
    setUserName("");
    setTweets([]);
    setError(null);
  }

  return (
    <Container>
      <h3 style={styles.title}> Twitter API Demo </h3>
      <Row style={styles.row}>
        <Form style={styles.form}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>User Name</Form.Label>
            <Form.Control type="email" placeholder="Enter Username" value={userName} onChange={setValues} />
            {errors && (
              <Form.Text className="text-muted">
                {errors[0].detail}
              </Form.Text>
            )}
          </Form.Group>

          <Button variant="primary" onClick={fetchUserData} disabled={!userName}>
            Search User
          </Button>
          <Button variant="primary" style={{ marginLeft: 8 }} onClick={clear} disabled={!userName}>
            Clear
          </Button>
          {userId && (
            <Container style={{ padding: '16px 0px' }}>
              <hr />
              <p style={{ margin: 0 }}> Username: {userName}</p>
              <p style={{ margin: 0 }}> UserId: {userId}</p>
              <Button style={{ marginTop: 8 }}variant="primary" onClick={fetchTweetsData} disabled={!userName}>
                Get Last 10 Tweets
              </Button>
            </Container>
            )
          }
          {
            tweets.length > 0 && (
              <Container style={styles.container}>
                <hr />
                {tweets.map((each, index) => (
                  <Alert key={index} variant="primary">
                    {each.text}
                  </Alert>
                ))}
              </Container>
            )
          }
        </Form>
      </Row>
    </Container>
  );
}

export default App;
