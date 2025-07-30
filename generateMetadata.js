const fs = require("fs");
const path = require("path");

const songsDir = path.join(__dirname, "songs");
const albums = [];

fs.readdirSync(songsDir).forEach(folder => {
  const folderPath = path.join(songsDir, folder);
  const stat = fs.statSync(folderPath);

  if (stat.isDirectory()) {
    const files = fs.readdirSync(folderPath);
    const mp3Files = files.filter(file => file.endsWith(".mp3"));
    const cover = files.find(file => file.toLowerCase().includes("cover")) || "cover.jpeg";

    // Create songs.json in the folder
    fs.writeFileSync(
      path.join(folderPath, "songs.json"),
      JSON.stringify(mp3Files, null, 2)
    );

    // Push to albums.json
    albums.push({
      folder,
      title: folder.replace(/_/g, " ").toUpperCase(),
      description: `Songs from ${folder}`,
      cover
    });
  }
});

// Write albums.json
fs.writeFileSync(
  path.join(songsDir, "albums.json"),
  JSON.stringify(albums, null, 2)
);

console.log("✅ Metadata generated successfully.");
