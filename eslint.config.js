import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import svelte from "eslint-plugin-svelte";
import globals from "globals";
import { fileURLToPath } from "node:url";
import ts from "typescript-eslint";

const gitignorePath = fileURLToPath(new URL("./.gitignore", import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		plugins: {
			svelte,
		},
		settings: {},
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
		},
		rules: {
			"no-undef": "off",
			semi: ["error", "always"],
		},
	},
	{
		files: ["**/*.ts", "**/*.tsx"],
		languageOptions: {
			globals: { ...globals.node },
			parser: ts.parser,
			parserOptions: {
				projectService: true,
			},
		},
	},
	{
		plugins: {
			svelte,
		},
		rules: {
			...svelte.configs.recommended.rules,
		},
		files: ["apps/web/**/*.svelte", "apps/web/**/*.svelte.ts"],
		languageOptions: {
			parser: svelte.parser,
			parserOptions: {
				projectService: true,
				extraFileExtensions: [".svelte"],
			},
		},
	},
);
