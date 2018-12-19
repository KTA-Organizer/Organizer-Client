<template>
<v-dialog v-model="model" width="500">
    <v-card v-if="!uploaded && !error">
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
    <v-card v-if="uploaded && !error">
        <v-card-title class="headline grey lighten-2" primary-title>
            Bestand toegevoegd!
        </v-card-title>
        <v-card-text>
            <p>De gegevens worden verwerkt. Dit kan even duren. U kan gewoon verder werken tijdens de verwerking.</p>
            <small>(Studenten die al bestaan in de databank worden overgeslaan)</small>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat v-on:click="$emit('update:model', false)">
                Begrepen!
            </v-btn>
        </v-card-actions>
    </v-card>
    <v-card v-if="error">
        <v-card-title class="headline grey lighten-2" primary-title>
            Er liep iets mis.
        </v-card-title>
        <v-card-text>
            <p>Probeer opnieuw</p>
            <small>(Enkel .csv bestanden zijn toegelaten)</small>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" flat v-on:click="$emit('update:model', false); error = false;">
                Begrepen!
            </v-btn>
        </v-card-actions>
    </v-card>
</v-dialog>
</template>

<script>
export default {
    name: "FileDialog",
    props: ["model", "uploaded"],
    data() {
        return {
            error: false
        }
    },
    methods: {
        async uploadFile() {
            const doc = document.getElementById("userFile");
            let response;
            if (doc.files.length > 0) {
                response = await this.$http.uploadUserCsv(doc.files[0]);
            } else return;
            if (response && response.ok) {
                this.uploaded = true;
            } else {
                this.error = true;
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
