<script lang="ts">
	import { onMount, tick, untrack } from "svelte";
	import { basicEditor } from "prism-code-editor/setups";
	import "prism-code-editor/prism/languages/markup";
	import "prism-code-editor/prism/languages/markdown";
	import "prism-code-editor/prism/languages/json";

	interface Props {
		value?: string;
		language?: "markdown" | "json";
		theme?: string;
		height?: string;
		class?: string;
	}

	let {
		value = $bindable(""),
		language = "markdown",
		theme = "atom-one-dark",
		height = "480px",
		class: className = "",
	}: Props = $props();

	let editorInstance: any;
	let editorElement: HTMLElement | undefined = $state();

	onMount(() => {
		tick().then(() => {
			if (editorElement) {
				editorInstance = basicEditor(editorElement, {
					language,
					theme,
					value: untrack(() => value),
					onUpdate(val) {
						value = val;
					},
				});
			}
		});

		return () => {
			if (editorInstance) {
				editorInstance.remove();
			}
		};
	});

	$effect(() => {
		if (editorInstance && value !== editorInstance.value) {
			editorInstance.setOptions({ value });
		}
	});
</script>

<div
	bind:this={editorElement}
	class={className}
	style="height: {height}; border: 1px solid var(--border-glass); overflow: auto;"
></div>
