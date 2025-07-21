<script lang="ts">
	const PAGES = [
		{
			href: "/",
			name: "Home",
		},
		{
			href: "/sign-up",
			name: "Sign up",
		},
		{
			href: "/sign-in",
			name: "Sign in",
		},
	];
</script>

<nav class="fixed top-0 flex w-full items-center justify-between bg-white p-4 shadow-sm">
	<a href="/">SealBox</a>

	<div class="flex gap-4">
		{#each PAGES as page, index (index)}
			<a href={page.href}>
				{page.name}
			</a>
		{/each}
	</div>
</nav>
