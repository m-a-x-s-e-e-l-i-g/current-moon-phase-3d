<script lang="ts">
import type { Snippet } from "svelte";
import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
import { cn } from "$lib/utils";
import DotFilled from "svelte-radix/DotFilled.svelte";

interface Props {
class?: string;
value: string;
children?: Snippet;
[key: string]: any;
}

let { class: className = undefined, value, children: content, ...rest }: Props = $props();
</script>

<DropdownMenuPrimitive.RadioItem
class={cn(
"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
className
)}
{value}
{...rest}
>
{#snippet children({ checked })}
<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
{#if checked}
<DotFilled class="h-4 w-4 fill-current" />
{/if}
</span>
{@render content?.()}
{/snippet}
</DropdownMenuPrimitive.RadioItem>
