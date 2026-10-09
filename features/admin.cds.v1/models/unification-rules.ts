/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * What kind of value an attribute holds. The type decides three things at once: how the
 * value is normalized, which comparison runs against it, and which keys it is indexed
 * under. They have to agree, which is why one choice drives all three.
 */
export enum UnificationAttributeType {
    /**
     * Compared byte for byte, with no normalization at all.
     */
    PRIMITIVE_EXACT = "PRIMITIVE_EXACT",
    /**
     * Free text where typos are expected.
     */
    FUZZY_STRING = "FUZZY_STRING",
    /**
     * A person or company name. Word order is ignored and names that sound alike can match.
     */
    NAME = "NAME",
    EMAIL = "EMAIL",
    PHONE = "PHONE",
    /**
     * A postal address or locality. Compared on shared words rather than character order.
     */
    LOCATION = "LOCATION",
    /**
     * A date in any format. Normalized before comparison, then matched exactly.
     */
    DATE = "DATE",
    /**
     * An identifier that exists to identify a person, such as a national ID or passport
     * number. Matching one exactly is conclusive on its own.
     */
    UNIQUE_ID = "UNIQUE_ID"
}

/**
 * Whether a rule matches on exact equality or tolerates variation.
 *
 * This is set per rule rather than per organisation: exact and tolerant rules are evaluated
 * side by side within a single comparison.
 */
export enum UnificationMethod {
    DETERMINISTIC = "deterministic",
    FUZZY = "fuzzy"
}

/**
 * Attribute types that can be matched with {@link UnificationMethod.FUZZY}.
 *
 * The rest have no meaningful notion of "close enough" — there is no nearly-correct
 * identifier and no almost-the-same date — so the server rejects `fuzzy` for them.
 */
const FUZZY_CAPABLE_ATTRIBUTE_TYPES: ReadonlySet<UnificationAttributeType> = new Set([
    UnificationAttributeType.FUZZY_STRING,
    UnificationAttributeType.NAME,
    UnificationAttributeType.EMAIL,
    UnificationAttributeType.PHONE,
    UnificationAttributeType.LOCATION
]);

/**
 * Whether the given attribute type can be matched with tolerance.
 */
export const supportsFuzzyMatching = (attributeType: UnificationAttributeType): boolean =>
    FUZZY_CAPABLE_ATTRIBUTE_TYPES.has(attributeType);

/**
 * How much agreement or disagreement on an attribute counts toward a merge.
 *
 * Returned for information only. The server derives both directions from `attribute_type`
 * and rejects them on a request unless it has been configured to allow overrides.
 */
enum EvidenceStrength {
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW"
}

export interface UnificationRuleModel {
    rule_id: string;
    property_name: string;
    rule_name: string;
    is_active: boolean;
    priority: number;
    /**
     * Absent on rules created before typed matching existed; the server reads those as
     * {@link UnificationAttributeType.PRIMITIVE_EXACT}.
     */
    attribute_type?: UnificationAttributeType;
    unification_method?: UnificationMethod;
    /**
     * Read-only. Derived from `attribute_type` by the server.
     */
    match_strength?: EvidenceStrength;
    /**
     * Read-only. Derived from `attribute_type` by the server.
     */
    mismatch_strength?: EvidenceStrength;
}

/**
 * Only these fields can be updated.
 *
 * Changing `attribute_type` or `unification_method` changes which keys the attribute is
 * indexed under, so the server rebuilds the blocking index for the rule when either moves.
 */
export interface UpdateUnificationRulePayload {
    is_active?: boolean;
    priority?: number;
    attribute_type?: UnificationAttributeType;
    unification_method?: UnificationMethod;
}

export interface CreateUnificationRulePayload {
    property_name: string;
    rule_name: string;
    is_active: boolean;
    priority: number;
    attribute_type: UnificationAttributeType;
    unification_method: UnificationMethod;
}

/**
 * Guesses what kind of value an attribute holds from its property name.
 *
 * The attribute type drives comparison, indexing and evidence strength together, and an
 * operator picking "Email address" from a list should not then have to tell the form that an
 * attribute called `email` holds an email. It matters beyond convenience: only some types can
 * be matched with tolerance, so leaving an email attribute typed as a plain exact value puts
 * tolerant matching out of reach without explaining why.
 *
 * A guess, not a rule — it only seeds the field, and the operator can always override it.
 * Anything unrecognised stays {@link UnificationAttributeType.PRIMITIVE_EXACT}, which
 * compares byte for byte and is the safe thing to do with a value we cannot characterise.
 */
export const inferAttributeType = (propertyName: string): UnificationAttributeType => {
    const leaf: string = propertyName.toLowerCase().split(".").pop() ?? propertyName.toLowerCase();

    // Split on separators and camelCase humps so a needle is tested against whole words. Plain
    // substring matching reads `clinic` as an identifier (`nic`), `ethnicity` as a location
    // (`city`) and `mailingaddress` as an email (`mail`) — and a wrong guess is not cosmetic:
    // the type sets the evidence strengths, and UNIQUE_ID lets one match merge on its own.
    const words: string[] = leaf
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .split(/[^a-z0-9]+/i)
        .filter(Boolean);

    // Needles short enough, or common enough as a fragment, to be unsafe anywhere but as a
    // whole word: `mail` inside `mailing`, `city` inside `ethnicity`, `region` inside
    // `regionalmanager`, `name` inside `nickname`.
    const WHOLE_WORD_ONLY: Set<string> = new Set([ "mail", "name", "city", "region", "state" ]);

    const matches = (...needles: string[]): boolean =>
        needles.some((needle: string) => words.some((word: string) => {
            if (word === needle) {
                return true;
            }
            if (needle.length < 5 || WHOLE_WORD_ONLY.has(needle)) {
                return false;
            }

            // Longer needles may still head or tail a compound: `emailaddress`, `workemail`.
            return word.startsWith(needle) || word.endsWith(needle);
        }));

    if (matches("email", "mail")) {
        return UnificationAttributeType.EMAIL;
    }
    if (matches("phone", "mobile", "telephone", "msisdn", "contactno")) {
        return UnificationAttributeType.PHONE;
    }
    // Checked before the date and identifier cases: "username" and "nickname" are names, and
    // both would otherwise be caught by the identifier test below.
    if (matches("name", "surname", "lastname", "firstname", "givenname", "displayname",
        "fullname", "nickname", "username")) {
        return UnificationAttributeType.NAME;
    }
    if (matches("birthdate", "dob", "dateofbirth", "birthday")) {
        return UnificationAttributeType.DATE;
    }
    if (matches("address", "street", "city", "country", "locality", "postal", "region")) {
        return UnificationAttributeType.LOCATION;
    }
    if (matches("nic", "passport", "nationalid", "identifier", "ssn")) {
        return UnificationAttributeType.UNIQUE_ID;
    }

    return UnificationAttributeType.PRIMITIVE_EXACT;
};
