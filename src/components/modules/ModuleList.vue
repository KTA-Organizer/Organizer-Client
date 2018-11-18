<template>
<v-layout column>
  <v-card class="mb-4" v-for="(categorie) in module.domains" :value="categorie.active" v-bind:key="categorie.name">
    <v-card-title primary-title v-if="categorie.active">
      <h3 class="headline">{{ categorie.name }}</h3>
    </v-card-title>
    <v-card-text v-if="categorie.active">
      <v-data-table hide-headers :items="categorie.goals" hide-actions class="criteriaTable">
        <template slot="items" slot-scope="props">
          <tr v-if="props.item.active">
            <th class="oneThirdWidth">{{ props.item.name }}</th>
            <div v-for="(criteria) in props.item.criteria" v-bind:key="criteria.name">
              <v-layout v-if="criteria.active" class="py-2 mt-2" row>
                <v-layout :class="getClass">
                  <v-flex>
                    <td d-block class="text-xs-left pl-0 xs-5 oneThirdWidth">{{ criteria.name }}</td>
                    <v-divider></v-divider>
                  </v-flex>
                </v-layout>
                <template>

                  <!-- <v-spacer></v-spacer> -->

                  <v-btn round class="primary" v-if="evaluations" @click="createScoreDialog(criteria.id)">
                    <v-badge left color="green">
                      <span slot="badge">{{evaluations.size}}</span>
                      <span>scores</span>
                    </v-badge>

                  </v-btn>

                  <!-- <v-spacer></v-spacer> -->

                  <td v-if="evaluating" class="gradeBox">
                    <gradeboxes :criteriaid="criteria.id" :newEvaluation="newEvaluation" v-on:graded="graded"></gradeboxes>
                  </td>
                </template>
              </v-layout>
            </div>
          </tr>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
  <v-dialog width="500" v-model="showScores">
    <v-card>
      <v-card-title>
        <h3>Scores</h3>
      </v-card-title>
      <v-card-text v-if="!isEmptyEvalObj(selectedCriteriaScores)">
        <table class="scores">
          <tr>
            <th>Opdracht</th>
            <th>Score</th>
          </tr>
          <tr v-for="(score, key) in selectedCriteriaScores" v-bind:key="key">
            <td class="score"><strong>{{key}}</strong>:</td>
            <td class="score">{{score}}</td>
          </tr>
        </table>
      </v-card-text>
      <v-card-text v-else>
        <p>Er zijn nog geen evaluaties toegevoegd.</p>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="showScores = false">
          <v-icon>clear</v-icon>Sluit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-layout>
</template>

<script>
import * as grades from "../../constants/grades";
import _ from "lodash";

export default {
  name: "moduleList",
  props: ["module", "evaluating", "evaluations", "newEvaluation"],
  data() {
    return {
      selectedCriteria: null,
      showScores: false
    };
  },
  methods: {
    isEmptyEvalObj(obj) {
      return _.isEmpty(obj);
    },
    getEvalForCriteria(assignment, id) {
      let score = "NI";
      const grade = assignment.find(x => x.criteriaid === id);
      if (grade) {
        score = this.getKeyByValue(grades.gradeValues, grade.grade);
        score = grades.gradeKeys[score];
      }
      return score;
    },
    getKeyByValue(object, value) {
      return Object.keys(object).find(key => object[key] === value);
    },
    graded() {
      console.log(this.newEvaluation);
      this.$emit("graded");
    },
    createScoreDialog(criteriaid) {
      this.selectedCriteria = criteriaid;
      this.showScores = true;
    }
  },
  computed: {
    selectedCriteriaScores() {
      const scoreObject = {};
      this.evaluations.forEach((value, key) => {
        let score = this.getEvalForCriteria(value, this.selectedCriteria);
        scoreObject[key] = score;
      })
      return scoreObject;
    },
    getClass() {
      return this.evaluating ? "criteriaTextSm" : "criteriaText";
    }
  }
};
</script>

<style scoped>
/* .abc {
    width: 100%;
}

div.menu__content--autocomplete {
    top: 165px !important;
}

.criteriaTable {
    margin-bottom: 4%;
    width: 100%;
}

.categorieTitle {
    width: 100%;
}

.criteriaTextSm {
    width: 30%;
}

.criteriaText {
    width: 80%;
}
*/

.gradeBox {
  width: 15%;
  min-width: 110px;
}

.scores.th {
  border: none;
  display: inline-block;
}

.scores {
  border-spacing: 0;
}

.score {
  padding: 1em;
  border: 1px black solid;
}

.oneThirdWidth {
  width: 30%;
}
</style>
