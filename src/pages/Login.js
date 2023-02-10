import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { setUser } from '../reducers/user/userSlice';

import Axios from 'axios';

let errorMessage = "";

export const Index = () => {

  const userField = useRef(null);
  const passwordField = useRef(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const wrongUser = () => {
    errorMessage = "Wrong user or password!";
  }

  const handleSubmit = e => {
    e.preventDefault();
    Axios.get("http://localhost:9090/users")
      .then(response => {
        const users = response.data;
        console.log(users);
        const userToLog = users.find(user => user.name === userField.current.value);
        if (userToLog) {
          if (userToLog.password === passwordField.current.value) {
            dispatch(setUser({
              userName : userToLog.name,
              password : userToLog.password,
              status : userToLog.connectedStatus,
              token : userToLog.id,
            }))
            navigate("/chat-selection");
          } 
        } else {
          console.warn("Wrong user or password");
          wrongUser();
          navigate("/");
        }
      })
  }
  return (
    <div className="row justify-content-center">
      <div className="col-6">
        <h2 className="mb-4">LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">User Name</label>
            <input type="text" placeholder = "User name" className="form-control" ref={userField} />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" placeholder = "Password" className="form-control" ref={passwordField} />
          </div>
          <h3 className = "row justify-content-center" style={{fontSize : "1em", color:"red"}}>{errorMessage}</h3>
          <div className="mb-3 text-center">
            <button type="submit" className="btn btn-primary">Log in</button>
          </div>
        </form>
        <form onSubmit = {() => navigate("/register")}>
          <div className="mb-3 text-center">
            <button type="submit" className="btn btn-success">Register</button>
            
          </div>
        </form>
      </div>
    </div>
  )
}