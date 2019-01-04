import LinkedList from 'linkedlistpup';

export class ProcessManager {

   constructor(concurrency) {
      this._queue = new LinkedList();
      this._concurrency = concurrency;
      this._task_count = 0;
   }
   
   addTask(task) {
      task._setHook(this._completeHook.bind(this));
      this._queue.add(task);
      this._executeTasks();
   }

   _completeHook() {
      this._task_count--;
      this._executeTasks();
   }

   _executeTasks() {
      while (this._queue.size() > 0 && (this._task_count < this._concurrency)) {
         let task = this._queue.poll();
         this._task_count++;
         task.start();
      }
   }

}
