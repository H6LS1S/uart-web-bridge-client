<script lang="ts">
	import { mdiBrightness3, mdiBrightness4, mdiUpload, mdiWifiCog } from '@mdi/js';
	import { onMount } from 'svelte';

	import { ApiService } from '@/services/api';
	import Console from '@/lib/Console.svelte';
	import Btn from '@/lib/Btn.svelte';

	const api = new ApiService();

	let theme = $state(localStorage.getItem('theme') === 'dark');
	let connected = $state(true);
	let fileInput: HTMLInputElement;

	const changeTheme = async () => {
		theme = !theme;
		document.documentElement.classList.toggle('dark', theme);
		localStorage.setItem('theme', theme ? 'dark' : 'light');
	};

	const changeFirmware = async (): Promise<void> => {
		fileInput.click();

		const { target } = await new Promise<Event>((resolve) => {
			fileInput.onchange = resolve;
			fileInput.oncancel = resolve;
		});

		const [file] = (target as HTMLInputElement).files || [];
		if (!file) return;
		await api
			.changeFirmware(file)
			.then(() => setInterval(() => location.reload(), 5000))
			.finally(() => (fileInput.value = ''));
	};

	const changeWifiMode = async () => {
		const ssid = window.prompt('SSID');
		const passphrase = window.prompt('PASS') || '';

		if (!ssid) return;

		await api.setProvision(ssid, passphrase).then(() => api.applyProvision());
		await new Promise((_, reject) =>
			setInterval(() => {
				api
					.getProvisionStatus()
					.then(({ respGetStatus: res }) => !res?.staState && location.reload())
					.catch(reject);
			}, 5000)
		);
	};

	onMount(async () => {
		document.documentElement.classList.toggle('dark', theme);
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', changeTheme);

		await api.getProvisionStatus().then(({ respGetStatus: res }) => (connected = !res?.staState));
	});
</script>

<header class="flex items-center px-8 pt-4">
	<h1 class="text-3xl mr-auto">WebUART:{__APP_VERSION__}</h1>

	<Btn click={changeFirmware} icon={mdiUpload} />
	<Btn click={changeTheme} icon={theme ? mdiBrightness4 : mdiBrightness3} />
	<Btn click={changeWifiMode} icon={mdiWifiCog} hidden={connected} />
</header>

<main class="container m-auto my-4 grid grid-rows-[auto_1fr] rounded bg-gray-200 dark:bg-black">
	<Console />
</main>

<input type="file" accept=".bin" hidden bind:this={fileInput} />
