<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { addNoSleepListener, removeNoSleepListener } from "./stayAwake";
  import fitty from "fitty";

  let timeDiv: HTMLDivElement;
  let timerForm: HTMLFormElement;
  let beforeStart = true;
  let showStartButton = true;

  onMount(() => {
    // Keep device awake when timer in focus
    addNoSleepListener(timerForm);

    // Fit text in div to size of parent container
    fitty(timeDiv);
  });

  onDestroy(removeNoSleepListener);

  const pad = (num: number) => {
    return num.toString().length === 1 ? "0" + num : num.toString();
  };

  const inSeconds = (minutes: number) => minutes * 60;
  const returnMinutes = (time: number) => Math.floor(time / 60);
  const returnSeconds = (time: number) => Math.floor(time % 60);

  let intervalId = 0;

  let defaultSession = 50;
  let defaultBreak = 10;

  let sessionMinutes = 50;
  let breakMinutes = 10;
  let sessionTimer = true;

  let timerMinutes = defaultSession;

  // let initialMinutes = sessionMinutes;
  let initialTime = inSeconds(timerMinutes);

  $: time = initialTime;
  $: minutes = pad(returnMinutes(time));
  $: seconds = pad(returnSeconds(time));

  $: if (time <= 0) {
    clearInterval(intervalId);
    timerMinutes = sessionTimer ? sessionMinutes : breakMinutes;
    if (Number.isInteger(timerMinutes) === false) {
      timerMinutes = sessionTimer ? defaultSession : defaultBreak;
    }
    time = inSeconds(timerMinutes);
    showStartButton = true;
  }

  function updateTime(currentTime: number) {
    return currentTime - 1;
  }

  function start(minutes: number) {
    console.log("minutes", minutes);
    console.log("sessionMinutes", sessionMinutes);
    console.log("timerMinutes", timerMinutes);    
    clearInterval(intervalId);
    if (Number.isInteger(minutes) && minutes > 0) {
      time = inSeconds(minutes);
    }
    intervalId = window.setInterval(() => (time = updateTime(time)), 1000);
    beforeStart = false;
    showStartButton = false;
    sessionTimer = !sessionTimer;
  }

  function toggle(element: HTMLElement, cssClass: string) {
    element.classList.toggle(cssClass);
  }
</script>

<main class="centered">
  <div class="mirror timer" bind:this={timeDiv}>
    {minutes}:{seconds}
  </div>
  <form
    bind:this={timerForm}
    on:submit|preventDefault={() => start(sessionMinutes)}
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
        on:click={() => toggle(timeDiv, "mirror")}
      />
      <input type="submit" class="buttons" value="START" />
    {/if}
  </form>
</main>

<style>
  main {
    text-align: center;
    margin: 0 auto;
    /* font-family: "Andalé Mono"; */
    /* font-family: "Lucida Console"; */
    /* font-family: "Monaco"; */
    font-family: "Courier";
    width: 75%;
  }

  /* @media (min-width: 640px) {
        main {
            max-width: none;
        }
    } */

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
