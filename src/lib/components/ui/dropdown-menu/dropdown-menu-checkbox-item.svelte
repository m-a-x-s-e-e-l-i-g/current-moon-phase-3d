<script lang="ts">
import type { Snippet } from "svelte";
import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
import { cn } from "$lib/utils";
import Check from "svelte-radix/Check.svelte";

interface Props {
class?: string;
checked?: boolean;
children?: Snippet;
[key: string]: any;
}

let {
class: className = undefined,
checked = $bindable(false),
children: content,
...rest
}: Props = $props();
</script>

<DropdownMenuPrimitive.CheckboxItem
bind:checked
class={cn(
"relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50",
className
)}
{...rest}
>
{#snippet children({ checked, indeterminate })}
<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
{#if checked || indeterminate}
<Check class="h-4 w-4" />
{/if}
</span>
{@render content?.()}
{/snippet}
</DropdownMenuPrimitive.CheckboxItem>
