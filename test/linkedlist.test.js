import { LinkedList } from '../src/renderer/common/linkedlist';

// Empty List Tests
describe('Empty LinkedList', () => {

   let linkedList = null;

   beforeEach(() => {
      linkedList = new LinkedList();
   });

   test('#add()', () => {
      linkedList.add("Alpha");
      expect(linkedList.peekFirst()).toBe("Alpha");
      expect(linkedList.peekLast()).toBe("Alpha");
      expect(linkedList.size()).toBe(1);
   });

   test('#addFirst()', () => {
      linkedList.addFirst("Alpha");
      expect(linkedList.peekFirst()).toBe("Alpha");
      expect(linkedList.peekLast()).toBe("Alpha");
      expect(linkedList.size()).toBe(1);
   });

   test('#size()', () => {
      expect(linkedList.size()).toBe(0);
   });

   test('#peekFirst()', () => {
      expect(linkedList.peekFirst()).toBe(undefined);
   });

   test('#peekLast()', () => {
      expect(linkedList.peekLast()).toBe(undefined);
   });

   test('#poll()', () => {
      expect(linkedList.poll()).toBe(undefined);
   });

   test('#forEach()', () => {
      let count = 0;
      linkedList.forEach((value) => {
         count++;
      });
      expect(count).toBe(0);
   });

   test('#forEachReverse()', () => {
      let count = 0;
      linkedList.forEachReverse((value) => {
         count++;
      });
      expect(count).toBe(0);
   });

   test('#toArray()', () => {
      let listArray = linkedList.toArray();
      expect(listArray.length).toBe(0);
   });

   test('#remove()', () => {
      let value = linkedList.remove();
      expect(value).toBe(undefined);
      expect(linkedList.size()).toBe(0);
   });

   test('#removeLast()', () => {
      let value = linkedList.removeLast();
      expect(value).toBe(undefined);
      expect(linkedList.size()).toBe(0);
   });

   test('#push()', () => {
      linkedList.push("Alpha");
      expect(linkedList.peekFirst()).toBe("Alpha");
      expect(linkedList.peekLast()).toBe("Alpha");
      expect(linkedList.size()).toBe(1);
   });

   test('#pop()', () => {
      let value = linkedList.pop();
      expect(value).toBe(undefined);
      expect(linkedList.size()).toBe(0);
   });

   test('#peek()', () => {
      expect(linkedList.peek()).toBe(undefined);
   });
});

// One Item List Tests
describe('One Item LinkedList', () => {

   let linkedList = null;

   beforeEach(() => {
      linkedList = new LinkedList();
      linkedList.add("Alpha");
   });

   test('#add()', () => {
      linkedList.add("Beta");
      expect(linkedList.peekFirst()).toBe("Alpha");
      expect(linkedList.peekLast()).toBe("Beta");
      expect(linkedList.size()).toBe(2);
   });

   test('#addFirst()', () => {
      linkedList.addFirst("Beta");
      expect(linkedList.peekFirst()).toBe("Beta");
      expect(linkedList.peekLast()).toBe("Alpha");
      expect(linkedList.size()).toBe(2);
   });

   test('#size()', () => {
      expect(linkedList.size()).toBe(1);
   });

   test('#peekFirst()', () => {
      expect(linkedList.peekFirst()).toBe("Alpha");
   });

   test('#peekLast()', () => {
      expect(linkedList.peekLast()).toBe("Alpha");
   });

   test('#poll()', () => {
      expect(linkedList.poll()).toBe("Alpha");
      expect(linkedList.size()).toBe(0);
   });

   test('#forEach()', () => {
      let all = "";
      linkedList.forEach((value) => {
         all += value;
      });
      expect(all).toBe("Alpha");
   });

   test('#forEachReverse()', () => {
      let all = "";
      linkedList.forEachReverse((value) => {
         all += value;
      });
      expect(all).toBe("Alpha");
   });

   test('#toArray()', () => {
      let listArray = linkedList.toArray();
      expect(listArray.length).toBe(1);
      expect(listArray[0]).toBe("Alpha");
   });

   test('#remove()', () => {
      let value = linkedList.remove();
      expect(value).toBe("Alpha");
      expect(linkedList.size()).toBe(0);
   });

   test('#removeLast()', () => {
      let value = linkedList.removeLast();
      expect(value).toBe("Alpha");
      expect(linkedList.size()).toBe(0);
   });

   test('#push()', () => {
      linkedList.push("Beta");
      expect(linkedList.peekFirst()).toBe("Alpha");
      expect(linkedList.peekLast()).toBe("Beta");
      expect(linkedList.size()).toBe(2);
   });

   test('#pop()', () => {
      let value = linkedList.pop();
      expect(value).toBe("Alpha");
      expect(linkedList.size()).toBe(0);
   });

   test('#peek()', () => {
      expect(linkedList.peek()).toBe("Alpha");
   });
});

// Two Item List Tests
describe('Two Item LinkedList', () => {

   let linkedList = null;

   beforeEach(() => {
      linkedList = new LinkedList();
      linkedList.add("Alpha");
      linkedList.add("Beta");
   });

   test('#add()', () => {
      linkedList.add("Charlie");
      expect(linkedList.peekFirst()).toBe("Alpha");
      expect(linkedList.peekLast()).toBe("Charlie");
      expect(linkedList.size()).toBe(3);
   });

   test('#addFirst()', () => {
      linkedList.addFirst("Charlie");
      expect(linkedList.peekFirst()).toBe("Charlie");
      expect(linkedList.peekLast()).toBe("Beta");
      expect(linkedList.size()).toBe(3);
   });

   test('#size()', () => {
      expect(linkedList.size()).toBe(2);
   });

   test('#peekFirst()', () => {
      expect(linkedList.peekFirst()).toBe("Alpha");
   });

   test('#peekLast()', () => {
      expect(linkedList.peekLast()).toBe("Beta");
   });

   test('#poll()', () => {
      expect(linkedList.poll()).toBe("Alpha");
      expect(linkedList.size()).toBe(1);
   });

   test('#forEach()', () => {
      let all = "";
      linkedList.forEach((value) => {
         all += value;
      });
      expect(all).toBe("AlphaBeta");
   });

   test('#forEachReverse()', () => {
      let all = "";
      linkedList.forEachReverse((value) => {
         all += value;
      });
      expect(all).toBe("BetaAlpha");
   });

   test('#toArray()', () => {
      let listArray = linkedList.toArray();
      expect(listArray.length).toBe(2);
      expect(listArray[0]).toBe("Alpha");
      expect(listArray[1]).toBe("Beta");
   });

   test('#remove()', () => {
      let value = linkedList.remove();
      expect(value).toBe("Alpha");
      expect(linkedList.size()).toBe(1);
   });

   test('#removeLast()', () => {
      let value = linkedList.removeLast();
      expect(value).toBe("Beta");
      expect(linkedList.size()).toBe(1);
   });

   test('#push()', () => {
      linkedList.push("Charlie");
      expect(linkedList.peekFirst()).toBe("Alpha");
      expect(linkedList.peekLast()).toBe("Charlie");
      expect(linkedList.size()).toBe(3);
   });

   test('#pop()', () => {
      let value = linkedList.pop();
      expect(value).toBe("Beta");
      expect(linkedList.size()).toBe(1);
   });

   test('#peek()', () => {
      expect(linkedList.peek()).toBe("Beta");
   });
});

// Three Item List Tests
describe('Three Item LinkedList', () => {

   let linkedList = null;

   beforeEach(() => {
      linkedList = new LinkedList();
      linkedList.add("Alpha");
      linkedList.add("Beta");
      linkedList.add("Charlie");
   });

   test('#add()', () => {
      linkedList.add("Delta");
      expect(linkedList.peekFirst()).toBe("Alpha");
      expect(linkedList.peekLast()).toBe("Delta");
      expect(linkedList.size()).toBe(4);
   });

   test('#addFirst()', () => {
      linkedList.addFirst("Delta");
      expect(linkedList.peekFirst()).toBe("Delta");
      expect(linkedList.peekLast()).toBe("Charlie");
      expect(linkedList.size()).toBe(4);
   });

   test('#size()', () => {
      expect(linkedList.size()).toBe(3);
   });

   test('#peekFirst()', () => {
      expect(linkedList.peekFirst()).toBe("Alpha");
   });

   test('#peekLast()', () => {
      expect(linkedList.peekLast()).toBe("Charlie");
   });

   test('#poll()', () => {
      expect(linkedList.poll()).toBe("Alpha");
      expect(linkedList.size()).toBe(2);
   });

   test('#forEach()', () => {
      let all = "";
      linkedList.forEach((value) => {
         all += value;
      });
      expect(all).toBe("AlphaBetaCharlie");
   });

   test('#forEachReverse()', () => {
      let all = "";
      linkedList.forEachReverse((value) => {
         all += value;
      });
      expect(all).toBe("CharlieBetaAlpha");
   });

   test('#toArray()', () => {
      let listArray = linkedList.toArray();
      expect(listArray.length).toBe(3);
      expect(listArray[0]).toBe("Alpha");
      expect(listArray[1]).toBe("Beta");
      expect(listArray[2]).toBe("Charlie");
   });

   test('#remove()', () => {
      let value = linkedList.remove();
      expect(value).toBe("Alpha");
      expect(linkedList.size()).toBe(2);
   });

   test('#removeLast()', () => {
      let value = linkedList.removeLast();
      expect(value).toBe("Charlie");
      expect(linkedList.size()).toBe(2);
   });

   test('#push()', () => {
      linkedList.push("Delta");
      expect(linkedList.peekFirst()).toBe("Alpha");
      expect(linkedList.peekLast()).toBe("Delta");
      expect(linkedList.size()).toBe(4);
   });

   test('#pop()', () => {
      let value = linkedList.pop();
      expect(value).toBe("Charlie");
      expect(linkedList.size()).toBe(2);
   });

   test('#peek()', () => {
      expect(linkedList.peek()).toBe("Charlie");
   });
});