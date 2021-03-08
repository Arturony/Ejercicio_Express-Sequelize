var express = require('express');
var fs = require('fs');
var path = require('path');
const Joi = require("joi");
const { json } = require('express');
var router = express.Router();
const Message = require("../models/message");

const directoryPath = "./chat_logs/";

/* GET msg listing. */
router.get('/', function(req, res, next) 
{
    Message.findAll().then((result) => {
        res.send(result);
      });
});

router.get("/:id", (req, res) => 
{
    Message.findByPk(req.params.id).then((response) => {
        if (response === null)
          return res
            .status(404)
            .send("The client with the given id was not found.");
        res.send(response);
      });
  });

router.post('/', function(req, res) 
{
    //save msg to database
    const schema = Joi.object({
        message: Joi.string().min(5).required(),
        author: Joi.string().pattern(new RegExp('^[A-Za-z]+( [A-Za-z]+)')).required(),
        ts: Joi.string().required()
      });
    
      const { error } = schema.validate(req.body);
    
      if (error) {
        return res.status(400).send(error);
      }

      Message.create({ author: req.body.author, message: req.body.message, ts: req.body.ts }).then(
        (result) => {
          res.send(result);
        }
      );
    
});

router.put('/:id', function(req, res)
{
    const schema = Joi.object({
        message: Joi.string().min(5).required(),
        author: Joi.string().pattern(new RegExp('^[A-Za-z]+( [A-Za-z]+)')).required()
      });
    
    const { error } = schema.validate(req.body);
    
    if (error) {
        return res.status(400).send(error);
      }

    Message.update(req.body, { where: { ts: req.params.id } }).then((response) => 
    {
        if (response[0] !== 0) res.send({ message: "Message updated" });
        else res.status(404).send({ message: "Message was not found" });
    });
});

router.delete("/:id", (req, res) => 
{
    destroy({
        where: {
          ts: req.params.id,
        },
      }).then((response) => {
        if (response === 1) res.status(204).send();
        else res.status(404).send({ message: "Message was not found" });
      });
  });

module.exports = router;
