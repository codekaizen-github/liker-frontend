import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // https://github.com/vitejs/vite/discussions/14739
    server: {
        port: 80,
        host: '0.0.0.0', // node container in docker. This is a MUST have.
        origin: 'https://likeriker.codekaizen.net:8443', // exposed node container address
        hmr: {
            clientPort: 8443,
            port: 80,
            host: 'liker.codekaizen.net',
            path: '/ws/',
            protocol: 'wss',
        },
    },
});
