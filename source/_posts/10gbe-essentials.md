---
title: 10Gbps+ Ethernet Essentials
tags:
  - Ubuntu
abbrlink: 877bbff9
date: 2021-07-21 21:10:00
---

## Prerequisites

`MLNX_OFED_LINUX-5.1` no longer supports lowest-end `Mellanox ConnectX3` series; using `MLNX_OFED_LINUX-5.0` instead.

> sudo mount [MLNX..._ubuntu20.04_x86_64.iso] /mnt/cdrom -o loop  
> ./mlnxofedinstall

## Start configuration

> sudo mst start  
> sudo mst status

## Details

> ibv_devinfo

> mlxconfig -d [device_identifier] query  
> mlxconfig -d [device_identifier] set LINK_TYPE_P1=2

> sudo systemctl start opensmd

See also [more](https://zhuanlan.zhihu.com/p/74082377).