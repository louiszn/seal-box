<script lang="ts">
	import REST, { type ResponseError } from "$lib/REST.js";
	import { APIRoute } from "@seal-box/enums";
	import type { APIRegisterBody } from "@seal-box/types";
	import { createForm } from "@tanstack/svelte-form";
	import { fade } from "svelte/transition";
	import { z } from "zod";
	import toast from "svelte-french-toast";

	interface RegisterBody extends APIRegisterBody {
		repeatPassword: string;
	}

	const schema = z.object({
		email: z.email("Please enter a valid email address"),
		password: z.string().min(8, "Password must be at least 8 characters long"),
		repeatPassword: z.string(),
	}) satisfies z.ZodType<RegisterBody>;

	let isSubmitting = $state(false);

	const form = createForm(() => ({
		defaultValues: {
			email: "",
			password: "",
			repeatPassword: "",
		} as RegisterBody,
		async onSubmit({ value }) {
			const { email, password } = value;

			if (isSubmitting) {
				return;
			}

			isSubmitting = true;

			toast.promise(
				(async () => {
					const [data, error] = await REST.post<object, APIRegisterBody>(APIRoute.Register, {
						email,
						password,
					});

					isSubmitting = false;

					if (error) {
						throw error;
					}

					return data;
				})(),
				{
					success: "Successfully signed up!",
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
	<div class="text-text-primary text-center text-5xl font-bold">SealBox</div>

	<form
		class="text-text bg-surface-primary flex w-[30%] flex-col gap-6 rounded-2xl p-10 text-lg shadow-lg"
		onsubmit={(e) => {
			e.preventDefault();
			e.stopPropagation();
			form.handleSubmit();
		}}
	>
		<div class="text-text-primary mb-4 text-center text-3xl font-bold">Sign Up</div>

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

			<!-- Confirm Password -->
			<form.Field
				name="repeatPassword"
				validators={{
					onChange(field) {
						if (!field.value || field.value !== form.getFieldValue("password")) {
							return { message: "Passwords do not match" };
						}
					},
					onBlur(field) {
						if (!field.value || field.value !== form.getFieldValue("password")) {
							return { message: "Passwords do not match" };
						}
					},
				}}
			>
				{#snippet children(field)}
					<label class="flex flex-col gap-1">
						<span
							class={`text-md font-semibold ${field.state.meta.errors.length ? "text-red-500" : ""}`}
							>Confirm password</span
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
			{isSubmitting ? "Submitting..." : "Sign Up"}
		</button>
	</form>
</div>
