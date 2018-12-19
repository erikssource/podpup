
function registerMediaKeys(desktop, sessionBus, mainWindow) {
   sessionBus.getService(`org.${desktop}.SettingsDaemon`)
         .getInterface(`/org/${desktop}/SettingsDaemon/MediaKeys`,
           `org.${desktop}.SettingsDaemon.MediaKeys`,
           (err, iface) => {
             if (!err) {
               iface.on('MediaPlayerKeyPressed', (n, keyName) => {
                  if (keyName === "Play") {
                     console.info("Play Media Key Pressed")
                     mainWindow.webContents.send('mkplay')
                  }
               })
               iface.GrabMediaPlayerKeys("podpup", 0)
             }
           })
 }

export default {
  linuxMediaKeys(mainWindow) {
    try {
      const dbus = require('dbus-native')
      const sessionBus = dbus.sessionBus()
      registerMediaKeys('gnome', sessionBus, mainWindow);
      registerMediaKeys('mate', sessionBus, mainWindow);
    } catch (e) {
      console.error("Exception registering dbus media keys: ", e)
    }
  }
}