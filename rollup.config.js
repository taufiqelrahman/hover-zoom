import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/HoverZoom.js',
  output: [
    {
      file: 'dist/hoverzoom.esm.js',
      format: 'esm'
    },
    {
      file: 'dist/hoverzoom.umd.js',
      format: 'umd',
      name: 'HoverZoom', // jadi window.HoverZoom di browser
      exports: 'default'
    }
  ],
  plugins: [resolve(), commonjs()]
};