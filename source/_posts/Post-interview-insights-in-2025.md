---
title: Post-interview DS&A Coding Insights in 2025
tags:
  - Interview
  - Python
abbrlink: 33dd1419
date: 2025-07-12 13:22:52
---

The questions below will be in a reverse-chronological order as they appeared in the interviews.

## Simulated Calculator in String Processing

### Calculator V1 - [LC 224. Basic Calculator (Hard)](https://leetcode.com/problems/basic-calculator/)

Essentially, merely `+-` arithmetic operations and parenthesis (nested possible) need to be supported.

#### Concise & efficient Solution after refactoring

Upon second thought, it appears that stack operations are need only when destructing parenthesis and processing the `+-` operators (see also other shared solutions on LeetCode).

<!--more-->

```python
class Solution:
    def calculate(self, s: str) -> int:
        res, num, sign = 0, 0, 1
        stack = [1] # + by default

        for ch in s:
            if ch.isdigit():
                num = num * 10 + int(ch)
            elif ch == '(': # construct
                stack.append(sign)
            elif ch == ')': # destruct
                stack.pop()
            elif ch in set('+-'):
                res += sign * num
                # decide current sign based on parenthesis
                sign = (1 if ch == '+' else -1) * stack[-1]
                num = 0 # reset

        return res + sign * num  # remaining number
```

#### Intuitive Solution

It's easier to come up with, but results in many edge cases to be taken care of, still likely ending up in `TLE` on LeetCode.

```python
class Solution:
    def process_add_sub(self, nums, ops) -> int:
        if not len(nums):
            return 0
        res = nums[0]
        # for idx, op in enumerate(ops, start=1):
        for idx in range(1, len(ops) + 1):
            if idx >= len(nums):
                break
            op = ops[idx - 1]
            # print(f"process_add_sub {idx}:", (op, nums[idx]))
            res += -nums[idx] if op == '-' else nums[idx]
        return res

    def locate_last(self, elems: list):
        if type(elems) == list and (len(elems) < 1 or type(elems[-1]) != list):
            return elems
        return self.locate_last(elems[-1])

    def locate_upper(self, elems: list):
        if type(elems) == list and len(elems) and type(elems[-1]) == list and len(elems[-1]) \
            and type(elems[-1][-1]) == list:
            return self.locate_upper(elems[-1])
        return elems

    def calculate(self, s: str) -> int:
        nums, ops, prev_ch = [0], [], '0' # init-value

        for ch in s:
            if ch.isdigit() and not prev_ch.isdigit():
                tar_nums = self.locate_last(nums)
                tar_nums.append(int(ch))
            elif ch.isdigit():
                tar_nums = self.locate_last(nums)
                tar_nums[-1] = tar_nums[-1] * 10 + int(ch)
            elif ch == '(':
                tar_nums = self.locate_last(nums)
                tar_nums.append([]) # dummy 0 in case of leading -
                tar_ops = self.locate_last(ops)
                tar_ops.append([])
                # print('(:', nums, ops)
                pass
            elif ch == ')':
                upper_nums = self.locate_upper(nums)
                tar_nums = upper_nums.pop()
                upper_ops = self.locate_upper(ops)
                tar_ops = upper_ops.pop()
                val = self.process_add_sub(tar_nums, tar_ops)
                upper_nums.append(val)
            elif ch in set('+-'):
                tar_nums = self.locate_last(nums)
                if len(tar_nums) < 1: # in case of leading +- in parenthesis
                    tar_nums.append(0)
                tar_ops = self.locate_last(ops)
                tar_ops.append(ch)
            else: # skip invalid character
                continue
            prev_ch = ch

        if len(ops) + 1 < len(nums):
            ops = [['+'] * (len(nums) - len(ops)), *ops]
        return self.process_add_sub(nums, ops)
```

### Calculator V2 - [227. Basic Calculator II (Medium)](https://leetcode.com/problems/basic-calculator-ii/)

It was asked during a recent 60-min coding interview with `OpusClip` in early-July 2025, in which `+-*/` arithmetic operations need to be supported.

#### Concise & efficient Solution after refactoring

Upon second thought, it appears that multiply and division operations are only needed when encountering an operator or reaching the end of the expression. Otherwise, simply proceed with adding/subtraction.

```python
class Solution:
    from operator import mul, floordiv

    def process_mul_div(self, nums: list[int], ops: list[str]) -> None:
        if len(nums) > 1 and len(ops) and ops[-1] in set('*/'):
            op, num2, num1 = ops.pop(), nums.pop(), nums.pop()
            nums.append(floordiv(num1, num2) if op == '/' else mul(num1, num2))

    def calculate(self, s: str) -> int:
        nums, ops, prev_ch = [0], [], '0' # init-value
        for ch in s:
            if ch.isdigit() and not prev_ch.isdigit():
                nums.append(int(ch))
            elif ch.isdigit():
                nums[-1] = nums[-1] * 10 + int(ch)
            elif ch in set('+-*/'):
                self.process_mul_div(nums, ops)
                ops.append(ch)
            else: # skip invalid character
                continue
            prev_ch = ch

        self.process_mul_div(nums, ops)
        return nums[0] + sum(-nums[idx + 1] if op == '-' else nums[idx + 1] \
            for idx, op in enumerate(ops))
```

#### Intuitive Solution

Used in the original interview - it's easier to come up with, but results in too many edge cases to be taken care of, so as to be difficult to complete in a timely manner during an interview.

```python
class Solution:
    def calculate(self, s: str) -> int:
        # pre-processing
        nums: list[Optional[int]] = [None]
        ops: list[tuple[str, int]] = []
        src = re.sub(r"[^0-9\+\-\*\/]", '', s) # clean-up
        for ch in src:
            if re.match(r"[0-9]", ch): # numeric number
                nums[-1] = nums[-1] * 10 + int(ch) if nums[-1] is not None else int(ch)
            elif ch in set('*/+-'): # operators */+-
                ops.append((ch, len(nums)))
                nums.append(None)

        # pass 1: multiply & division
        new_nums: list[tuple[int, int]] = []
        last_idx: Optional[int] = None
        for op, idx in filter(lambda op: op[0] in set('*/'), ops):
            if last_idx is not None and last_idx + 1 < idx:
                last_idx = None
            if idx >= 1 and idx < len(nums):
                prev_idx = idx - 1
                if last_idx is None:
                    num1, num2 = nums[idx - 1], nums[idx]
                else:
                    num1, num2 = new_nums[-1][1], nums[idx]
                    prev_idx, _ = new_nums.pop()
                new_nums.append((prev_idx, mul(num1, num2) if op == '*' else floordiv(num1, num2)))
                last_idx = idx

        # pass 2: add & subtract
        res, next_ptr = nums[0], 0
        if len(ops) > 0 and ops[0][0] in set('*/'):
            res = new_nums[0][1]
        # use two-pointer to calculate the result
        for op, idx in filter(lambda op: op[0] in set('+-'), ops):
            while next_ptr < len(new_nums) and new_nums[next_ptr][0] < idx:
                next_ptr += 1
            val = new_nums[next_ptr][1] if next_ptr < len(new_nums) and idx == new_nums[next_ptr][0] else nums[idx]
            res = add(res, val) if op == '+' else sub(res, val)
        return res
```

#### Test cases

```python
if __name__ == "__main__":
  assert(solution('') is None)
  assert(solution('  ') is None)
  assert(solution('0') == 0)
  assert(solution('10') == 10)
  assert(solution('1*2+3*4-0') == 14)
  assert(solution(' 3/2 ') == 1)
  assert(solution(' 2/ 3') == 0)
  assert(solution(' 15 / 2+3 ') == 10)
  assert(solution(' 3+15 / 2 ') == 10)
  assert(solution(' 100 / 11 /2*10 -0 -1/2+ 10 +0') == 50)
  assert(solution('1000 0302 *21-9+0  ') == 210006333)
  assert(solution("1+2*5/3+6/4*2") == 1 + 3 + 2)
  assert(solution("111+999+111/999") == 111 + 999)
  assert(solution("1787+2136/3/2*2") == 2499)
  print('Test passed!')
```

## LRUCache && LinkedList (singly-linked)

Originally asked by `Aktus AI` in a 30-min
coding round in mid-February 2025 - [live demo](https://sharepad.io/live/TepsSxj).

The reusability has to be improved in the original implementation during the interview:

```python
class LRUCache:
    class LinkedList:
        class Node:
            def __init__(self, val: int, next_node: Optional['Node']=None) -> None:
                self.data = val
                self.next = next_node

        def __init__(self, val: int) -> None:
            self.head = Node() # dummy node
            self.rear = self.head

        def insert(self, val: int) -> None:
            node = Node(val) # insert a node of value to the rear of the linked list
            self.rear.next = node
            self.rear = node
            # if self.head.next is None:
                # self.head.next = node

        def delete(self) -> None: # delete from head
            if self.head.next is not None:
                if self.head == self.rear:
                    self.rear = self.rear.next
                self.head = self.head.next

    def __init__(self, capacity: int):
        # self.c
        pass

    def get(self, key: int) -> int:
        pass

    def put(self, key: int, value: int) -> None:
        pass
```

### Test cases

The followings are the notes when asked by the interviewer to test the coding orally:

```python
"""
init LinkedList:
head rear
|    |
Node(next=None)

insert 1:
new_node=Node(1,next=None)
head             rear
|                |
Node(next=Node(1,))

insert 2:
new_node=Node(2,next=None)
head                         rear
|                            |
Node(next=Node(1,next=Node(2,)))

insert 3:
new_node=Node(3,next=None)
head                                     rear
|                                        |
Node(next=Node(1,next=Node(2,next=Node(3,)))

insert 4, delete from head 1:
new_node=Node(4,next=None)
head                                       rear
|                                          |
Node(1,next=Node(2,next=Node(3,next=Node(4,))
"""
```

```python
if __name__ == '__main__':
    # Test case 1:
    print("Test Case 1:")
    cache = LRUCache(2)
    cache.put(1, 1)
    cache.put(2, 2)
    print(cache.get(1))    # Expected output: 1
    cache.put(3, 3)
    print(cache.get(2))    # Expected output: -1 (not found)
    cache.put(4, 4)
    print(cache.get(1))    # Expected output: -1 (not found)
    print(cache.get(3))    # Expected output: 3
    print(cache.get(4))    # Expected output: 4

    # Additional Test Case 2:
    print("\nTest Case 2:")
    cache = LRUCache(1)
    cache.put(1, 10)
    print(cache.get(1))    # Expected: 10
    cache.put(2, 20)
    print(cache.get(1))    # Expected: -1
    print(cache.get(2))    # Expected: 20

    # Additional Test Case 3:
    print("\nTest Case 3:")
    cache = LRUCache(3)
    cache.put(1, 1)
    cache.put(2, 2)
    cache.put(3, 3)
    print(cache.get(2))    # Expected: 2
    cache.put(4, 4)
    print(cache.get(1))    # Expected: -1
    print(cache.get(3))    # Expected: 3
    print(cache.get(4))    # Expected: 4
```

## HashTable && LinkedList (singly-linked)

Originally asked during a 60-min coding interview with LinkedIn in early-February 2025.

Revised implementation using **singly-linked nodes** (instead of array/list):

```python
from typing import Optional, Union, Callable

class LinkedList:
    class Node:
        data: Optional[str]
        next: Optional['Node'] # type: ignore

        def __init__(self,
                    value: Optional[str] = None,
                    next_node: Optional['Node'] = None) -> None: # type: ignore
            self.data = value
            self.next = next_node

    head: Node

    def __init__(self) -> None:
        self.head = self.Node() # dummy node at creation

    def insert(self, value: Optional[str] = None) -> None: # insert as head node
        self.head.next = self.Node(value, next_node=self.head.next) # pass existing next node

class Hashtable:
    key_nums: int
    data: list[Optional[LinkedList]]
    hash_func: Callable[[str], int]

    def __init__(self, size: int = 1000007) -> None:
        self.key_nums = size
        self.data = [None] * self.key_nums # [LinkedList() for _ in range(self.key_nums)]
        self.hash_func = lambda key: \
            sum(pow(10, int(digit[0])) * int(digit[1]) if digit[1] >= '0' and digit[1] <= '9' else ord(digit[1])
                for digit in enumerate(reversed(key))) % self.key_nums

    def get(self, key: str) -> Union[list[str], str, None]:
        hashed_key: int = self.hash_func(key)
        if hashed_key >= 0 and hashed_key < self.key_nums and self.data[hashed_key] is not None:
            ptr: Optional[LinkedList] = self.data[hashed_key].head # empty data for dummy node
            res: list[str] = []
            while ptr.next is not None:
                ptr = ptr.next
                res.append(ptr.data)
            return res if len(res) > 1 else res[0]
        else:
            return None

    def put(self, key: str, value: str) -> None:
        hashed_key: int = self.hash_func(key)
        if hashed_key >= 0 and hashed_key < self.key_nums:
            if self.data[hashed_key] is None:
                self.data[hashed_key] = LinkedList() # initialization
            # insert or chain nodes of values
            self.data[hashed_key].insert(value)
```

### Test cases

```python
hash_table = Hashtable()
print(hash_table.get('10')) # output: None
print(hash_table.put('10', '20')) # None
print(hash_table.put('key1', '3')) # None
print(hash_table.get('10')) # output: 20
print(hash_table.get('1')) # None
print(hash_table.put('key2', '4')) # None
print(hash_table.put('key2', '5')) # None
print(hash_table.get('key2')) # 5 -> 4
print(hash_table.get('key1')) # 3
print(hash_table.put('key2', '-2')) # None
print(hash_table.get('key1')) # 3
print(hash_table.get('key2')) # -2 -> 5 -> 4
```

## LRUCache && LinkedList (doubly-linked)

Originally asked during a **90-min offline** coding round with Speechify in early-February 2025.

Requirement: Both most/least recently used nodes need to be accessed.

Learnings: Beware of the modularization and reusability to avoid running into unnecessary issues. When refreshing a node in the middle of a list, avoid mixing the head logic with the mid-node logic.

Note: No need to use dummy node like singly linked list.

## LFUCache && LinkedList (doubly-linked)

~~Not asked in any interview yet.~~ It was asked by EvenUp in a coding round as part of the final interviews in early-Aug 2025. See [460. LFU Cache (Hard)](https://leetcode.com/problems/lfu-cache/description/).

Although there was an uncommon solution based on Priority Queue to sort the keys by frequencies and timestamps that was tested passing on LeetCode, it relied on the [`remove` method](https://docs.oracle.com/javase/8/docs/api/java/util/PriorityQueue.html#remove-java.lang.Object-) of native Priority Queue class in Java, of which no equivalent implementation exists in Python `heapify` library.

A more acceptable solution is to reuse and extend the LRU Cache class design using doubly-linked lists.

```py
from collections import defaultdict
from typing import Optional

class Node:
    def __init__(self, key, value, freq):
        self.prev = None
        self.next = None
        self.key = key
        self.val = value
        self.freq = freq

class LFUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.size = 0
        self.min_freq = 1
        self.data = dict() # key -> Node
        self.freq = defaultdict(lambda : { 'head': None, 'rear': None }) # freq -> {head, rear} # most recently used, least recently used

    def _add_node(self, key, value, frequency) -> None:
        node = Node(key, value, frequency)
        self.data[key] = node

        head = self.freq[frequency]['head']
        rear = self.freq[frequency]['rear']
        node.next = head

        if head is not None:
            head.prev = node
        self.freq[frequency]['head'] = node
        if rear is None:
            self.freq[frequency]['rear'] = node

    def _delete_node(self, key) -> None:
        if not key in self.data:
            return
        node = self.data[key]
        frequency = node.freq
        if node.prev is not None:
            node.prev.next = node.next
        if node.next is not None:
            node.next.prev = node.prev

        head = self.freq[frequency]['head']
        rear = self.freq[frequency]['rear']
        if node == head:
            self.freq[frequency]['head'] = head.next
        if node == rear:
            self.freq[frequency]['rear'] = rear.prev
        del self.data[key]

    def _renew_node(self, key, value = None) -> int:
        val = value if value is not None else self.data[key].val
        freq = self.data[key].freq
        self._delete_node(key)
        self._add_node(key, val, freq + 1)
        if self.freq[freq]['head'] is None and self.freq[freq]['rear'] is None:
            del self.freq[freq]
            # update it if current frequency happens to be the global minimum frequency
            self.min_freq = freq + 1 if freq == self.min_freq else self.min_freq
        return val

    def get(self, key) -> Optional[int]:
        if not key in self.data:
            return None
        return self._renew_node(key)

    def put(self, key, value) -> None:
        if key in self.data:
            self._renew_node(key, value)
            return
        if not key in self.data and self.size < self.cap:
            self._add_node(key, value, 1)
            self.size += 1
            self.min_freq = 1
            return
        # if not key in self.data and self.size == self.cap
        least_freq_key = self.freq[self.min_freq]['rear']
        if least_freq_key is not None:
            self._delete_node(least_freq_key.key)
        self._add_node(key, value, 1)
        self.min_freq = 1
```

### OrderedDict

An alternative solution is to use `OrderedDict` to simulate a linked list for conciseness, of which adding a key can be handled by value (`None`) assignment and removing can be achieved by `popitem(last=False)`.

```py
from collections import defaultdict, OrderedDict

class LFUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.size = 0
        self.min_freq = 0
        self.kv = {}                       # key -> (value, freq)
        self.freq_buckets = defaultdict(OrderedDict)  # freq -> OrderedDict of keys for LRU

    def _bump(self, key: int, new_value=None):
        """Increase key's frequency and (optionally) update its value."""
        value, f = self.kv[key]
        if new_value is not None:
            value = new_value

        # Remove from current freq bucket (LRU structure)
        del self.freq_buckets[f][key]
        if not self.freq_buckets[f]:
            del self.freq_buckets[f]
            self.min_freq = f + 1 if self.min_freq == f else self.min_freq

        # Add to next freq bucket at the MRU position
        nf = f + 1
        self.freq_buckets[nf][key] = None
        self.kv[key] = (value, nf)

        return value  # convenient for get()

    def get(self, key: int):
        if key not in self.kv or self.cap == 0:
            return None
        return self._bump(key)

    def put(self, key: int, value: int):
        if self.cap == 0:
            return

        if key in self.kv:
            # Update value and bump freq
            self._bump(key, new_value=value)
            return

        # Evict if full
        if self.size == self.cap:
            # Evict the LRU key from the current min_freq bucket
            evict_key, _ = self.freq_buckets[self.min_freq].popitem(last=False)
            del self.kv[evict_key]
            if not self.freq_buckets[self.min_freq]:
                del self.freq_buckets[self.min_freq]
            # size remains the same after eviction
        else:
            self.size += 1

        # Insert new key with freq = 1
        self.kv[key] = (value, 1)
        self.freq_buckets[1][key] = None
        self.min_freq = 1
```

### Test cases

```python
cache = LFUCache(2)
cache.put(1, 1)
cache.put(2, 2)
assert(cache.get(1) == 1)
cache.put(3, 3) # 2 evicted
assert(cache.get(2) is None)
assert(cache.get(3) == 3)
cache.put(4, 4) # 1 evicted
assert(cache.get(1) is None)
assert(cache.get(3) == 3)
assert(cache.get(4) == 4)
print("Test case 1 passed!")

cache = LFUCache(3)
cache.put(1, 1)
cache.put(3, 3)
cache.put(8, 8)
assert(cache.get(3) == 3)
cache.put(2, 2)
cache.put(-1, -1)
assert(cache.get(1) is None)
assert(cache.get(8) is None)
cache.put(5, 5)
assert(cache.get(3) == 3)
assert(cache.get(-1) == -1)
assert(cache.get(2) is None)
print("Test case 2 passed!")
```

## Priority Queue

Originally asked by Duolingo in early-February 2025.

Problem description:

```markdown
There appears to be a certain data structure, together with trace logs of insertion and pop operations of element values into and out of it, but the type of the data structure is unknown.

The only known types of the data structure are as follows, which can be one type or more out of the following:
Stack, queue, or priority queue (the minimum element gets popped out first)

Given the trace log as input, determine the potential type(s) of the data structure and output as a set of type strings. If none of the types applies, output an empty set.
```

Only minor typo occurred in implemenation during interview:

```python
def data_structure(trace):
    """
    Returns:
        A set containing zero or more of the strings "stack",
        "queue", or "priority", indicating which data structures
        the trace can represent
    """
    # edge case: empty
    if len(trace) == 0:
        return {"stack", "queue", "priority"}
        # return {"stack", "queue"}
    # edge case: all inserts or all pops
    types = set([line[0] for line in trace])
    if types == {'insert'} or types == {'pop'}:
        return set()
    res = {'stack', 'queue', 'priority'}
    # assume it can be a stack and check for most number of elements in the data structure at any time
    stack = []
    # num_elements = 0
    for line, element in trace:
        if line == 'insert':
            stack.append(element)
            # num_elements += 1
        elif line == 'pop' and (len(stack) == 0 or element != stack[-1]):
            res.remove('stack') # not FILO; can't be a stack
            break
        elif line == 'pop':
            stack.pop() # FILO

    from collections import deque
    que = deque()
    for line, element in trace:
        if line == 'insert':
            que.append(element)
        elif line == 'pop' and len(que) == 0:
            res.remove('queue')
            break
        elif line == 'pop' and len(que) > 0 and que.popleft() != element:
            res.remove('queue')
            break
        elif line == 'pop' and len(que) > 0:
            que.popleft() # FIFO
    # minimum heap - priority-queue
    from heapq import heappop, heappush
    min_heap = []
    min_element = None
    for line, element in trace:
        if line == 'insert':
            heappush(min_heap, element)
            min_element = min(element, min_heap[0]) if len(min_heap) > 0 else element
        elif line == 'pop' and len(min_heap) == 0:
            res.remove('priority')
            break
        elif line == 'pop' and len(min_heap) > 0 and min_heap[0] != min_element:
            res.remove('priority')
            break
        elif line == 'pop':
            heappop(min_heap)

    return res
    pass
```

### Test cases

```python
def run_tests():
    """ You should implement some tests here. """
    trace = [("insert", 5), ("insert", 10), ("pop", 5)]
    assert data_structure(trace) == {"queue", "priority"}
    assert data_structure([]) == {"stack", "queue", "priority"}
    assert data_structure([("pop", 5)]) == set()
    assert data_structure([("insert", 5), ("pop", 5), ("insert", 0), ("pop", 0)]) == {
        "stack",
        "queue",
        "priority",
    }
    assert data_structure([("insert", 5), ("pop", 5), ("insert", 0)]) == {"stack", "queue", "priority"}
    assert data_structure([("insert", 5), ("pop", 5), ("insert", 0), ("insert", 0)]) == {"stack", "queue", "priority"}

    print("Success!")

if __name__ == "__main__":
    run_tests()
```

## Multi-unit Conversion as Graph

Originally asked during a 60-min coding interview with Snap in mid-Jan 2025. The problem was so challenging that the proper solution wasn't brought up until after about 40 minutes.

Problem Description:

```markdown
Your old code in javascript has been preserved below.

Create a function convertUnits, to convert a number from a given starting unit to a given ending unit.
You're given a list of conversion factors consisting of triple `(c, u, v)`, where `c` is a float and `u, v` are unit names.
```

Example:

```python
list = [[12, 'in', 'ft'], [3, 'ft', 'yd'], [5280, 'ft', 'mi'], [220, 'yd', 'furlong'], [25.4, 'mm', 'in'], [100, 'cm', 'm'], [10, 'mm', 'cm']]

convertUnits(0.125, 'mi', 'furlong', list) # returns 1
convertUnits(1, 'mi', 'm', list) # returns 1609.34
```

After revision, it appears to be totally applicable to convert the problem into graph-traversal:

```python
from typing import Optional
from collections import deque, defaultdict

def convertUnits(c: float, u: str, v: str, factors: list[list]) -> Optional[float]:
    # build adjacency list using dictionary denoting the direct conversion factors of every unit
    adj_list: defaultdict[str, list[list]] = defaultdict(list) # DefaultDict[str, List[List[str, float]]]
    for factor in factors:
        rate: float = factor[0]
        unit1: str = factor[1]
        unit2: str = factor[2]
        # set up conversion list for both units
        adj_list[unit1].append([rate, unit2])
        adj_list[unit2].append([1.0 / rate, unit1])

    # perform BFS from u to v and calculate the overall rate
    visited: dict[str, float] = { u: 1.0 }
    que: deque[str] = deque()
    que.append(u)
    while len(que) and v not in visited:
        cur_unit = que.popleft()
        for factor in adj_list.get(cur_unit, []):
            next_rate: float = factor[0]
            next_unit: str = factor[1]
            if next_unit in visited:
                continue
            visited[next_unit] = visited[cur_unit] * next_rate
            que.append(next_unit)

    return c / visited[v] if v in visited else None

factors = [[12, 'in', 'ft'], [3, 'ft', 'yd'], [5280, 'ft', 'mi'], [220, 'yd', 'furlong'], [25.4, 'mm', 'in'], [100, 'cm', 'm'], [10, 'mm', 'cm']]
print(convertUnits(0.125, 'mi', 'furlong', factors)) # 1.0
print(convertUnits(1, 'mi', 'm', factors)) # 1609.344
```

Original intuitive BFS implementation failed to cope with those beyond 2-step conversions within the tight interview timeline:

```typescript
const convertUnits = (
  c: number,
  u: string,
  v: string,
  factors: Array<[number, string, string]>
): number => {
  var ratio: number = 1.0;
  var conversion: Map<string, number> = new Map();
  var adj: string[] = [];
  // key: Array<u, v> -> value: ratio number

  // parse the ratios
  for (const factor of factors) {
    var pair1 = [factor[1], factor[2]].join("");
    var pair2 = [factor[2], factor[1]].join("");
    conversion[pair1] = factor[0];
    conversion[pair2] = 1.0 / factor[0];
    adj.append(pair1);
    adj.append(pair2);
  }
  // combine the ratios
  for (const factor1 of factors) {
    for (const factor2 of factors) {
      if (factor1[1] === factor2[2]) {
        // check overlapping units
        var pair1 = [factor1[2], factor2[1]].join("");
        var pair2 = [factor2[1], factor1[2]].join("");
        var rate = factor1[0] * factor2[0];
        conversion[pair1] = factor1[0] * factor2[0];
        conversion[pair2] = 1.0 / rate;
      }
      //  || factor1[2] === factor2[1]
    }
  }

  // breath-first search using queue
  var que: string[] = [u];
  while (que.length > 0) {
    var top = que[0];
    que.shift();
    for (const factor in conversion) {
    }
  }
  return ratio * c;
};
```
