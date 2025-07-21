<script lang="ts">
	import "../app.css";

	import { Toaster } from "svelte-french-toast";

	import Navbar from "$lib/components/Navbar.svelte";

	let { children } = $props();
</script>

<Navbar />
<Toaster />
{@render children()}
