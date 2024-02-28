import fs from 'fs'
import path from 'path'

import {promisify} from 'util'
// import ncp from 'ncp'

// 读取manifest.json文件
fs.readFile('dist/manifest.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let manifest = JSON.parse(data);
  
  // 修改options_ui.page属性的值为options.html
  manifest.options_ui.page = 'options.html';
  
  // 获取dist目录下所有类似options.xxx.html格式的文件名
  fs.readdir('dist', (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    files.forEach(file => {
      if (file.startsWith('options.') && file.endsWith('.html')) {
        fs.rename(`dist/${file}`, 'dist/options.html', (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`${file} renamed to options.html successfully`);
        });
      }
    });

    // 将修改后的manifest.json写回文件
    fs.writeFile('dist/manifest.json', JSON.stringify(manifest, null, 2), 'utf8', (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('manifest.json updated successfully');
    });
  });
});


const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// 递归拷贝icon目录到dist目录
async function copyIconToDist() {
  try {
    await copyDir('icon', 'dist/icon');
    console.log('Icon directory copied to dist/icon successfully');
  } catch (err) {
    console.error(err);
  }
}

// 递归拷贝目录
async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true });

  const files = await readdir(src);
  for (const file of files) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    const stats = await stat(srcPath);
    if (stats.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

copyIconToDist();