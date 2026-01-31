<script lang="ts">
	import { HistoryService } from '@/services/history';
	import { ConsoleService } from '@/services/console';
	import { ApiService } from '@/services/api';

	const command = new HistoryService();
	const console = new ConsoleService();
	const api = new ApiService();

	const onkeydown = async (event: KeyboardEvent) => {
		const target = event.target as HTMLInputElement;

		if (event.key === 'ArrowUp') return (target.value = command.up());
		if (event.key === 'ArrowDown') return (target.value = command.down());
		if (event.ctrlKey) {
			event.preventDefault();
			if (event.key === 'l') return console.clear();
		}

		if (event.key !== 'Enter') return;
		if (!target.value.trim()) return;

		await api.sendData(target.value);
		command.write(target.value);
		return (target.value = '');
	};

	const stream = api.stream();
	stream.onmessage = (e) => console.write(e.data);
	// stream.onopen = () => console.write(pr('Connected'));
	// stream.onerror = () => console.write(pr('Error'));
</script>

<code class={{ 'm-auto opacity-25': !$console.length }}>
	{$console.read() || console.placeholder}
</code>
<label class="p-2 flex border-t border-gray-300">
	> <input {onkeydown} type="text" />
	<select onchange={(e) => api.setBaudRate(e.target.value)} class="px-2">
		<option>9600</option>
		<option selected>115200</option>
		<option>921600</option>
	</select>
</label>
