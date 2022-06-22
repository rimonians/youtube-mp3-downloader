// Import external module
const express = require("express");
const cors = require("cors");
const ejs = require("ejs");
const ytdl = require("ytdl-core");

const PORT = process.env.PORT || 8080;

// Initialize app
const app = express();

// Enable cors
app.use(cors());

// Parse request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine
app.set("view engine", "ejs");

// Set static folder
app.use(express.static("public"));

// Get index file
app.get("/", (req, res) => {
  res.render("index");
});

// Information response
app.get("/info/:videoId", async (req, res) => {
  try {
    const { videoId } = req.params;
    const info = await ytdl.getInfo(
      `https://www.youtube.com/watch?v=${videoId}`
    );
    res.status(200).json(info.videoDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Download response
app.get(
  "/download/:videoId",
  cors({
    exposedHeaders: ["Content-Disposition"],
  }),
  async (req, res) => {
    try {
      const { videoId } = req.params;
      const info = await ytdl.getInfo(
        `https://www.youtube.com/watch?v=${videoId}`
      );
      const stream = ytdl.downloadFromInfo(info, {
        quality: "highestaudio",
      });

      const regex = /[a-zA-Z\s\d]/g;
      const filename = info.videoDetails.title.match(regex).join("");

      res.set({
        "Content-Disposition": `attachment; filename='rimonians--${filename}.MP3'`,
        "Content-Type": "audio/mpeg",
      });
      stream.pipe(res).on("end", function () {
        console.log(res._headers);
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Listening to app
app.listen(PORT, (err) => {
  if (err) console.log(err.message);
  if (!err) console.log(`Server successfully running at ${PORT}`);
});
