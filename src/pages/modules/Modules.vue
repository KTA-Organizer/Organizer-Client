<template>
<main>
    
    <v-layout row class="ml-5">
        <v-flex xs4>
            <v-text-field name="modulenaam" label="Naam van de opleiding" v-model="modulenaam" single-line></v-text-field>
        </v-flex>
        <v-flex xs5>
            <v-btn color="success" :loading="loading" @click.native="saveOpleiding" :disabled="loading">
                Opslaan
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
            </v-btn>
        </v-flex>
    </v-layout>
</main>
</template>

<script>
export default {
    name: "Modules",
    data() {
        return {
            module: null
        };
    },
    methods: {
        
    },
    async created() {
        var self = this;
        this.module = await this.$http.getModule(parseInt(this.$route.query.id));
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
.custom-loader {
    animation: loader 1s infinite;
    display: flex;
}

@-moz-keyframes loader {
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
}

@-webkit-keyframes loader {
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
}

@-o-keyframes loader {
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
}

@keyframes loader {
    from {
        transform: rotate(0);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>

