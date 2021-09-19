---
title: System Design Memorandum on Priority Topics
tags:
  - System Design
abbrlink: 288a795e
date: 2021-03-13 15:01:06
---

TL;DR

### Cache is to reduce latency in the system.

Cache prefers immutable or static data. 
Cache can be stale when not updated. Ask, do we care that much?
Write Policy: Write through cache vs write back cache
Eviction policy: LRU, FIFO, LFU
	

### How to sync between Cache and DB?

It is more complicated when syncing Cache replicas & DB replicas and maintain consistency & high throughput.

Get() follows cache-aside strategy ; update() follows write through strategy;

delete() request both operations into caches and DBs; upon DB changed, trigger some asynchronized threads to wait a certain while and notify the cache again to evict stale data that happened to be  brought by concurrent reading from DB into cache (proven and incorporated by Facebook)
	
### Hashing function basically transforms arbitrary pieces of data into fixed size values (typ. Integers)

### Consistent hashing

Consistent hashing maximizes the cache hits when adding and removing cache nodes; minimizes key re-distribution; mitigate hotkey problem

<!--more-->

Clockwise walk logic: Consider (partition a circle) placing nodes on a imaginary circle and distribute evenly in the clockwise direction. Hashing function can put them. When determining which node a request should go to, walk from the key location on the cycle, in that direction and encounter the nearest server.

When adding or removing nodes, place/remove nodes and maintain the locations of others. But the partitioning or key distribution is still non-uniform; will use virtual nodes or replicas

By introducing virtual nodes pointing to real ndoes, each server is represented by multiple virtual nodes and responsible for multiple regions.

Server of higher capacity is assigned to more virtual nodes.

As they grows, the distribution of keys becomes more balanced and standard deviation gets smaller.

### Load balancer 

### server-selection strategy
Round-robin, random selection, performance-based selection

Round-robin: client requests are routed to available servers on a cyclical basis. Round robin server load balancing works best when servers have roughly identical computing capabilities and storage capacity.

Hot spot when sharding key or hashing function are suboptimal, or the workload is naturally skewed
	
### Strong consistency - ACID transactions

### Eventual consistency 
Reads might return stale data;
Only guarantee the state of DB will eventually reflect writes within a certain period.
	
### Leader election - consensus algorithm often implemented by 3rd-party service

ZooKeeper is a strongly consistent, highly available key-value store.

Often used to store important configuration or leader election
	
### Rate limiting - by what? Ips? Users? Regions?

Apache Kafka is a distributed messaging system created by LinkedIn. Very useful when using the streaming paradigm as opposed to polling.
