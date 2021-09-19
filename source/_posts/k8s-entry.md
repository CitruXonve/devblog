---
title: Kubernetes (K8s) Containerization at an Entry Level
tags:
  - K8s
categories:
  - DevOps
abbrlink: '92383761'
date: 2021-02-23 23:09:41
---

TL;DR

## What?

A container is an executable unit of software in which application code is packaged (encapsulated), along with its libraries and dependencies, in common ways so that it can be run anywhere, whether
on a desktop, on-premises, or in the cloud. 

*A container include a guest OS; instead it leverages host OS.*
Compared to virtual machines, containers virtualize the operating system rather than the infrastructure.
The clear benefit of containers is that you do not have to run a dedicated operating system instance for each virtual environment. Instead, one operating system is virtualized across all the containers.

To do this, containers take advantage of a form of operating system virtualization.
	
Benefits: isolates processes; controls resources allocated to them; small, fast portable

### Use cases

- Containers are small and lightweight, which makes them a good match for microservice architectures where applications are constructed of many loosely coupled and independently deployable smaller services.
- The combination of a microservices architecture and containers is a common foundation for many teams that embrace DevOps as the way they build, ship, and run software.

<!--more-->

### Orchestration

Container orchestration manages the lifecycle of containers especially in large dynamic environments.
Kubernetes is a portable, extensible, open-source platform for managing containerized workloads and services that facilitates both declarative configuration and automation.
In contrast to PaaS, Kubernetes provides a flexible model that maintains choice for users.
No CI/CD pipelines; no logging, monitoring or alerting; no built-in databases, microservices or other services.

A deployment of Kubernetes is called a "cluster."

The control plane consists of several components.
- First is the Kubernetes API server, which exposes the Kubernetes API.
- All communication in the cluster utilizes this API.
- Next is "etcd," a highly available key value store that contains all the cluster data, deployment configuration and truth of states
- The Kubernetes scheduler assigns newly created Pods to nodes.
- The Kubernetes controller manager runs all the controller processes

Nodes are the worker machines (virtual/physical machines) in a Kubernetes cluster. Each node is managed by the control plane and is able to run Pods. Nodes are not created by Kubernetes itself, but rather by the cloud provider.


Kubernetes objects are persistent entities in Kubernetes. (Can be Pods, namespaces, Deployments, ConfigMaps, and volumes)
- **Namespaces** provide a convenient way to virtualize a physical cluster. With namespaces, you can make one cluster appear to be several distinct clusters. This is useful when several teams want to share a cluster, such as for cost-saving purposes,
- **Pod** is the simplest unit that you deploy in Kubernetes. Represents a process or a single instance of running app in cluster.  A Pod wraps a single container or encapsulate multiple tightly coupled containers.
- **ReplicaSet** is a group of identical Pods that are running. ReplicaSets are the object used to do horizontally scaling by running replicas of a Pod. helps scale applications to meet increasing demand. Maintains desired state. True to this loose-coupling idea, the ReplicaSet does not own any of the pods; instead it uses the pod labels
- **Deployment** is an object that provides updates for both Pods and ReplicaSets. Deployments run multiple replicas of an application by creating ReplicaSets and offering additional management capabilities on top of those ReplicaSets. suitable for stateless applications. Deployments are more robust and provide additional objects, rolling updates than replicasets.