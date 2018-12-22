import printf from 'printf'

const _audioMimeMapper = {
   "audio/flac": ".flac",
   "audio/mp4": ".m4a",
   "audio/mpeg": ".mp3",
   "audio/ogg": ".ogg",
   "audio/wav": ".wav"
}

export default {
   formatDuration(durationInSecs) {
      let value = ""
      let mins = Math.floor(durationInSecs / 60)
      let secs = durationInSecs % 60
      if (mins > 59) {
         let hours = Math.floor(mins / 60)
         mins = mins % 60
         value = printf("%d:%02d:%02d", hours, mins, secs)
      }
      else {
         value = printf("%d:%02d", mins, secs)
      }
      return value;
   },
   formatDateFromString(value) {
      let d = new Date(value)
      return d.toLocaleDateString()
   },
   mimeToExt(mime) {
      return _audioMimeMapper[mime.toLowerCase()]
   },
   // For development purposes.
   sleep(time) {
      return new Promise((resolve) => setTimeout(resolve, time))
   }
}