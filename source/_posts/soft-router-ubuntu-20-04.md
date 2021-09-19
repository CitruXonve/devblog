---
title: Soft Router Solution on Ubuntu Server 20.04
tags:
  - Ubuntu
abbrlink: b09b6fb9
date: 2021-07-21 22:31:00
---

This solution is based on the built-in `systemd-networkd`, `isc-dhcp-server` and `hostapd`; conflicted with `dnsmasq`.

It is using the built-in IP forwarding feature against bridging. See also [routing vs bridging](https://en.wikipedia.org/wiki/Bridging_(networking))

## Prerequisites

- Traffic and firewall management

```
sudo ufw enable
sudo ufw status
```

- DHCP server

```
sudo service isc-dhcp-server start
sudo service isc-dhcp-server status
```

- WiFi hotspot

```
sudo systemctl unmask hostapd
sudo systemctl enable hostapd
sudo systemctl status hostapd
```

<!--more-->

## Configurations

- `Netplan` wraps the basic network interface configuration using `networkd` / `NetworkManager` as renderer.

> /etc/netplan/*.yaml

```
sudo netplan generate
sudo netplan apply
```

- DHCP pools

> /etc/dhcp/dhcpd.conf

- OS forwarding feature

> /etc/sysctl.conf

- WiFi AP tuning

> /etc/hostapd/hostapd.conf

## TODO list when problem occurs

- If `NetworkManager` is involved:
> sudo nmcli radio wifi off

- Check IP addresses for network interfaces

> sudo rfkill unblock [interface]

> sudo ifconfig [interface] [CIDR] (up)
or
> sudo ip a add [CIDR] dev [interface]

- Check routing table

> route -n

> sudo ip route add [CIDR] via [gateway_ip] dev [interface] metric [metric_value]

- Quick firewall rule setup

Potential effect on incoming connection: `Operation timed out`.

> sudo ufw allow [port_range]/[protocol]

> sudo ufw allow from [CIDR]

> sudo ufw allow [in|out on [interface]] [proto [protocol]] [from any|[CIDR] port [port_range]] [to any|[CIDR] port [port_range]]

- Check IP forwarding and NAT

> sudo sysctl -p

> sudo iptables -A FORWARD -i [interface] -j ACCEPT

> sudo iptables -t nat -A POSTROUTING -o [interface] -j MASQUERADE