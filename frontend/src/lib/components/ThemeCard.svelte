<script lang="ts">
    import type { Theme } from "$lib/types";

    let { theme }: { theme: Theme } = $props();
</script>

<a href="/themes/{theme.id}" class="theme-card-wrapper">
    <div class="theme-card glass-panel">
        <div class="card-image">
            {#if theme.images && theme.images.length > 0}
                <img src={theme.images[0]} alt={theme.name} />
            {:else}
                <div class="placeholder">
                    <span class="premium-font">{theme.name.charAt(0)}</span>
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
                <span class="owner">By @{theme.id.slice(0, 8)}</span>
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
                    @include premium-button;
                    @include glassmorphism;
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

                .owner {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                }

                .install-btn {
                    @include premium-button;
                    padding: 6px 16px;
                    font-size: 0.85rem;
                }
            }
        }
    }
</style>
