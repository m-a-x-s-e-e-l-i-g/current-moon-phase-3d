<script lang="ts">
     import { doge } from '$lib/stores.js';
</script>
{@html $doge === true ? '<audio id="dogeSong" src="./audio/doge-song.mp3" type="audio/mpg" autoplay loop></audio>' : ''}