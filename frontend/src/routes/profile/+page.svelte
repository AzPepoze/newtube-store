<script lang="ts">
	import { onMount } from "svelte";
	import type { Theme } from "$lib/types";
	import { fade } from "svelte/transition";
	import { getUserId } from "$lib/auth";
	import ProfileThemeList from "$lib/components/ProfileThemeList.svelte";
	import ProfileHeader from "$lib/components/ProfileHeader.svelte";

	let myThemes = $state<Theme[]>([]);
	let userData = $state<{
		name: string;
		avatarUrl: string;
		createdAt: string;
	} | null>(null);
	let loading = $state(true);
	let userId = $state("");

	import { PUBLIC_API_URL } from "$lib/constants";

	async function fetchMyThemes() {
		userId = getUserId();

		if (!userId) {
			loading = false;
			return;
		}

		loading = true;
		try {
			const response = await fetch(
				`${PUBLIC_API_URL}/profile?userId=${userId}`,
			);
			const data = await response.json();
			myThemes = data.themes || [];
			userData = data.user;
		} catch (error) {
			console.error("Failed to fetch profile themes:", error);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		fetchMyThemes();
	});

	async function deleteTheme(themeId: string) {
		if (!confirm("Are you sure you want to delete this theme?")) return;
		try {
			await fetch(`${PUBLIC_API_URL}/themes/${themeId}`, {
				method: "DELETE",
			});
			myThemes = myThemes.filter((t) => t.id !== themeId);
		} catch (error) {
			console.error("Failed to delete theme:", error);
		}
	}
</script>

<div class="profile-container">
	{#if !userId}
		<div class="login-prompt glass-panel" in:fade>
			<h2>Login Required</h2>
			<p>Please sign in to view and manage your themes.</p>
			<a href="/login" class="login-btn">Sign In with Google</a>
		</div>
	{:else}
		<ProfileHeader {userData} />
		<ProfileThemeList {loading} {myThemes} {deleteTheme} />
	{/if}
</div>

<style lang="scss">
	.profile-container {
		padding: 2rem 0;
	}

	.login-prompt {
		max-width: 500px;
		margin: 10vh auto;
		padding: 4rem;
		text-align: center;

		h2 {
			font-size: 2rem;
			margin-bottom: 1rem;
		}

		p {
			color: var(--text-secondary);
			margin-bottom: 2.5rem;
		}

		.login-btn {
			background: var(--text-primary);
			color: var(--bg-dark);
			text-decoration: none;
			display: inline-block;
			padding: 10px 20px;
			border-radius: var(--radius-sm);
			font-weight: bold;
		}
	}
</style>
