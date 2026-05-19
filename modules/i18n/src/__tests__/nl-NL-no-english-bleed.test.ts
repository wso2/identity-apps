import { common } from "../translations/nl-NL/portals/common";

describe("nl-NL common spot-check Dutch values", () => {
    it("cancel is Dutch", () => expect((common as any).cancel).toBe("Annuleren"));
    it("save is Dutch", () => expect((common as any).save).toBe("Opslaan"));
    it("delete is Dutch", () => expect((common as any).delete).toBe("Verwijderen"));
    it("search is Dutch", () => expect((common as any).search).toBe("Zoeken"));
    it("logout is Dutch", () => expect((common as any).logout).toBe("Afmelden"));
});