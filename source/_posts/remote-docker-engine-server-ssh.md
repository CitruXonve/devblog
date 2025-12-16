---
title: Build a remote server of Docker Engine server via SSH
tags:
  - Docker
  - SSH
  - Ubuntu
abbrlink: 8f9620b4
date: 2025-12-07 12:38:36
---

# Background

There appears to be lots of screen recordings that occupy gigabytes of storage space locally on an MBP, which need to be compressed. While the local tasks running on an MBP may cause the heat dissipating fan to roaring, making use of an idle desktop seems a viable solution to accelerate the workflow.

# Quick Start

Counter-intuitively, there's actually no need to install or run Docker Desktop app on either the client or server side, as long as the **Docker daemon** is ready on the server host and **Docker CLI** is present on the client side, saving lots of confusion, time and effort on the unnecessary desktop app settings.

Either **Docker daemon** and **Docker CLI** can be installed on the common *nix OS or distros including MacOS. If on Windows, **Windows Subsystem Linux (WSL)** will be helpful to prepare the runtime environment without the need to reinstall the entire OS or run a virtual machine, by enabling the certain optional feature instead.

## Essential package installation on server-side in Linux/WSL distro of Ubuntu
- Package sources

  Common practice to refresh the list of available packages and their versions:
  ```bash
  sudo apt update
  ```
  
  Additionally, set up Docker's apt repository using Docker's official GPG key and Apt sources (recommended; see also [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)).
  
  ```bash
  # Add Docker's official GPG key:
  sudo apt update
  sudo apt install ca-certificates curl
  sudo install -m 0755 -d /etc/apt/keyrings
  sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  sudo chmod a+r /etc/apt/keyrings/docker.asc
  
  # Add the repository to Apt sources:
  sudo tee /etc/apt/sources.list.d/docker.sources <<EOF
  Types: deb
  URIs: https://download.docker.com/linux/ubuntu
  Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
  Components: stable
  Signed-By: /etc/apt/keyrings/docker.asc
  EOF
  
  sudo apt update
  ```

- Where is `ifconfig`?

  After updating, install the `net-tools` package, which contains `ifconfig`, using this command:
  ```bash
  sudo apt install net-tools
  ```

- OpenSSH server

  ```bash
  sudo apt install openssh-server
  ```
  
  Enable, Start and check SSH Service:
  ```bash
  sudo systemctl enable ssh
  sudo systemctl start ssh
  sudo systemctl status ssh
  ```
  
  Adjust Firewall (if using UFW):
  ```bash
  sudo ufw allow ssh
  ```

- Docker engine, daemon and container management (latest version)

  ```bash
  sudo apt install docker-ce docker-ce-cli containerd.io
  ```
  
  The Docker service starts automatically after installation. To verify that Docker is running, use:
  ```bash
  sudo systemctl status docker
  ```
  
  Verify that the installation is successful by running the hello-world image (expecting some human-readable self-explanatory outputs):
  ```
  sudo docker run hello-world
  ```

- More usages about Docker daemon ([read more](https://docs.docker.com/engine/daemon/))

  Test Docker daemon connection:
  ```
  dockerd --debug
    [--tls=true \]
    [--tlscert=/var/docker/server.pem \]
    [--tlskey=/var/docker/serverkey.pem \]
    [--host tcp://192.168.59.3:2376]
  ```
  
  By default the daemon stores data in:
  
    - `/var/lib/docker` on Linux
    - `C:\ProgramData\docker` on Windows

## Windows environment setup (skip this if not using Windows on a host)

Before starting, beware of the difference between the concepts of WSL and WSL distros ([read more](https://forums.docker.com/t/issues-with-docker-desktop-and-wsl-2-integration/141865/4)).

What's more, the current versions of WSL are `2.x`, also referred to as `WSL2`. And the WSL command line tool will run in `2.x` version by default.

### WSL Distros

- List all the distro versions ready to install

  ```powershell
  wsl --list --online
  ```

- List the local distros installed
  
  ```powershell
  wsl --list [--verbose]
  ```

- Install a specific distro (e.g. Ubuntu)

  ```powershell
  wsl --install ubuntu
  ```

- Start a WSL distro instance - simply run `wsl` in the built-in Command Prompt, Terminal App or Powershell.

- Check for the private IP address assigned to the Distro, which is helpful for the upcoming network configs

  ```powershell
  wsl hostname -I
  ```

- Stop a running WSL distro only without removing its filesystem

  ```
  wsl --shutdown
  ```

- Remove a WSL distro instance with its filesystem
  ```
  wsl --unregister ubuntu
  ```

### Network Configs on a Windows host

- Allow for incoming `ping` requests

  Add this rule to the firewall via Powershell with administrator permissions to resolve the timeout error of `ping`:
  ```powershell
  New-NetFirewallRule -Name "Ping" -Protocol ICMPv4 -Direction Inbound -Action Allow
  ```

- Allow for incoming SSH requests

  This is to enable the built-in firewall rule for the OpenSSH Server:
  ```
  Enable-NetFirewallRule -DisplayGroup "OpenSSH Server"
  ```

  Alternatively, manually create a new inbound firewall rule:
  ```
  New-NetFirewallRule -DisplayName "Allow SSH Inbound" -Direction Inbound -Protocol TCP -LocalPort 22 -Action Allow -Profile Any
  ```

- Set up Port Forwarding on Windows host

  This is to add a port proxy rule to forward a local port 22 on Windows host to the WSL SSH server port 22 in WSL:
  
  ```powershell
  netsh interface portproxy add v4tov4 listenport=22 listenaddress=0.0.0.0 connectport=22 connectaddress=<wsl-ip>
  ```

- Test connecting to WSL server via SSH from another device
  
  ```powershell
  ssh username@host_ip [-p 22]
  ```

- Alternative: SSH Tunnels from Windows to a Remote Host via WSL (SSH Tunneling)

  This option hasn't been tested and verified yet:
  ```powershell
  ssh -L <local-port>:localhost:<remote-port> <remote-host>
  ```
