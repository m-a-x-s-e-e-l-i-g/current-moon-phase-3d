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

<DropdownMenuPrimitive.Item
class={cn(
"relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
inset && "pl-8",
className
)}
{...rest}
>
{@render children?.()}
</DropdownMenuPrimitive.Item>
