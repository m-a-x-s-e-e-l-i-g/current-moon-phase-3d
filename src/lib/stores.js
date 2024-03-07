import { writable } from 'svelte/store';
import { toast } from 'svelte-sonner';

// Location defaults to Breda, The Netherlands
export const latitude = writable(51.571915);
export const longitude = writable(4.768323);
export const hemisphere = writable('northern');
export const doge = writable(false);

doge.subscribe(value => {
    toast(`Doge mode ${value ? 'enabled' : 'disabled'}`);
});

latitude.subscribe(value => {
    let hemi = value >= 0 ? 'northern' : 'southern';
    hemisphere.set(hemi);
    toast(`Hemisphere set to ${hemi}`);
});