import { writable } from 'svelte/store';
import { toast } from 'svelte-sonner';

export const hemisphere = writable('northern');
export const doge = writable(false);
doge.subscribe(value => {
    toast.success(`Doge mode ${value ? 'enabled' : 'disabled'}`);
});
