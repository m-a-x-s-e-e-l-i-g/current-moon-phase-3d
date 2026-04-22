<script lang="ts">
import type { Snippet } from "svelte";
import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
import { cn } from "$lib/utils";

interface Props {
class?: string;
inset?: boolean;
children?: Snippet;
[key: string]: any;
}

let { class: className = undefined, inset = false, children, ...rest }: Props = $props();
</script>

<DropdownMenuPrimitive.GroupHeading
class={cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className)}
{...rest}
>
{@render children?.()}
</DropdownMenuPrimitive.GroupHeading>
