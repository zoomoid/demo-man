import { ColorResponse, PaletteResponse, PicassoService } from "@demo-man/proto";
import Vibrant from "node-vibrant";
import { calculateTextColor, toString, white } from "./utils.js";
export default (router) => router.service(PicassoService, {
    color: color,
    palette: palette,
});
const defaultBackgroundColor = [194, 65, 12];
const defaultAccentColor = [67, 56, 202];
async function color(req) {
    const image = Buffer.from(req.image);
    const r = new Vibrant(image, {
        colorCount: 1,
        quality: req.quality,
    });
    const { Vibrant: c } = await r.getPalette();
    let backgroundColor = defaultBackgroundColor;
    let textColor = white;
    if (c) {
        backgroundColor = [c.r, c.g, c.b];
        textColor = calculateTextColor(backgroundColor);
    }
    // TODO: this transparently masks the error case where we are not able to determine the vibrant color off of the image...
    return new ColorResponse({
        backgroundColor: toString(backgroundColor),
        textColor: toString(textColor)
    });
}
async function palette(req) {
    const image = Buffer.from(req.image);
    const r = new Vibrant(image, {
        colorCount: req.colorCount,
        quality: req.quality,
    });
    const palette = await r.getPalette();
    let backgroundColor = defaultBackgroundColor;
    let textColor = white;
    let accentColor = defaultAccentColor;
    const primary = palette.Vibrant;
    if (primary) {
        backgroundColor = [primary.r, primary.g, primary.b];
        textColor = calculateTextColor(backgroundColor);
    }
    const accent = palette.LightVibrant;
    if (accent) {
        accentColor = [accent.r, accent.g, accent.b];
    }
    const pl = Object.values(palette).filter((s) => s !== null).map((s) => s && [s.r, s.g, s.b]);
    return new PaletteResponse({
        bgColor: toString(backgroundColor),
        textColor: toString(textColor),
        accentColor: toString(accentColor),
        palette: pl.map(toString)
    });
}
