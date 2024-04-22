<script>
	import { LEVELS } from '$lib/constants';
	import { difficulty } from '$stores/board';

	import BoardOverlay from './BoardOverlay.svelte';

	$: BOARD_WIDTH = LEVELS[$difficulty].width;
	$: BOARD_HEIGHT = LEVELS[$difficulty].height;
</script>

<div
	class="grid relative w-full gap-0.5 mx-auto md:w-max"
	style:grid-template-columns="repeat({BOARD_HEIGHT}, minmax(0, 1fr))"
	style:grid-template-rows="repeat({BOARD_WIDTH}, minmax(0, 1fr))"
>
	<BoardOverlay />
	<slot />
</div>
