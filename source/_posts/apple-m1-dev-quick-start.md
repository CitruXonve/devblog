---
title: Apple M1 Development Quick-start
tags:
  - Mac
abbrlink: 844d69fa
date: 2021-07-22 17:56:00
---

- Command Line Tools

```
==> Downloading and installing Homebrew...
xcrun: error: unable to load libxcrun (dlopen(/Library/Developer/CommandLineTools/usr/lib/libxcrun.dylib, 0x0005): could not use '/Library/Developer/CommandLineTools/usr/lib/libxcrun.dylib' because it is not a compatible arch).
Failed during: git init -q
```

To get rid of the initial git error, install a complete version of Command Line Tools from [Apple Developer site](https://developer.apple.com/download/all/).

Validate Command Line Tools:
> sudo xcode-select -p

- Homebrew

> /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

- Curl & wget

> brew install curl wget

If you need to have curl first in your PATH, run:

> echo 'export PATH="/opt/homebrew/opt/curl/bin:$PATH"' >> ~/.zshrc

For compilers to find curl you may need to set:
> export LDFLAGS="-L/opt/homebrew/opt/curl/lib"
> export CPPFLAGS="-I/opt/homebrew/opt/curl/include"

- Oh-my-zsh

Extend the default `zsh` shell with rich sources of plugins and themes.

- NVM


You should create NVM's working directory if it doesn't exist:

> mkdir ~/.nvm

Add the following to ~/.zshrc or your desired shell
configuration file:

```
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && . "/opt/homebrew/opt/nvm/nvm.sh"  # This loads nvm
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && . "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
```