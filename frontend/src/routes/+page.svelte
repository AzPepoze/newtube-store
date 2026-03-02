<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";

    let visible = $state(false);

    onMount(() => {
        visible = true;
    });
</script>

<div class="welcome-container">
    {#if visible}
        <section class="hero" in:fly={{ y: 30, duration: 800, delay: 200 }}>
            <div class="hero-content">
                <h1 class="premium-font">
                    Discover / Create Your <span class="glow">NewTube</span> Experience
                </h1>

                <div class="cta-group">
                    <a href="/store" class="primary-cta">Explore Store</a>
                    <a href="/themes/create" class="secondary-cta"
                        >Create Your Own</a
                    >
                </div>
            </div>
        </section>
    {/if}
</div>

<style lang="scss">
    .welcome-container {
        display: flex;
        flex-direction: column;
        gap: 6rem;
        padding-top: 6rem;
        padding-bottom: 6rem;
    }

    .hero {
        display: flex;
        justify-content: center;
        text-align: center;

        .hero-content {
            max-width: 900px;
        }

        h1 {
            font-size: 5rem;
            line-height: 1;
            margin-bottom: 2rem;
            font-weight: 800;

            .glow {
                @include glow-text(#ffffff);
            }

            @media (max-width: 768px) {
                font-size: 3.5rem;
            }
        }

        p {
            font-size: 1.4rem;
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 4rem;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
        }

        .cta-group {
            display: flex;
            gap: 1.5rem;
            justify-content: center;
        }

        .primary-cta {
            @include premium-button;
            padding: 16px 40px;
            font-size: 1.1rem;
            background: var(--text-primary);
            color: var(--bg-dark);
        }

        .secondary-cta {
            @include premium-button;
            @include glassmorphism;
            padding: 16px 40px;
            font-size: 1.1rem;
            color: var(--text-primary);
        }
    }

    .features {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 2rem;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }

        .feature-card {
            padding: 2.5rem;
            text-align: center;
            transition: transform 0.3s ease;

            &:hover {
                transform: translateY(-10px);
                border-color: rgba(255, 255, 255, 0.2);
            }

            .icon {
                font-size: 3rem;
                margin-bottom: 1.5rem;
            }

            h3 {
                font-size: 1.5rem;
                margin-bottom: 1rem;
            }

            p {
                color: var(--text-secondary);
                line-height: 1.5;
                font-size: 0.95rem;
            }
        }
    }
</style>
