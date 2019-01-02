import electron from 'electron';
import path from 'path';
import { KeyValueFile } from './keyvaluefile';

class AppProperties {

   constructor() {
      this.properties = {};
      this.configfile = "";
      this.keyValueFile = new KeyValueFile();
      this.initialized = false;
   }

   getProperty(name) {
      this._initialize();  
      return this.properties[name];
   }

   setProperty(name, value) {
      this._initialize();
      if (value) {
         let val = value.toString();
         if (!this.properties[name] || this.properties[name] !== val) {
            this.properties[name] = val;
            this.keyValueFile.writeKeyValues(this.configfile, this.properties);
         }
      }
   }

   _initialize() {
      if (this.initialized) {
         return;
      }

      this.configfile = path.join(this._getApp().getPath('userData'), 'podpup.config');
      console.log("Podpup Config ", this.configfile);

      // Set Defaults
      this.properties.datadir = path.join(this._getApp().getPath('home'), 'podpup');

      // Read Value from File
      this.keyValueFile.readKeyValues(this.configfile, this.properties);
      this.initialized = true;
   }

   _isDev() {
      return this._getExeFile() === 'electron';
   }
   
   _getExeFile() {
      return path.basename(this._getApp().getPath('exe'));
   }

   _getApp() {
      return electron.app || electron.remote.app;
   }
}

const appProperties = new AppProperties();

export default {
   datadir: "datadir",
   
   getProperties() {
      return appProperties;
   }
};