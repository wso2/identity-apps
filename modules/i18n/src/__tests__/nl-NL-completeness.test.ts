import { EN_US } from "../translations/en-US";
import { NL_NL } from "../translations/nl-NL";

describe("nl-NL translation completeness", () => {
    const nlCommon = NL_NL.resources.portals.common as Record<string, unknown>;
    const enCommon = EN_US.resources.portals.common as Record<string, unknown>;

    it("nl-NL common namespace has no undefined values at top level", () => {
        Object.entries(nlCommon).forEach(([, value]) => {
            expect(value).toBeDefined();
            expect(value).not.toBeNull();
        });
    });

    it("nl-NL common namespace has the same top-level keys as en-US", () => {
        const nlKeys = Object.keys(nlCommon).sort();
        const enKeys = Object.keys(enCommon).sort();

        expect(nlKeys).toEqual(enKeys);
    });

    it("nl-NL myaccount namespace exists and is not empty", () => {
        const myaccount = NL_NL.resources.portals.myAccount;

        expect(myaccount).toBeDefined();
        expect(Object.keys(myaccount as object).length).toBeGreaterThan(0);
    });

    it("nl-NL commonUsers namespace exists and is not empty", () => {
        const commonUsers = NL_NL.resources.portals.commonUsers;

        expect(commonUsers).toBeDefined();
        expect(Object.keys(commonUsers as object).length).toBeGreaterThan(0);
    });
});