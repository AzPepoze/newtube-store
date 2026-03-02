<script lang="ts">
	let {
		name,
		description,
		images,
		settingsCode,
	}: {
		name: string;
		description: string;
		images: string[];
		settingsCode: string;
	} = $props();
</script>

<div class="preview-card glass-panel">
	<h3>Card Preview</h3>
	<div class="mock-card glass-panel">
		<div class="mock-image">
			{#if images[0]}
				<img src={images[0]} alt="Preview" />
			{:else}
				<div class="placeholder">
					{name.charAt(0) || "T"}
				</div>
			{/if}
		</div>
		<div class="mock-content">
			<h4>{name || "Theme Name"}</h4>
			<p>
				{description || "Description will appear here..."}
			</p>
		</div>
	</div>
</div>

<div class="preview-card glass-panel">
	<h3>Raw Data</h3>
	<pre><code
			>{JSON.stringify(
				{
					name,
					description,
					images,
					settings: JSON.parse(settingsCode || "{}"),
				},
				null,
				2,
			)}</code
		></pre>
</div>

<style lang="scss">
	.preview-card {
		padding: 2rem;
		h3 {
			margin: 0 0 1.5rem;
			font-size: 0.9rem;
			color: var(--text-muted);
			text-transform: uppercase;
			letter-spacing: 0.05em;
		}

		pre {
			background: rgba(0, 0, 0, 0.2);
			padding: 1rem;
			border-radius: var(--radius-sm);
			overflow-x: auto;
			code {
				font-family: monospace;
				font-size: 0.85rem;
				color: var(--text-secondary);
			}
		}
	}

	.mock-card {
		max-width: 320px;
		overflow: hidden;

		.mock-image {
			aspect-ratio: 16/9;
			background: rgba(0, 0, 0, 0.2);
			overflow: hidden;
			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}
			.placeholder {
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 3rem;
				background: linear-gradient(135deg, #1a1a1a, #0a0a0a);
				opacity: 0.3;
			}
		}

		.mock-content {
			padding: 1.5rem;
			h4 {
				margin: 0 0 0.5rem;
				font-size: 1.1rem;
			}
			p {
				margin: 0;
				font-size: 0.9rem;
				color: var(--text-secondary);
				line-height: 1.5;
			}
		}
	}
</style>
