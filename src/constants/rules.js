export const firstname = [v => !!v || "Voornaam moet ingevuld worden"];
export const name = [v => !!v || "Naam moet ingevuld worden"];
export const email = [
  v => !!v || "E-mail moet ingevuld worden",
  v =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,4})+$/.test(v) ||
    "E-mail moet geldig zijn"
];
export const role = [
  v =>
    (v.length > 0 && v.length < 3) ||
    "Rol moet ingevuld worden en kan maximum 2 rollen bevatten"
];
export const gender = [v => !!v || "Geslacht moet ingevuld worden"];
export const opleiding = [v => !!v || "Opleiding moet ingevuld worden!"];
export const password = [v => !!v || "paswoord moet ingevuld worden"];
export const passwordRepeat = [
  v => !!v || "Voer u wachtwoord hier nog een keer in",
  v => v === this.password || "Uw wachtwoorden komen niet overeen"
];
export const rgn = [
  v => !!v || "Vul het rijksregisternummer in",
  v => !!v && v.length === 11 || "Het formaat van het rijksregisternummer is niet correct"
]
export const defaultRule = [
  v => !!v || "Vul dit veld in"
]