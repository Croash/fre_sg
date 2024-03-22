const { execSync } = require('child_process');
const fs = require('fs');

try {
  // 获取传入的包名称作为参数
  const packageName = process.argv[2];
  
  if (!packageName) {
    console.error('Error: Package name is required.');
    process.exit(1);
  }

  // 读取 package.json 文件
  const packageJsonPath = `packages/${packageName}/package.json`;
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // 获取当前 package.json 文件中的版本号
  const currentVersion = packageJson.version;

  // 使用 execSync 执行命令查询 npm 仓库中的最新版本号
  const latestVersion = execSync(`npm show ${packageName} version`, { encoding: 'utf8' }).trim();

  // 比较当前版本和最新版本是否相同
  if (currentVersion === latestVersion) {
    console.log(`Current version (${currentVersion}) is up to date.`);
  } else {
    console.log(`Current version (${currentVersion}) is outdated. Latest version is ${latestVersion}.`);
  }
} catch (error) {
  console.error('Error checking version:', error);
}
