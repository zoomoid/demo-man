import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#F58B44",
        secondary: "#F58B44",
        accent: "#F58B44",
        error: "#b71c1c"
      }
    }
  },
  icons: {
    iconfont: "md"
  }
});
