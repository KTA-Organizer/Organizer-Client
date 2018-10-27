<template>
    
    <v-container>
        <p>{{user.firstname}} {{user.lastname}}</p>
    </v-container>
    

</template>

<script>
export default {
    name: "DetailUser",
    data() {
        return {
            user: {}
        }
    },
    methods: {

    },
    async created() {
        const userId = this.$route.params.id;
        this.user = await this.$http.getUser(userId);
    }
}
</script>
