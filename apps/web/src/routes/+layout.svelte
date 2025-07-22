<script lang="ts">
	import { onMount } from "svelte";

	import "../app.css";

	import { Toaster } from "svelte-french-toast";

	import Navbar from "$lib/components/Navbar.svelte";
	import Sidebar from "$lib/components/Sidebar.svelte";

	import { createAppContext } from "$lib/contexts/app.js";
	import { getUserContext } from "$lib/contexts/user.js";

	let { children } = $props();

	const { init: initApp, ready } = createAppContext();
	const { user } = getUserContext();

	onMount(async () => {
		await initApp();
	});
</script>

{#if $ready}
	<div class="flex h-screen w-full overflow-hidden">
		{#if $user}
			<Sidebar />
		{:else}
			<Navbar />
		{/if}

		<main class="flex-1 overflow-auto">
			<Toaster />
			{@render children()}
		</main>
	</div>
{/if}
