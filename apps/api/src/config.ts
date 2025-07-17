import { config as LoadEnv } from "dotenv";
import z, { prettifyError } from "zod";

const nodeEnv = process.env.NODE_ENV ?? "development";

LoadEnv({
	quiet: true,
	path: nodeEnv === "production" ? ".env" : `.env.${nodeEnv}`,
	override: true,
});

const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z.enum(["development", "production"]).default("development"),
	DATABASE_URL: z.string().nonempty(),
	PEPPER_KEY: z.string().nonempty(),
	JWT_SECRET: z.string().nonempty(),
	COOKIE_SECRET: z.string().nonempty(),
});

const result = envSchema.safeParse(process.env);

if (result.error) {
	console.error("Invalid env variables:", prettifyError(result.error));
	process.exit(1);
}

const { data } = result;

const config = {
	port: data.PORT,
	nodeEnv: data.NODE_ENV,
	databaseURL: data.DATABASE_URL,
	pepperKey: data.PEPPER_KEY,
	jwtSecret: data.JWT_SECRET,
	cookie: {
		secure: data.NODE_ENV === "production",
		httpOnly: true,
		secret: data.COOKIE_SECRET,
	},
};

export default config;
