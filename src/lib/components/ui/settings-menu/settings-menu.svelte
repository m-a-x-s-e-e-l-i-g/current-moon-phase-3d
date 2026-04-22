<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet";
  import { Switch } from "$lib/components/ui/switch";
  import { Label } from "$lib/components/ui/label";
  import { DonateButton } from '$lib/components/ui/donate-button';
  import { Settings } from 'lucide-svelte';
  import { DOGE_MODE_ENABLED, doge } from '$lib/stores.js';
</script>

<Sheet.Root>
  <Sheet.Trigger style="position:absolute;left:10px;top:5px;" aria-label="Open settings">
    <Settings color="white" size={20} />
  </Sheet.Trigger>
  <Sheet.Content side="left">
    <Sheet.Header>
      <Sheet.Title>Settings</Sheet.Title>
      <Sheet.Description />
    </Sheet.Header>
    <div style="margin-top:2em;">
      <div class="flex">
        <Label class="flex-auto" for="doge">Doge mode</Label>
        <Switch class="flex-none" id="doge" bind:checked={$doge} disabled={!DOGE_MODE_ENABLED} />
      </div>
      {#if !DOGE_MODE_ENABLED}
        <div style="margin-top:0.4rem; font-size:0.85rem; opacity:0.85;">
          Doge mode is being reworked — coming back soon.
        </div>
      {/if}
    </div>
    <Sheet.Footer class="absolute bottom-5 left-5 right-5">
      <DonateButton />
      <a
        class="absolute right-0 bottom-2"
        href="https://www.maxmade.nl?utm_source=moon-phase&utm_medium=referral"
        target="_blank"
        rel="noreferrer"
      >
        <img src="img/logo-MAXmade-FFF.svg" alt="MAXmade" class="h-4 mx-auto" />
      </a>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
