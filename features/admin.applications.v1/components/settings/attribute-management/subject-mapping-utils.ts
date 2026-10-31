/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { ClaimConfigurationInterface, ClaimMappingInterface } from "../../../models/application";

/**
 * The parts of an attribute name mapping entry of the User Attributes tab that the subject attribute rules need.
 */
export interface SubjectMappingEntryInterface {
    addMapping?: boolean;
    applicationClaim?: string;
    localClaim?: {
        uri?: string;
    };
}

/**
 * Attribute name mapping is in effect only while it is switched on and at least one attribute of the table is
 * mapped. With no mapped row the application is saved with the local dialect, so the subject attribute follows the
 * local dialect rules and any attribute can be assigned. Mapping entries without a row (the implicit identity
 * mapping added for the default or the user id) do not count, unless the Console cannot list their attribute at
 * all (an identity attribute while identity attributes are hidden, or a deleted attribute): such mappings exist on
 * the server without a row and must be kept.
 *
 * @param claimMappingOn - State of the attribute name mapping toggle.
 * @param claimMappings - Mapping entries of the session.
 * @param rowClaimURIs - Local attribute URIs of the rows of the attribute table.
 * @param listableClaimURIs - Local attribute URIs the Console can list (available and requested attributes).
 * @returns Whether attribute name mapping is in effect.
 */
export const isClaimMappingInEffect = (
    claimMappingOn: boolean,
    claimMappings: SubjectMappingEntryInterface[],
    rowClaimURIs: string[],
    listableClaimURIs?: string[]
): boolean => {
    return !!claimMappingOn && (claimMappings ?? []).some((mapping: SubjectMappingEntryInterface) => {
        const uri: string = mapping?.localClaim?.uri;

        return mapping?.addMapping && !!uri
            && (rowClaimURIs?.includes(uri) || (!!listableClaimURIs && !listableClaimURIs.includes(uri)));
    });
};

/**
 * Whether the stored subject attribute is a mapped attribute name of the application as saved on the server. Only
 * an application saved with the custom dialect has mapped names; the identity mappings the server reports for a
 * local dialect application mirror its requested attributes and do not count.
 *
 * @param claimConfigurations - Claim configuration of the application as saved on the server.
 * @param isLocalDialectView - Whether the User Attributes tab shows the local dialect view.
 * @returns Whether the stored subject attribute is a mapped attribute name.
 */
export const isStoredSubjectServerMapping = (
    claimConfigurations: ClaimConfigurationInterface,
    isLocalDialectView: boolean
): boolean => {
    const storedSubjectUri: string = claimConfigurations?.subject?.claim?.uri;

    return !!isLocalDialectView && claimConfigurations?.dialect === "CUSTOM" && !!storedSubjectUri
        && (claimConfigurations?.claimMappings ?? []).some(
            (mapping: ClaimMappingInterface) => mapping?.applicationClaim === storedSubjectUri
        );
};

/**
 * Whether the mapped attribute name the stored subject relies on is gone in this session, because attribute name
 * mapping is no longer in effect or the name is not mapped any more. Such a subject is not kept in the dropdown, and
 * the selection returns to the application's default unless the name is a local attribute the dropdown offers.
 *
 * @param claimConfigurations - Claim configuration of the application as saved on the server.
 * @param claimMappings - Mapping entries of the session.
 * @param isMappingInEffect - Whether attribute name mapping is in effect.
 * @param isLocalDialectView - Whether the User Attributes tab shows the local dialect view.
 * @returns Whether the mapped name the stored subject relies on is gone.
 */
export const isStoredSubjectMappingRemoved = (
    claimConfigurations: ClaimConfigurationInterface,
    claimMappings: SubjectMappingEntryInterface[],
    isMappingInEffect: boolean,
    isLocalDialectView: boolean
): boolean => {
    if (!isStoredSubjectServerMapping(claimConfigurations, isLocalDialectView)) {
        return false;
    }

    const storedSubjectUri: string = claimConfigurations?.subject?.claim?.uri;
    const isMapped: boolean = isMappingInEffect && (claimMappings ?? []).some(
        (mapping: SubjectMappingEntryInterface) =>
            mapping?.addMapping && mapping?.applicationClaim === storedSubjectUri
    );

    return !isMapped;
};
