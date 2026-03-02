<script lang="ts">
	import { fade } from "svelte/transition";
	import type { Theme } from "$lib/types";
	import { PUBLIC_API_URL } from "$lib/constants";

	let { theme }: { theme: Theme } = $props();

	let currentImageIndex = $state(0);
	let hoverTimer: ReturnType<typeof setInterval> | null = $state(null);
	let ownerName = $state("");
	let ownerAvatar = $state("");
	const displayImages = $derived(theme.images || []);

	$effect(() => {
		if (theme.ownerId) {
			fetch(`${PUBLIC_API_URL}/users/profile?userId=${theme.ownerId}`)
				.then((res) => res.json())
				.then((data) => {
					ownerName = data.user?.name || theme.ownerId;
					ownerAvatar = data.user?.avatarUrl || "";
				})
				.catch(() => {
					ownerName = theme.ownerId;
				});
		}
	});

	function startImageCarousel() {
		if (displayImages.length <= 1) return;
		hoverTimer = setInterval(() => {
			currentImageIndex =
				(currentImageIndex + 1) % displayImages.length;
		}, 2000);
	}

	function stopImageCarousel() {
		if (hoverTimer) {
			clearInterval(hoverTimer);
			hoverTimer = null;
		}
		currentImageIndex = 0;
	}

	function getDisplayImage(): string {
		if (theme.coverImage) {
			return theme.coverImage;
		}
		return displayImages[currentImageIndex] || "";
	}
</script>

<a
	href="/themes/{theme.id}"
	class="theme-card-wrapper"
	onmouseenter={startImageCarousel}
	onmouseleave={stopImageCarousel}
>
	<div class="theme-card glass-panel">
		<div class="card-image">
			{#if displayImages.length > 0}
				{#key currentImageIndex}
					<img
						src={getDisplayImage()}
						alt={theme.name}
						in:fade={{ duration: 300 }}
					/>
				{/key}
			{:else}
				<div class="placeholder">
					<span class="premium-font">{theme.name.charAt(0)}</span
					>
				</div>
			{/if}
			<div class="overlay">
				<span class="view-tag">View Details</span>
			</div>
		</div>

		<div class="card-content">
			<div class="header">
				<h3>{theme.name}</h3>
				<span class="downloads">📥 {theme.downloads}</span>
			</div>
			<p>{theme.description || "No description provided."}</p>
			<div class="footer">
				<div class="owner-info">
					{#if ownerAvatar}
						<img
							src={ownerAvatar}
							alt={ownerName}
							class="avatar"
						/>
					{/if}
					<span class="owner">{ownerName || theme.ownerId}</span>
				</div>
				<button
					class="install-btn"
					onclick={(e) => {
						e.preventDefault();
						e.stopPropagation(); /* install logic here */
					}}>Install</button
				>
			</div>
		</div>
	</div>
</a>

<style lang="scss">
	.theme-card-wrapper {
		text-decoration: none;
		color: inherit;
		display: block;
		height: 100%;
	}

	.theme-card {
		overflow: hidden;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		height: 100%;
		display: flex;
		flex-direction: column;

		&:hover {
			transform: translateY(-4px);
			border-color: rgba(255, 255, 255, 0.3);
			box-shadow:
				0 10px 30px rgba(0, 0, 0, 0.4),
				0 0 15px rgba(255, 255, 255, 0.05);

			.overlay {
				opacity: 1;
			}

			img {
				transform: scale(1.1);
			}
		}

		.card-image {
			position: relative;
			aspect-ratio: 16/9;
			overflow: hidden;
			background: rgba(0, 0, 0, 0.2);

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
				transition: transform 0.6s ease;
			}

			.placeholder {
				width: 100%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				background: linear-gradient(135deg, #0a0a0a, #1a1a1a);
				font-size: 3rem;
				opacity: 0.5;
			}

			.overlay {
				position: absolute;
				inset: 0;
				background: rgba(0, 0, 0, 0.6);
				display: flex;
				align-items: center;
				justify-content: center;
				opacity: 0;
				transition: opacity 0.3s ease;
				.view-tag {
					color: white;
					border: 1px solid rgba(255, 255, 255, 0.2);
					pointer-events: none;
				}
			}
		}

		.card-content {
			padding: 1.5rem;
			flex: 1;
			display: flex;
			flex-direction: column;
			gap: 0.75rem;

			.header {
				display: flex;
				justify-content: space-between;
				align-items: center;

				h3 {
					margin: 0;
					font-size: 1.25rem;
					font-weight: 700;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.downloads {
					font-size: 0.85rem;
					color: var(--text-muted);
					white-space: nowrap;
				}
			}

			p {
				margin: 0;
				font-size: 0.95rem;
				color: var(--text-secondary);
				display: -webkit-box;
				-webkit-line-clamp: 2;
				line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
				line-height: 1.5;
				flex: 1;
			}

			.footer {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-top: 0.5rem;
				gap: 0.75rem;

				.owner-info {
					display: flex;
					align-items: center;
					gap: 0.5rem;
					flex: 1;

					.avatar {
						width: 24px;
						height: 24px;
						border-radius: 50%;
						object-fit: cover;
					}
				}

				.owner {
					font-size: 0.8rem;
					color: var(--text-muted);
					min-width: 0;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.install-btn {
					padding: 6px 16px;
					font-size: 0.85rem;
					white-space: nowrap;
				}
			}
		}
	}
</style>
