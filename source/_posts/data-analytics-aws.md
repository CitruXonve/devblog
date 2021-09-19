---
title: Data Analytics from the Perspective of AWS
tags:
  - Data Analytics
  - AWS
categories:
  - Computing - Cloud
  - Notes
abbrlink: 541fef6d
date: 2021-03-05 21:57:53
---

TL;DR

## Data Analytics at a Glance

**Analysis** is a detailed examination of something in order to understand its nature or determine its essential features. Data analysis is the process of compiling, processing, and analyzing data so that you can use it to make decisions.

**Analytics** is the systematic analysis of data. Data analytics is the specific analytical process being applied.

Data analysis solutions, which are broader than big data solutions, are made up of gathering, storing, processing, and visualizing data.

The challenges identified in many data analysis solutions can be summarized by five key challenges: *volume*, *velocity*, *variety*, *veracity*, and *value*.

### Structured vs Semi-structured vs Unstructured data

- Structured data is organized and stored in the form of values that are grouped into rows and columns of a table. *Commonly stored in relational databases.*

- Semi-structured data is often stored in a series of key-value pairs that are grouped into elements within a file. *Often stored in NoSQL databases or CSV, XML or JSON files.*

- Unstructured data is not structured in a consistent way. Some data may have structure similar to semi-structured data but others may only contain metadata. *Often takes the form of files or objects.*

<!--more-->

## Volume – data storage
When businesses have more data than they are able to process and analyze, they have a volume problem.

#### Amazon S3

scalable, durable object storage; decoupling storage from processing; parallelization; centralized, accessible and avoid moving between systems.

Other S3 benefits: Store anything; Secure object storage; Natively online, HTTP access; 99.999999999% durability

An object is composed of a file and any metadata that describes that file.
Buckets are logical containers for objects.
An object key is the unique identifier for an object in a bucket.
Think of Amazon S3 as a basic data map between "bucket + key + version" and the object itself. 

#### Data Lake

A data lake is a **centralized repository** that allows you to store *structured*, *semistructured*, and *unstructured data* at any scale, through a single set of tools.

Traditional data storage and analytic tools can no longer provide the agility and flexibility required to deliver relevant business insights. That’s why many organizations are shifting to a data lake architecture.

Benefits of data lake: By using data lakes, you can break down data silos and bring data into a single, central repository that is managed by a single team. That gives you a single, consistent source of truth. Store any type of data regardless of structure. Leave that pre-processing to the system that processes it, rather than the system that stores it. Can still be analyzed using ETL, AI and ML.

Benefits of AWS data lake: cost-effective data storage; security and compliance; take advantage of many different data collection and ingestion tools; categorize and manage your data; turn data into meaningful insights.

Feature:
- Collect and store any type of data, at any scale, and at low cost
- Secure the data and prevent unauthorized access
- Catalog, search, and find the relevant data in the central repository
- Quickly and easily perform new types of data analysis
- Use a broad set of analytic engines for one-time analytics, real-time streaming, predictive analytics, AI, and machine learning

Open source distributed processing frameworks, such as those supported by Amazon EMR. Apache Hadoop and Spark are both supported by Amazon EMR.

"Data scientists spend 60% of their time cleaning and organizing data and 19% collecting data sets. "Data preparation is a huge undertaking. 

#### Data Warehouse

A data warehouse is a central repository of structured data from many data sources. This data is transformed, aggregated, and prepared for business reporting and analysis before it is loaded.

A subset of data from a data warehouse is called a data mart. Data marts only focus on one subject or functional area. A warehouse might contain all relevant sources for an enterprise, but a data mart might store only a single department’s sources. Because data marts are generally a copy of data already contained in a data warehouse, they are often fast and simple to implement.

|Characteristics|Data warehouse|Data lake|
|---|---|---|
|Data|Relational from transactional systems, operational databases, and line of business applications|Non-relational and relational from IoT devices, websites, mobile apps, social media, and corporate applications|
|Schema|Designed prior to implementation (schema-on-write); Written at the time of analysis |(schema-on-read)|
|Price/performance|Fastest query results using higher cost storage|Query results getting faster using low-cost storage|
|Data quality|Highly curated data that serves as the central version of the truth|Any data, which may or may not be curated (e.g., raw data)|
|Users|Business analysts|Data scientists, data developers, and business analysts (using curated data)|
|Analytics|Batch reporting, BI, and visualizations|Machine learning, predictive analytics, data discovery, and profiling.|

#### Amazon Redshift

Amazon Redshift lets you set up and deploy a new data warehouse in minutes. Recommended storing massive amounts of structured data for complex analysis. It’s built to store and query datasets ranging from gigabytes to petabytes in size. Scalable and 10x performance vs traditional ones.
- Benefits of Amazon Redshift
- Faster performance
	- 10x faster than other data warehouses
- Easy to set up, deploy, and manage
- Secure
- Scales quickly to meet your needs
	
Traditional data warehousing: pros and cons:

|Pros	|Cons|
|---|---|
|Fast data retrieval	|Costly to implement|
|Curated data sets	|Maintenance can be challenging|
|Centralized storage	|Security concerns|
|Better business intelligence	|Hard to scale to meet demand|

Amazon Redshift Spectrum allows you to combine your data lake and data warehouse as if it were a single source of data. it’s possible to execute a single query against exabytes of data!

a tool for creating ETL operations called Amazon EMR. Amazon EMR is a managed Hadoop framework. 

Hadoop supports rapid data transfers, which means you can speed up the processing time for complex queries. Whether you use Hadoop on-premises or Amazon EMR, you will use the same tools, with one major exception: Amazon EMR uses its own file system. And that means you can use your Amazon S3 data lake as the data store.

Data storage on a BIG scale:
- When storing individual objects or files, we recommend Amazon S3.
- When storing massive volumes of data, both semistructured and unstructured, we recommend building a data lake on Amazon S3.
- When storing massive amounts of structured data for complex analysis, we recommend storing your data in Amazon Redshift.

#### Apache Hadoop

Hadoop uses a distributed processing architecture, in which a task is mapped to a cluster of commodity servers for processing. Each piece of work distributed to the cluster servers can be run or re-run on any of the servers. The cluster servers frequently use the Hadoop Distributed File System (HDFS) to store data locally for processing. The results of the computation performed by those servers are then reduced to a single output set. One node, designated as the master node, controls the distribution of tasks and can automatically handle server failures.

Hadoop clusters provide extremely fast and reliable ingestion and processing of data.

Amazon EMR provides an alternative to HDFS: the EMR File System (EMRFS).

## Velocity – data processing

When businesses need rapid insights from the data they are collecting, but the systems in place simply cannot meet the need, there's a velocity problem.

Batch processing means processing content in batches.  process it at certain intervals—for example, on a schedule or when you reach a certain volume of data. This kind of processing is performed on datasets like server logs, financial data, fraud reports, and clickstream summaries. Batch processing comes in two forms: scheduled (regular predictable massive burst at once) and periodic (irregular unpredictable tremendous workloads).

Stream processing means processing data in a stream. processing data that’s generated continuously, in small datasets (measured in kilobytes) for real-time feedback or continuous insights. This kind of processing is performed on datasets like IoT sensor data, e-commerce purchases, in-game player activity, clickstreams, or information from social networks. Stream processing also comes in two forms: real time (very small individual batches in ms) and near-real time (small individual batches in min)

Stream processing is used to get initial insights and real-time feedback, while batch processing is used to get deep insights from complex analytics.

In stream processing, Amazon Kinesis Data Analytics allows you to choose to query a rolling time window of data, say the last two minutes. The analysis is limited to only those records collected within that window of time. Because of this limitation, analytics on streaming data are often simple aggregates.

**Attributes of batch and stream processing**

The table below highlights the difference between batch and stream processing: 

|	|Batch data processing	|Stream data processing|
|---|---|---|
|Data scope	|Queries or processing over all or most of the data in the dataset	|Queries or processing over data within a rolling time window, or on just the most recent data record|
|Data size	|Large batches of data	|Individual records or micro batches consisting of a few records|
|Latency	|Minutes to hours	|Seconds or milliseconds|
|Analysis	|Complex analytics	|Simple response functions, aggregates, and rolling metrics|

The more complex definition is that batch processing is the execution of a series of programs, or jobs, on one or more computers without manual intervention.

#### Amazon EMR

Amazon EMR is a managed service for executing highly complex, massive batch workloads. This service also allows highly complex analytic operations. It provides managed Hadoop framework.

Amazon EMR has mitigated this problem (collection systems and processing systems are out of balance) by decoupling the collection system from the processing system. 

Both Hadoop and Spark support general batch processing, streaming analytics, machine learning, graph databases, and ad hoc queries. The difference is that Spark uses in-memory caching and optimized execution for faster performance. Analytics are performed by first filtering the data and then aggregating it. avoids writing data to storage.

#### AWS Glue

AWS Glue is a fully managed ETL service that categorizes, cleans, enriches, and moves your data reliably between various data stores, which makes it easy to prepare and load your data for analytics. AWS Glue simplifies and automates difficult and time-consuming data discovery, conversion, mapping, and job-scheduling tasks. In other words, it simplifies data processing.

In addition to running the Apache Hadoop framework, you can also run other popular distributed frameworks such as Apache Spark, HBase, Presto, and Flink in EMR.

#### AWS Lambda

AWS Lambda is a serverless compute service that can be used to trigger processing operations in a batch processing system.

Amazon Redshift is a managed, fast, scalable data warehouse service that stores large amounts of transactional data for the purpose of analytics.

With streaming data solutions, the default is to decouple the collection system, called the producer, from the processing system, called the consumer. The streaming solution provides a persistent buffer for your incoming data. Second, each of the stream producers can write their data to the same endpoint。  Third is the ability to preserve the ordering of data.

#### AWS Kinesis

Kinesis makes it easy to collect, process, and analyze real-time, streaming data so you can get timely insights and react quickly to new information.

There are many reasons to use streaming data solutions. In a batch processing system, processing is always asynchronous, and the collection system and processing system are often grouped together. With streaming solutions, the collection system (producer) and the processing system (consumer) are always separate (decoupled). Streaming data uses what are called data producers. Each of these producers can write their data to the same endpoint, allowing multiple streams of data to be combined into a single stream for processing. Another huge advantage is the ability to preserve client ordering of data and the ability to perform parallel consumption of data. This allows multiple users to work simultaneously on the same data. Parellelization in collecting and consuming data.

Amazon Kinesis Data Firehose is the easiest way to capture, transform, and load data streams into AWS data stores for near real-time analytics with existing business intelligence tools. 

Amazon Kinesis Data Streams enables you to build custom, real-time applications that process data streams using popular stream processing frameworks. 

Amazon Kinesis Data Analytics is the easiest way to process data streams in real time with SQL or Java without having to learn new programming languages or processing frameworks.

Amazon Kinesis Video Streams makes it easy to securely stream video from connected devices to AWS for analytics, machine learning (ML), and other processing. 

Amazon Athena is an interactive query service that makes it easy to analyze data in Amazon S3 using standard SQL. Athena is serverless, so there is no infrastructure to manage, and you pay only for the queries that you run.

Amazon QuickSight is a fast, cloud-powered business intelligence (BI) service that makes it easy for you to deliver insights to everyone in your organization.

## Variety – data structure and types

When your business becomes overwhelmed by the sheer number of data sources to analyze and you cannot find systems to perform the analytics, you know you have a variety problem.

Data Variety is not about data types but about how data types are organized.

Structured data is hot, immediately ready to be analyzed. 
Semistructured data is lukewarm—some data will be ready to go and other data may need to be cleansed or preprocessed. Unstructured data is the frozen ocean—full of exactly what you need but separated by all kinds of stuff you don’t need.

#### OLTP vs OLAP

there are two primary information systems or methods for organizing information: online transaction processing, or OLTP, and online analytical processing, or OLAP. 

Online transaction processing (OLTP) databases, often called operational databases, logically organize data into tables with the primary focus being on the speed of data entry. These databases are characterized by a large number of insert, update, and delete operations.
All decisions about the organization of data and storage of attributes is based on ensuring rapid data entry and updates. The effectiveness of an OLTP system is often measured by the number of transactions per second.

Online analytical processing (OLAP) databases, often called data warehouses, logically organize data into tables with the primary focus being the speed of data retrieval through queries. These databases are characterized by a relatively low number of write operations and the lack of update and delete operations.
All decisions about the organization of data and storage of attributes are based on the types of queries and other analytics that will be performed using the data. The effectiveness of an OLAP system is often measured by the response time of query results.

|Characteristic	|OLTP	|OLAP|
|---|---|---|
|Nature	|Constant transactions (queries/updates)	|Periodic large updates, complex queries|
|Examples	|Accounting database, online retail transactions	|Reporting, decision support|
|Type	|Operational data	|Consolidated data|
|Data retention	|Short-term (2-6 months)	|Long-term (2-5 years)|
|Storage	|Gigabytes (GB)	|Terabytes (TB)/petabytes (PB)|
|Users	|Many	|Few|
|Protection	|Robust, constant data protection and fault tolerance	|Periodic protection|

In an **OLTP system**, the most common queries are called lookup queries. These queries need to return several columns of data for each matching record. The filters on this data are generally based on the key columns in that table. In this type of system, you might query to get details for a specific order.

In an **OLAP system**, the most common queries are aggregate queries. These queries take large numbers of rows and reduce them to a single row by aggregating the values in one or more columns. In this type of system, you might query to find out the total number of items sold on a specific date.
	
|	|Row-based indexes   |Columnar indexes|
|---|---|---|
|Storage on disk|	Row by row	|Column by column|
|Read/write	|Best at random reads and writes	|Best at sequential reads and writes|
|Best for	|Returning full rows of data based on a key	|Returning aggregations of column values|
|Implementation	|Transactional systems	|Analytical processing
|Data compression	|Low to medium compression can be achieved	|High compression is the norm|

## Veracity – cleansing and transformation

When you have data that is ungoverned, coming from numerous, dissimilar systems and cannot curate the data in meaningful ways, you know you have a veracity problem.
Data veracity is contingent on the integrity of the data. 

**Data cleansing** is the process of detecting and correcting corruptions within data.

**Referential integrity** is the process of ensuring that the constraints of table relationships are enforced.

**Domain integrity** is the process of ensuring that the data being entered into a field matches the data type defined for that field.

**Entity integrity** is the process of ensuring that the values stored within a field match the constraints defined for that field.

The *share* stage is where consumers gain access to the data in the form of reports. Most consumers will have a good idea of what the numbers should be. If consumers do not see what they expect, they will question the validity of the data.

- **Relational integrity** ensures that both members of a relationship remain consistent.
- **Entity integrity** ensures that values within a field remain consistent.
- An **information schema** is a database of metadata containing information on all database objects.
- A **logical schema** lists the constraints, relationships, and properties of tables and views in a database.

|ACID compliance|BASE compliance|
|---|---|
|Strong consistency|Weak consistency – stale data is OK|
|Isolation is key|Availability is key|
|Focus on committed results|Best effort results|
|Conservative (pessimistic) availability|Aggressive (optimistic) availability|

When the consistency of changes across all instances is my primary concern, ACID compliance is the proper method for compliance enforcement.

When data is being generated in a highly active environment and availability is my primary concern, BASE compliance is the proper method for compliance enforcement.

Your data analysis solution requires a process to gather, transform, and move data into a new analytical data store. 
ETL operations allow you to ensure that your data has the accuracy, precision, and depth you need to properly analyze the data and produce a complete data narrative through reports and dashboards. 