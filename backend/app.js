const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "hungdeveloper2910200321fs";
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
const mongoose = require("mongoose");

const mongoUrl =
  "mongodb+srv://voviethungdeveloper:TFxZINVZlKsD2gFk@cluster0.pv6rkef.mongodb.net/ReactJS_NodeJS?retryWrites=true&w=majority";
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connect db success");
  })
  .catch((e) => console.log(e));

require("./userDetails");
require("./imageDetails");

const User = mongoose.model("UserInfo");
const Images = mongoose.model("ImageDetails");
app.post("/register", async (req, res) => {
  const { fname, lname, email, password, userType } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send({ error: "email đã được sử dụng!" });
    }
    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
    });
    res.send({ status: "ok" });
  } catch (error) {
    console.log(error);
    res.send({ status: "error" });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.send({ error: "User Not Found " });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "60m", //time het han token
    });

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "Invalid Token" });
});

app.post("/profile", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }
    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Found" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
    console.log(link);
  } catch (error) {
    console.log(error);
  }
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Found" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    res.send("Not Verified");
  }
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Found" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );
    res.json({ status: "Password Updated" });
    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    res.json({ status: "Something went wrong" });
  }
});

app.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {}
});

app.post("/updateUser", async (req, res) => {
  const { id, fname, lname } = req.body;
  try {
    await User.updateOne(
      { _id: id },
      {
        $set: {
          fname: fname,
          lname: lname,
        },
      }
    );
    return res.json({ status: "ok", data: "updated" });
  } catch (error) {
    return res.json({ status: error, data: error });
  }
});

app.post("/deleteUser", async (req, res) => {
  const { userid } = req.body;

  // phiên bản mới của Mongoose đã thay đổi cách sử dụng hàm deleteOne và không còn chấp nhận một hàm callback như trước. Thay vào đósử dụng hàm trả về Promise của deleteOne 
  try {
    const result = await User.deleteOne({ _id: userid });
    if (result.deletedCount === 1) {
      console.log("User deleted successfully");
      res.send({ status: "Ok", data: "Deleted" });
    } else {
      console.log("User not found");
      res.status(404).send({ status: "Error", data: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "Error", data: "Failed to delete user" });
  }
});


app.post("/upload-image", async (req, res) => {
  const { base64 } = req.body;
  try {
    await Images.create({ image: base64 });

    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

app.get("/get-image", async (req, res) => {
  try {
    await Images.find({}).then((data) => {
      res.send({ status: "ok", data: data });
    });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

app.get("/paginatedUsers", async (req, res) => {
  const allUser = await User.find({});
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * 1;
  const lastIndex = page * limit;
  const results = {};

  results.totalUser = allUser.length;
  results.pageCount = Math.ceil(allUser.length / limit);



  if (lastIndex < allUser.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }

  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
    };
  }

  results.result = allUser.slice(startIndex, lastIndex);
  res.json(results);
});
app.listen(5000, () => {
  console.log("Server dang chay tai PORT : http://localhost:5000/");
});
