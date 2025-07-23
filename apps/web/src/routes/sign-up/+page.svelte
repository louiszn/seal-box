<script lang="ts">
	import { createForm } from "@tanstack/svelte-form";
	import { z } from "zod";
	import toast from "svelte-french-toast";

	import REST, { type ResponseError } from "$lib/REST.js";

	import { APIRoute } from "@seal-box/enums";
	import type { APIRegisterBody } from "@seal-box/types";

	import { goto } from "$app/navigation";

	import { getUserContext } from "$lib/contexts/user.js";

	interface RegisterBody extends APIRegisterBody {
		confirmPassword: string;
	}

	const schema = z.object({
		email: z.email(),
		password: z.string().nonempty(),
		confirmPassword: z.string().nonempty(),
	}) satisfies z.ZodType<RegisterBody>;

	let isSubmitting = $state(false);

	const form = createForm(() => ({
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		} as RegisterBody,
		async onSubmit({ value }) {
			const { email, password } = value;

			if (isSubmitting) {
				return;
			}

			isSubmitting = true;

			toast.promise(
				(async () => {
					const [data, error] = await REST.post<object, APIRegisterBody>(
						APIRoute.Register,
						{
							email,
							password,
						},
						{
							credentials: "include",
						},
					);

					isSubmitting = false;

					if (error) {
						throw error;
					}

					goto("/sign-in");

					return data;
				})(),
				{
					success: "Successfully signed up! You can now sign in to your account.",
					loading: "Signing up...",
					error: (error: ResponseError) => {
						return typeof error.error === "string" ? error.error : "Something went wrong.";
					},
				},
				{
					position: "bottom-right",
					duration: 5000,
				},
			);
		},
	}));

	const { user } = getUserContext();

	$effect(() => {
		if ($user) {
			goto("/");
		}
	});
</script>

{#if !$user}
	<div class="flex h-screen w-full flex-col items-center justify-center gap-1">
		<form
			class="text-text bg-surface-primary flex w-[450px] flex-col gap-6 rounded-2xl p-10 text-lg shadow-xl"
			onsubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<div class="mb-4 flex flex-col items-center">
				<span class="text-text-primary text-2xl font-bold">Create Account</span>
				<span class="text-text-secondary text-sm">Let the seal track your money</span>
			</div>

			<div class="flex flex-col gap-6">
				<!-- Email -->
				<form.Field
					name="email"
					validators={{ onChange: schema.shape.email, onBlur: schema.shape.email }}
				>
					{#snippet children(field)}
						<div class="flex flex-col gap-1">
							<label for={field.name}> Email </label>

							<input
								id={field.name}
								name={field.name}
								type="email"
								value={field.state.value}
								onblur={field.handleBlur}
								oninput={(e) => field.handleChange(e.currentTarget.value)}
								placeholder="your@email.com"
								required
								class={`outline-border-secondary rounded-lg bg-transparent px-3 py-1 outline-2 transition-all duration-150 ${field.state.meta.errors.length ? "text-red-500" : ""}`}
							/>
						</div>
					{/snippet}
				</form.Field>

				<!-- Password -->
				<form.Field
					name="password"
					validators={{
						onChange: schema.shape.password,
						onBlur: schema.shape.password,
					}}
				>
					{#snippet children(field)}
						<div class="flex flex-col gap-1">
							<label for={field.name}> Password </label>

							<input
								id={field.name}
								name={field.name}
								type="password"
								value={field.state.value}
								onblur={field.handleBlur}
								oninput={(e) => field.handleChange(e.currentTarget.value)}
								placeholder="Master secret"
								required
								class={`outline-border-secondary rounded-lg bg-transparent px-3 py-1 outline-2 transition-all duration-150 ${field.state.meta.errors.length ? "text-red-500" : ""}`}
							/>
						</div>
					{/snippet}
				</form.Field>

				<!-- Confirm Password -->
				<form.Field
					name="confirmPassword"
					validators={{
						onChange: ({ value }) => {
							return form.getFieldValue("password") !== value;
						},
						onBlur: ({ value }) => {
							return form.getFieldValue("password") !== value;
						},
					}}
				>
					{#snippet children(field)}
						<div class="flex flex-col gap-1">
							<label for={field.name}> Confirm password </label>

							<input
								id={field.name}
								name={field.name}
								type="password"
								value={field.state.value}
								onblur={field.handleBlur}
								oninput={(e) => field.handleChange(e.currentTarget.value)}
								placeholder="Master secret"
								required
								class={`outline-border-secondary rounded-lg bg-transparent px-3 py-1 outline-2 transition-all duration-150 ${field.state.meta.errors.length ? "text-red-500" : ""}`}
							/>
						</div>
					{/snippet}
				</form.Field>
			</div>

			<!-- Submit Button -->
			<button
				type="submit"
				class="bg-accent-tertiary border-accent-secondary text-text-ice mt-4 cursor-pointer rounded-2xl border-2 px-6 py-3 text-lg font-bold transition-all duration-200 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
				disabled={isSubmitting}
			>
				{isSubmitting ? "Submitting..." : "Sign Up"}
			</button>

			<span class="text-text-secondary text-center"
				>Already have an account? <a href="/sign-in" class="text-text-ice">Sign in!</a></span
			>
		</form>
	</div>
{/if}
