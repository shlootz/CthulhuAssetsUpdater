const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const unzip = require('unzip2');
const fs = require('fs');

//wget({url: url, dest: destination_folder_or_filename}, callback);

// default options
app.use(fileUpload());

app.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    let name = req.body["gameName"];
    let path = "games/"+name+"/"+name+"/"+name+"/graphicsSprite/design_tool_layout/"
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(path+sampleFile.name, function(err) {
        //console.log(req);
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded, unzipping '+sampleFile.name);

        fs.createReadStream(path+sampleFile.name).pipe(unzip.Extract({ path: path }));

    });
}).bind(this);

app.listen(8000);