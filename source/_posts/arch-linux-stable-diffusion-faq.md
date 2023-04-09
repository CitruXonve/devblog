---
title: Generative AI on Arch Linux FAQ
tags:
  - Arch Linux
  - Stable Diffusion
abbrlink: 72c2fcb
date: 2023-04-09 00:35:36
---

### Dependencies

- Issue of dependency conflict or failure to find the dependency that should be there:  

    > sudo pacman -Syu --debug  
    It triggers a prompt 
    This also performs wide-range package upgrades.

- Issue of `CMake` / `makepkg -si`:

    ```
    ==> Starting build()...
    CMake Error: CMake was unable to find a build program corresponding to "Unix Makefiles".
    CMAKE_MAKE_PROGRAM is not set.  You probably need to select a different build tool.
    CMake Error: CMAKE_C_COMPILER not set, after EnableLanguage
    CMake Error: CMAKE_CXX_COMPILER not set, after EnableLanguage
    -- Configuring incomplete, errors occurred!
    ==> ERROR: A failure occurred in build().
    Aborting...
    ```
    To resolve such building depedencies:
    > sudo pacman -S base-devel

    ```
    Packages (12)
    autoconf-2.71-4  automake-1.16.5-2  bison-3.8.2-5
    debugedit-5.0-5  flex-2.6.4-5  gc-8.2.2-1  guile-3.0.9-1
    m4-1.4.19-3  make-4.4.1-2  patch-2.7.6-9  pkgconf-1.8.1-1
    base-devel-1-2
    ```

- Install pytorch with ROCm backend ([read more](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/Install-and-Run-on-AMD-GPUs#arch-specific-dependencies))

    > For CPUs with AVX2 instruction set support, that is, CPU microarchitectures beyond Haswell (Intel, 2013) or Excavator (AMD, 2015), install `python-pytorch-opt-rocm` to benefit from performance optimizations. Otherwise install `python-pytorch-rocm`.

    > sudo pacman -S python-pytorch-opt-rocm
    
    This may generate an installation as large as:
    ```
    Total Download Size:    2654.00 MiB
    Total Installed Size:  29579.85 MiB

    :: Proceed with installation? [Y/n]
    ```