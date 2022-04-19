import { extname, join } from 'path';
import { readdir, readFile, stat } from 'fs/promises';
import { spawn } from 'child_process';

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
  const files = await crawl(process.cwd());

  const ffmpeg = spawn(
    'ffmpeg.exe',
    [
      '-init_hw_device',
      'qsv=hw,child_device_type=d3d11va',
      '-filter_hw_device',
      'hw',
      '-hwaccel',
      'qsv',
      '-hwaccel_output_format',
      'qsv',
      '-f',
      'mpjpeg',
      '-i',
      'pipe:',
      '-c:v',
      'hevc_qsv',
      '-global_quality',
      '25',
      '-r',
      '30',
      `output-${Math.random().toString(36).substr(2, 5)}.mp4`
    ],
    {
      stdio: ['pipe', 'inherit', 'inherit']
    }
  );

  while (files.length) {
    const buffer = await readFile(files.shift());

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
