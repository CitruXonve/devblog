---
title: Running FFmpeg on a Remote Server
tags:
  - SSH
  - FFmpeg
abbrlink: e05bb15e
date: 2025-12-17 16:51:02
---

# Background

See also [remote Docker server via SSH](posts/8f9620b4/).

# Basics

[Reference: FFmpeg syntax and examples](https://ffmpeg-api.com/learn/ffmpeg/guide/syntax-and-examples)

## Streaming

### Streaming capability

Be aware that not all the video container formats allow for streaming. Compared to the commonly used `.mp4`, effective streamable video container (muxer) names for use with FFmpeg are `Matroska` (`.mkv`), `MPEG-TS` (`.m2ts` preferred over `.ts` to be distinguished against TypeScript) and so on.

<iframe width="545" height="320" src="https://www.youtube.com/embed/-ssOzR0qSe4" title="What is Video Formats, Container, Codecs | Explained!" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

If the proper format option is missing, an error may occur from FFmpeg as:

```
Unable to choose an output format for 'pipe:'; use a standard extension for the filename or specify the format manually.
```

### Preview an **outbound** stream in real-time replay

```bash
ffmpeg -i [input_source] -f [format] - | ffplay -f [format] -
```

### Pipe and stream videos over SSH **outbound** to a remote ffmpeg process

Note: `-y` option is to skip any keyboard input prompt (in case of overriding an existing output file) to avoid the "broken pipe" error.

```bash
ffmpeg -i [input_source] -f [format] - | ssh [remote_user]@[remote_host] "ffmpeg -y -i pipe:0 [options] [output]"
```

### Preview an **inbound** stream in real-time replay

```bash
ssh [remote_user]@[remote_host] "ffmpeg -i [input_source] -f [format] -" | ffplay -f [format] -
```

### Pipe and stream videos over SSH **inbound** from a remote ffmpeg process

```bash
ssh [remote_user]@[remote_host] "ffmpeg -i [input_source] -f [format] pipe:1" | cat > output_file
```

## Performance/Quality Tuning

### Nvidia GPU-accelerated video processing

[Reference 1](https://stackoverflow.com/questions/44510765/gpu-accelerated-video-processing-with-ffmpeg)  
[Reference 2](https://unix.stackexchange.com/questions/794394/how-to-make-ffmpeg-use-gpu-mostly-for-reducing-file-sizes)

CUDA

```
ffmpeg -i [input] -hwaccel cuda [output]
```

CUVID

```
ffmpeg -i [input] -c:v h264_cuvid [output]
```

Full hardware transcode with NVDEC and NVENC

```
ffmpeg -hwaccel cuda -hwaccel_output_format cuda -i [input] -c:v h264_nvenc [output]
```
