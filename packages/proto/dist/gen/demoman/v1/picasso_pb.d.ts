import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";
/**
 * @generated from message demoman.v1.PaletteRequest
 */
export declare class PaletteRequest extends Message<PaletteRequest> {
    /**
     * @generated from field: int32 color_count = 1;
     */
    colorCount: number;
    /**
     * @generated from field: bytes image = 2;
     */
    image: Uint8Array;
    /**
     * @generated from field: int32 quality = 3;
     */
    quality: number;
    constructor(data?: PartialMessage<PaletteRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "demoman.v1.PaletteRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): PaletteRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): PaletteRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): PaletteRequest;
    static equals(a: PaletteRequest | PlainMessage<PaletteRequest> | undefined, b: PaletteRequest | PlainMessage<PaletteRequest> | undefined): boolean;
}
/**
 * @generated from message demoman.v1.PaletteResponse
 */
export declare class PaletteResponse extends Message<PaletteResponse> {
    /**
     * @generated from field: string bg_color = 1;
     */
    bgColor: string;
    /**
     * @generated from field: string text_color = 2;
     */
    textColor: string;
    /**
     * @generated from field: string accent_color = 3;
     */
    accentColor: string;
    /**
     * @generated from field: repeated string palette = 4;
     */
    palette: string[];
    constructor(data?: PartialMessage<PaletteResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "demoman.v1.PaletteResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): PaletteResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): PaletteResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): PaletteResponse;
    static equals(a: PaletteResponse | PlainMessage<PaletteResponse> | undefined, b: PaletteResponse | PlainMessage<PaletteResponse> | undefined): boolean;
}
/**
 * @generated from message demoman.v1.ColorRequest
 */
export declare class ColorRequest extends Message<ColorRequest> {
    /**
     * @generated from field: bytes image = 1;
     */
    image: Uint8Array;
    /**
     * @generated from field: int32 quality = 2;
     */
    quality: number;
    constructor(data?: PartialMessage<ColorRequest>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "demoman.v1.ColorRequest";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ColorRequest;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ColorRequest;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ColorRequest;
    static equals(a: ColorRequest | PlainMessage<ColorRequest> | undefined, b: ColorRequest | PlainMessage<ColorRequest> | undefined): boolean;
}
/**
 * @generated from message demoman.v1.ColorResponse
 */
export declare class ColorResponse extends Message<ColorResponse> {
    /**
     * @generated from field: string background_color = 1;
     */
    backgroundColor: string;
    /**
     * @generated from field: string text_color = 2;
     */
    textColor: string;
    constructor(data?: PartialMessage<ColorResponse>);
    static readonly runtime: typeof proto3;
    static readonly typeName = "demoman.v1.ColorResponse";
    static readonly fields: FieldList;
    static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ColorResponse;
    static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ColorResponse;
    static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ColorResponse;
    static equals(a: ColorResponse | PlainMessage<ColorResponse> | undefined, b: ColorResponse | PlainMessage<ColorResponse> | undefined): boolean;
}
