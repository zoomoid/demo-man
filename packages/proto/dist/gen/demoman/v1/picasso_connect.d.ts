import { ColorRequest, ColorResponse, PaletteRequest, PaletteResponse } from "./picasso_pb.js";
import { MethodKind } from "@bufbuild/protobuf";
/**
 * @generated from service demoman.v1.PicassoService
 */
export declare const PicassoService: {
    readonly typeName: "demoman.v1.PicassoService";
    readonly methods: {
        /**
         * @generated from rpc demoman.v1.PicassoService.Palette
         */
        readonly palette: {
            readonly name: "Palette";
            readonly I: typeof PaletteRequest;
            readonly O: typeof PaletteResponse;
            readonly kind: MethodKind.Unary;
        };
        /**
         * @generated from rpc demoman.v1.PicassoService.Color
         */
        readonly color: {
            readonly name: "Color";
            readonly I: typeof ColorRequest;
            readonly O: typeof ColorResponse;
            readonly kind: MethodKind.Unary;
        };
    };
};
