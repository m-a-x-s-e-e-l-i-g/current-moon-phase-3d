<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import { toast } from "svelte-sonner";
  import { ExternalLink } from 'lucide-svelte';

  const dogecoinAddress = "D7bWW2idUMeL3DyFJ4RauPXiZCKdfP5yXv";
  const cardanoAddress = "addr1qx0gnjhp4d092k3zjevfwu892kqspvy20rjlc7dyv4lqh7y7389wr26724dz99jcjacw24vpqzcg5789l3u6get7p0uq6zt7u4";
  const ethereumAddress = "0x142d976240C8C17eFbF94ce1D2bE82c2eF26e706";
  const bitcoinAddress = "bc1qhmgqvxrv6pn3r07kp6npr64d29jz34jme3q6ep";
  const paypalAddress = "https://www.paypal.me/maxseelig";

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast("Address copied to clipboard");
    } catch {
      toast.error("Failed to copy address to clipboard");
    }
  }
</script>

<div class="absolute left-0 bottom-0">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      {#snippet child({ props })}
        <Button {...props} variant="outline">Feed me 🥩</Button>
      {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-56">
      <DropdownMenu.Group>
        <DropdownMenu.Item onclick={() => copyToClipboard(dogecoinAddress)}>
          Dogecoin
          <DropdownMenu.Shortcut>Ð</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item onclick={() => copyToClipboard(cardanoAddress)}>
          Cardano
          <DropdownMenu.Shortcut>₳</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item onclick={() => copyToClipboard(ethereumAddress)}>
          Ethereum
          <DropdownMenu.Shortcut>Ξ</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item onclick={() => copyToClipboard(bitcoinAddress)}>
          Bitcoin
          <DropdownMenu.Shortcut>₿</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Separator />
      <DropdownMenu.Item onclick={() => window.open(paypalAddress, '_blank', 'noopener,noreferrer')}>
        PayPal
        <DropdownMenu.Shortcut><ExternalLink size={14} /></DropdownMenu.Shortcut>
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
