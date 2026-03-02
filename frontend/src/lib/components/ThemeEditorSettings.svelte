<script lang="ts">
	import { onMount, tick, untrack } from "svelte";
	import { basicEditor } from "prism-code-editor/setups";
	import "prism-code-editor/prism/languages/markup";
	import "prism-code-editor/prism/languages/json";

	let {
		settingsCode = $bindable(""),
		jsonError = $bindable(""),
	}: {
		settingsCode: string;
		jsonError: string;
	} = $props();

	let editorInstance: any;

	onMount(() => {
		tick().then(() => {
			editorInstance = basicEditor(".json-editor-wrapper", {
				language: "json",
				theme: "github-dark",
				value: untrack(() => settingsCode),
				onUpdate(val) {
					settingsCode = val;
				},
			});
		});

		return () => {
			if (editorInstance) {
				editorInstance.remove();
			}
		};
	});

	$effect(() => {
		if (editorInstance && settingsCode !== editorInstance.value) {
			editorInstance.setOptions({ value: settingsCode });
		}
	});

	$effect(() => {
		try {
			JSON.parse(settingsCode);
			jsonError = "";
		} catch (e: any) {
			jsonError = e.message;
		}
	});
</script>

<div class="card glass-panel">
	<div class="card-header">
		<h3>Theme Settings (JSON)</h3>
		{#if jsonError}
			<span class="json-error">{jsonError}</span>
		{:else}
			<span class="json-valid">✓ Valid JSON</span>
		{/if}
	</div>
	<div
		class="json-editor-wrapper"
		style="height: 480px; border-radius: var(--radius-md); border: 1px solid var(--border-glass); overflow: hidden;"
	></div>
</div>

<style lang="scss">
	.card {
		padding: 2.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 2rem;

		h3 {
			margin: 0;
			font-size: 1.1rem;
			color: var(--text-secondary);
		}

		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.json-error {
				font-size: 0.8rem;
				color: #ff3232;
			}
			.json-valid {
				font-size: 0.8rem;
				color: #ffffff;
				opacity: 0.6;
			}
		}
	}
</style>
