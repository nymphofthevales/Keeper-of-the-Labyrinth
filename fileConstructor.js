

const electron = require('electron');
const { app } = require('electron');
const path = require('path');
const fs = require('fs');


function Save(opts) {
            //electron.app if in main, electron.remote.app if in renderer
        const userDataPath = app.getPath('userData');
        console.log(userDataPath)
        this.path = path.join(userDataPath, opts.configName + '.json');
        //creates property 'path' at writeSave.constructor.path with a value equal to the user's app directory plus a file name fed to the class instance through 'opts.configName' and an ending of '.json'
        //might look like user/library/appdata/whatever/configName.json
        this.data = parseDataFile(this.path, opts.defaults);
    
    this.set = function(saveJSON) {
        this.data = `${saveJSON}`
        fs.writeFile(this.path, JSON.stringify(this.data),(err)=>{
            if (err) {
                console.log(err);
            } else {
                console.log(this.path)
                console.log(`wrote to file!`)
            }
        });
    }
}

function parseDataFile(filePath, defaults) {
    try {
      return JSON.parse(fs.readFile(filePath));
    } catch(error) {
      return defaults;
    }
  }

module.exports = Save;