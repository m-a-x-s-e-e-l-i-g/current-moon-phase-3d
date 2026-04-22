<script lang="ts">
import type { Snippet } from "svelte";
import { cn } from "$lib/utils";
import type { HTMLAttributes } from "svelte/elements";

interface Props extends HTMLAttributes<HTMLDivElement> {
children?: Snippet;
}

let { class: className = undefined, children, ...rest }: Props = $props();
</script>

<div class={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...rest}>
{@render children?.()}
</div>
