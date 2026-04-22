<script lang="ts">
import type { Snippet } from "svelte";
import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
import { cn } from "$lib/utils";

interface Props {
class?: string;
sideOffset?: number;
children?: Snippet;
[key: string]: any;
}

let {
class: className = undefined,
sideOffset = 4,
children,
...rest
}: Props = $props();
</script>

<DropdownMenuPrimitive.Content
{sideOffset}
class={cn(
"z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md focus:outline-none",
className
)}
{...rest}
>
{@render children?.()}
</DropdownMenuPrimitive.Content>
