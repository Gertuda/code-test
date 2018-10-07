import React, { Component } from "react";
import {
  Button,
  Alert,
  Input,
  FormGroup,
  Label,
  Form
} from "reactstrap";
import axios from "axios";
import { connect } from "react-redux";

import "./TodoList.css";

class TodoList extends Component {
  constructor(props) {
    super(props);

    function generateHours() {
      let hours = [];

      for (let i = 8; i < 18; i++) {
        const key = i >= 10 ? i : `0${i}`;
        hours.push(`${key}:00`);
        hours.push(`${key}:30`);
      }

      hours.pop();
      return hours;
    }

    this.state = {
      todos: [],
      hours: generateHours(),
      jsonTodos: [],
      token: localStorage.getItem("authToken"),
      title: this.props.inputs.title,
      duration: this.props.inputs.duration,
      start: this.props.inputs.start,
      errorMessage: ""
    };
  }

  componentWillMount() {
    this.getTodos();
  }

  getTodos = () => {
    axios
      .get("/todos", { headers: { authtoken: this.state.token } })
      .then(res => {
        this.setState({ todos: res.data.todos });
      })
      .catch(e => {
        if (e.response.status === 401) {
          this.props.history.push("/");
        }
        console.log(e);
      });
  };

  handleGetTodos = () => {
    axios
      .get("/todos/json", { headers: { authtoken: this.state.token } })
      .then(res => {
        this.setState({ jsonTodos: JSON.stringify(res.data, undefined, 2) });
      })
      .catch(e => console.log(e));
  };

  handleLogout = () => {
    const body = {
      title: this.state.title,
      start: this.state.start,
      duration: this.state.duration
    };

    axios
      .post("/users/logout", body, { headers: { authtoken: this.state.token } })
      .then(() => this.props.history.push("/"))
      .catch(e => console.log(e));
  };

  convertStart = value => {
    const start = value.split(":");
    return start[0] * 60 + Number(start[1]) - 480;
  };

  convertDuration = value => {
    const duration = value.split(":");
    return duration[0] * 60 + Number(duration[1]);
  };

  handleRemove = id => {
    axios
      .delete(`todos/${id}`, { headers: { authtoken: this.state.token } })
      .then(() => this.getTodos())
      .catch(e => console.log(e));
  };

  onSubmit = e => {
    e.preventDefault();

    const checkStart = this.convertStart(this.state.start);

    if (checkStart < 0 || checkStart > 540) {
      return this.setState({
        errorMessage: "Chose start time between 8am to 5pm"
      });
    }

    const body = {
      title: this.state.title,
      start: this.state.start,
      duration: this.state.duration
    };

    axios
      .post("/todos", body, { headers: { authtoken: this.state.token } })
      .then(() => {
        this.getTodos();
        this.setState({ errorMessage: "" });
      });
  };

  onChangeTitle = e => {
    const title = e.target.value;
    this.setState({ title });
  };

  onChangeStart = e => {
    const start = e.target.value;
    this.setState({ start });
  };

  onChangeDuration = e => {
    const duration = e.target.value;
    this.setState({ duration });
  };

  renderTodos = () => {
    const todos = this.state.todos.map(item => {
      const start = this.convertStart(item.start);
      const duration = this.convertDuration(item.duration);
      return { ...item, start, duration };
    });

    const newTodos = todos
      .sort((a, b) => (a.start > b.start ? 1 : -1))
      .map((todo, index, array) => {
        const style = {
          top: `${todo.start * 2}px`,
          height: `${todo.duration * 2}px`
        };

        if (index === 0 || index === array.length - 1) {
          return (
            <div
              onClick={() => this.handleRemove(todo._id)}
              style={style}
              className="todo-item"
              key={todo._id}
            >
              <div className="todo-body">{todo.title}</div>
            </div>
          );
        }

        const two = array[index + 1];
        const endPoint = todo.start + todo.duration;

        if (endPoint > two.start) {
          style.left = `${200 * index + 50}px`;
        }
        return (
          <div
            onClick={() => this.handleRemove(todo._id)}
            style={style}
            className="todo-item"
            key={todo._id}
          >
            <div className="todo-body">{todo.title}</div>
          </div>
        );
      });

    return newTodos;
  };

  render() {
    const state = this.state;

    return (
      <div className="todolist-main">
        <div className="todolist">
          {state.hours.map(hour => {
            if (hour.includes("30")) {
              return (
                <div className="todo-hours small" key={hour}>
                  {hour}
                </div>
              );
            }
            return (
              <div className="todo-hours big" key={hour}>
                {hour}
              </div>
            );
          })}
          {this.renderTodos()}
        </div>
        <div className="todolist-menu">
          <Button className="todolist-logout" onClick={this.handleLogout}>
            Logout
          </Button>
          <Form onSubmit={this.onSubmit} className="todolist-form">
            {this.state.errorMessage ? (
              <Alert color="danger">{this.state.errorMessage}</Alert>
            ) : null}
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                value={state.title}
                required
                onChange={this.onChangeTitle}
                type="text"
                name="title"
                id="title"
                placeholder="Title of your todo"
              />
            </FormGroup>
            <FormGroup>
              <Label for="start">Start Time</Label>
              <Input
                value={state.start}
                required
                onChange={this.onChangeStart}
                type="time"
                name="start"
                id="start"
              />
            </FormGroup>
            <FormGroup>
              <Label for="duration">Duration</Label>
              <Input
                value={state.duration}
                required
                onChange={this.onChangeDuration}
                type="time"
                name="duration"
                id="duration"
              />
            </FormGroup>
            <Button>Submit</Button>
          </Form>
          <textarea
            className="todolist-textarea"
            value={this.state.jsonTodos}
            disabled
          />
          <Button onClick={this.handleGetTodos}>Get todos like json</Button>
        </div>
      </div>
    );
  }
}

const mapStateTopProps = state => {
  return {
    inputs: state
  };
};

export default connect(mapStateTopProps)(TodoList);
