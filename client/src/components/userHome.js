import React, {  useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function UserHome() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState("");
  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };
  useEffect(() => {
    fetch("http://localhost:5000/profile", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        token: window.localStorage.getItem("token"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data.data);
      });
  }, []);
  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <FontAwesomeIcon
          icon={faUserPlus}
          onClick={() => navigate("/updateUser", {state: userData})}
        />
        <div>
          Name<h1>{userData.fname} {userData.lname}</h1>
          Email <h1>{userData.email}</h1>
          <br />
          <button onClick={logOut} className="btn btn-primary">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
