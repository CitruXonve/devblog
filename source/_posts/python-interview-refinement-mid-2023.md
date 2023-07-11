---
title: Python Interview Refinement in Mid-2023
tags:
  - Python
  - Interview
abbrlink: 7f231503
date: 2023-07-10 23:07:51
---

### LRU Cache
```python
class Node:
    def __init__(self, key, value):
        self.prev = None
        self.next = None
        self.key = key
        self.val = value
```
<!--more-->
```python
class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.size = 0
        self.data = dict()
        self.head = None  # most recently used
        self.rear = None  # least recently used

    def add_node(self, key, value):
        node = Node(key, value)
        self.data[key] = node
        node.next = self.head
        if self.head is not None:
            self.head.prev = node
        self.head = node
        if self.rear is None:
            self.rear = node
    
    def delete_node(self, key):
        if not key in self.data:
            return
        node = self.data[key]
        if node.prev is not None:
            node.prev.next = node.next
        if node.next is not None:
            node.next.prev = node.prev
        if node == self.head:
            self.head = node.next
        if node == self.rear:
            self.rear = node.prev
        del self.data[key]

    def get(self, key):
        if not key in self.data:
            return None
        val = self.data[key].val
        # renew the node
        self.delete_node(key)
        self.add_node(key, val)
        return val

    def put(self, key, value):
        if key in self.data:
            # Case 1: existing key - renew the node
            self.delete_node(key)
            self.add_node(key, value)
            return
        if not key in self.data and self.size < self.cap:
            # Case 2: non-existing key - insert the node directly
            self.add_node(key, value)
            self.size += 1
            return
        # Case 3: non-existing key - vacate the least recently used one and insert the node
        least_used_key = self.rear.key
        self.delete_node(least_used_key)
        self.add_node(key, value)
```

### LFU Cache

```python
class Node:
    def __init__(self, key, value, freq = 1):
        # similar as LRU Cache Node ...
        self.freq = freq

class LFUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.size = 0
        self.min_freq = 1
        self.data = dict()  # stores (key: int, node: Node)
        self.freq_table = dict()  # stores (freq: int, linked_list: (head, rear))

    def add_node(self, key, value, freq):
        node = Node(key, value, freq)
        self.data[key] = node
        if not freq in self.freq_table:
            self.freq_table[freq] = (node, node)
            return

        # freq in self.freq_table
        head, rear = self.freq_table[freq]
        node.next = head
        if head is not None:
            head.prev = node
        head = node
        if rear is None:
            rear = node
        self.freq_table[freq] = (head, rear)
    
    def delete_node(self, key, update_min_freq_if_empty):
        if not key in self.data:
            return
        node = self.data[key]
        freq = node.freq
        
        if node.prev is not None:
            node.prev.next = node.next
        if node.next is not None:
            node.next.prev = node.prev

        del self.data[key]

        if not freq in self.freq_table:
            return
        head, rear = self.freq_table[freq]
        if freq in self.freq_table and node == head:
            head = node.next
        if freq in self.freq_table and node == rear:
            rear = node.prev
        if head is None or rear is None:
            # delete this linked list from frequency table
            del self.freq_table[freq]
            # min_freq should NOT be larger than the just deleted freq at any time
            # update min_freq can either be updated to +1 or remain the same
            self.min_freq = update_min_freq_if_empty \
                if update_min_freq_if_empty is not None and update_min_freq_if_empty == self.min_freq + 1 \
                else self.min_freq
        else:
            # update linked list of this freq
            self.freq_table[freq] = (head, rear)
        

    def get(self, key):
        if not key in self.data:
            return None
        val = self.data[key].val
        freq = self.data[key].freq
        # renew the frequency of the node
        self.delete_node(key, freq + 1)
        self.add_node(key, val, freq + 1)
        return val

    def put(self, key, value):
        if key in self.data:
            # Case 1: existing key - renew the node
            freq = self.data[key].freq
            self.delete_node(key, freq + 1)
            self.add_node(key, value, freq + 1)
            return
        if not key in self.data and self.size < self.cap:
            # Case 2: non-existing key - insert the node directly
            self.min_freq = 1
            self.add_node(key, value, 1)
            self.size += 1
            return
        # Case 3: non-existing key - vacate the least frequently used one and insert the node
        # min_freq = min(self.freq_table.keys())
        if not self.min_freq in self.freq_table:
            return
        _, least_used_node = self.freq_table[self.min_freq]  # self.freq_table[min_freq]
        self.delete_node(least_used_node.key, None)
        self.min_freq = 1
        self.add_node(key, value, 1)
```

### LC 787

#### (1) BFS
```python
def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
    best_price = [sys.maxsize >> 1 for _ in range(n)]
    best_price[src] = 0

    # build adjacency table (directional!)
    # ...

    que = Queue()
    que.put((0, -1, src)) # cost, stops, node
    while que.qsize() > 0:
        cost, stops, node = que.get()
        if stops > k:
            continue
        for ed, price in adj[node]:
            if ed == node or stops + 1 > k:
                continue
            if cost + price < best_price[ed]:
                best_price[ed] = cost + price
                que.put((cost + price, stops + 1, ed))
    
    return best_price[dst] if best_price[dst] < (sys.maxsize >> 1) else -1
```

#### (2) Modified Dijkstra
```python
def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
    best_price = [sys.maxsize >> 1 for _ in range(n)]
    best_price[src] = 0

    # build adjacency table (directional!)
    # ...

    track = [(0, -1, src)] # cost, stops, node
    while track:
        cost, stops, node = heappop(track)
        # returns early
        if node == dst:
            return cost
        for ed, price in adj[node]:
            if ed == node or stops + 1 > k:
                continue
            # limit number of status to add to PQ
            if cost + price < best_price[ed]:
                best_price[ed] = cost + price
                heappush(track, (cost + price, stops + 1, ed))
    
    return -1
```

#### (3) DP
Not so efficient in the real time. Higher memory usage.
```python
def solve(self, dp: List[DefaultDict[int, int]], adj: DefaultDict[int, List[int]], cur: int, dst:int, availStops: int) -> int:
    if availStops < 0:
        return -1
    if cur == dst:
        return 0
    if dp[cur][availStops] is not None:
        return dp[cur][availStops]
    new_cost = sys.maxsize >> 1
    for ed, price in adj[cur]:
        cost = self.solve(dp, adj, ed, dst, availStops - 1)
        if cost > -1:
            new_cost = min(new_cost, cost + price)
    dp[cur][availStops] = new_cost if new_cost < (sys.maxsize >> 1) else -1
    return dp[cur][availStops]

def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
    # build adjacency table (directional!)
    # ...
    dp = [defaultdict(lambda: None) for node in range(n)]
    return self.solve(dp, adj, src, dst, k + 1)
```

### LC 1928. Minimum Cost to Reach Destination in Time

#### (1) BFS
```python
def minCost(self, maxTime: int, edges: List[List[int]], passingFees: List[int]) -> int:
    n = len(passingFees)
    best_price = [sys.maxsize >> 1 for _ in range(n)]
    best_price[0] = 0
    min_time = [sys.maxsize >> 1 for _ in range(n)]
    min_time[0] = 0

    # build adjacency table (bidirectional!)
    # ...

    que = Queue()
    que.put((passingFees[0], 0, 0)) # cost, time, node
    while que.qsize() > 0:
        cur_cost, cur_time, node = que.get()
        for ed, time in adj[node]:
            if ed == node or time + cur_time > maxTime:
                continue
            # when new cost is better
            if cur_cost + passingFees[ed] < best_price[ed]:
                best_price[ed] = cur_cost + passingFees[ed]
                que.put((cur_cost + passingFees[ed], time + cur_time, ed))
            # when new cost is not better but new time consumption is better
            elif time + cur_time < min_time[ed]:
                min_time[ed] = time + cur_time
                que.put((cur_cost + passingFees[ed], time + cur_time, ed))
    
    return best_price[n - 1] if best_price[n - 1] < (sys.maxsize >> 1) else -1
```

#### (2) Modified Dijkstra
```python
def minCost(self, maxTime: int, edges: List[List[int]], passingFees: List[int]) -> int:
    num_nodes = len(passingFees)
    cost = [(passingFees[0], 0, 0)] # (fees, time, node_id)
    low_fee = [sys.maxsize >> 1 for _ in range(num_nodes)]
    low_fee[0] = passingFees[0]
    best_time = [maxTime + 1 for _ in range(num_nodes)]
    best_time[0] = 0

    # build adjacency table (bidirectional!)
    # ...

    while len(cost) > 0:
        cur_fees, cur_time, node = heappop(cost)
        # returns early
        if node == num_nodes - 1:
            return cur_fees
        for ed, time in adj[node]:
            if ed == node or cur_time + time > maxTime:
                continue
            # limit number of status to add to PQ
            if cur_time + time < best_time[ed] or cur_fees + passingFees[ed] < low_fee[ed]:
                low_fee[ed] = cur_fees + passingFees[ed]
                best_time[ed] = cur_time + time
                heappush(cost, (cur_fees + passingFees[ed], cur_time + time, ed))

    return -1
```

#### (3) DP
Less efficient; consumes more memory.
```python
def solve(self, dp: List[DefaultDict[int, int]], adj: DefaultDict[int, List[int]], passingFees: List[int], cur: int, availTime: int) -> int:
    if cur == len(passingFees) - 1: # destination
        return passingFees[cur]
    if dp[cur][availTime] is not None:
        return dp[cur][availTime]
    new_cost = sys.maxsize >> 1
    for ed, time in adj[cur]:
        if ed == cur or availTime < time:
            continue
        cost = self.solve(dp, adj, passingFees, ed, availTime - time)
        if cost > -1:
            new_cost = min(new_cost, cost + passingFees[cur])
    dp[cur][availTime] = new_cost if new_cost < (sys.maxsize >> 1) else -1
    return dp[cur][availTime]

def minCost(self, maxTime: int, edges: List[List[int]], passingFees: List[int]) -> int:
    # build adjacency table (bidirectional!)
    # ...

    dest = len(passingFees) - 1
    dp = [defaultdict(lambda: None) for node in range(dest)]
    return self.solve(dp, adj, passingFees, 0, maxTime)
```