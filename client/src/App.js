import React from 'react';
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Login from './components/login';
import Dashboard from './components/dashboard';
import Details from './components/details';

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Dashboard} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/task/:id" render={(props) => <Details {...props} />} />
    </Switch>
  </Router>
);
export default App;
