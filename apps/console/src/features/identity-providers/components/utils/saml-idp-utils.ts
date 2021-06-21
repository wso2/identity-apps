/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { FormValidation } from "@wso2is/validation";
import {
    CommonPluggableComponentMetaPropertyInterface,
    FederatedAuthenticatorMetaInterface,
    FederatedAuthenticatorWithMetaInterface
} from "../../models";

type SamlIdPListItemOption = {
    key: number;
    text: string;
    value: string;
};

export const getAvailableNameIDFormats = (): Array<SamlIdPListItemOption> => {
    const schemes: string[] = [
        "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
        "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress",
        "urn:oasis:names:tc:SAML:2.0:nameid-format:entity",
        "urn:oasis:names:tc:SAML:2.0:nameid-format:transient",
        "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent",
        "urn:oasis:names:tc:SAML:2.0:nameid-format:encrypted",
        "urn:oasis:names:tc:SAML:1.1:nameid-format:X509SubjectName",
        "urn:oasis:names:tc:SAML:1.1:nameid-format:WindowsDomainQualifiedName",
        "urn:oasis:names:tc:SAML:2.0:nameid-format:kerberos"
    ];
    return schemes.map((scheme: string, index: number) => ({
        key: index, text: scheme, value: scheme
    }));
};

export const getAvailableProtocolBindingTypes = (): Array<SamlIdPListItemOption> => {
    return [
        { key: 1, text: "HTTP Redirect", value: "redirect" },
        { key: 2, text: "HTTP Post", value: "post" },
        { key: 3, text: "As Per Request", value: "as_request" }
    ];
};

/**
 * From this point onwards we have some metadata mapping functions.
 *
 * Why did we implement such methods at the first place? instead of
 * plugging the options as it is to the consumer? Good question!
 *
 * The reason is currently our metadata API does not receive proper
 * values for signature algorithms (only plain string) and some of
 * the application parts have inconsistencies because of this. So,
 * these methods simply does the mapping for us.
 *
 * This issue is currently tracking via:-
 * FIXME: https://github.com/wso2-enterprise/asgardeo-product/issues/4288
 */

export const getSignatureAlgorithmOptionsMapped = (
    metadata: FederatedAuthenticatorMetaInterface
): Array<SamlIdPListItemOption> => {

    const property = metadata.properties.find(({ key }) => key === "SignatureAlgorithm");
    const displayNameMapper = (algorithmPlainString: string): string => {
        switch (algorithmPlainString) {
            case "DSA with SHA1":
                return "http://www.w3.org/2000/09/xmldsig#dsa-sha1";
            case "ECDSA with SHA1":
                return "http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha1";
            case "ECDSA with SHA256":
                return "http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha256";
            case "ECDSA with SHA384":
                return "http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha384";
            case "ECDSA with SHA512":
                return "http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha512";
            case "RSA with MD5":
                return "http://www.w3.org/2001/04/xmldsig-more#rsa-md5";
            case "RSA with RIPEMD160":
                return "http://www.w3.org/2001/04/xmldsig-more#rsa-ripemd160";
            case "RSA with SHA1":
                return "http://www.w3.org/2000/09/xmldsig#rsa-sha1";
            case "RSA with SHA256":
                return "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
            case "RSA with SHA384":
                return "http://www.w3.org/2001/04/xmldsig-more#rsa-sha384";
            case "RSA with SHA512":
                return "http://www.w3.org/2001/04/xmldsig-more#rsa-sha512";
        }
    };

    if (property) {
        return property.options.map((option: string, index: number) => {
            return {
                key: index,
                text: displayNameMapper(option),
                value: option
            };
        });
    }

    return [];

};

export const getDigestAlgorithmOptionsMapped = (
    metadata: FederatedAuthenticatorMetaInterface
): Array<SamlIdPListItemOption> => {

    const property = metadata.properties.find(({ key }) => key === "DigestAlgorithm");
    const displayNameMapper = (algorithmPlainString: string): string => {
        switch (algorithmPlainString) {
            case "MD5":
                return "http://www.w3.org/2001/04/xmldsig-more#md5";
            case "RIPEMD160":
                return "http://www.w3.org/2001/04/xmlenc#ripemd160";
            case "SHA1":
                return "http://www.w3.org/2000/09/xmldsig#sha1";
            case "SHA256":
                return "http://www.w3.org/2001/04/xmlenc#sha256";
            case "SHA384":
                return "http://www.w3.org/2001/04/xmldsig-more#sha384";
            case "SHA512":
                return "http://www.w3.org/2001/04/xmlenc#sha512";
        }
    };

    if (property) {
        return [ ...property.options.map((option: string, index: number) => {
            return {
                key: index,
                text: displayNameMapper(option),
                value: option
            };
        }), {
            key: -1,
            text: '',
            value: ''
        } ];
    }

    return [];

};

type FindPropValArgs<DefaultType> = { key: string; defaultValue: DefaultType; };
type FindPropValFunction = <Type>(args: FindPropValArgs<Type>) => Type;

type FindMetaArgs = { key: string };
type FindMetaFunction = (args: FindMetaArgs) => CommonPluggableComponentMetaPropertyInterface;

export const fastSearch = (
    authenticator: FederatedAuthenticatorWithMetaInterface
): [ FindPropValFunction, FindMetaFunction ] => {

    const propertyMap = new Map<string, any>();
    authenticator.data?.properties.forEach(({ key, value }) => propertyMap.set(key, value));

    const metadataMap = new Map<string, CommonPluggableComponentMetaPropertyInterface>();
    authenticator.meta?.properties.forEach((meta) => metadataMap.set(meta.key, meta));

    return [
        <T>({ key, defaultValue }: FindPropValArgs<T>): T => {
            if (propertyMap.has(key)) {
                const value = propertyMap.get(key);
                if (booleanSentAsAStringValue(value)) {
                    return (castToBool(value) as unknown) as T;
                }
                return value;
            }
            return defaultValue;
        },
        ({ key }: FindMetaArgs) => {
            if (metadataMap.has(key)) {
                return metadataMap.get(key);
            }
            return null;
        }
    ];

};

export const castToBool = (value: string): boolean => {
    if (!value) return false;
    if ("true" === value.toLowerCase()) return true;
    if ("false" === value.toLowerCase()) return false;
};

export const booleanSentAsAStringValue = (value: any): boolean => {
    if (typeof value === "string") {
        return /true|false/g.test(value);
    }
    return false;
};

export type MinMaxLength = { max: number; min: number };
export type FormErrors = { [ key: string ]: string };

export const SERVICE_PROVIDER_ENTITY_ID_LENGTH: MinMaxLength = { max: 240, min: 3 };
export const SSO_URL_LENGTH: MinMaxLength = { max: 2048, min: 10 };
export const LOGOUT_URL_LENGTH: MinMaxLength = { max: 2048, min: 10 };
export const IDENTITY_PROVIDER_ENTITY_ID_LENGTH: MinMaxLength = { max: 2048, min: 5 };
export const IDENTITY_PROVIDER_NAME_LENGTH: MinMaxLength = { max: 120, min: 3 };

export const ifFieldsHave = (errors: FormErrors): boolean => {
    return !Object.keys(errors).every((k) => !errors[ k ]);
};

export const composeValidators = (...validators: any[]) => (value: string) => {
    return validators.reduce(
        (error, validator) => error || validator(value),
        undefined
    );
};

export const required = (value: string | any) => {
    if (!value) {
        return "This is a required field";
    }
    return undefined;
};

export const hasLength = (minMax: MinMaxLength) => (value: string) => {
    if (!value && minMax.min > 0) {
        return "You cannot leave this blank";
    }
    if (value?.length > minMax.max) {
        return `Cannot exceed more than ${ minMax.max } characters.`;
    }
    if (value?.length < minMax.min) {
        return `Should have at least ${ minMax.min } characters.`;
    }
    return undefined;
};

export const isUrl = (value: string): string => {
    return FormValidation.url(value)
        ? undefined
        : "This URL is invalid.";
};
