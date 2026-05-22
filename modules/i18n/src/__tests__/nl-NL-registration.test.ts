import * as translations from "../translations";
import { NL_NL } from "../translations/nl-NL";
import { LocaleBundle } from "../models";

describe("Dutch (Netherlands) locale - registration, metadata validation, and barrel export", () => {
    it("NL_NL export exists and has correct meta", () => {
        expect(NL_NL).toBeDefined();
        expect(NL_NL.meta.code).toBe("nl-NL");
        expect(NL_NL.meta.flag).toBe("nl");
        expect(NL_NL.meta.direction).toBe("ltr");
        expect(NL_NL.meta.name).toBe("Nederlands (Nederland)");
    });

    it("nl-NL is re-exported from the translation barrel", () => {
        const codes: (string | undefined)[] = Object.values(translations).map(
            (bundle: LocaleBundle) => bundle.meta?.code
        );
        expect(codes).toContain("nl-NL");
    });
});
