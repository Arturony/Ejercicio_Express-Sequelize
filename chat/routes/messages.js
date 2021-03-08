var express = require('express');
var fs = require('fs');
var path = require('path');
const Joi = require("joi");
const { json } = require('express');
var router = express.Router();
const directoryPath = "./chat_logs/";

/* GET msg listing. */
router.get('/', function(req, res, next) 
{
    //passsing directoryPath and callback function
    fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    arr = [files.length];
    i = 0;
    //listing all files using forEach
    files.forEach(function (file) 
    {
        // Do whatever you want to do with the file
        var filePath = path.join(directoryPath, file);
        //read file and parse json
        arr[i] = fs.readFileSync(filePath, 'utf8');
        i++;
    });
    res.send(arr);
});
});

router.get("/:id", (req, res) => 
{
    var filePath = path.join(directoryPath, req.params.id + ".json");
    data = fs.readFileSync(filePath, 'utf8');
    res.send(data);
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

    newFile = path.join(directoryPath, req.body.ts+".json");
    fs.writeFile(newFile, JSON.stringify(req.body),function (err) 
    {
        if (err) return console.log(err);
        res.send(req.body);
    });
    
});

router.put('/:id', function(req, res)
{
    var filePath = path.join(directoryPath, req.params.id + ".json");
    data = fs.readFileSync(filePath, 'utf8');
    jsox = JSON.parse(data);
    jsox.author = req.body.author;
    jsox.message = req.body.message;
    newFile = path.join(directoryPath, jsox.ts+".json");
    fs.writeFile(newFile, JSON.stringify(jsox),function (err) 
    {
        if (err) return console.log(err);
        res.send(jsox);
    });
});

router.delete("/:id", (req, res) => 
{
    var filePath = path.join(directoryPath, req.params.id + ".json");
    data = fs.readFileSync(filePath, 'utf8');
    fs.unlink(filePath, (err) => 
    {
        if (err) {
          console.error(err)
          return
        }
    });
    res.send(data);
  });

module.exports = router;
