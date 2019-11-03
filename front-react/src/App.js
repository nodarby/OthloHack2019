import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Assessmentor from './components/Assessmentor'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          
        </header>
        <ul>
          <li><Link to="/all">All</Link></li>
          <li><Link to="/url/2502">PC</Link></li>
          <li><Link to="/url/10002">Book</Link></li>
        </ul>

        <Route path="/all" component={Assessmentor} />
        <Route 
         path="/url/:id"
         render={
           ({ match }) => <Assessmentor urlId = {match.params.id} />
         }
        /> 
      </div>
    );
  }
  
}

export default App;
