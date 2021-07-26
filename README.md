# Dev Blog of CitruXonve

![Travis-CI build](https://travis-ci.com/CitruXonve/devblog.svg?branch=master)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)

[Devblog](https://devblog.citruxonve.net/) - the low-latency durable knowledge base of [CitruXonve](https://github.com/CitruXonve).

## Prerequisites

- Node.js 11.x+ (recommended)
- [Hexo](https://hexo.io) 5.4.0 (recommended)
- [Hexo Theme Icarus](https://github.com/ppoffice/hexo-theme-icarus/)

## Quick start from scratch

```bash
npm install -g hexo-cli
npm install hexo
npx hexo <command>
```

Also remember to pull/sync the submodule if the generation of static pages fails (see also [git submodule](https://devblog.citruxonve.net/posts/a54d5a40/)):

```bash
git submodule sync
git submodule update --init --recursive --remote
```

# Local testing

* Replace the `url: '__BASE_URL__'` by `https://localhost:4000/` to suppress syntax error!!

```bash
hexo g
hexo s
```

## License
[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/)