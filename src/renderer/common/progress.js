import through from 'through2';

export default {
   progress(progressCallback) {
      let length = 0;
      let time = 500;
      let transferred = 0;
      let nextUpdate = Date.now() + time;

      let update = {
         percentage: 0,
         transferred: transferred,
         length: length
      };

      let write = function(chunk, enc, callback) {
         var len = chunk.length;
         transferred += len;
         update.transferred = transferred;
         if (Date.now() >= nextUpdate) emit(false);
         callback(null, chunk);
      };

      let end = function(callback) {
         emit(true);
         callback();
      };

      let tr = through({}, write, end);

      let emit = function(ended) {
         update.percentage = ended ? 100 : (length ? (transferred/length) * 100 : 0);
         nextUpdate = Date.now() + time;
         tr.emit('progress', update);
      };

      let onlength = function(newLength) {
         length = newLength;
         update.length = length;
         tr.emit('length', length);
      };

      tr.on('pipe', (stream) => {
         if (typeof length === 'number') return;

         // Support request module
         stream.on('response', function(res) {
            if (!res || !res.headers) return;
            if (res.headers['content-length']) {
               return onlength(parseInt(res.headers['content-length']));
            }
         });
      });

      tr.on('progress', progressCallback);

      tr.progress = function() {
         return update;
      };

      return tr;
   }
};