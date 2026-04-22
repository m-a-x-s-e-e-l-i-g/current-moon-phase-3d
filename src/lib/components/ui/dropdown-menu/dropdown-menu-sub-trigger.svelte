<script lang="ts">
import type { Snippet } from "svelte";
import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
import { cn } from "$lib/utils";
import ChevronRight from "svelte-radix/ChevronRight.svelte";

interface Props {
class?: string;
inset?: boolean;
children?: Snippet;
[key: string]: any;
}

let { class: className = undefined, inset = false, children, ...rest }: Props = $props();
</script>

<DropdownMenuPrimitive.SubTrigger
class={cn(
"flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-accent data-[state=open]:bg-accent data-[highlighted]:text-accent-foreground data-[state=open]:text-accent-foreground",
inset && "pl-8",
className
)}
{...rest}
>
{@render children?.()}
<ChevronRight class="ml-auto h-4 w-4" />
</DropdownMenuPrimitive.SubTrigger>
