import { includeIgnoreFile } from "@eslint/compat";
import { fileURLToPath } from "node:url";
import globals from "globals";

import js from "@eslint/js";
import ts from "typescript-eslint";
import svelte from "eslint-plugin-svelte";
import prettier from "eslint-config-prettier";

import svelteParser from "svelte-eslint-parser";
import svelteConfig from "./apps/web/svelte.config.js";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
	},
	{
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			parser: ts.parser,
			parserOptions: {
				projectService: true,
			},
		},
	},
	{
		files: ["**/*.svelte"],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				svelteConfig,
				parser: ts.parser,
			},
			globals: {
				...globals.browser,
			},
		},
	},
	{
		rules: {
			"no-undef": "off",
			semi: ["error", "always"],
		},
	},
);
