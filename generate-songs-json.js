// generate-songs-json.js
const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'songs');

fs.readdirSync(baseDir).forEach(folder => {
  const folderPath = path.join(baseDir, folder);
  if (fs.lstatSync(folderPath).isDirectory()) {
    const mp3s = fs.readdirSync(folderPath)
      .filter(file => file.endsWith('.mp3'));

    const jsonData = {
      songs: mp3s
    };

    fs.writeFileSync(
      path.join(folderPath, 'songs.json'),
      JSON.stringify(jsonData, null, 2)
    );

    console.log(`✅ songs.json created for ${folder}`);
  }
});
