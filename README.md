# actioncam-timelapse

This Node.js script will encode a JPEG sequence from Sony ActionCam into a HEVC (h.265) video with hardware acceleration by Intel QuickSync, at quality 25 and framerate of 30.

# How to use

1. Create a new folder
1. Download `timelapse.mjs` to this folder
1. Download ffmpeg and put it under this folder
1. Copy `.jpg` files of the timelapse from Sony ActionCam SD card
1. Run `node ./timelapse.mjs`

The output will be named `output-*.mp4`.

