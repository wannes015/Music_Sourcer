const ytdl = require("ytdl-core");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const ffmpeg = require("fluent-ffmpeg");
const Duplex = require("stream").Duplex;
const Readable = require("stream").Readable;
const NodeID3 = require("node-id3");
const fs = require("fs");
const chalk = require('chalk');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/conv', async (req, res, next) => {
    try {
        let {url, title, artist} = req.body;
        title = title.trim()
        artist = artist.trim()

        // res.writeHead(200, {
        //     "Content-Type": "audio/mpeg",
        //     "Content-Disposition":
        //         'attachment; filename="' +
        //         (req.body.artist.split("; ").join(", ") + " - " + req.body.title) +
        //         '.mp3"',
        // });

        const tags = {
            title,
            artist,
            genre: req.body.genre,
        };

        const stream = ytdl(url);
        let proc = ffmpeg(stream);

        const bufs = [];
        const writ = new Duplex();
        writ._read = () => {};
        writ._write = function (chunk, enc, next) {
            bufs.push(chunk);
            next();
        };

        proc.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");
        proc.audioCodec("libmp3lame")
            .format("mp3")
            .on("end", () => {
                const buffer = Buffer.concat(bufs);
                let success = NodeID3.write(tags, buffer);
                const readable = new Readable();
                readable._read = () => {};
                readable.push(success);
                readable.push(null);
                readable.on("end", () => {
                    console.log("Done")
                    res.sendStatus(202);
                });
                readable.pipe(fs.createWriteStream(path.join("D:/_MusicLibrary", req.body.artist.split("; ").join(", ") + " - " + req.body.title) + '.mp3'));
            })
            .output(writ)
            .run();
    } catch (error) {
        console.log(error);
    }
})

app.listen(3000, () => {
    // console.log(`Example app listening on port ${3000}`)
    console.clear()
    console.log(chalk.hex('#4f46e5').bold('Music Sourcer Backend running...'))
    console.log("You can now use the extension in order to download tracks from YouTube")
    console.log()
    console.log(chalk.hex("#525252")("©wannes015 | https://github.com/wannes015"))
})