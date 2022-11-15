// frontend/src/components/LoginFormModal/LoginForm.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import './loginForm.css'

function LoginForm({setShowModal}) {
  console.log('correct one')
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation()
    setErrors([]);

    return dispatch(sessionActions.login({ credential, password }))
    .then(() => {
      // console.log('in the then')
      setShowModal(false)
    })
    .catch(
      async (res) => {
        const data = await res.json();
        // console.log('in the catch', (data && data.errors))
        if (data && data.errors) setErrors(data.errors);
      }
    );
  };

  return (

    <form onSubmit={handleSubmit}>
      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      <label>
        Username or Email
        <input
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      <div>
      <button type="submit">Log In</button>
      </div>
      <div >
      <button  type="submit"
      onClick={()=>{setCredential("Demo-lition");setPassword("password")}}>Demo Login</button>
      </div>
    </form>
  );
}

export default LoginForm;