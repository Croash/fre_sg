import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
// import typescript from '@rollup/plugin-typescript';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: false, // 在生产环境禁用 sourcemap
  },
  plugins: [
    resolve(),
    commonjs(),
    // typescript(),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
      exclude: /node_modules/,
      babelrc: true,
    }),
    htmlTemplate({
      template: 'index.html',
      target: 'dist/index.html',
    }),
    terser(), // 生产环境使用 terser 进行压缩
  ],
};
