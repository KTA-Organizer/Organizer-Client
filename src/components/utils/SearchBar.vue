<template>
 <v-flex xs12 sm12 class="ma-0">
    <v-autocomplete
                  :items="searchable_data"
                  :item-text="`${item_concat_key}`"
                  :item-value="`${item_value}`"
                  v-model="selecteditem"
                  :label="`Zoek een ${labeltext}`"
                  no-data-text="Er werd niets gevonden"
                  clearable
                  @input="selectItem()"
                  @update:searchInput="checkSelected"
                ></v-autocomplete>
</v-flex>
</template>

<script>
export default {
  name: "SearchBar",
  props: ["list", "concat_keys", "labeltext", "item_concat_key", "item_value"],
  data() {
    return {
      selecteditem: ""
    };
  },
  methods: {
    selectItem: function() {
      this.$emit("select-item", this.selecteditem);
    },
    checkSelected: function(payload) {
      if (payload === "") {
        this.$emit("no-student-select", "");
      }
    }
  },
  computed: {
    searchable_data: function() {
      var self = this;
      var array = [];
      self.list.forEach(function(item) {
        var object = {};
        object[self.item_concat_key] = "vuile slet";
        var string = "";
        self.concat_keys.forEach(function(key, i) {
          string += item[key];
          if (i !== self.concat_keys.length - 1) {
            string += " ";
          }
        });
        object[self.item_concat_key] = string;
        object[self.item_value] = item.id;
        array.push(object);
      });

      return array;
    }
  },
  created() {
    if (this.$route.query.name && this.$route.query.id) {
      var object = {};
      object[this.item_concat_key] = this.$route.query.name;
      object[this.item_value] = this.$route.query.id;
      this.selecteditem = object;
      this.checkSelected(object[this.item_concat_key]);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
menu__content--autocomplete {
  color: red;
}
</style>
