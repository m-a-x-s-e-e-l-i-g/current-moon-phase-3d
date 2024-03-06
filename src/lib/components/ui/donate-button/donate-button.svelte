<script lang="ts">
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import { Button } from "$lib/components/ui/button";
  import { Toaster } from "$lib/components/ui/sonner";
  import { toast } from "svelte-sonner";
  import Icon from 'svelte-awesome';
  import paypal from 'svelte-awesome/icons/paypal';

  const dogecoinAddress = "D7bWW2idUMeL3DyFJ4RauPXiZCKdfP5yXv";
  const cardanoAddress = "addr1qx0gnjhp4d092k3zjevfwu892kqspvy20rjlc7dyv4lqh7y7389wr26724dz99jcjacw24vpqzcg5789l3u6get7p0uq6zt7u4";
  const ethereumAddress = "0x142d976240C8C17eFbF94ce1D2bE82c2eF26e706";
  const bitcoinAddress = "bc1qhmgqvxrv6pn3r07kp6npr64d29jz34jme3q6ep";
  const paypalAddress = "https://www.paypal.me/maxseelig";

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Address copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy address to clipboard");
    }
  }
</script>

<div class="absolute left-0 bottom-0">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild let:builder>
      <Button builders={[builder]} variant="outline">Feed me 🥩</Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-56">
      <DropdownMenu.Group>
        <DropdownMenu.Item on:click={() => copyToClipboard(dogecoinAddress)}>
          Dogecoin
          <DropdownMenu.Shortcut>Ð</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item on:click={() => copyToClipboard(cardanoAddress)}>
          Cardano
          <DropdownMenu.Shortcut>₳</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item on:click={() => copyToClipboard(ethereumAddress)}>
          Ethereum
          <DropdownMenu.Shortcut>Ξ</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <DropdownMenu.Item on:click={() => copyToClipboard(bitcoinAddress)}>
          Bitcoin
          <DropdownMenu.Shortcut>₿</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
      <DropdownMenu.Separator />    
      <DropdownMenu.Item on:click={() => window.open(paypalAddress, '_blank')}>
        <a href="{paypalAddress}" target="_blank" rel="noreferrer">PayPal</a>
        <DropdownMenu.Shortcut><Icon data={paypal} scale={0.6}/></DropdownMenu.Shortcut>
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>
<Toaster />