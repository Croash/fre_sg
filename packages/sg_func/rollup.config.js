import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
// import pkg from './package.json'

const output = [
  {
    format: 'cjs', // 输出格式为 CommonJS
    dir: 'dist/cjs', // CommonJS 格式的输出目录路径
    preserveModules: true, // 保持目录结构不变
  },
  {
    format: 'es', // 输出格式为 ES 模块
    dir: 'dist/esm', // ES 模块格式的输出目录路径
    preserveModules: true, // 保持目录结构不变
  }
]

const cfgList = [
  {
    output: {
      format: 'cjs', // 输出格式为 CommonJS
      dir: 'dist/cjs', // CommonJS 格式的输出目录路径
      preserveModules: true, // 保持目录结构不变
			preserveModulesRoot: 'src'
    },
    outDir: 'dist/cjs',
  },
  {
    output: {
      format: 'es', // 输出格式为 ES 模块
      dir: 'dist/esm', // ES 模块格式的输出目录路径
      preserveModules: true, // 保持目录结构不变
      preserveModulesRoot: 'src'
    },
    outDir: 'dist/esm',
  },
]

const getCommonCfg = ({ outDir, }) => ({
  input: 'src/index.js',
  output: [],
  plugins: [
    nodeResolve(), // 解析第三方模块
    commonjs(),
    // 将 CommonJS 模块转换为 ES6
    typescript({
      tsconfig: 'tsconfig.json', // TypeScript 配置文件路径
      outDir, // TypeScript 输出目录，应与 Rollup 的输出目录一致
    }), // 使用 TypeScript 编译代码
    babel({
      // 使用 babel 转换代码
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
      // 排除 node_modules 目录 
    }),
    terser() // 压缩代码 
  ]
});

export default cfgList.map(({ output, outDir }) => ({
  ...getCommonCfg({ outDir }),
  output,
}))
