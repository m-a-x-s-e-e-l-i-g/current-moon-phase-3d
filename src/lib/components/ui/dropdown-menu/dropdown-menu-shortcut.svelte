<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "$lib/utils";
import type { HTMLAttributes } from "svelte/elements";

interface Props extends HTMLAttributes<HTMLSpanElement> {
children?: Snippet;
}

let { class: className = undefined, children, ...rest }: Props = $props();
</script>

<span class={cn("ml-auto text-xs tracking-widest opacity-60", className)} {...rest}>
{@render children?.()}
</span>
