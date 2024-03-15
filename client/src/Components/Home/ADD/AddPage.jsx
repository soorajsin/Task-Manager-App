import React, { useState } from "react";
import "./AddPage.css";
import { NavLink, useNavigate } from "react-router-dom";
import apiURL from "../../config";

const AddPage = () => {
  const api = apiURL.url;
  const pageNavigate = useNavigate();
  const [sendData, setSendData] = useState({
    title: "",
    description: ""
  });

  const changedata = (e) => {
    setSendData({
      ...sendData,
      [e.target.name]: e.target.value
    });
  };
  console.log(sendData);

  const submitToAdd = async (e) => {
    e.preventDefault();

    const { title, description } = sendData;
    if (!title || !description) {
      alert("Please enter all fields");
    } else {
      console.log("add");
      const token = await localStorage.getItem("token");
      const data = await fetch(`${api}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({ sendData })
      });
      const res = await data.json();
      // console.log(res);
      if (res.status === 208) {
        console.log(res);
        pageNavigate("/home");
      } else {
        alert("Note not add");
      }
    }
  };

  return (
    <>
      <div className="reg">
        <div className="regCon">
          <div className="form">
            <h2>Welcome to Add Notes</h2>
          </div>
          <div className="form">
            <label htmlFor="title">Title</label>
            <br />
            <input
              type="title"
              name="title"
              onChange={changedata}
              value={sendData.title}
              placeholder="Enter title here ..."
            />
          </div>
          <div className="form">
            <label htmlFor="description">Description</label>
            <br />
            <textarea
              name="description"
              onChange={changedata}
              value={sendData.description}
              placeholder="Enter description here ...."
              cols="30"
              rows="2"
            ></textarea>
          </div>
          <div className="form">
            <button onClick={submitToAdd}>Submit</button>
          </div>
          <div className="form">
            <p>
              <NavLink to={"/home"}>Cancel</NavLink>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPage;
