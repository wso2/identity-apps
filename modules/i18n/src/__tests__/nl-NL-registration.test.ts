import * as translations from "../translations";
import { NL_NL } from "../translations/nl-NL";

describe("nl-NL locale registration", () => {
    it("NL_NL export exists and has correct meta", () => {
        expect(NL_NL).toBeDefined();
        expect(NL_NL.meta.code).toBe("nl-NL");
        expect(NL_NL.meta.flag).toBe("nl");
        expect(NL_NL.meta.direction).toBe("ltr");
        expect(NL_NL.meta.name).toBe("Nederlands (Nederland)");
    });

    it("nl-NL is re-exported from the translation barrel", () => {
        const codes = Object.values(translations).map((bundle: any) => bundle.meta?.code);
        expect(codes).toContain("nl-NL");
    });
});