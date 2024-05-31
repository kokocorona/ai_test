import React, { useRef } from 'react'
import axios from 'axios';

export default function Login() {
  // useRef - מאפשר בדרך קלה יותר לשלוף את המידע
  // 
  const emailRef = useRef();
  const passwordRef = useRef();

  const onSub = async(e) => {
    e.preventDefault();
    const bodyData = {
      email:emailRef.current.value,
      password:passwordRef.current.value
    }

    try {
      // מאפשר לשמור קוקיס דרך אקסיוס במחשב של המשתמש
      axios.defaults.withCredentials = true;
      // בקשת אקסיוס עם מיטודה פוסט
      const {data} = await axios({
        url:"http://localhost:3001/users/login",
        method:"POST",
        data:bodyData
      })
      console.log(data);
    } catch (error) {
      alert("Password or email not match")
      console.log(error);
    }

    console.log(bodyData);
  }

  return (
    <div className='container'>
      <h1>Log in form</h1>
      <form onSubmit={onSub} className='col-md-6 p-2'>
        <label>Email:</label>
        <input ref={emailRef} type="email" className='form-control' />
        <label>Password:</label>
        <input ref={passwordRef} type="password" className='form-control' />
        <button className='btn btn-success mt-3'>Log in</button>
      </form>
    </div>
  )
}
