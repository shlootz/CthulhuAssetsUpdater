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

    if (fs.existsSync(dest)) {
        // Do something
        wget({
                url:  downloadURL,
                dest: dest,      // destination path or path with filenname, default is ./
                timeout: 10000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
            },
            function (error, response, body) {
                if (error) {
                    console.log('--- error:');
                    console.log(error);            // error encountered
                    res.send("ERROR "+error);
                } else {
                    // console.log('--- headers:');
                    // console.log(response.headers); // response headers
                    // console.log('--- body:');
                    // console.log(body);             // content of package
                    res.send("File uploaded to game ");
                    fs.createReadStream(dest+fileName).pipe(unzip.Extract({ path: dest }).on('close', function(){
                        //res.send("File extracted!");
                        //require("openurl").open("http://192.168.10.150/gp/games/"+name+"/"+name+".html");
                        //http://192.168.10.150/gp/games/pulse_crystal_clans/pulse_crystal_clans.html
                    }));
                }
            }
        );
    } else {
        res.send("Game does not exist OR Game ID is wrong ");
    }
}).bind(this);

// test link https://public.adobecc.com/files/1ERHQIOFCHQJGGZ0CY4LFKKCBXHEFF?content_disposition=attachment;%20filename=Archive.zip

app.post('/downloadCC', function(req, res) {
    let name = req.body["gameName"];
    let downloadURL = req.body["archiveLink"];
    let dest =  "games/"+name+"/"+name+"/graphicsSprite/design_tool_layout/";
    downloadURL = downloadURL.replace("dl=0", "dl=1");
    let extract = downloadURL.split("filename=");
    let fileName = extract[extract.length-1];
    let tempName =  downloadURL.split("?content_disposition")[0].replace("https://public.adobecc.com/files/", "");

    if (fs.existsSync(dest)) {
        // Do something
        wget({
                url:  downloadURL,
                dest: dest,      // destination path or path with filenname, default is ./
                timeout: 10000       // duration to wait for request fulfillment in milliseconds, default is 2 seconds
            },
            function (error, response, body) {
                if (error) {
                    console.log('--- error:');
                    console.log(error);            // error encountered
                    res.send("ERROR "+error);
                } else {
                    // console.log('--- headers:');
                    // console.log(response.headers); // response headers
                    // console.log('--- body:');
                    // console.log(body);             // content of package
                    res.send("File uploaded to game ");
                    fs.rename(dest + tempName, dest + fileName, function(err) {
                        if ( err ) console.log('ERROR: ' + err);
                    });
                    console.log("dest "+dest);
                    console.log("tempName "+tempName);
                    console.log("fileName "+fileName);
                    fs.createReadStream(dest+fileName).pipe(unzip.Extract({ path: dest }).on('close', function(){
                        //res.send("File extracted!");
                        //require("openurl").open("http://192.168.10.150/gp/games/"+name+"/"+name+".html");
                        //http://192.168.10.150/gp/games/pulse_crystal_clans/pulse_crystal_clans.html
                    }));
                }
            }
        );
    } else {
        res.send("Game does not exist OR Game ID is wrong ");
    }


}).bind(this);

app.listen(8000);