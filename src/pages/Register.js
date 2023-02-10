import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Axios from 'axios';

import { setUser } from '../reducers/user/userSlice';

let stompClient = null;
let errorMessage = "";
export const Register = () => {
  const userField = useRef(null);
  const passwordField = useRef(null);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const wrongUser = () => {
    errorMessage = "User already exist!";
  }

  const handleSubmit = e => {
    e.preventDefault();
    Axios.get("http://localhost:9090/users")
    .then(response => {
      const users = response.data;
      console.log(users);
      const userToLog = users.find(user => user.name === userField.current.value);
      console.log(userToLog);
      if (userToLog) {
        if (userToLog.password === passwordField.current.value) {
          console.warn("User already exist!");
          wrongUser();
          navigate("/register");
        } 
      } else {
        const newUser = {
            name: userField.current.value,
            password: passwordField.current.value,
            connectedStatus : true,
        };
        
        Axios.post("http://localhost:9090/register", newUser)
        .then(response => {
            dispatch(setUser({
              userName : response.data.name,
              password : response.data.password,
              status : response.data.connectedStatus,
              token : response.data.id,
            }));
        }).catch((err) => {
            console.log(err);
        });
            navigate("/chat-selection");
    }
    })

    
}



  return (
    <div className="row justify-content-center">
      <div className="col-6">
        <h2 className="mb-4">REGISTER</h2>
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
          <div className='text-center'>
          <button type="submit" className="btn btn-primary" style={{position: "center"}}>Register</button>
          </div>
          </form>
      </div>
    </div>
  )
}