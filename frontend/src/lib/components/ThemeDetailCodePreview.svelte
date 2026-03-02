<script lang="ts">
    import { fade } from "svelte/transition";
    import type { Theme } from "$lib/types";

    let {
        theme,
        activeTab = $bindable("overview"),
    }: {
        theme: Theme | null;
        activeTab: string;
    } = $props();
</script>

{#if theme}
    <div class="tabs">
        <button
            class:active={activeTab === "overview"}
            onclick={() => (activeTab = "overview")}>Overview</button
        >
        <button
            class:active={activeTab === "settings"}
            onclick={() => (activeTab = "settings")}>Settings</button
        >
        {#if theme.customStyleshift && theme.customStyleshift.length > 0}
            <button
                class:active={activeTab === "custom"}
                onclick={() => (activeTab = "custom")}>Custom Styles</button
            >
        {/if}
    </div>

    {#if activeTab === "settings"}
        <div class="code-block glass-panel" in:fade={{ duration: 200 }}>
            <pre><code>{JSON.stringify(theme.settings, null, 2)}</code></pre>
        </div>
    {:else if activeTab === "custom"}
        <div class="code-block glass-panel" in:fade={{ duration: 200 }}>
            <pre><code>{JSON.stringify(theme.customStyleshift, null, 2)}</code
                ></pre>
        </div>
    {/if}
{/if}

<style lang="scss">
    .tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;

        button {
            background: transparent;
            border: 1px solid var(--border-glass);
            color: var(--text-muted);
            font-weight: 600;
            padding: 0.5rem 1.25rem;
            cursor: pointer;
            transition: all 0.2s;
            border-radius: var(--radius-sm);
            font-size: 0.9rem;

            &:hover {
                color: var(--text-primary);
                border-color: rgba(var(--text-primary-rgb), 0.3);
            }
            &.active {
                color: var(--primary-glow);
                background: rgba(var(--text-primary-rgb), 0.1);
                border-color: rgba(var(--text-primary-rgb), 0.3);
            }
        }
    }

    .code-block {
        padding: 1.5rem;

        pre {
            margin: 0;
            overflow-x: auto;
            font-size: 0.875rem;
            color: var(--primary-glow);
            line-height: 1.6;

            code {
                font-family: "Fira Code", "Consolas", monospace;
            }
        }
    }
</style>
