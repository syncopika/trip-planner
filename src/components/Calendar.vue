<template>
    <div>
        <div class="calendar" v-if="isEditing">
			<p> {{header}}: </p>
            <input :id="destName + 'month'" type="text" size="2" maxlength="2" placeholder="mm" />
            <p> / </p>
            <input :id="destName + 'day'" type="text" size="2" maxlength="2" placeholder="dd" />
            <p> / </p>
            <input :id="destName + 'year'" type="text" size="4" maxlength="4" placeholder="yyyy" />
        </div>
        <div class="calendar" v-if="!isEditing">
            <h3>{{header}}:  {{date.length === 2 ? "" : date.replaceAll("-", "/")}} (MM/DD/YYYY)</h3>
        </div>
    </div>
</template>


<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    data(){
        return {}
    },
    props: {
        destName: { required: true, type: String },
        isEditing: { required: true, type: Boolean },
        date: { required: true, type: String },
		header: { required: true, type: String },
    },
    methods: {
        getDateInfo: function(): {month: string; day: string; year: string} {
            const destName = this.destName;
            const month: HTMLInputElement = document.getElementById(destName + "month") as HTMLInputElement;
            const day: HTMLInputElement = document.getElementById(destName + "day") as HTMLInputElement;
            const year: HTMLInputElement = document.getElementById(destName + "year") as HTMLInputElement;
            return {
                month: month.value,
                day: day.value,
                year: year.value
            };
        }
    },
    updated: function(){
        if(this.date && this.isEditing){
            // show the input fields with the date filled in
            const dateParts = this.date.split("-"); // dates should be delimited by "-"
            const destName = this.destName;

            const month: HTMLInputElement = document.getElementById(destName + "month") as HTMLInputElement;
            const day: HTMLInputElement = document.getElementById(destName + "day") as HTMLInputElement;
            const year: HTMLInputElement = document.getElementById(destName + "year") as HTMLInputElement;

            if(month && dateParts.length > 0) month.value = dateParts[0];
            if(day && dateParts.length > 1) day.value = dateParts[1];
            if(year && dateParts.length > 2) year.value = dateParts[2];
        }
    }
});
</script>

<style scoped>
    .calendar > * {
        display: inline-block;
    }
</style>