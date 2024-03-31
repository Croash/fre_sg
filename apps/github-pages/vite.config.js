import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
  plugins: [reactRefresh()],
  resolve: {
    alias: {
      // 将 React-like 库设置为 react 别名
      'react': 'fre_sg',
    },
  },
});