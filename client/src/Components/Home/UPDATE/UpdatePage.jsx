import React, { useCallback, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import apiURL from "../../config";
import { useState } from "react";

const UpdatePage = () => {
  const api = apiURL.url;
  const pageNavigate = useNavigate();
  const { addNoteId } = useParams();
  //   console.log(addNoteId);
  const updateAuth = useCallback(async () => {
    const token = await localStorage.getItem("token");
    const data = await fetch(`${api}/validator`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    });
    const res = await data.json();
    if (res.status === 205) {
      //   console.log(res);
      const checkIndex = await res.data.addNotes.find(
        (addNotes) => addNotes._id.toString() === addNoteId
      );
      //   console.log("Checked  ", checkIndex);
      if (!checkIndex) {
        console.log(" wrong index");
      } else {
        setSendData({
          title: checkIndex.title,
          description: checkIndex.description
        });
      }
    } else {
      console.log("user not found");
    }
  }, [api, addNoteId]);

  useEffect(() => {
    updateAuth();
  }, [updateAuth]);

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

  const updateNotesItem = async () => {
    const { title, description } = sendData;
    if (!title || !description) {
      alert("Please enter all fields");
    } else {
      console.log("done");
      const token = await localStorage.getItem("token");
      const data = await fetch(`${api}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({ sendData, addNoteId })
      });
      const res = await data.json();
      //   console.log(res);
      if (res.status === 203) {
        console.log(res);
        pageNavigate("/home");
      } else {
        alert("Not update notes");
      }
    }
  };

  return (
    <>
      <div className="reg">
        <div className="regCon">
          <div className="form">
            <h2>Welcome to Edit Notes</h2>
          </div>
          <div className="form">
            <label htmlFor="title">Title</label>
            <br />
            <input
              type="title"
              name="title"
              value={sendData.title}
              onChange={changedata}
              placeholder="Enter here ..."
            />
          </div>
          <div className="form">
            <label htmlFor="description">Description</label>
            <br />
            <textarea
              name="description"
              value={sendData.description}
              onChange={changedata}
              placeholder="Enter here ..."
              cols="30"
              rows="2"
            ></textarea>
          </div>
          <div className="form">
            <button onClick={updateNotesItem}>Submit</button>
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

export default UpdatePage;
