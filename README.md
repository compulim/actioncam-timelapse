# actioncam-timelapse

This Node.js script will encode a JPEG sequence from Sony ActionCam into a HEVC (h.265) video with hardware acceleration by Intel QuickSync via DirectX 11, at quality 25 and framerate of 30.

The output of Sony ActionCam FDR-X3000 is capable of delivering 4K timelapse (3840x2160).

If you are not using Windows, you will need to modify this script.

# How to use

1. Create a new folder
1. Download `timelapse.mjs` to this folder
1. Download ffmpeg and put it under this folder
1. Copy `DCIM\100MSDCF\DSC*.jpg` files of the timelapse from the SD card
1. Run `node ./timelapse.mjs`

The output will be named `output-*.mp4`.

# Technical

This script will look for `*.jpg` or `*.jpeg` under the current working directory, sort them using filenames, then pipe them into FFMPEG via multipart JPEG.
