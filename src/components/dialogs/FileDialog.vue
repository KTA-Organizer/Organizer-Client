<template>
    <v-dialog v-model="model" width="500">
    <v-card>
         <v-card-title class="headline grey lighten-2" primary-title>
                Bestand toevoegen
            </v-card-title>
        <v-card-text>
            <v-form action="/api/users/csv" method="post" enctype="multipart/form-data">
                <input type="file" id="userFile" name="userfile" accept=".csv" />
            </v-form>
        </v-card-text>
        <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat v-on:click="$emit('update:model', false)">
                    Annuleer
                </v-btn>
                <v-btn color="primary" flat v-on:click="uploadFile">
                    Bevestig
                </v-btn>
            </v-card-actions>
    </v-card>
    </v-dialog>
</template>

<script>
export default {
    name: "FileDialog",
    props: ["model"],
    methods:{
        uploadFile(){
            const doc = document.getElementById("userFile");
            console.log(doc.files);
            if(doc.files.length > 0){
                this.$http.uploadUserCsv(doc.files[0]);
            }
            
        }
    },
    watch: {
        model() {
            this.$emit('update:model', this.model);
        }
    }
}
</script>