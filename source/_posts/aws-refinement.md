---
title: Learning Paths towards AWS Certification
tags:
  - Data Analytics
  - AWS
categories:
  - Computing - Cloud
  - Notes
abbrlink: 115e2ac7
date: 2021-02-20 16:29:06
---

TL;DR

## AWS IaaS

### Amazon S3

scalable, durable object storage; decoupling storage from processing; parallelization; centralized, accessible and avoid moving between systems

**S3 bucket policy and IAM policy are different.**
Blocking the offending website IP traffic in security group may be trivial; makes "allows" but not "denies"

## AWS IaC

### CloudFormation

AWS CloudFormation treats infrastructure / environment as code.

## AWS DBaaS

### RDS

RDS Backups are automated, daily full backup; transaction logs are backed-up every 5 min. 7-35 days of retention. Manual DB snapshots have retention as long as possible.

RDS can have up to 5 read replicas, within AZ, cross AZ or cross origin. Async replication. Reads are eventually consistent. Replicas can be promoted. **It is possible to setup multi-AZ read replicas for Disaster Recovery(DR).**

<!--more-->

### DynamoDB

DynamoDB is fully-managed scalable, fast and predictable performance NoSQL database. High availability and durability by 3 geographic replicas for each table. Eventually consistent or strong consistent choices. Secondary index for queries other than partition key and sort key.
1RCU = 1 strongly consistent reading or 2 eventually consistent readings of 4KB/s
1WCU = Writing of 1KB/s
Global tables for replications

### SQS/SNS Queue

Amazon SQS is "Fully managed message queuing service".
Standard SQS Queue can be asynchronous, not guaranteed the order, and at-least-once delivery. The other type of SQS Queue is first in first out and processed exactly once.
SNS is kind of like SQS but SNS has topics and those topics can have subscribers.

## AWS Security

### IAM

**Users or Groups are attached to Policies.**
**Services assume Roles to gain access to other services, and roles have policies.**

## AWS Storage

EBS (Elastic Block Store) Volume is a network drive (i.e. not a physical drive) allowing to persist data. Has latency. **Locked to specific AZ.** (Need to migrate via I/O) Billed for all provisioned capacity in GBs and IOPS. Can increase capacity over time.

EFS (Elastic Network File System) works in multi-AZ. Pay per use.

Instance store is *ephemeral* (lost after termination) storage physically attached to the machine, **best for intensive IOPS performance.**

## Extra

https://www.scnsoft.com/blog/spark-vs-hadoop-mapreduce
https://data-flair.training/blogs/apache-spark-rdd-vs-dataframe-vs-dataset/
https://www.guru99.com/data-lake-vs-data-warehouse.html
https://phoenixnap.com/kb/cassandra-vs-mongodb
https://stackshare.io/stackups/amazon-sqs-vs-kafka
