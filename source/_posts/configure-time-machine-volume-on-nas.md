---
title: Configure a ZFS volume for Time Machine on NAS
tags:
  - NAS
  - ZFS
abbrlink: a6d4d30
date: 2022-07-20 23:45:03
---

### Preparation

A ZFS pool should surely pre-exist there to allow for the operations introduced later.

- Key point: Why not split, or shrink existing volumes for a Time Machine volume?

    Not viable. A ZFS partition always tries to occupy as much space as possible, so does ZFS volumes under it, sharing the entire space of it. To reserving some space is exactly what the `quota` property is designed for. 

    In addition, you can use the `reservation` property to guarantee that a specified amount of disk space is available to a file system. Both properties apply to the dataset on which they are set and all descendents of that dataset.

    [More...](https://docs.oracle.com/cd/E23823_01/html/819-5461/gazvb.html)

- Creating a new ZFS filesystem

    > zfs create -o compression=lz4 pool/filesystem

    where the purpose of an optional argument -o compression=lz4 is to turn on the compression for this dataset. 

    <!--more-->

    Check if it is mounted:

    > zfs get mountpoint pool/filesystem

    > zfs get mounted pool/filesystem

- Setting Quotas on ZFS File Systems

    > zfs set quota=10G pool/dataset

    > zfs get quota pool/dataset

    Check for any change in `AVAIL`:

    > zfs list -r pool

- Grant access to ZFS volume

    The reading and writing permission controls of the ZFS volume simply go with that in the Linux filesystem:

    > sudo chown owner:group pool/filesystem

### Set up Time Machine Server

- Dependency installation

    > sudo apt install netatalk avahi-daemon

- Netatalk Configuration

    ```
    # /etc/netatalk/afp.conf  

    [myTimeMachine]  
    path = /pool/dataset
    valid users = linux_user 
    time machine = yes  
    ```

    > sudo systemctl restart netatalk.service

- Avahi Configuration

    Create file `/etc/avahi/services/afpd.service` as:
    ```xml
    <?xml version="1.0" standalone='no'?><!--*-nxml-*--> 
    <!DOCTYPE service-group SYSTEM "avahi-service.dtd"> 
    <service-group>  
    <name replace-wildcards="yes">%h</name>   
    <service> 
        <type>_afpovertcp._tcp</type> 
        <port>548</port> 
    </service>   
    <service> 
        <type>_device-info._tcp</type> 
        <port>0</port> 
        <txt-record>model=Xserve</txt-record> 
    </service>   
    </service-group>
    ```

    > sudo systemctl restart avahi-daemon.service

- Unblock network access from firewalls

    Unblock `afp` protocol requests ([example](https://wiki.archlinux.org/title/Netatalk)):
    > sudo iptables -A INPUT -p tcp --dport afpovertcp -j ACCEPT

### Usage

Press [Cmd]+[K] in Finder. Use the Linux user credential to log into `afp://ip_address_or_domain_name`.

### References

[Building NAS with ZFS, AFP/Samba for Time Machine](https://blog.gwlab.page/building-nas-with-zfs-afp-for-time-machine-d8d67add1980)

[Netatalk Wiki](https://wiki.archlinux.org/title/Netatalk)

[Mounting and Sharing ZFS File Systems](https://docs.oracle.com/cd/E23823_01/html/819-5461/gaynd.html)

[ZFS Quotas and Reservations](https://docs.oracle.com/cd/E23823_01/html/819-5461/gazvb.html)