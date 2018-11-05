export const firstname = [v => !!v || "Voornaam moet ingevuld worden"];
export const name = [v => !!v || "Naam moet ingevuld worden"];
export const email = [
  v => !!v || "E-mail moet ingevuld worden",
  v =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
    "E-mail moet geldig zijn"
];
export const role = [
  v =>
    (v.length > 0 && v.length < 3) ||
    "Rol moet ingevuld worden en kan maximum 2 rollen bevatten"
];
export const gender = [v => !!v || "Geslacht moet ingevuld worden"];
