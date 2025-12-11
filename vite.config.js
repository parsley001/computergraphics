import { defineConfig } from 'vite';
import { assignmentsPlugin } from './vite-plugins/assignments-plugin.js';

export default defineConfig({
    server: {
        port: 3000,
        open: true
    },
    plugins: [assignmentsPlugin()]
});
