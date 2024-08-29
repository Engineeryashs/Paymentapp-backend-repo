const express = require("express");
const { authMiddleWare } = require("../middlewares/middlewares");
const { Account } = require("../db/db");
const router = express.Router();
const mongoose = require("mongoose");
router.use(express.json());
router.get("/balance", authMiddleWare, async (req, res) => {
    const id = req.userId;
    try {
        const account = await Account.findOne({
            userId: id
        })
        res.json({
            msg: "Wait while fetching bank balance",
            balance: account.balance
        })
    }
    catch (err) {
        console.log(err);
        res.status(411).json({
            msg: "Error in fetching your bank balance"
        })
    }
})

router.post("/transfer", authMiddleWare, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const amount = req.body.amount;
    const to = req.body.to;
    const account = await Account.findOne({
        userId: req.userId
    }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            msg: "Insufficient balance"
        })
    }

    const toAccount = await Account.findOne({
        userId: to
    }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            msg: "Invalid reciever account"
        })
    }

    try {
        console.log(to);
        const debitFromUserAccount = await Account.updateOne({
            userId: req.userId
        },
            {
                $inc: { balance: -amount }
            }).session(session);

        const creditToAccount =await Account.updateOne({
            userId: to
        },
            {
                $inc: { balance: amount }
            }).session(session);

        await session.commitTransaction();
        return res.json({
            msg: "Transfer Successful",
            amount:amount
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({
            msg: "Database Error"
        })
    }
})

module.exports = router;