import mediakeys from '../../renderer/common/mediakeys'
import { ipcRenderer, ipcMain } from 'electron';

function registerMediaKeys(desktop, sessionBus) {
   sessionBus.getService(`org.${desktop}.SettingsDaemon`)
         .getInterface(`/org/${desktop}/SettingsDaemon/MediaKeys`,
           `org.${desktop}.SettingsDaemon.MediaKeys`,
           (err, iface) => {
             if (!err) {
               iface.on('MediaPlayerKeyPressed', (n, keyName) => {
                  console.info("Media Key", keyName)
                  if (keyName === "Play") {
                     //ipcRenderer.send('mediakey', 'play')
                     console.info("Need to send message here")
                  }
               })
               iface.GrabMediaPlayerKeys("podpup", 0)
             }
           })
 }
 
 try {
   const dbus = require('dbus-native')
   const sessionBus = dbus.sessionBus()
   registerMediaKeys('gnome', sessionBus);
   registerMediaKeys('mate', sessionBus);
 } catch (e) {
   console.error("Exception registering dbus media keys: ", e)
 }