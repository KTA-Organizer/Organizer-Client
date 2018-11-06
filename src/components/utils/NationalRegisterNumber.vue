<template>
<v-text-field :disabled="disabled" type="text" label="Rijksregisternummer" v-model="rgn" :mask="mask" required v-on:input="$emit('update:model', rgn)">
</v-text-field>
</template>

<script>
export default {
    name: "NationalRegisterNumber",
    props: ["model", "disabled"],
    data() {
        return {
            mask: "##.##.##-###.##",
            rgn: undefined,
        }
    },
    beforeUpdate() {
        this.rgn = this.model;
    }
}
</script>
