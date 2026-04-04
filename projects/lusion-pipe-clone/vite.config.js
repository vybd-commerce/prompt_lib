import { defineConfig } from "vite";
import glsl from 'vite-plugin-glsl';

export default defineConfig({
    plugins: [],
    server: { port: 8083 } // different port to not clash
});
