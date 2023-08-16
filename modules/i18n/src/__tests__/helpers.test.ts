/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { I18nModuleConstants } from "../constants";
import {
    getLanguagesSupportedByDefault,
    getNamespacesSupportedByDefault,
    getResourcesSupportedByDefault,
    isLanguageSupported
} from "../helpers";
import { LocaleBundles, SupportedLanguagesMeta } from "../models";

const DEFAULT_SUPPORTED_LANGUAGES = [ "en-US", "pt-BR", "si-LK", "ta-IN" ];

const LANGUAGE_BUNDLES: LocaleBundles = {
    "en-US": {
        "meta": {
            "code": "en-US",
            "flag": "us",
            "name": "English (United States)",
            "namespaces": [ "common", "console" ]
        },
        "resources": {
            "i18key": "i18value"
        }
    },
    "pt-BR": {
        "meta": {
            "code": "pt-BR",
            "flag": "br",
            "name": "Português (Brazil)",
            "namespaces": [ "common" ]
        },
        "resources": {
            "i18key": "i18value"
        }
    },
    "si-LK": {
        "meta": {
            "code": "si-LK",
            "flag": "lk",
            "name": "සිංහල (Sri Lanka)",
            "namespaces": [ "common" ]
        },
        "resources": {
            "i18key": "i18value"
        }
    },
    "ta-IN": {
        "meta": {
            "code": "ta-IN",
            "flag": "in",
            "name": "தமிழ் (India)",
            "namespaces": [ "common" ]
        },
        "resources": {
            "i18key": "i18value"
        }
    }
};

describe("If default supported language retrieval helper function", () => {

    test("Should return the default supported languages as an array", () => {
        expect(Array.isArray(getLanguagesSupportedByDefault(LANGUAGE_BUNDLES))).toBe(true);
    });

    test("Should return all default supported languages", () => {
        expect(getLanguagesSupportedByDefault(LANGUAGE_BUNDLES)).toStrictEqual(DEFAULT_SUPPORTED_LANGUAGES);
    });
});


describe("If default supported namespaces retrieval helper function", () => {

    const DEFAULT_SUPPORTED_NAMESPACES = [
        I18nModuleConstants.COMMON_NAMESPACE,
        I18nModuleConstants.CONSOLE_PORTAL_NAMESPACE
    ];

    test("Should return the default supported namespaces as an array", () => {
        expect(Array.isArray(getNamespacesSupportedByDefault(LANGUAGE_BUNDLES))).toBe(true);
    });

    test("Should return all the default supported namespaces", () => {
        expect(getNamespacesSupportedByDefault(LANGUAGE_BUNDLES)).toStrictEqual(DEFAULT_SUPPORTED_NAMESPACES);
    });
});

describe("If default supported resources retrieval helper function", () => {

    test("Should return the default supported resources in correct format", () => {
        expect(typeof getResourcesSupportedByDefault(LANGUAGE_BUNDLES)).toBe("object");
    });

    test("Should return resources for all the supported languages", () => {
        expect(Object.keys(getResourcesSupportedByDefault(LANGUAGE_BUNDLES))).toEqual(DEFAULT_SUPPORTED_LANGUAGES);
    });
});

describe("If supported language checker helper function", () => {

    const VALID_META: SupportedLanguagesMeta = {
        "en-US": {
            "code": "en-US",
            "flag": "si",
            "name": "",
            "namespaces": [ I18nModuleConstants.COMMON_NAMESPACE ],
            "paths": {
                [ I18nModuleConstants.COMMON_NAMESPACE ]: "/path"
            }
        }
    };

    const INVALID_META = {
        "code": "en-GB"
    };

    test("Should return false for supported language when only detected language is passed in", () => {
        expect(isLanguageSupported("en-US")).toBe(false);
    });

    test("Should return false for un-supported language when only detected language is passed in", () => {
        expect(isLanguageSupported("fr")).toBe(false);
    });

    test("Should return true for supported language when an array of languages are passed in", () => {
        expect(isLanguageSupported("en-US", DEFAULT_SUPPORTED_LANGUAGES)).toBe(true);
    });

    test("Should return false for un-supported language when an array of languages are passed in", () => {
        expect(isLanguageSupported("fr", DEFAULT_SUPPORTED_LANGUAGES)).toBe(false);
    });

    test("Should return true for supported language when a valid meta file is passed in", () => {
        expect(isLanguageSupported("en-US", null, VALID_META)).toBe(true);
    });

    test("Should return true for supported language when an invalid meta file is passed in", () => {
        expect(isLanguageSupported("en-US", null, INVALID_META as any)).toBe(false);
    });
});
