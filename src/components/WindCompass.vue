<template>
  <img src="../assets/icons/arrow.svg" class="inline w-4 h-4" :style="{ transform: rotation }" />
  
</template>

<script>
import { ref } from 'vue';

export default {
    props: {
        compassDirection: {
            type: String,
            required: false,
            default: null,
        },
        degreeDirection: {
            type: Number,
            required: false,
            default: null,
        }
    },
    setup(props) {
        const rotation = ref('');
        const directionalLookup = {
            'N': 0,
            'NNE': 22.5,
            'NE': 45,
            'ENE': 67.5,
            'E': 90,
            'ESE': 112.5,
            'SE': 135,
            'SSE': 157.5,
            'S': 180,
            'SSW': 202.5,
            'SW': 225,
            'WSW': 247.5,
            'W': 270,
            'WNW': 292.5,
            'NW': 315,
            'NNW': 337.5
        }
        if (props.compassDirection){
            rotation.value = `rotate(${directionalLookup[props.compassDirection]-45}deg)`;
        } else if (props.degreeDirection) {
            rotation.value = `rotate(${props.degreeDirection-45}deg)`;
        }
        return {
            rotation,
        }
    }
}
</script>
