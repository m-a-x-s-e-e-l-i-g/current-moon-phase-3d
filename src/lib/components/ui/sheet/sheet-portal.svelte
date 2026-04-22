<script lang="ts">
import type { Snippet } from "svelte";
import { Dialog as SheetPrimitive } from "bits-ui";

interface Props {
children?: Snippet;
[key: string]: any;
}

let { children, ...rest }: Props = $props();
</script>

<SheetPrimitive.Portal {...rest}>
{@render children?.()}
</SheetPrimitive.Portal>
