var express = require("express");
var router = express.Router();
const WebSocket = require("ws");
const ws = new WebSocket("ws://localhost:3000");

const Joi = require("joi");
const Message = require("../models/message");

router.get("/", function (req, res, next) {
    Message.findAll().then((result) => {
        res.send(result);
    });
});

router.get("/:ts", (req, res) => {
    Message.findByPk(req.params.ts).then((response) => {
        if (response === null)
            return res
                .status(404)
                .send("The client with the given id was not found.");
        res.send(response);
    });
});

router.post("/", function (req, res, next) {
    const { error } = validateNewMessage(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    Message.create({ message: req.body.message, author: req.body.author, ts: Date.now() }).then(
        (result) => {
            ws.send(req.body.message);
            res.send(result);
        }
    );
});

router.put("/:ts", (req, res) => {
    const { error } = validateNewMessage(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    Message.update(req.body, { where: { ts: req.params.ts } }).then(
        (response) => {
            if (response[0] !== 0) res.send({ message: "Client updated" });
            else res.status(404).send({ message: "Client was not found" });
        }
    );
});

router.delete("/:ts", (req, res) => {
    Message.destroy({
        where: {
            ts: req.params.ts,
        },
    }).then((response) => {
        if (response === 1) res.status(204).send();
        else res.status(404).send({ message: "Client was not found" });
    });
});

const validateNewMessage = (message) => {
    const schema = Joi.object({
        message: Joi.string().min(5).required(),
        author: Joi.string()
            .regex(/^[A-z]+\s[A-z]+$/)
            .required(),
    });

    return schema.validate(message);
};

module.exports = router;
