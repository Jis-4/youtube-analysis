const fs = require('fs');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

module.exports = function downloadAndConvert(youtubeUrl, outWavPath) {
  return new Promise((resolve, reject) => {
    const stream = ytdl(youtubeUrl, { filter: 'audioonly', quality: 'highestaudio' });
    // fluent-ffmpeg will spawn ffmpeg from PATH
    const proc = ffmpeg(stream)
      .audioBitrate(128)
      .format('wav')
      .audioChannels(1)
      .on('error', (err) => {
        reject(err);
      })
      .on('end', () => {
        resolve();
      })
      // set output options to 16 kHz, 16-bit PCM
      .outputOptions([
        '-ar 16000',
        '-ac 1',
        '-sample_fmt s16'
      ])
      .save(outWavPath);
  });
};
