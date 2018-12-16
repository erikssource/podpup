
var mediaKeyManager = {
   playpauseCallback: null
}

export default {
   handlePlaypause() {
      if (mediaKeyManager.playpauseCallback) {
         mediaKeyManager.playpauseCallback()
      }
   },

   registerPlaypauseHandler(callback) {
      mediaKeyManager.playpauseCallback = callback
   }
}