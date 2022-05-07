# actioncam-timelapse

This Node.js script will encode a JPEG sequence from Sony ActionCam into a HEVC (h.265) video with hardware acceleration by Intel QuickSync via DirectX 11, at quality of 25 and framerate of 30.

The output of Sony ActionCam FDR-X3000 is capable of delivering 4K timelapse (3840x2160).

The following table shows the file size and duration after recording 1 hour of timelapse.

| Interval | 1s | 2s | 5s | 10s | 30s | 60s |
| - | - | - | - | - | - | - |
| Output duration | 2 minutes | 1 minute | 24 seconds | 12 seconds | 4 seconds | 2 seconds |
| Output file size | 240 MB | 120 MB | 48 MB | 24 MB | 8 MB | 4 MB |

If you are not using Windows, you will need to modify this script.

# How to use

1. Create a new folder
1. Download `timelapse.mjs` to this folder
1. Download ffmpeg and put it under this folder
1. Run `node ./timelapse.mjs D:\DCIM\100MSDCF Output.mp4`

> If no arguments is passed, it will read `*.jpg` from current directory and output to `Outputs\output-*.mp4`.

# Environment variables

| Name | Default | Description |
| - | - | - |
| `FRAME_RATE` | 23.976 | Target frame rate |
| `INPUT_DIR` | Current directory | Input directory to recursive finding `*.jpg` |
| `OUTPUT_FILE` | `Outputs/output-*.mp4` | Output file name |
| `VIDEO_QUALITY` | 25 | Video quality |

# Technical

This script will look for `*.jpg` or `*.jpeg` under the directory specified in the first argument, or under the current working directory. Then sort them using filenames, then pipe them into FFMPEG via multipart JPEG.
