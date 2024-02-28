<script lang="ts">
    import * as Sheet from "$lib/components/ui/sheet";
    import { Switch } from "$lib/components/ui/switch";
    import { Label } from "$lib/components/ui/label";
    import Icon from 'svelte-awesome';
    import gear from 'svelte-awesome/icons/gear';
    import { hemisphere } from '$lib/stores.js';
</script>

<Sheet.Root>
  <Sheet.Trigger style="position:absolute;left:10px;top:5px;">
    <Icon data={gear} label="Settings" style="fill:white"/>
  </Sheet.Trigger>
  <Sheet.Content side=left>
    <Sheet.Header>
      <Sheet.Title>Settings</Sheet.Title>
      <Sheet.Description>
        <div class="flex items-center space-x-2" style="margin-top:1em;">
            <Switch id="hemisphere" on:click={() => $hemisphere = $hemisphere === 'northern' ? 'southern' : 'northern'}/>
            <Label for="hemisphere"><span style="text-transform:capitalize">{$hemisphere}</span> hemisphere</Label>
        </div>
      </Sheet.Description>
    </Sheet.Header>
  </Sheet.Content>
</Sheet.Root>