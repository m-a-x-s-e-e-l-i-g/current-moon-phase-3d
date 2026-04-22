<script lang="ts">
import type { Snippet } from "svelte";
import { Button as ButtonPrimitive } from "bits-ui";
import { cn } from "$lib/utils";
import { buttonVariants } from ".";

interface Props {
class?: string;
variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
size?: "default" | "sm" | "lg" | "icon";
children?: Snippet;
[key: string]: any;
}

let {
class: className = undefined,
variant = "default",
size = "default",
children,
...rest
}: Props = $props();
</script>

<ButtonPrimitive.Root
class={cn(buttonVariants({ variant, size, className }))}
type="button"
{...rest}
>
{@render children?.()}
</ButtonPrimitive.Root>
