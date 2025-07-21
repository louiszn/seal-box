<script lang="ts">
	import REST, { type ResponseError } from "$lib/REST.js";
	import { APIRoute } from "@seal-box/enums";
	import type { APILoginBody, APILoginResponse } from "@seal-box/types";
	import { createForm } from "@tanstack/svelte-form";
	import { fade } from "svelte/transition";
	import { z } from "zod";
	import toast from "svelte-french-toast";

	const schema = z.object({
		email: z.email("Please enter a valid email address"),
		password: z.string().nonempty("Password is required"),
	}) satisfies z.ZodType<APILoginBody>;

	let isSubmitting = $state(false);

	const form = createForm(() => ({
		defaultValues: {
			email: "",
			password: "",
		} as APILoginBody,
		async onSubmit({ value }) {
			const { email, password } = value;

			if (isSubmitting) {
				return;
			}

			isSubmitting = true;

			toast.promise(
				(async () => {
					const [data, error] = await REST.post<APILoginResponse, APILoginBody>(APIRoute.Login, {
						email,
						password,
					});

					isSubmitting = false;

					if (error) {
						throw error;
					}

					REST.setAccessToken(data.accessToken);

					return data;
				})(),
				{
					success: "Successfully signed in!",
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
</script>

<div class="flex h-screen w-full flex-col items-center justify-center gap-10">
	<form
		class="text-text bg-surface-primary flex w-[30%] flex-col gap-6 rounded-2xl p-10 text-lg shadow-lg"
		onsubmit={(e) => {
			e.preventDefault();
			e.stopPropagation();
			form.handleSubmit();
		}}
	>
		<div class="mb-4 flex flex-col items-center font-bold">
			<span class="text-text-primary text-2xl">Welcome back!</span>
			<span class="text-text-secondary text-lg">Let's dive into your personal account!</span>
		</div>

		<div class="flex flex-col gap-6">
			<!-- Email -->
			<form.Field
				name="email"
				validators={{ onChange: schema.shape.email, onBlur: schema.shape.email }}
			>
				{#snippet children(field)}
					<label class="flex flex-col gap-1">
						<span
							class={`text-md font-semibold ${field.state.meta.errors.length ? "text-red-500" : ""}`}
							>Email</span
						>
						<input
							id={field.name}
							name={field.name}
							type="email"
							value={field.state.value}
							onblur={field.handleBlur}
							oninput={(e) => field.handleChange(e.currentTarget.value)}
							class={`border-b-2 bg-transparent px-2 py-1 text-lg outline-none transition-all duration-150 ${field.state.meta.errors.length ? "border-red-500 text-red-500" : "border-[#d0d7de]"}`}
						/>
						{#if field.state.meta.errors.length}
							<em role="alert" class="text-sm text-red-500" in:fade={{ duration: 50 }}
								>{field.state.meta.errors[0]?.message}</em
							>
						{/if}
					</label>
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
					<label class="flex flex-col gap-1">
						<span
							class={`text-md font-semibold ${field.state.meta.errors.length ? "text-red-500" : ""}`}
							>Password</span
						>
						<input
							id={field.name}
							name={field.name}
							type="password"
							value={field.state.value}
							onblur={field.handleBlur}
							oninput={(e) => field.handleChange(e.currentTarget.value)}
							class={`border-b-2 bg-transparent px-2 py-1 text-lg outline-none transition-all duration-150 ${field.state.meta.errors.length ? "border-red-500 text-red-500" : "border-[#d0d7de]"}`}
						/>
						{#if field.state.meta.errors.length}
							<em role="alert" class="text-sm text-red-500" in:fade={{ duration: 50 }}
								>{field.state.meta.errors[0]?.message}</em
							>
						{/if}
					</label>
				{/snippet}
			</form.Field>
		</div>

		<!-- Submit Button -->
		<button
			type="submit"
			class="bg-accent-secondary mt-4 cursor-pointer rounded-full px-6 py-3 text-lg font-bold transition-all duration-200 hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50"
			disabled={isSubmitting}
		>
			{isSubmitting ? "Submitting..." : "Sign In"}
		</button>

		<span class="text-text-secondary text-center"
			>Don't have an account? <a href="/sign-up" class="text-blue-500">Create one!</a></span
		>
	</form>
</div>
