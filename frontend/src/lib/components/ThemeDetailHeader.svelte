<script lang="ts">
    import type { Theme } from "$lib/types";
    import EditIcon from "$lib/icons/EditIcon.svelte";
    import TrashIcon from "$lib/icons/TrashIcon.svelte";

    interface ThemeDetail extends Theme {
        creator_name?: string;
        creator_avatar?: string;
    }

    let {
        theme,
        currentUser,
        deleteTheme,
    }: {
        theme: ThemeDetail;
        currentUser: string;
        deleteTheme: () => void;
    } = $props();
</script>

<div class="title-row">
    <h1 class="premium-font glow-text">{theme.name}</h1>
    <div class="actions-group">
        {#if currentUser === theme.ownerId}
            <a
                href="/themes/edit/{theme.id}"
                class="icon-action-btn edit"
                title="Edit Theme"
            >
                <EditIcon size={18} />
            </a>
            <button
                class="icon-action-btn delete"
                title="Delete Theme"
                onclick={deleteTheme}
            >
                <TrashIcon size={18} />
            </button>
        {/if}
        <button class="install-btn premium-button">Install Theme</button>
    </div>
</div>

<div class="stats glass-panel">
    <div class="stat-item">
        <span class="stat-value">📥 {theme.downloads.toLocaleString()}</span>
        <span class="stat-label">Downloads</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat-item">
        <span class="stat-value">🖼️ {theme.images?.length ?? 0}</span>
        <span class="stat-label">Screenshots</span>
    </div>
    <div class="stat-divider"></div>
    <div class="stat-item">
        <span class="stat-value"
            >⚙️ {Object.keys(theme.settings || {}).length}</span
        >
        <span class="stat-label">Settings</span>
    </div>
</div>

<style lang="scss">
    .title-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;

        h1 {
            margin: 0;
            font-size: 2.5rem;
            line-height: 1.1;
        }

        .actions-group {
            display: flex;
            align-items: center;
            gap: 0.75rem;

            .icon-action-btn {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                border-radius: var(--radius-sm);
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid var(--border-glass);
                color: var(--text-secondary);
                cursor: pointer;
                transition: all 0.2s;

                &:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-primary);
                }

                &.edit:hover {
                    color: var(--primary-glow);
                    border-color: rgba(var(--text-primary-rgb), 0.3);
                }

                &.delete:hover {
                    color: #ff4d4d;
                    border-color: rgba(255, 77, 77, 0.3);
                    background: rgba(255, 77, 77, 0.1);
                }
            }
        }

        .install-btn {
            background: linear-gradient(
                135deg,
                var(--primary-glow),
                var(--secondary-glow)
            );
            color: var(--bg-dark);
            white-space: nowrap;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: var(--radius-sm);
            font-weight: 600;
            font-family: inherit;
            cursor: pointer;
        }
    }

    .stats {
        display: flex;
        align-items: center;
        padding: 1.25rem 1.5rem;
        gap: 0;
        border-radius: var(--radius-md);

        .stat-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.25rem;

            .stat-value {
                font-size: 1.1rem;
                font-weight: 700;
                color: var(--text-primary);
            }

            .stat-label {
                font-size: 0.75rem;
                color: var(--text-muted);
            }
        }

        .stat-divider {
            width: 1px;
            height: 40px;
            background: var(--border-glass);
        }
    }
</style>
