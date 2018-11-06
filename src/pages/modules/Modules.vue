<template>
<main>
    <p>hallo</p>
</main>
</template>

<script>
export default {
    name: "Modules",
    data() {
        return {
            
        };
    },
    methods: {
        
    },
    async created() {
        var self = this;
        const module = await this.$http.getModule(parseInt(this.$route.query.id));
        console.log(module);
    },
    mounted() {
        var sheet = document.createElement("style");
        sheet.innerHTML = "div.menu__content--autocomplete {top:165px !important;}";
        document.body.appendChild(sheet);
    }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
</style>
