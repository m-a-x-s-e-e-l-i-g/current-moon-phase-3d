<script lang="ts">
import type { Snippet } from "svelte";
import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";

interface Props {
value?: string;
children?: Snippet;
[key: string]: any;
}

let { value = $bindable(undefined), children, ...rest }: Props = $props();
</script>

<DropdownMenuPrimitive.RadioGroup {...rest} bind:value>
{@render children?.()}
</DropdownMenuPrimitive.RadioGroup>
