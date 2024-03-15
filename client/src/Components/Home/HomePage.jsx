import React, { useCallback, useEffect, useState } from "react";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";
import apiURL from "../config";

const HomePage = () => {
  const api = apiURL.url;
  const pageNavigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(""); // State to track search term
  const [filteredNotes, setFilteredNotes] = useState([]); // State to store filtered notes

  const addNotes = () => {
    pageNavigate("/add");
  };

  const [userData, setUserData] = useState();

  const homeAuth = useCallback(async () => {
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
      setUserData(res);
      setFilteredNotes(res.data.addNotes); // Set filteredNotes initially with all notes
    } else {
      console.log("user not found");
    }
  }, [api]);

  useEffect(() => {
    homeAuth();
  }, [homeAuth]);

  const deleteNotes = async (addNoteId, index) => {
    const token = await localStorage.getItem("token");
    const data = await fetch(`${api}/deleteNotes`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ addNoteId })
    });
    const res = await data.json();
    if (res.status === 209) {
      setUserData(res); // Update user data after deletion
      setFilteredNotes((prevNotes) =>
        prevNotes.filter((note) => note._id !== addNoteId)
      ); // Remove deleted note from filteredNotes
    } else {
      alert("Notes not deleted");
    }
  };

  const updateNotes = (addNoteId, index) => {
    pageNavigate(`/update/${addNoteId}`);
  };

  // Function to handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Filter notes based on the search term
    const filtered = userData.data.addNotes.filter((note) =>
      note.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredNotes(filtered);
  };

  return (
    <>
      <div className="home">
        <div className="homeCon">
          <div className="add">
            <div className="addCon">
              <>
                <button onClick={addNotes}>ADD</button>
                <input
                  type="text"
                  placeholder="Search title here ..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
                {/* show new modified notes on top */}
              </>
            </div>
          </div>
          <div className="show">
            {filteredNotes.map((addNote, index) => (
              <div key={index} className="show-data">
                <h3>{addNote.date}</h3>
                <h3>{addNote.title}</h3>
                <p>{addNote.description}</p>
                <div className="action">
                  <>
                    <i
                      onClick={() => deleteNotes(addNote._id, index)}
                      className="fa-solid fa-trash"
                    ></i>
                    <i
                      onClick={() => updateNotes(addNote._id, index)}
                      className="fa-solid fa-pen-to-square"
                    ></i>
                  </>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
