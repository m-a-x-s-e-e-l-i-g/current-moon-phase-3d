<script lang="ts">
import type { Snippet } from "svelte";
import { Dialog as SheetPrimitive } from "bits-ui";
import { cn } from "$lib/utils";

interface Props {
class?: string;
children?: Snippet;
[key: string]: any;
}

let { class: className = undefined, children, ...rest }: Props = $props();
</script>

<SheetPrimitive.Title
class={cn("text-lg font-semibold text-foreground", className)}
{...rest}
>
{@render children?.()}
</SheetPrimitive.Title>
