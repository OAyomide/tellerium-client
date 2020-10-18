import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Switch, Route } from 'react-router-dom'
import Signin from './views/Signin';
import Landing from './views/Landing';
import Market from './views/Market';


function App() {
  return (
    <Switch>
      <Route path="/signup" component={Signin} exact />
      <Route path="/" component={Landing} exact />
      <Route path="/market/:id/" component={Market} />
    </Switch>
  );
}

export default App;
