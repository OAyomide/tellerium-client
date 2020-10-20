import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Switch, Route } from 'react-router-dom'
import Signin from './views/Login';
import Landing from './views/Landing';
import Market from './views/Market';
import Login from './views/Login';


function App() {
  return (
    <Switch>
      <Route path="/login" component={Login} exact />
      <Route path="/" component={Landing} exact />
      <Route path="/market/:id/" component={Market} />
    </Switch>
  );
}

export default App;
