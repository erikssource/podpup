
export class Task {
   constructor(task, payload, err, complete, start) {
     this._task = task;
     this._payload = payload;
     this._err = err;
     this._complete = complete;
     this._start = start;
     this._hook = null;
   }

   _setHook(hook) {
      this._hook = hook;
   }
 
   start() {
     if (this._start !== null) {
       this._start();
     }
     this._task(this._payload).then((result) => {
       if (this._hook !== null) {
          this._hook();
       }
       this._complete(result);
     },
     (err) => {
       if (this._hook !== null) {
          this._hook();
       }
       this._err(err);
     });
   }
 }
 