---
title: Manjaro UI Improvement
tags:
  - Arch Linux
  - NAS
abbrlink: '71e8169'
date: 2023-07-15 23:06:12
---

These usages are helpful to build a solution of NAS Status Monitor Visualization.

#### Fix `pacman-mirrors` `ModuleNotFoundError``

```
sudo pacman -S python3 python-urllib3 python-charset-normalizer python-idna
```

#### Fix blocking pacman upgrade failure

```
sudo pacman-mirrors --fasttrack && sudo pacman -Syyu
yay -Suy
```
Possibly also needs to remove conflicting packages to proceed.

#### Allow installing dependencies from AUR
```
sudo pacman -S yay
```

#### UI tools
```
yay -S gotop
sudo pacman -S bspwm sxhkd polybar picom dunst dmenu nitrogen
```

#### UI modules
```
sudo pacman -S rofi calc
yay -S pywal networkmanager-dmenu
```
#### Font dependencies

```
sudo pacman -S ttf-dejavu ttf-font-awesome
yay -S ttf-material-design-iconic-font
```

Check if TTF fonts are present in the OS:
```
fc-cache
fc-list | grep ...
```