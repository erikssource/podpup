

class Node {
   constructor(payload) {
      this._next = null;
      this._previous = null;
      this._payload = payload;
   }

   setPrevious(previous) {
      this._previous = previous;
   }

   setNext(next) {
      this._next = next;
   }

   getNext() {
      return this._next;
   }

   getPrevious() {
      return this._previous;
   }

   getPayload() {
      return this._payload;
   }
}

export class LinkedList {

   constructor() {
      this._head = null;
      this._tail = null;
      this._size = 0;
   }

   add(payload) {
      let node = new Node(payload);
      if (this._head === null) {
         this._head = node;
      }
      if (this._tail === null) {
         this._tail = node;
      }
      else {
         node.setPrevious(this._tail);
         this._tail.setNext(node);
         this._tail = node;
      }
      this._size++;
      return payload;
   }

   addFirst(payload) {
      let node = new Node(payload);
      if (this._tail === null) {
         this._tail = node;
      }
      if (this._head === null) {
         this._head = node;
      }
      else {
         node.setNext(this._tail);
         this._head.setPrevious(node);
         this._head = node;
      }
      this._size++;
      return payload;
   }

   size() {
      return this._size;
   }

   peekFirst() {
      return this._head === null ? undefined : this._head.getPayload();
   }

   peekLast() {
      return this._tail === null ? undefined : this._tail.getPayload();
   }

   poll() {
      return this.remove();
   }

   forEach(cb) {
      let node = this._head;
      while (node !== null) {
         cb(node.getPayload());
         node = node.getNext();
      }
   }

   forEachReverse(cb) {
      let node = this._tail;
      while (node !== null) {
         cb(node.getPayload());
         node = node.getPrevious();
      }
   }

   toArray() {
      let items = [];
      this.forEach((payload) => items.push(payload));
      return items;
   }

   remove() {
      if (this._head === null) {
         return undefined;
      }
      let payload = this._head.getPayload();
      this._head = this._head.getNext();
      if (this._head === null) {
         this._tail = null;         
      }
      else {
         this._head.setPrevious(null);
      }
      this._size--;
      return payload;
   }

   removeLast() {
      if (this._tail === null) {
         return undefined;
      }
      let payload = this._tail.getPayload();
      this._tail = this._tail.getPrevious();
      if (this._tail === null) {
         this._tail = null;
      }
      else {
         this._tail.setNext(null);
      }
      this._size--;
      return payload;
   }

   push(payload) {
      return this.add(payload);
   }

   pop() {
      return this.removeLast();
   }

   peek() {
      return this.peekLast();
   }
}
