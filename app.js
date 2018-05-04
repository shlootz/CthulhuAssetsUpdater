const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const unzip = require('unzip2');
const fs = require('fs');
const wget = require('node-wget');
const shell = require('shelljs');

app.use(fileUpload());

app.post('/upload', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');

    let name = req.body["gameName"];
    let path = "games/"+name+"/"+name+"/graphicsSprite/design_tool_layout/"
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


app.post('/download', function(req, res) {
    let name = req.body["gameName"];
    let downloadURL = req.body["archiveLink"];
    let dest =  "games/"+name+"/"+name+"/graphicsSprite/design_tool_layout/";
    downloadURL = downloadURL.replace("dl=0", "dl=1");

    let extract = downloadURL.split("/");
    let fileName = extract[extract.length-1].replace("?dl=1", "");

    // wget({url: downloadURL, dest: "games/"+name+"/"+name+"/"+name+"/graphicsSprite/design_tool_layout/"}, function (err){
    //     if (err) throw err
    //     res.send("File downloaded ");
    // });

    wget({
            url:  downloadURL,
            dest: dest,      // destination path or path with filenname, default is ./
            timeout: 2000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
        },
        function (error, response, body) {
            if (error) {
                console.log('--- error:');
                console.log(error);            // error encountered
            } else {
                // console.log('--- headers:');
                // console.log(response.headers); // response headers
                // console.log('--- body:');
                // console.log(body);             // content of package
                res.send("File downloaded ");
                fs.createReadStream(dest+fileName).pipe(unzip.Extract({ path: dest }));
            }
        }
    );
}).bind(this);

app.listen(8000);