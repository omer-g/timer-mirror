<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { addNoSleepListener, removeNoSleepListener } from "./util/stayAwake";
  import { mirroredStore } from "./util/store";
  import fitty from "fitty";

  let timeDiv: HTMLDivElement;
  let timerForm: HTMLFormElement;

  // Before start ask for interval input
  let beforeStart = true;

  // Show buttons when timer not running
  let showStartButton = true;

  onMount(() => {
    // Keep device awake when timer in focus
    addNoSleepListener(timerForm);

    // Fit text in div to size of parent container
    fitty(timeDiv);

    if ($mirroredStore === false) {
      timeDiv.classList.remove("mirror");
    }
  });

  onDestroy(removeNoSleepListener);

  const pad = (num: number) => {
    return num.toString().length === 1 ? "0" + num : num.toString();
  };

  const inSeconds = (minutes: number) => minutes * 60;
  const returnMinutes = (time: number) => Math.floor(time / 60);
  const returnSeconds = (time: number) => Math.floor(time % 60);
  const isPositiveInteger = (num: unknown) => Number.isInteger(num) && num > 0;

  let intervalId = 0;

  let defaultSession = 50;
  let defaultBreak = 10;

  let sessionMinutes = 50;
  let breakMinutes = 10;
  let sessionTimer = true;

  let timerMinutes = defaultSession;

  let startTime: Date;
  let timeDelta = 0;

  let time = inSeconds(timerMinutes);
  $: minutesOutput = pad(returnMinutes(time));
  $: secondsOutput = pad(returnSeconds(time));

  function setTimerMinutes() {
    const defaultMinutes = sessionTimer ? defaultSession : defaultBreak;
    const minutes = sessionTimer ? sessionMinutes : breakMinutes;
    return isPositiveInteger(minutes) ? minutes : defaultMinutes;
  }

  $: if (time <= 0) {
    clearInterval(intervalId);
    timerMinutes = setTimerMinutes();
    time = inSeconds(timerMinutes);
    showStartButton = true;
  }

  function updateTime() {
    const timeNow = new Date();
    timeDelta = Math.floor(
      timeNow.valueOf() / 1000 - startTime.valueOf() / 1000
    );
    return inSeconds(timerMinutes) - timeDelta;
  }

  function start() {
    beforeStart = false;
    startTime = new Date();

    timerMinutes = setTimerMinutes();
    time = inSeconds(timerMinutes);
    intervalId = window.setInterval(() => (time = updateTime()), 1000);

    showStartButton = false;
    sessionTimer = !sessionTimer;
  }

  function toggleMirror(element: HTMLElement) {
    $mirroredStore = !$mirroredStore;
    element.classList.toggle("mirror");
  }
</script>

<main class="centered">
  <div class="mirror timer" bind:this={timeDiv}>
    {minutesOutput}:{secondsOutput}
  </div>
  <form
    bind:this={timerForm}
    on:submit|preventDefault={() => start()}
    class="start"
  >
    {#if beforeStart === true}
      <input
        type="number"
        placeholder="Session minutes"
        bind:value={sessionMinutes}
      />
      <input
        type="number"
        placeholder="Break minutes"
        bind:value={breakMinutes}
      /><br />
    {/if}
    {#if showStartButton}
      <input
        type="button"
        class="buttons"
        value="MIRROR"
        on:click={() => toggleMirror(timeDiv)}
      />
      <input type="submit" class="buttons" value="START" />
    {/if}
  </form>
</main>

<style>
  main {
    text-align: center;
    margin: 0 auto;
    font-family: "Courier";
    width: 75%;
  }

  .timer {
    color: white;
    font-weight: 100;
  }

  .start {
    font-size: 20px;
    color: white;
    font-weight: 100;
  }

  .buttons {
    background-color: teal;
  }

  .mirror {
    transform: scale(-1, 1);
    -moz-transform: scale(-1, 1);
    -webkit-transform: scale(-1, 1);
    -o-transform: scale(-1, 1);
    -ms-transform: scale(-1, 1);
    transform: scale(-1, 1);
  }
</style>
