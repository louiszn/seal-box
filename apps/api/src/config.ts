import { config as LoadEnv } from "dotenv";
import { z } from "zod";

const nodeEnv = process.env.NODE_ENV ?? "development";

LoadEnv({
	quiet: true,
	path: `.env.${nodeEnv}`,
	override: true,
});

const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z.enum(["development", "production"]).default("development"),
});

const result = envSchema.safeParse(process.env);

if (result.error) {
	console.error("Invalid env variables:", z.treeifyError(result.error));
	process.exit(1);
}

const { data } = result;

const config = {
	port: data.PORT,
	nodeEnv: data.NODE_ENV,
};

export default config;
