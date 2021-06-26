<template>
  <div class="flex-grow relative">
    <input
      v-model="zipCodeSearch"
      @keyup="handleKeyup"
      @focus="handleFocus"
      class="w-full mt-2 py-2 px-2 rounded chrome-hide-arrow "
      type="text"
      placeholder="ZIP Code"
    />
    <template v-if="showHistoryList">
      <div
        class="fixed top-0 left-0 w-full h-full z-10"
        @click="closeHistoryList"
      ></div>
      <ul
        id="history-options"
        class="absolute block w-full text-lg bg-gray-400 rounded-b z-20 overflow-hidden"
      >
        <li
          v-for="opt in historyOptions"
          @click="selectOption"
          @mouseover="highlightOption"
          :key="opt.zip"
          :data-zip="opt.zip"
          class="text-lg p-2 hover:bg-gray-600 flex justify-between"
          :class="{ 'bg-gray-600': opt.zip === highlightedZipInList }"
        >
          <span>{{ opt.zip }} ({{ opt.city }}, {{ opt.state }})</span>
          <span
            class="text-2xl cursor-pointer text-gray-800 hover:text-black"
            @click.stop="removeHistoryItem"
          >
            &times;
          </span>
        </li>
      </ul>
    </template>
    <button
      v-if="zipCodeSearch.length == 5"
      @click="lookupZip"
      class="absolute inset-y-0 right-0 border border-indigo-400 bg-indigo-400 text-white rounded px-2 py-2 mt-2 disabled:opacity-90"
    >
      Submit
    </button>
    <span
      v-else
      class="absolute inset-y-0 right-0 border border-indigo-400 bg-indigo-400 text-white rounded px-2 py-2 mt-2 opacity-50"
      >Submit</span
    >
  </div>
</template>

<script>
import { ref, watchEffect } from "vue";
import { store } from "../store.js";

export default {
  props: {},
  components: {},
  setup() {
    
    // Reactive objects
    const originalOptions = ref(store.getHistory());
    const historyOptions = ref(store.getHistory());
    const zipCodeSearch = ref("");
    const highlightedZipInList = ref("");
    const showHistoryList = ref(false);

    const lookupZip = async () => {
      if (zipCodeSearch.value.length == 5) {
        const history = store.getHistory();
        const inHistory = history.find((o) => o.zip === zipCodeSearch.value);
        if (inHistory) {
          store.wfo = inHistory.wfo;
          store.x = inHistory.x;
          store.y = inHistory.y;
          store.city = inHistory.city;
          store.state = inHistory.state;
          store.zip = inHistory.zip;
          store.zoneId = inHistory.zoneId;
        } else {
          const zipResponse = await fetch(
            `https://public.opendatasoft.com/api/records/1.0/search/?dataset=georef-united-states-of-america-zc-point&q=${zipCodeSearch.value}`
          );
          const zipJson = await zipResponse.json();
          if (!zipJson.records || zipJson.records.length === 0) {
            // Invalid ZIP - do something
          }
          const geopoint = zipJson.records[0].fields;
          const latitude = geopoint.geo_point_2d[0];
          const longitude = geopoint.geo_point_2d[1];
          const city = geopoint.usps_city;
          const state = geopoint.stusps_code;
          const zip = geopoint.zip_code;
          const weatherResponse = await fetch(
            `https://api.weather.gov/points/${latitude},${longitude}`
          );
          const weatherJson = await weatherResponse.json();
          const forecastZone = weatherJson.properties.forecastZone.split('/');
          store.wfo = weatherJson.properties.gridId;
          store.x = weatherJson.properties.gridX;
          store.y = weatherJson.properties.gridY;
          store.zoneId = forecastZone[forecastZone.length - 1];
          store.city = city;
          store.state = state;
          store.zip = zip;
          store.addToHistory(zip, store.wfo, store.x, store.y, city, state, store.zoneId);
        }
        store.setCookie("wfo", store.wfo);
        store.setCookie("x", store.x);
        store.setCookie("y", store.y);
        store.setCookie("city", store.city);
        store.setCookie("state", store.state);
        store.setCookie("zip", store.zip);
        // Push this location to history, if not already there
        zipCodeSearch.value = "";
      }
    };

    const handleFocus = (e) => {
      showHistoryList.value = true;
    };

    const handleKeyup = (e) => {
      if (e.key === "Enter") {
        // Submit the currently input ZIP code
        if (!zipCodeSearch.value.length < 5 && highlightedZipInList.value) {
          // If there is no complete ZIP code input, and there is a higlighted 
          // ZIP code, use the highlighted ZIP code
          zipCodeSearch.value = highlightedZipInList.value;
        }
        lookupZip();
        // Hide the history list
        showHistoryList.value = false;
        // Reset the highlighted value
        highlightedZipInList.value = "";
        // Manually blur the input
        e.target.blur();
      } else if (e.key === "ArrowDown") {
        // Mimicing a native option list, support arrow navigation
        if (historyOptions.value.length && highlightedZipInList.value !== "") {
          // Find the next index in the current list of options
          const currentIndex = historyOptions.value.findIndex((o) => o.zip === highlightedZipInList.value);
          // Use modulo to wrap back to beginning
          const newIndex = (currentIndex + 1) % historyOptions.value.length;
          highlightedZipInList.value = historyOptions.value[newIndex].zip;
        } else if (historyOptions.value.length) {
          // Select the first option on first ArrowDown
          highlightedZipInList.value = historyOptions.value[0].zip;
        } else {
          // If no options, reset value
          highlightedZipInList.value = "";
        }
      } else if (e.key === "ArrowUp") {
        // Mimicing a native option list, support arrow navigation
        if (historyOptions.value.length && highlightedZipInList.value !== "") {
          // Find the previous index in the current list of options
          const currentIndex = historyOptions.value.findIndex((o) => o.zip === highlightedZipInList.value);
          // If at zero-index, wrap to last index (length - 1)
          const newIndex = currentIndex - 1 < 0? historyOptions.value.length - 1 : currentIndex - 1;
          highlightedZipInList.value = historyOptions.value[newIndex].zip;
        } else if (historyOptions.value.length) {
          // Select the last option on first ArrowUP
          highlightedZipInList.value = historyOptions.value[historyOptions.value.length - 1].zip;
        } else {
          // If no options, reset value
          highlightedZipInList.value = "";
        }
      } else {
        // All other keys we assume are valid input
        filterZip();
      }
    };

    const filterZip = () => {
      // Use the current input value to filter the remaining options
      historyOptions.value = originalOptions.value.filter((o) => o.zip.startsWith(zipCodeSearch.value));
    };
    const closeHistoryList = (e) => {
      // Clear highlighted value and close list
      highlightedZipInList.value = "";
      showHistoryList.value = false;
    };

    const selectOption = (e) => {
      // Set the value as the target's value, run lookup, and close list
      zipCodeSearch.value = e.currentTarget.dataset.zip;
      lookupZip();
      closeHistoryList();
    };

    const highlightOption = (e) => {
      // Mouse support for highlighting
      highlightedZipInList.value = e.currentTarget.dataset.zip;
    };

    const removeHistoryItem = (e) => {
      // Remove a ZIP code/location from History
      // Accesses parentElement of the <span>, which is the <option>
      store.removeFromHistory(e.target.parentElement.dataset.zip);
      originalOptions.value = store.getHistory();
      historyOptions.value = store.getHistory();
    };

    return {
      closeHistoryList,
      handleFocus,
      handleKeyup,
      highlightOption,
      highlightedZipInList,
      historyOptions,
      selectOption,
      removeHistoryItem,
      showHistoryList,
      store,
      zipCodeSearch,
    };
  },
};
</script>