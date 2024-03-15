import React, { useCallback, useEffect, useState } from "react";
import { AppBar, Avatar, Toolbar } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import "./Nav.css";
import apiURL from "../config";

const Nav = () => {
  const api = apiURL.url;
  const pageNavigate = useNavigate();
  const [userData, setUserData] = useState();
  console.log(userData);
  const navAuth = useCallback(async () => {
    const token = await localStorage.getItem("token");
    // console.log(token);

    const data = await fetch(`${api}/validator`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    });
    const res = await data.json();
    // console.log(res);
    if (res.status === 205) {
      // console.log(res);
      setUserData(res);
    } else {
      console.log("user not found");
    }
  }, [api]);

  useEffect(() => {
    navAuth();
  }, [navAuth]);

  const logOut = async () => {
    const token = await localStorage.getItem("token");
    const data = await fetch(`${api}/logOut`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      }
    });
    const res = await data.json();
    // console.log(res);
    if (res.status === 206) {
      console.log(res);
      localStorage.removeItem("token");
      pageNavigate("/");
      window.location.reload();
    } else {
      alert("Not log out");
    }
  };

  return (
    <>
      <AppBar>
        <Toolbar>
          <div className="nav">
            <div className="navCon">
              {userData ? (
                userData.data && (
                  <>
                    <div className="tab">
                      <NavLink to={"/home"} className={"tabNav"}>
                        <img
                          src="https://shopping-app-xx1p.vercel.app/static/media/Sooraj-logo.4ea9ba32a0c93354b8a8.png"
                          alt="logo"
                        />
                      </NavLink>
                    </div>
                    <div className="tab">
                      <NavLink to={"/home"} className={"tabNav"}>
                        Home
                      </NavLink>
                    </div>
                  </>
                )
              ) : (
                <>
                  <div className="tab">
                    <NavLink className={"tabNav"}>
                      <img
                        src="https://shopping-app-xx1p.vercel.app/static/media/Sooraj-logo.4ea9ba32a0c93354b8a8.png"
                        alt="logo"
                      />
                    </NavLink>
                  </div>
                  <div className="tab">
                    <NavLink className={"tabNav"}>Home</NavLink>
                  </div>
                </>
              )}
              <div className="tab">
                <NavLink to={"/"} className={"tabNav"}>
                  Login
                </NavLink>
              </div>
              <div className="tab">
                <NavLink className={"tabNav"}>
                  <Avatar className="avaStyle">
                    {userData
                      ? userData.data.email.charAt(0).toUpperCase()
                      : ""}{" "}
                  </Avatar>
                </NavLink>
                <div className="ava">
                  <div className="avaCon">
                    <div className="avatab">
                      <NavLink className={"avatabNav"}>
                        {userData ? userData.data.email : "Email"}
                      </NavLink>
                    </div>
                    {userData ? (
                      userData.data && (
                        <>
                          <div className="avatab">
                            <NavLink to={"/home"} className={"avatabNav"}>
                              Home
                            </NavLink>
                          </div>
                        </>
                      )
                    ) : (
                      <>
                        <div className="avatab">
                          <NavLink className={"avatabNav"}>Home</NavLink>
                        </div>
                      </>
                    )}
                    <div className="avatab">
                      <NavLink to={"/"} className={"avatabNav"}>
                        login
                      </NavLink>
                    </div>
                    {userData
                      ? userData.data && (
                          <>
                            <div className="avatab" onClick={logOut}>
                              <NavLink className={"avatabNav"}>Log Out</NavLink>
                            </div>
                          </>
                        )
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Nav;
