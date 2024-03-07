import { toast } from "svelte-sonner";
import { latitude, longitude } from '$lib/stores.js';

export function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    } else {
        toast.error("Geolocation umsupported by this browser.");
    }
}

function setPosition(position) {
    latitude.set(position.coords.latitude);
    longitude.set(position.coords.longitude);
    toast.success("Your current location has been set.");
}

function showError(error) {
    const defaultString = "Defaulting to Breda, the Netherlands.";
    switch (error.code) {
        case error.PERMISSION_DENIED:
            toast.error("Location request denied.", { description: defaultString });
            break;
        case error.POSITION_UNAVAILABLE:
            toast.error("Location unavailable.", { description: defaultString });
            break;
        case error.TIMEOUT:
            toast.error("Location request timed out.", { description: defaultString });
            break;
        case error.UNKNOWN_ERROR:
            toast.error("Unknown error 🤷", { description: defaultString });
            break;
    }
}