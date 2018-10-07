import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import LoginPage from '../components/LoginPage/LoginPage'
import TodoList from '../components/TodoList/TodoList'

const AppRouter = () => (
  <Router>
    <div>
      <Switch>
        <Route path="/" component={LoginPage} exact />
        <Route path="/TodoList" component={TodoList} />
        {/* <Route path="/AddNewUser/:id" component={AddNewUser} />
        <Route path="/UserPage/:id" component={UserPage} />
        <Route path="/AddNewUser" component={AddNewUser} />
        <Route component={NotFoundPage} /> */}
      </Switch>
    </div>
  </Router>
);

export default AppRouter;