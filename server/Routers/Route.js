const express = require("express");
const router = express.Router();
const userdb = require("../Model/userSchema");
const bcrypt = require("bcryptjs");
const authentication = require("../Middleware/authentication");

router.post("/register", async (req, res) => {
  try {
    // console.log(req.body);
    const { name, email, password, cpassword } = req.body;
    if (!name || !email || !password || !cpassword) {
      res.status(401).json({
        msg: "plz enter all fields"
      });
    } else {
      const checkUser = await userdb.findOne({ email });
      if (checkUser) {
        res.status(201).json({
          status: 201,
          msg: "user already exist"
        });
      } else {
        const newForm = new userdb({
          name,
          email,
          password,
          cpassword
        });

        const saveData = await newForm.save();
        res.status(201).json({
          status: 202,
          msg: "successfully registered",
          data: saveData
        });
      }
    }
  } catch (error) {
    res.status(501).json({
      msg: "not registered",
      error: error
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        msg: "data not found"
      });
    } else {
      const checkUser = await userdb.findOne({ email });
      if (!checkUser) {
        res.status(201).json({
          status: 201,
          msg: "user not found"
        });
      } else {
        const checkPassword = await bcrypt.compare(
          password,
          checkUser.password
        );
        if (!checkPassword) {
          res.status(201).json({
            status: 202,
            msg: "password not matched"
          });
        } else {
          // console.log(checkPassword);

          //generate token
          const token = await checkUser.generateToken();
          // console.log(token);

          //generate cookie
          res.cookie("auth_token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
          });

          const result = { token, checkUser };
          res.status(201).json({
            status: 203,
            msg: "User Login succesfully done",
            data: result
          });
        }
      }
    }
  } catch (error) {
    res.status(400).json({
      msg: "login failed",
      error: error
    });
  }
});

router.post("/validator", authentication, async (req, res) => {
  try {
    // console.log("done");
    if (req.getData) {
      res.status(201).json({
        status: 205,
        msg: "successfully user found",
        data: req.getData
      });
    } else {
      res.status(400).json({
        error: error,
        msg: "not auth"
      });
    }
  } catch (error) {
    res.status(501).json({
      msg: "not authorized",
      error: error
    });
  }
});

router.post("/logOut", authentication, async (req, res) => {
  try {
    // console.log(req.body);
    const user = req.getData;
    if (!user) {
      res.status(401).json({
        msg: "user not found"
      });
    } else {
      user.tokens = [];
      const saveuser = await user.save();
      // console.log(saveuser);
      res.status(201).json({
        status: 206,
        msg: "logOut successfully done",
        data: saveuser
      });
    }
  } catch (error) {
    res.status(501).json({
      msg: "not log out",
      error: error
    });
  }
});

router.post("/add", authentication, async (req, res) => {
  try {
    // console.log(req.body);
    const { sendData } = req.body;
    if (!sendData) {
      res.status(400).json({
        msg: "data not found"
      });
    } else {
      const user = req.getData;
      if (!user) {
        res.status(400).json({
          msg: "user not found"
        });
      } else {
        user.addNotes.push(sendData);
        const updatedUser = await user.save();
        // console.log(updatedUser);
        res.status(201).json({
          status: 208,
          msg: "successfully add data",
          data: updatedUser
        });
      }
    }
  } catch (error) {
    res.status(501).json({
      error: error,
      msg: "not add noted"
    });
  }
});

router.delete("/deleteNotes", authentication, async (req, res) => {
  try {
    // console.log(req.body);
    const { addNoteId } = req.body;
    if (!addNoteId) {
      res.status(400).json({
        msg: "data not fund"
      });
    } else {
      const user = req.getData;
      if (!user) {
        res.status(400).json({
          msg: "user not found"
        });
      } else {
        const index = user.addNotes.find(
          (addNotes) => addNotes._id.toString() === addNoteId
        );

        if (!index) {
          res.status(400).json({
            msg: "index not found"
          });
        } else {
          // console.log(index);
          user.addNotes = user.addNotes.filter(
            (addNotes) => addNotes._id.toString() !== addNoteId
          );

          const updatedUser = await user.save();
          res.status(201).json({
            msg: "notes delete successfully",
            status: 209,
            data: updatedUser
          });
        }
      }
    }
  } catch (error) {
    res.status(501).json({
      error: error,
      msg: "not delete"
    });
  }
});

router.put("/update", authentication, async (req, res) => {
  try {
    // console.log(req.body);
    const { sendData, addNoteId } = req.body;
    if (!sendData || !addNoteId) {
      res.status(400).json({
        msg: "data not found"
      });
    } else {
      const user = req.getData;
      if (!user) {
        res.status(400).json({
          msg: "user not found"
        });
      } else {
        // console.log(user);
        const entry = user.addNotes.findIndex(
          (addNotes) => addNotes._id.toString() === addNoteId
        );
        // console.log(entry);
        if (entry === -1) {
          res.status(400).json({
            msg: "index not found"
          });
        } else {
          // console.log(entry);
          (user.addNotes[entry].title = sendData.title),
            (user.addNotes[entry].description = sendData.description),
            (user.addNotes[entry].date = sendData.date);

          const updatedUser = await user.save();
          // console.log(updatedUser);
          res.status(201).json({
            status: 203,
            msg: "Update successfully done",
            data: updatedUser
          });
        }
      }
    }
  } catch (error) {
    res.status(501).json({
      error: error,
      msg: "not update"
    });
  }
});

module.exports = router;
