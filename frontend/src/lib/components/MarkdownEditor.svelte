<script lang="ts">
	import { onMount, tick } from "svelte";
	import { renderMarkdown } from "$lib/markdown";
	import { basicEditor } from "prism-code-editor/setups";
	import "prism-code-editor/prism/languages/markup";
	import "prism-code-editor/prism/languages/markdown";

	let { value = $bindable("") }: { value: string } = $props();

	let editorInstance: any;

	onMount(async () => {
		await tick();
		editorInstance = basicEditor(".markdown-editor-wrapper", {
			language: "markdown",
			theme: "github-dark",
			value: value,
			onUpdate(val) {
				value = val;
			},
		});
	});

	$effect(() => {
		if (editorInstance && value !== editorInstance.value) {
			editorInstance.setOptions({ value });
		}
	});
</script>

<div class="markdown-editor-container">
	<div class="editor-pane">
		<div class="header">EDITOR (MARKDOWN)</div>
		<div class="editor-wrapper markdown-editor-wrapper">
			<!-- prism-code-editor mounts here -->
		</div>
	</div>

	<div class="preview-pane">
		<div class="header">PREVIEW</div>
		<div class="preview-content markdown-content">
			{@html renderMarkdown(value)}
		</div>
	</div>
</div>

<style lang="scss">
	.markdown-editor-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
		height: 400px;
		background: #050505;
		border: 1px solid var(--border-glass);
		border-radius: var(--radius-md);
		overflow: hidden;

		@media (max-width: 768px) {
			grid-template-columns: 1fr;
			height: 600px;
		}
	}

	.header {
		font-size: 0.7rem;
		font-weight: 800;
		color: var(--text-muted);
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.02);
		border-bottom: 1px solid var(--border-glass);
		letter-spacing: 0.1em;
	}

	.editor-pane,
	.preview-pane {
		display: flex;
		flex-direction: column;
		height: 100%;
		overflow: hidden;
	}

	.editor-pane {
		border-right: 1px solid var(--border-glass);
	}

	.editor-wrapper {
		position: relative;
		flex: 1;
		overflow: hidden;
	}

	.preview-pane {
		background: #080808;
	}

	.preview-content {
		flex: 1;
		padding: 1rem;
		overflow-y: auto;
		color: var(--text-secondary);
		line-height: 1.6;
	}
</style>
