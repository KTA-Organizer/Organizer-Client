<template>
<div>
    <v-layout row-wrap>
        <v-flex xs4 offset-xs1>
        </v-flex>
        <v-flex xs1 offset-xs4 class="mr-5">
            <router-link :to="{ name: 'Rapport Aanmaken' }">
                <v-btn class="primary">
                    <v-icon>add</v-icon> Rapport Aanmaken
                </v-btn>
            </router-link>
        </v-flex>
    </v-layout>
    <v-layout row-wrap>
        <v-flex class="mt-5">
            <v-data-table v-bind:headers="headers" :items="reports" hide-actions class="elevation-1">
                <template slot="items" slot-scope="props">
                    <tr>
                        <td class="text-xs-left">{{ props.item.student.firstname + " " + props.item.student.lastname }}</td>
                        <td class="text-xs-left">{{ props.item.teacher.firstname + " " + props.item.teacher.lastname }}</td>
                        <td class="text-xs-left">{{ props.item.discipline.name }}</td>
                        <td class="text-xs-left">{{ props.item.module.name }}</td>
                        <td class="text-xs-right">
                            <v-btn color="primary" class="ma-1 right" dark :to="{ name: 'Rapport', params: { reportid: props.item.id }}">
                                <v-icon dark>remove_red_eye</v-icon> Bekijken
                            </v-btn>
                        </td>
                    </tr>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex';
import pdfMake from "pdfmake/build/pdfmake.min.js";

export default {
    name: "DisciplinesList",
    data() {
        return {
            headers: [{
                    text: "Student",
                    align: "left",
                    value: "student"
                },
                {
                    text: "Leerkracht",
                    align: "left",
                    value: "teacher"
                },
                {
                    text: "Opleiding",
                    align: "left",
                    value: "discipline"
                },
                {
                    text: "Module",
                    align: "left",
                    value: "module"
                },
                {
                    text: "",
                    value: "actionbtns"
                }
            ],
            reports: [],
        };
    },
    computed: mapGetters(["isAdmin"]),
    methods: {
        async getReports() {
            this.reports = await this.$http.getReports();
        }
    },
    async created() {
        // await this.getReports();
        const reportid = 1;
        // const pdfData = await this.$http.getReportPDF(reportid);
        // pdfMake.createPdf(pdfData).open();
        const pdfData = {
            content: [{
                    columns: [{
                            width: "*",
                            text: ""
                        },
                        {
                            width: "auto",
                            table: {
                                body: [
                                    [{
                                        text: "Rapport",
                                        style: {
                                            bold: true
                                        },
                                        alignment: 'center'
                                    }],
                                    [{
                                        text: "Lastname Firstname",
                                        style: {
                                            bold: true
                                        },
                                        alignment: 'center'
                                    }],
                                    [{
                                        text: "Klas 7",
                                        style: {
                                            bold: true
                                        },
                                        alignment: 'center'
                                    }],
                                    [{
                                        text: "Schooljaar: 20XX-20XX",
                                        alignment: 'center'
                                    }],
                                ]
                            },
                            layout: {
                                hLineWidth: function (i, node) {
                                    return (i === 0 || i === node.table.body.length) ? 2 : 0;
                                },
                                vLineWidth: function (i, node) {
                                    return (i === 0 || i === node.table.widths.length) ? 2 : 0;
                                },
                            }
                        },
                        {
                            width: "*",
                            text: ""
                        }
                    ]

                },
                {
                    columns: [{
                            width: "*",
                            text: ""
                        },
                        {
                            image: await getDataURL(),
                            fit: [200, 200],
                            margin: [0, 200, 0, 230]
                        },
                        {
                            width: "*",
                            text: ""
                        }
                    ],
                },
                {
                    columns: [{
                            width: "*",
                            text: ""
                        },
                        {
                            width: "auto",
                            layout: "noBorders",
                            table: {
                                body: [
                                    [{
                                        text: "KTA- Centrum voor Leren en Werken",
                                        stye: {
                                            bold: true
                                        },
                                        alignment: "center"
                                    }],
                                    [{
                                        text: "Fonteinstraat 30",
                                        alignment: "center"
                                    }],
                                    [{
                                        text: "8020 Oostkamp",
                                        alignment: "center"
                                    }]
                                ]
                            }
                        },
                        {
                            width: "*",
                            text: ""
                        }
                    ]
                }
            ]
        }
        console.log(await getDataURL());
        pdfMake.createPdf(pdfData).open();
    }
};

var canvas = document.createElement("canvas");
var context = canvas.getContext('2d');

async function getDataURL() {
    let blob = await fetch("http://localhost:8080/img/CLW_Logo.c5a0ce8b.png").then(r => r.blob());
    let dataUrl = await new Promise(resolve => {
        let reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
    return dataUrl;
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
div.menu__content--autocomplete {
    top: 165px !important;
}
</style>
