import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/**/*.ts"],
	format: ["esm"],
	clean: true,
	bundle: false,
	dts: true,
});
