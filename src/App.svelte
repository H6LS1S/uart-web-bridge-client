<script lang="ts">
	import { mdiBrightness3, mdiBrightness4, mdiUpload } from '@mdi/js';
	import { onMount } from 'svelte';

	import { ApiService } from '@/services/api';
	import Console from '@/lib/Console.svelte';
	import Btn from '@/lib/Btn.svelte';

	const api = new ApiService();

	let theme = $state(localStorage.getItem('theme') === 'dark');
	let fileInput: HTMLInputElement;

	const toggleTheme = async () => {
		theme = !theme;
		document.documentElement.classList.toggle('dark', theme);
		localStorage.setItem('theme', theme ? 'dark' : 'light');
	};

	const updateFirmware = async (): Promise<void> => {
		fileInput.click();

		const { target } = await new Promise<Event>((resolve) => {
			fileInput.onchange = resolve;
			fileInput.oncancel = resolve;
		});

		const [file] = (target as HTMLInputElement).files || [];
		if (!file) return;
		await api
			.updateFirmware(file)
			.then(() => setInterval(() => location.reload(), 2000))
			.finally(() => (fileInput.value = ''));
	};

	onMount(() => {
		document.documentElement.classList.toggle('dark', theme);
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', toggleTheme);
	});
</script>

<header class="flex items-center px-8 pt-4">
	<h1 class="text-3xl mr-auto">WebUART:{__APP_VERSION__}</h1>

	<Btn click={updateFirmware} icon={mdiUpload} />
	<Btn click={toggleTheme} icon={theme ? mdiBrightness4 : mdiBrightness3} />

	<input type="file" accept=".bin" hidden bind:this={fileInput} />
</header>

<main class="container m-auto my-4 grid grid-rows-[auto_1fr] rounded bg-gray-200 dark:bg-black">
	<Console />
</main>
