# Dev Blog of CitruXonve

[![CircleCI Status](https://dl.circleci.com/status-badge/img/gh/CitruXonve/devblog/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/CitruXonve/devblog/tree/master)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)

[Devblog](https://devblog.citruxonve.net/) - the low-latency serverless knowledge base maintained by [CitruXonve](https://github.com/CitruXonve).

## Prerequisites

- Node.js v18.x (**required**, [here is why](https://stackoverflow.com/questions/67516168/i-just-installed-hexo-static-site-generator-on-debian-and-ran-hexo-server-to-see)) ~~12.x+~~
- [Hexo](https://hexo.io) v7.1.1 ~~6.1.0~~ (recommended)
- [Hexo Theme Icarus](https://github.com/ppoffice/hexo-theme-icarus/)

## Quick start from scratch

```bash
[npm install -g hexo-cli]
npm install hexo
[npx ]hexo <command>
```

Also remember to pull/sync the submodule if the generation of static pages fails, e.g. `No layout: index.html` due to missing submodule project of Hexo theme(s) (see also [git submodule](https://devblog.citruxonve.net/posts/a54d5a40/)):

```bash
git submodule sync
git submodule update --init --recursive --remote
```

# Local testing

* By default, the hexo local server listens at `http://localhost:4000/`.

```bash
[hexo clean]
[hexo g]
hexo s
```

# Deployment
```bash
hexo d -g
```

## License
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)