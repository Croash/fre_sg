import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
// import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import livereload from 'rollup-plugin-livereload';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    resolve({
      alias: {
        'react': 'frc'
      }
    }),
    commonjs(),
    // typescript(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              "node": "current"
            },
            modules: false
          }
        ],
        // "@babel/preset-typescript",
        // "@babel/preset-react"
      ],
      plugins: [
        [
          "@babel/plugin-transform-react-jsx",
          {
            pragma: "h"
          }
        ]
      ],
      extensions: ['.js', '.jsx']
    }),
    serve({
      open: true,
      contentBase: ['dist'],
      port: 8080,
    }),
    htmlTemplate({
      template: './index.html',
      target: 'dist/index.html',
    }),
    livereload('src'),
  ],
};
