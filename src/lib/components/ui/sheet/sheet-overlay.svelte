<script lang="ts">
import { Dialog as SheetPrimitive } from "bits-ui";
import { cn } from "$lib/utils";

interface Props {
class?: string;
[key: string]: any;
}

let { class: className = undefined, ...rest }: Props = $props();
</script>

<SheetPrimitive.Overlay
class={cn("fixed inset-0 z-50 bg-background/80 backdrop-blur-sm", className)}
{...rest}
/>
