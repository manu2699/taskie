import React from 'react';
import AuthContextProvider from "./context/AuthContext";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Login from './components/login';
import Dashboard from './components/dashboard';
import Details from './components/details';

const App = () => (
  <AuthContextProvider>
    <Router>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/task/:id" render={(props) => <Details {...props} />} />
      </Switch>
    </Router>
  </AuthContextProvider>
);
export default App;
