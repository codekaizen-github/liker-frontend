import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	// https://github.com/vitejs/vite/discussions/14739
	server: {
		port: 80,
		host: "0.0.0.0", // node container in docker. This is a MUST have.
		origin: "http://localhost:3040", // exposed node container address
	},
});
