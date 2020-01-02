<template>
  <div class="wrapper">
    <Breadcrump></Breadcrump>
    <div class="fill"></div>
    <div class="release">
      <h2 class="artist">Bounces</h2>
    </div>
    <a href="https://cdn.occloxium.com/g/zoomoid/schwerelos_remix_bounces.zip">Download</a>
    <p>
      Hey, eben kurz ein Guide für die Struktur der Bounces:
      <br>
      <br>
      Die Ordner visualisieren ungefähr die Struktur der Project File auf dem obersten Level, d.h. die obersten Gruppen sind entsprechend einfach die Ordner.
      Ich habe alle Effekte in die entsprechenden Spuren selbst geschoben, also sollte nichts mehr fehlen.
      Die dB-Zahlen hinter den Gruppen-Namen sind nur bei solchen Gruppen mit mehr als einer Spur von Relevanz, e.g. die Drums. Alle Gruppen mit nur einer Spur sind post-fader und damit weniger Aufwand. <br>

      Das Ganze wurde bisher aufm Master (vor Mastering Plugins) einfach nur durch einen Brickwall FabFilter L2 abgerundet, der aber im Prinzip wegen der vorherigen Lautstärke-Reduktion auf den Gruppen
      irrelevant geworden ist.<br>

      Wenn ihr doch noch mehr Spuren für mehr Details haben wollt, lasst es mich kurz wissen, dann bounce ich noch ne Runde!<br>

      Hier ist noch ein Screenshot, wie die Audiospuren in Live ungefähr lagen, in ihrer gebouncten Version.

      <img src="https://cdn.occloxium.com/g/zoomoid/Audiotracks_screenshot.png"/>
    </p>
  </div>
</template>

<script>
import Breadcrump from '@/components/Breadcrump.vue';

export default {
  components: {
    Breadcrump,
  },
};
</script>

<style lang="scss" scoped>
// .wrapper {
//   padding: 2em 2em 2em 2em;
// }

.players {
  padding: 2em 2em 2em 2em;
}
.fill {
  height: 24em;
  background: #227aff;
}
.release {
  padding: 2em 2em 2em 2em;
  .artist {
    letter-spacing: -0.02em;
    font-size: 2.5em;
    font-weight: 800;
    line-height: 1;
    margin: 0;
  }
  .title {
    letter-spacing: -0.04em;
    font-weight: 200;
    font-size: 3em;
    line-height: 1;
    margin: 0;
  }
}
</style>
