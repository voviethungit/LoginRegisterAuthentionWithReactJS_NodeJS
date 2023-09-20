import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function UpdateUser() {
  const location = useLocation();
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    console.log(location);
    setFname(location.state.fname);
    setLname(location.state.lname);
    setEmail(location.state.email);
  }, []);

  const updateData = () => {
    fetch("http://localhost:5000/updateUser", {
      method: "POST",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        id: location.state._id,
        fname: fname,
        lname: lname,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        window.location.href = "/userHome";
      });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        First Name
        <br />
        <input
          placeholder="First Name"
          className="form-control"
          defaultValue={fname}
          onChange={(e)=> setFname(e.target.value)}
        />
        Last Name
        <br />
        <input
          placeholder="Last Name"
          className="form-control"
          defaultValue={lname}
          onChange={(e)=> setLname(e.target.value)}
        />
        Email
        <br />
        <input
          placeholder="Email"
          className="form-control"
          disabled
          defaultValue={email}
        />
        <br />
        <button onClick={updateData}>Update Details</button>
      </div>
    </div>
  );
}

export default UpdateUser;
