
var mediaKeyManager = {
   playpauseCallback: null
}

export default {
   handlePlaypause() {
      console.info("handlePlaypause Called", mediaKeyManager)
      if (mediaKeyManager.playpauseCallback) {
         mediaKeyManager.playpauseCallback()
      }
   },

   registerPlaypauseHandler(callback) {
      mediaKeyManager.playpauseCallback = callback
   }
}