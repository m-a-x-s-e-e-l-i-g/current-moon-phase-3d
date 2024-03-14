<script lang="ts">
  import * as Sheet from "$lib/components/ui/sheet";
  import { Switch } from "$lib/components/ui/switch";
  import { Label } from "$lib/components/ui/label";
  import { DonateButton } from '$lib/components/ui/donate-button';
  import Icon from 'svelte-awesome';
  import gear from 'svelte-awesome/icons/gear';
  import { doge } from '$lib/stores.js';
</script>

<Sheet.Root>
  <Sheet.Trigger style="position:absolute;left:10px;top:5px;">
    <Icon data={gear} label="Settings" style="fill:white"/>
  </Sheet.Trigger>
  <Sheet.Content side=left>
    <Sheet.Header>
      <Sheet.Title>Settings</Sheet.Title>
      <Sheet.Description>
      </Sheet.Description>
    </Sheet.Header>
    <div class="flex" style="margin-top:2em;">
      <Label class="flex-auto" for="doge">Doge mode</Label>
      <Switch class="flex-none" id="doge" bind:checked={$doge}/>
    </div>
    <Sheet.Footer class="absolute bottom-5 left-5 right-5"> 
      <DonateButton/>
      <Sheet.Close class="absolute right-0 bottom-2">
        <a href="https://www.maxmade.nl?utm_source=moon-phase&utm_medium=referral" target="_blank" rel="noreferrer">
          <img src="img/logo-MAXmade-FFF.svg" alt="MAXmade" class="h-4 mx-auto"/>
        </a>
      </Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>