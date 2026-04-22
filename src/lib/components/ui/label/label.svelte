<script lang="ts">
import type { Snippet } from "svelte";
import { Label as LabelPrimitive } from "bits-ui";
import { cn } from "$lib/utils";

interface Props {
class?: string;
children?: Snippet;
[key: string]: any;
}

let { class: className = undefined, children, ...rest }: Props = $props();
</script>

<LabelPrimitive.Root
class={cn(
"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
className
)}
{...rest}
>
{@render children?.()}
</LabelPrimitive.Root>
