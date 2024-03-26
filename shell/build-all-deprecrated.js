// build-all.js
const fs = require('fs');
const { execSync } = require('child_process');
// 获取当前目录
const rootDir = process.cwd();
// 遍历 packages 目录下的每个子项目
const packagesDir = `${rootDir}/packages`;
const packages = fs.readdirSync(packagesDir);
packages.forEach((package) => {
  const packageDir = `${packagesDir}/${package}`;
  // 检查子项目是否是目录
  if (fs.lstatSync(packageDir).isDirectory()) { console.log(`Building ${packageDir}...`); process.chdir(packageDir); execSync('pnpm run build', { stdio: 'inherit' }); process.chdir(rootDir); }
});