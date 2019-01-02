import fs from 'fs';
import path from 'path';
import printf from 'printf';

export class KeyValueFile {

   readKeyValues(fileName, data) {
      try {
         if (fs.existsSync(fileName)) {
            let contents = fs.readFileSync(fileName, { encoding: 'utf8' });
            let incomingData = this._convertToKeyValuePairs(contents);
            if (incomingData) {
               Object.getOwnPropertyNames(incomingData).forEach((key) => {
                  data[key] = incomingData[key];
               });
            }
         }
         return data;
      }
      catch (err) {
         console.warn("Unable to read configuration: ", err);
         return data;
      }
   }

   _convertToKeyValuePairs(contents) {
      let data = {};
      if (contents) {
         let lines = contents.split(/[\r\n]+/);
         if (lines) {
            lines.forEach((line) => {
               let tline = line.trim();
               let pos = tline.indexOf("=");
               if (tline.indexOf("=") > 0) {
                  let key = tline.substring(0, pos);
                  let value = tline.substring(pos + 1, tline.length);
                  let tkey = key.trim();
                  let tvalue = value.trim();
                  if (tkey) {
                     data[tkey] = tvalue;
                  }
               }
            });
         }
      }
      return data;
   }

   writeKeyValues(fileName, data) {
      try {
         if (!fs.existsSync(fileName)) {
            let filePath = path.dirname(fileName);
            if (!fs.existsSync(filePath)) {
               fs.mkdirSync(filePath, { recursive: true });
            }
         }

         let contents = "";
         Object.getOwnPropertyNames(data).forEach((key) => {
            contents += printf("%s=%s\n", key, data[key] ? data[key].toString() : "");
         });

         fs.writeFileSync(fileName, contents, { encoding: 'utf8' });
      }
      catch (err) {
         console.error("Unable to save configuration: ", err);
      }
   }
}