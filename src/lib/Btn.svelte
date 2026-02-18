<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		click: () => Promise<void>;
		icon?: string;
		hidden?: boolean;
		disabled?: boolean;
	}

	let { click, icon, hidden, disabled = false }: Props = $props();

	const onclick = async () => {
		disabled = true;
		try {
			await click();
		} finally {
			disabled = false;
		}
	};
</script>

<button
	{onclick}
	{disabled}
	{hidden}
	aria-label="button"
	class="m-2 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10"
>
	<svg class="h-6 w-6 fill-current {disabled && 'animate-spin'}" viewBox="0 0 24 24">
		<path d={disabled ? 'M3 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' : icon} />
	</svg>
</button>

<style>
	button {
		transition: all 200ms ease-in-out;
		cursor: pointer;
	}

	button:hover {
		transform: scale(1.025);
	}

	button:disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}
</style>
