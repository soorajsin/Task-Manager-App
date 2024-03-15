import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./mix.css";
import apiURL from "../config";

const Register = () => {
  const api = apiURL.url;
  const pageNavigate = useNavigate();
  const [sendData, setSendData] = useState({
    email: "",
    password: ""
  });

  const changeData = (e) => {
    setSendData({
      ...sendData,
      [e.target.name]: e.target.value
    });
  };
  console.log(sendData);

  const submitToRegister = async (e) => {
    e.preventDefault();

    const { email, password } = sendData;

    if (!email || !password) {
      alert("Please enter all fields");
    } else if (!email.includes("@")) {
      alert("Emial invaled Eg abc@gmail.com");
    } else if (password.length < 6) {
      alert("Please enter password  must be 6");
    } else {
      console.log("login");
      const data = await fetch(`${api}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(sendData)
      });
      const res = await data.json();
      // console.log(res);
      if (res.status === 201) {
        alert("Email is not Exist");
      } else if (res.status === 202) {
        alert("Password not matched");
      } else if (res.status === 203) {
        console.log(res);
        localStorage.setItem("token", res.data.token);
        pageNavigate("/home");
        window.location.reload();
      }
    }
  };

  return (
    <>
      <div className="reg">
        <div className="regCon">
          <div className="form">
            <h1>Welcome to Login</h1>
          </div>
          <div className="form">
            <label htmlFor="email">Email</label>
            <br />
            <input
              type="email"
              name="email"
              value={sendData.email}
              onChange={changeData}
              placeholder="Enter email here ..."
            />
          </div>
          <div className="form">
            <label htmlFor="password">Password</label>
            <br />
            <input
              type="password"
              name="password"
              value={sendData.password}
              onChange={changeData}
              placeholder="Enter password here ..."
            />
          </div>
          <div className="form">
            <button onClick={submitToRegister}>Login</button>
          </div>
          <div className="form">
            <p>
              I have not account ? <NavLink to={"/register"}>Register</NavLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
