import React, { Component } from "react";

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: "",
    };
  }
  componentDidMount() {
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
        console.log(data, "userData");
        this.setState({ userData: data.data });
        if (data.data == "token expired") {
          alert("Token het han ! please login again");
          window.localStorage.clear();
          window.location.href = "./sign-in";
        }
      });
  }
  logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };
  render() {
    return (
      <div className="hungdev">
        Name{" "}
        <h1>
          {this.state.userData.fname} {this.state.userData.lname}
        </h1>
        Email <h1>{this.state.userData.email}</h1>
        Mobile Number <h1>+84 {this.state.userData.mobile}</h1>
        <br />
        <button onClick={this.logOut} className="btn btn-primary">
          Logout
        </button>
      </div>
    );
  }
}
