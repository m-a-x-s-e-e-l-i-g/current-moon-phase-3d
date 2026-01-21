<script lang="ts">
    import { onMount } from 'svelte';

    export let className = '';
    export let threshold = 0.12;
    export let rootMargin = '0px 0px -10% 0px';

    let node: HTMLElement;
    let inview = false;

    onMount(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                inview = entry.isIntersecting;
            },
            { threshold, rootMargin }
        );

        observer.observe(node);

        return () => observer.disconnect();
    });
</script>

<div bind:this={node} class={`reveal ${className}`} class:inview={inview}>
    <slot />
</div>

<style>
    .reveal {
        opacity: 0;
        transform: translateY(14px);
        filter: blur(4px);
        transition:
            opacity 700ms cubic-bezier(0.21, 0.85, 0.33, 1),
            transform 700ms cubic-bezier(0.21, 0.85, 0.33, 1),
            filter 700ms cubic-bezier(0.21, 0.85, 0.33, 1);
        will-change: opacity, transform, filter;
    }

    .reveal.inview {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0px);
    }

    @media (prefers-reduced-motion: reduce) {
        .reveal {
            transition: none;
            transform: none;
            filter: none;
            opacity: 1;
        }
    }
</style>
