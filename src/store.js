import { reactive } from 'vue';

// https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=97403
// https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=4600+Silver+Hill+Rd%2C+Suitland%2C+MD+20746&benchmark=9&format=json
export const store = reactive({
    baseURL: 'https://api.weather.gov',
    wfo: '',
    x: null,
    y: null,
    city: '',
    state: '',
    zip: '',
    zoneId: '',
    currentDescription: '',
    imageChoice: '',
    settingsMenu: false,
    stateLookup: {
        "AL": "Alabama",
        "AK": "Alaska",
        "AZ": "Arizona",
        "AR": "Arkansas",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DE": "Delaware",
        "DC": "District Of Columbia",
        "FL": "Florida",
        "GA": "Georgia",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "IA": "Iowa",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "ME": "Maine",
        "MD": "Maryland",
        "MA": "Massachusetts",
        "MI": "Michigan",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MO": "Missouri",
        "MT": "Montana",
        "NE": "Nebraska",
        "NV": "Nevada",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NY": "New York",
        "NC": "North Carolina",
        "ND": "North Dakota",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        "PA": "Pennsylvania",
        "RI": "Rhode Island",
        "SC": "South Carolina",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vermont",
        "VA": "Virginia",
        "WA": "Washington",
        "WV": "West Virginia",
        "WI": "Wisconsin",
        "WY": "Wyoming"
    },
    setCookie: (key, value) => {
        document.cookie = `${key}=${value}`;
    },
    getCookie: (key, defaultVal) => {
        const cookie = document.cookie.split('; ').find(row => row.startsWith(key));
        if (cookie) {
            return cookie.split('=')[1]
        } else {
            return defaultVal;
        }
    },
    addToHistory: (zip, wfo, x, y, city, state, zoneId) => {
        const history = localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history')) : [];
        if (!history.find(o => o.zip === zip)) {
            // Only add if the ZIP isn't already present in the array
            history.push({zip, wfo, x, y, city, state, zoneId});
            localStorage.setItem('history', JSON.stringify(history));
        }
    },
    getHistory: () => {
        return localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history')) : [];
    },
    removeFromHistory: (zip) => {
        const history = localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history')) : [];
        const newHistory = history.filter(o => o.zip !== zip);
        localStorage.setItem('history', JSON.stringify(newHistory));
    }

});