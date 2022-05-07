import { extname, join } from 'path';
import { platform as osPlatform } from 'os';
import { readdir, readFile, stat } from 'fs/promises';
import { spawn } from 'child_process';

const platform = osPlatform();

const {
  FRAME_RATE = 23.976 + '',
  INPUT_DIR = process.argv[2] || process.cwd(),
  OUTPUT_FILE = process.argv[3] || join('Outputs', `output-${Math.random().toString(36).substring(2, 7)}.mp4`),
  VIDEO_QUALITY = 25 + ''
} = process.env;

const FFMPEG_ARGS = [
  ...(platform === 'win32'
    ? [
      '-init_hw_device',
      'qsv=hw,child_device_type=d3d11va',
      '-filter_hw_device',
      'hw',
      '-hwaccel',
      'qsv',
      '-hwaccel_output_format',
      'qsv'
    ]
    : ''
  ),
  ...[
    '-f',
    'mpjpeg',
    '-i',
    'pipe:',
    '-c:v',
    platform === 'win32' ? 'hevc_qsv' : platform === 'arm64' ? 'hevc_v4l2m2m' : 'darwin' ? 'hevc_videotoolbox' : 'hevc',
    '-global_quality',
    VIDEO_QUALITY,
    '-r',
    FRAME_RATE,
    OUTPUT_FILE
  ]
];

async function crawl(baseDir) {
  const pendings = ['.'];
  const files = [];

  while (pendings.length) {
    const current = pendings.pop();

    const fileStat = await stat(join(baseDir, current));

    if (fileStat.isFile()) {
      const extension = extname(current).toLowerCase();

      (extension === '.jpg' || extension === '.jpeg') && files.push(current);
    } else if (fileStat.isDirectory()) {
      const entries = await readdir(join(baseDir, current));

      entries.forEach(entry => pendings.push(join(current, entry)));
    }
  }

  return files.sort();
}

(async function () {
  const files = await crawl(INPUT_DIR);

  const ffmpeg = spawn(
    'ffmpeg.exe',
    FFMPEG_ARGS,
    {
      stdio: ['pipe', 'inherit', 'inherit']
    }
  );

  while (files.length) {
    const buffer = await readFile(join(INPUT_DIR, files.shift()));

    ffmpeg.stdin.write(
      [
        '',
        '--FFMPEG_MULTIPART_JPEG_BOUNDARY',
        `Content-Length: ${buffer.byteLength}`,
        'Content-Type: image/jpeg',
        '',
        ''
      ].join('\n')
    );

    await new Promise(resolve => ffmpeg.stdin.write(buffer, null, resolve));
  }

  ffmpeg.stdin.end();

  await new Promise(resolve => ffmpeg.on('exit', resolve));
})();
