const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { signupSchema, signinSchema, updateSchema } = require("../types")
const {User, Account} = require("../db/db")
const jwt = require("jsonwebtoken")
require("dotenv").config();
const JWT_SECRET=process.env.JWT_SECRET;
const { authMiddleWare } = require("../middlewares/middlewares")

router.post("/signup", async (req, res) => {
    const body = req.body;
    const response = signupSchema.safeParse(body);
    if (!response.success) {
        return res.status(403).json({
            msg: "Incorrect inputs"
        });
    }


    const isExistingUser = await User.findOne({ userName: body.userName });
    if (isExistingUser) {
        return res.status(411).json({
            msg: "Email already taken/incorrect inputs"
        });
    }


    try {
        const newUser = await User.create({
            name: req.body.name,
            lastName: req.body.lastName,
            userName: req.body.userName,
            password: req.body.password,
        });
        const userId = newUser._id;
        const token = jwt.sign({
            userId: userId
        }, JWT_SECRET);
       
        const newAccount=await Account.create({
            userId:userId,
            balance:1+Math.random()*10000
        })

        return res.json({
            msg: "User Created successfully",
            token: token,
        });
    }
    catch (err) {
        console.log(err);
        return res.status(411).json({
            msg: "Error in signup process"
        });
    }
});

router.post("/signin", async (req, res) => {
    const userName = req.body.userName;
    const password = req.body.password;
    const response = signinSchema.safeParse({
        userName: userName,
        password: password
    })
    if (!response.success) {
        return res.status(411).json({
            msg: "Incorrect inputs"
        })
    }
    try {
        const isUser = await User.findOne({
            userName: userName,
            password: password
        })
        if (!isUser) {
            return res.status(411).json({
                msg: "Error while logging in with this invalid credentials"
            })
        }
        const token = jwt.sign({ userId: isUser._id }, JWT_SECRET);
        return res.json({
            token: token,
        });

    }
    catch (err) {
        return res.status(411).json({
            msg: "Error while logging in"
        })
    }
})

router.put("/", authMiddleWare, async (req, res) => {
    const response = updateSchema.safeParse({
        name: req.body.name,
        lastName: req.body.lastName,
        password: req.body.password
    })
    if (!response.success) {
        return res.status(403).json({
            msg: "Incorrect data format for updating"
        })
    }
    try {
        const updatedResponse = await User.updateOne({
            _id: req.userId
        },
            {
                name: req.body.name,
                lastName: req.body.lastName,
                password: req.body.password
            })
        res.json({
            msg: "Updated successfully"
        })

    } catch (err) {
        res.status(411).json({
            msg: "Error while updating information"
        })
    }
})

router.get("/bulk",authMiddleWare,async (req, res) => {
    const filter = req.query.filter || "";
    const signedInUserId=req.userId;
    console.log("Hi");
    console.log(signedInUserId)
    try {
        const users = await User.find({
            _id: { $ne: signedInUserId },
            $or: [
                {
                    name: { "$regex": filter, "$options": "i" }
                },
                {
                    lastName: { "$regex": filter, "$options": "i" }
                }
            ]
        })
        console.log(users);
        res.json({
            msg: "User founded",
            user: users.map(function (user) {
                return {
                    name: user.name,
                    lastName: user.lastName,
                    userName: user.userName,
                    _id: user._id
                }
            })
        })
    } catch (err) {
        res.status(411).json({
            msg: "Error in connecting database/incorrect inputs"
        })
    }

})

router.get("/userdata",authMiddleWare,async (req,res)=>{
const userId=req.userId;
try {
    let response=await User.findOne({
        _id:userId
    })
    console.log(response)
    res.json({
        msg:"User founded",
        user:response
    })
} catch (error) {
    console.error(error)
    res.status(404).json({
       msg: "Authentication error"
    })
}

})

module.exports = router;