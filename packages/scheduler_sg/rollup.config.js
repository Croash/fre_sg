import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
export default {
  input: 'src/index.js',
  // TypeScript 入口文件路径
  output: {
    file: 'dist/bundle.js',
    // 输出文件路径
    format: 'es',
    // 输出格式为 ES 模块（ESM）
    // sourcemap: true,
    //是否生成 sourcemap
  }, plugins: [
    nodeResolve(), // 解析第三方模块
    commonjs(),
    // 将 CommonJS 模块转换为 ES6
    typescript(), // 使用 TypeScript 编译代码
    babel({
      // 使用 babel 转换代码
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
      // 排除 node_modules 目录 
    }),
    terser() // 压缩代码 
  ]
};