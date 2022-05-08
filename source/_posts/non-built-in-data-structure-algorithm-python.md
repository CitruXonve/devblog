---
title: Non Built-in Data Structures And Algorithms in Python3
tags:
  - Template
  - Python
abbrlink: a6fa13e5
date: 2022-04-24 00:35:30
---

### Unordered MultiSet

```py
class MultiSet:
    def __init__(self):
        self.data = dict()
    
    def add(self, val):
        self.data[val] = 1 + (self.data[val] if val in self.data else 0)
    
    def remove(self, val):
        if not val in self.data:
            return
        self.data[val] -= 1
        if self.data[val] == 0:
            del self.data[val]
```

### Fenwick Tree / Binary-indexed Tree

```py
class BIT:
    def __init__(self, size):
        self.size = size
        self.data = [0] * size
    
    def add(self, pos, val):
        while pos < self.size:
            self.data[pos] += val
            pos += pos & (-pos)
    
    def query(self, pos):
        res = 0
        while pos > 0:
            res += self.data[pos]
            pos &= pos - 1
        return res
```

<!--more-->

### Binary Heap / Priority Queue
[Sample](https://www.geeksforgeeks.org/binary-heap/)

### Skip List
[Sample 1](https://kunigami.wordpress.com/2012/09/25/skip-lists-in-python/)
[Sample 2](https://developpaper.com/python-implementation-of-skip-list-sample-code/)

### Red Black Tree
[Sample 1](https://www.programiz.com/dsa/red-black-tree)
[Sample 2](https://favtutor.com/blogs/red-black-tree-python)

### [Next Permutation](https://stackoverflow.com/questions/4223349/python-implementation-for-next-permutation-in-stl)