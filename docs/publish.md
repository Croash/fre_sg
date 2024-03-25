### 1. pnpm changeset
提交完成后，pnpm changeset 选取changed packages，填写changelog

### 2. pnpm changeset version
更新版本以及 changelog.md

### 3. pnpm run build:all && pnpm install
重新build

### 4. pnpm changeset publish
发布所有更改版本的package 

[示例文章](https://juejin.cn/post/7181409989670961207)