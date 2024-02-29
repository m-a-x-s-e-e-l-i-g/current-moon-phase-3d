<script lang="ts">
  import * as Select from "$lib/components/ui/select";
  import * as Sheet from "$lib/components/ui/sheet";
  import { Switch } from "$lib/components/ui/switch";
  import { Label } from "$lib/components/ui/label";
  import Icon from 'svelte-awesome';
  import gear from 'svelte-awesome/icons/gear';
  import { hemisphere, doge } from '$lib/stores.js';
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
    <br/>
    <div>
      <Label>Hemisphere</Label>
      <Select.Root selected={$hemisphere}
        onSelectedChange={(v) => {
          v && ($hemisphere = v.value);
        }}>
        <Select.Trigger class="w-[180px]">
          <Select.Value placeholder="{$hemisphere}" style="text-transform:capitalize;"/>
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="northern">Northern</Select.Item>
          <Select.Item value="southern">Southern</Select.Item>
        </Select.Content>
      </Select.Root>
      <div class="flex" style="margin-top:1em;">
        <Label class="flex-auto" for="doge">Doge mode</Label>
        <Switch class="flex-none" id="doge" bind:checked={$doge}/>
      </div>
    </div>
  </Sheet.Content>
</Sheet.Root>