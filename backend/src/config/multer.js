/*

*/

import multer from 'multer';
import crypto from 'crypto';

// gets file's extensions and application's path
import { extname, resolve } from 'path';

export default {
  storage: multer.diskStorage({

    // path where all images will be temporary stored
    destination: resolve(__dirname, '..', '..', 'temp', 'uploads'),

    // processing the file's name
    filename: (req, file, callback) => {
      // generating a random string
      crypto.randomBytes(16, (err, res) => {
        // the first parameter is the error
        if (err) return callback(err);

        // when everything is okay, we don't have errors, then the first parameter
        // is null here
        return callback(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};
