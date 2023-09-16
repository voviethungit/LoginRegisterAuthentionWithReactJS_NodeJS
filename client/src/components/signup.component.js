import React, { Component } from "react";
import app from "./firebase.config";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
const auth = getAuth(app);

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      mobile: "",
      email: "",
      password: "",
      verifyButton: false,
      verifyOtp: false,
      otp: "",
      verified: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onSignInSubmit = this.onSignInSubmit.bind(this);
    this.verifyCode = this.verifyCode.bind(this);
  }

  onCaptchVerify() {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          this.onSignInSubmit();
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
        },
      },
      auth
    );
  }

  onSignInSubmit() {
    this.onCaptchVerify();
    const phoneNumber = "+84" + this.state.mobile;
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        alert("otp duoc gui thanh cong");
        this.setState({ verifyOtp: true });
        this.setState({
          verified: true,
          verifyOtp: true,
        });
        // ...
      })
      .catch((error) => {
        // Error; SMS not sent
        // ...
      });
  }
  verifyCode() {
    window.confirmationResult
      .confirm(this.state.otp)
      .then((result) => {
        // User signed in successfully.
        const user = result.user;
        console.log(user);
        alert("OTP Chinh xác");
        // ...
      })
      .catch((error) => {
        alert("OTP không tồn tại ! please try again");
        console.log(error);
        // User couldn't sign in (bad verification code?)
        // ...
      });
  }
  changeMobile(e) {
    this.setState({ mobile: e.target.value }, function () {
      if (this.state.mobile.length == 10) {
        this.setState({
          verifyButton: true,
        });
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.verified) {
      const { fname, lname, mobile, password, email } = this.state;
      fetch("http://localhost:5000/register", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          fname,
          mobile,
          lname,
          email,
          password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data, "userRegister");
          if (data.status == "ok") {
            alert("Dang ky thanh cong");
            window.location.href = "./sign-in";
          }
        });
    } else {
      alert("Please Verify Mobile !");
    }
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3>Sign Up</h3>
        <div id="recaptcha-container"></div>
        <div className="mb-3">
          <label>First name</label>
          <input
            type="text"
            className="form-control"
            placeholder="First name"
            onChange={(e) => this.setState({ fname: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label>Last name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Last name"
            onChange={(e) => this.setState({ lname: e.target.value })}
          />
        </div>

        <div className="mb-3">
          <label>Email Address</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter Email"
            onChange={(e) => this.setState({ email: e.target.value })}
          />
          </div>

        <div className="mb-3">
          <label>Mobile Number</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter Mobile"
            onChange={(e) => this.changeMobile(e)}
          />
          {this.state.verifyButton ? (
            <input
              type="button"
              value={this.state.verified ? "Verified" : "Verify"}
              onClick={this.onSignInSubmit}
              style={{
                backgroundColor: "#0163d2",
                width: "100%",
                padding: "8",
                color: "white",
                border: "none",
              }}
            />
          ) : null}
        </div>
        {this.state.verifyOtp ? (
          <div className="mb-3">
            <label>OTP</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter OTP"
              onChange={(e) => this.setState({ otp: e.target.value })}
            />
            <input
              type="button"
              value="OTP"
              onClick={this.verifyCode}
              style={{
                backgroundColor: "#0163d2",
                width: "100%",
                padding: "8",
                color: "white",
                border: "none",
              }}
            />
          </div>
        ) : null}

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            onChange={(e) => this.setState({ password: e.target.value })}
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>
        <p className="forgot-password text-right">
          Already registered <a href="/sign-in">sign in?</a>
        </p>
      </form>
    );
  }
}
