---
title: Manjaro UI Improvement
tags:
  - Arch Linux
  - NAS
abbrlink: '71e8169'
date: 2023-07-15 23:06:12
---

These usages are helpful to build a solution of NAS Status Monitor Visualization.

#### Fix `pacman-mirrors: ModuleNotFoundError`
Look for the missing modules failed to be imported:
```
sudo pacman -S python3 python-urllib3 python-charset-normalizer python-idna
```

#### Fix blocking pacman upgrade failure

##### Option 1:
```
sudo pacman-mirrors -g -f5
pamac upgrade --force-refresh
```
##### Option 2:
```
sudo pacman-mirrors --fasttrack && sudo pacman -Syyu
```
Also check for
```
yay -Suy
```
It's sometimes possibly also needs to remove conflicting packages to proceed, rather than trying to install by force using the `pacman` options `-d`/`-dd`/`-nodeps`.

#### Allow installing dependencies from AUR
```
sudo pacman -S yay
```

#### UI tools
```
yay -S gotop
sudo pacman -S bspwm sxhkd polybar picom dunst dmenu nitrogen
sudo pacman -S mpd ncmpcpp
```

#### UI modules
```
sudo pacman -S rofi calc xorg xorg-xinit xorg-xbacklight alsa-utils
yay -S pywal networkmanager-dmenu
```
#### Font dependencies

```
sudo pacman -S ttf-font-awesome [ttf-dejavu]
yay -S ttf-material-design-iconic-font ttf-unifont ttf-cascadia-code ttf-nerd-fonts-symbols ttf-material-icons
```

Check if TTF fonts are present in the OS:
```
fc-cache -f -v
fc-list | grep ...
```

#### Clock 
```
systemctl start mpd.service
```
Press `=` after starting `ncmpcpp` in CLI.