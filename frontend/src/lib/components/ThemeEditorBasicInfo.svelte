<script lang="ts">
	import { fade } from "svelte/transition";
	import MarkdownEditor from "$lib/components/MarkdownEditor.svelte";
	import TrashIcon from "$lib/icons/TrashIcon.svelte";
	import UploadIcon from "$lib/icons/UploadIcon.svelte";
	import LinkIcon from "$lib/icons/LinkIcon.svelte";
	import { uploadImageFile } from "$lib/imageUtils";
	import { PUBLIC_API_URL } from "$lib/constants";

	let {
		name = $bindable(""),
		description = $bindable(""),
		images = $bindable([]),
		errorMessage = $bindable(""),
	}: {
		name: string;
		description: string;
		images: string[];
		errorMessage: string;
	} = $props();

	let newImageUrl = $state("");
	let isDragging = $state(false);

	async function handleFile(file: File) {
		try {
			const url = await uploadImageFile(file, PUBLIC_API_URL);
			if (!images.includes(url)) {
				images = [...images, url];
			}
		} catch (error: any) {
			errorMessage = error.message || "Failed to upload image.";
		}
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		isDragging = false;
		if (e.dataTransfer?.files) {
			Array.from(e.dataTransfer.files).forEach(handleFile);
		}
	}

	function handleFileSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files) {
			Array.from(input.files).forEach(handleFile);
		}
	}

	function addImage() {
		const url = newImageUrl.trim();
		if (!url || images.includes(url)) return;
		images = [...images, url];
		newImageUrl = "";
	}

	function removeImage(index: number) {
		images = images.filter((_, i) => i !== index);
	}
</script>

<div class="card glass-panel">
	<h3>Basic Information</h3>
	<div class="field">
		<label for="name">Name</label>
		<input
			id="name"
			type="text"
			bind:value={name}
			placeholder="Cyberpunk Neon"
			required
		/>
	</div>
	<div class="field">
		<label for="description">Description (Markdown Supported)</label>
		<MarkdownEditor bind:value={description} />
	</div>
</div>

<div class="card glass-panel">
	<div class="card-header">
		<h3>Screenshots</h3>
		<p class="hint">Upload up to 5 screenshots of your theme</p>
	</div>

	<div
		class="drop-zone"
		class:dragging={isDragging}
		role="button"
		tabindex="0"
		ondragover={(e) => {
			e.preventDefault();
			isDragging = true;
		}}
		ondragleave={() => (isDragging = false)}
		ondrop={handleDrop}
	>
		<UploadIcon size={32} />
		<div class="drop-text">
			<p>Drag & Drop images here or</p>
			<label class="browse-btn">
				Browse Files
				<input
					type="file"
					accept="image/*"
					multiple
					onchange={handleFileSelect}
					hidden
				/>
			</label>
		</div>
	</div>

	<div class="url-input-wrapper">
		<div class="icon-input">
			<LinkIcon size={16} />
			<input
				type="url"
				bind:value={newImageUrl}
				placeholder="Or paste an image URL..."
				onkeydown={(e) =>
					e.key === "Enter" && (e.preventDefault(), addImage())}
			/>
		</div>
		<button
			type="button"
			class="add-url-btn premium-button"
			onclick={addImage}
		>
			Add URL
		</button>
	</div>

	<div class="images-grid">
		{#each images as url, i}
			<div class="image-item glass-panel" in:fade>
				<img src={url} alt="Screenshot {i + 1}" />
				<button
					type="button"
					class="remove-btn"
					onclick={() => removeImage(i)}
					title="Remove Screenshot"
				>
					<TrashIcon size={14} />
				</button>
			</div>
		{/each}
	</div>
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
			flex-wrap: wrap;

			.hint {
				margin: 0;
				font-size: 0.9rem;
				color: var(--text-muted);
			}
		}
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		label {
			font-size: 0.95rem;
			color: var(--text-muted);
			text-transform: uppercase;
			letter-spacing: 0.05em;
			font-weight: 700;
		}

		input {
			background: rgba(255, 255, 255, 0.02);
			border: 1px solid var(--border-glass);
			padding: 1rem 1.25rem;
			border-radius: var(--radius-md);
			color: var(--text-primary);
			font-family: inherit;
			font-size: 1.1rem;
			transition: all 0.2s;

			&:focus {
				outline: none;
				border-color: rgba(255, 255, 255, 0.3);
				background: rgba(255, 255, 255, 0.05);
			}
		}
	}

	.drop-zone {
		border: 2px dashed var(--border-glass);
		border-radius: var(--radius-md);
		padding: 3rem 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		transition: all 0.2s ease;
		background: rgba(var(--text-primary-rgb), 0.02);
		cursor: pointer;
		text-align: center;
		margin-bottom: 1.5rem;

		&:hover,
		&.dragging {
			border-color: var(--text-primary);
			background: rgba(var(--text-primary-rgb), 0.05);
			color: var(--text-primary);
		}

		.drop-text {
			p {
				margin: 0 0 0.5rem;
				font-size: 1rem;
				color: var(--text-secondary);
			}

			.browse-btn {
				color: var(--text-primary);
				font-weight: 700;
				text-decoration: underline;
				cursor: pointer;
				font-size: 1.1rem;

				&:hover {
					opacity: 0.8;
				}
			}
		}
	}

	.url-input-wrapper {
		display: flex;
		gap: 0.75rem;
		margin-bottom: 2.5rem;

		.icon-input {
			flex: 1;
			position: relative;
			display: flex;
			align-items: center;

			input {
				width: 100%;
				background: rgba(255, 255, 255, 0.02);
				border: 1px solid var(--border-glass);
				padding: 0.8rem 1rem 0.8rem 2.8rem;
				border-radius: var(--radius-sm);
				color: var(--text-primary);
				font-family: inherit;
				font-size: 1rem;
				transition: all 0.2s;

				&:focus {
					outline: none;
					border-color: rgba(255, 255, 255, 0.3);
					background: rgba(255, 255, 255, 0.05);
				}
			}

			:global(svg) {
				position: absolute;
				left: 1rem;
				color: var(--text-muted);
			}
		}

		.add-url-btn {
			white-space: nowrap;
			padding: 0 1.5rem;
			background: transparent;
			color: var(--text-primary);
			border-color: var(--border-glass);

			&:hover {
				background: var(--text-primary);
				color: var(--bg-dark);
			}
		}
	}

	.images-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1.5rem;

		.image-item {
			position: relative;
			background: rgba(0, 0, 0, 0.2);
			border-radius: var(--radius-sm);
			overflow: hidden;
			aspect-ratio: 16/9;
			box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
			border: 1px solid var(--border-glass);

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

			.remove-btn {
				position: absolute;
				top: 0.75rem;
				right: 0.75rem;
				background: rgba(255, 50, 50, 0.9);
				border: none;
				color: white;
				width: 28px;
				height: 28px;
				border-radius: 50%;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;
				opacity: 0;
				transform: translateY(-5px);
				transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
				box-shadow: 0 4px 10px rgba(255, 50, 50, 0.3);
			}

			&:hover .remove-btn {
				opacity: 1;
				transform: translateY(0);
			}
		}
	}
</style>
