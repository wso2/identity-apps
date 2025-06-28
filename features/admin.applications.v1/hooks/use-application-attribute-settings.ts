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

import { useOIDCScopesList } from "@wso2is/admin.oidc-scopes.v1/api/oidc-scopes";
import {
    OIDCScopesClaimsListInterface,
    OIDCScopesListInterface
} from "@wso2is/admin.oidc-scopes.v1/models/oidc-scopes";
import { useEffect, useState } from "react";
import {
    ExtendedClaimInterface,
    ExtendedExternalClaimInterface
} from "../components/settings/attribute-management/attribute-settings";
import { ClaimConfigurationInterface, RequestedClaimConfigurationInterface } from "../models/application";

export default function useApplicationAttributeSettings(
    claimConfigurations: ClaimConfigurationInterface,
    onlyOIDCConfigured: boolean
) {
    const [ externalClaims, setExternalClaims ] = useState<ExtendedExternalClaimInterface[]>([]);
    const [ scopes, setScopes ] = useState<OIDCScopesListInterface[]>(null);
    const [ unfilteredExternalClaims, setUnfilteredExternalClaims ] = useState<ExtendedExternalClaimInterface[]>([]);
    const [ isClaimLoading, setIsClaimLoading ] = useState<boolean>(true);

    const {
        data: OIDCScopeList,
        isLoading: isOIDCScopeListLoading,
        isValidating: isOIDCScopeListValidating
    } = useOIDCScopesList();

    useEffect(() => {
        if (!isOIDCScopeListLoading && !isOIDCScopeListValidating) {
            setScopes(OIDCScopeList);
            getClaims();
            getAllDialects();
            findLocalClaimDialectURI();

            return;
        }
    }, [ isOIDCScopeListLoading, isOIDCScopeListValidating, OIDCScopeList ]);

    /**
     * Get Local Claims
     */
    const getClaims = () => {
        setIsClaimLoading(true);
        const params: ClaimsGetParams = {
            "exclude-hidden-claims": true,
            filter: null,
            limit: null,
            offset: null,
            sort: null
        };

        getAllLocalClaims(params)
            .then((response: Claim[]) => {
                setClaims(response);
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("claims:local.notifications.fetchLocalClaims.genericError" +
                        ".description"),
                    level: AlertLevels.ERROR,
                    message: t("claims:local.notifications.fetchLocalClaims." +
                        "genericError.message")
                }));
            }).finally(() => {
                setIsClaimLoading(false);
            });
    };

    /**
     * Get All External Claims
     */
    const getMappedClaims = (newClaimId: string) => {
        if (newClaimId !== null) {
            getAllExternalClaims(newClaimId, null)
                .then((response: ExternalClaim[]) => {
                    setIsClaimRequestLoading(true);
                    setIsScopeExternalClaimMappingLoading(true);
                    setUnfilteredExternalClaims(response);
                })
                .catch(() => {
                    dispatch(addAlert({
                        description: t("claims:external.notifications.fetchExternalClaims" +
                            ".genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("claims:external.notifications.fetchExternalClaims" +
                            ".genericError.message")
                    }));
                })
                .finally(() => {
                    setIsClaimRequestLoading(false);
                });
        }
    };

    /**
     * Check whether claim is requested or not.
     *
     * @param uri - Claim URI to be checked.
     *
     * @returns If initially requested or not.
     */
    const checkInitialRequested = (uri: string): boolean => {
        const externalClaim: ExtendedExternalClaimInterface = externalClaims
            .find((claim: ExtendedExternalClaimInterface) => claim.claimURI === uri);

        if (externalClaim){
            const requestURI: RequestedClaimConfigurationInterface = claimConfigurations.requestedClaims
                .find((requestClaims: RequestedClaimConfigurationInterface) =>
                    requestClaims?.claim?.uri === externalClaim.mappedLocalClaimURI);

            return requestURI !== undefined;
        }

        return false;
    };

    /**
     * Get local mapped claim display name for external claims
     */
    useEffect(() => {
        const filteredExternalClaims: ExtendedExternalClaimInterface[] = unfilteredExternalClaims
            .filter((claim: ExtendedExternalClaimInterface) => {
                const matchedLocalClaim: ExtendedClaimInterface[] = claims
                    .filter((localClaim: ExtendedClaimInterface) => {
                        return localClaim.claimURI === claim.mappedLocalClaimURI;
                    });

                return matchedLocalClaim.length !== 0;
            });

        filteredExternalClaims.forEach((externalClaim: ExtendedExternalClaimInterface) => {
            const mappedLocalClaimUri: string = externalClaim.mappedLocalClaimURI;
            const matchedLocalClaim: ExtendedClaimInterface[] = claims
                .filter((localClaim: ExtendedClaimInterface) => {
                    return localClaim.claimURI === mappedLocalClaimUri;
                });

            if (matchedLocalClaim && matchedLocalClaim[0] && matchedLocalClaim[0].displayName) {
                externalClaim.localClaimDisplayName = matchedLocalClaim[0].displayName;
            }
        });
        setExternalClaims(filteredExternalClaims);
    }, [ claims, unfilteredExternalClaims ]);

    /**
     * Check whether claim is mandatory or not
     *
     * @param uri - Claim URI to be checked.
     *
     * @returns If initially requested as mandatory.
     */
    const checkInitialRequestMandatory = (uri: string): boolean => {
        const externalClaim: ExtendedExternalClaimInterface = externalClaims
            .find((claim: ExtendedExternalClaimInterface) => claim.claimURI === uri);

        if (externalClaim){
            const requestURI: boolean = claimConfigurations.requestedClaims.find(
                (requestClaims: RequestedClaimConfigurationInterface) => (
                    requestClaims?.claim?.uri === externalClaim.mappedLocalClaimURI))?.mandatory;

            if (requestURI !== undefined) {
                return requestURI;
            }
        }

        return false;
    };

    /**
     * Grouped Scopes and external claims
     */
    const getExternalClaimsGroupedByScopes = () => {
        const tempClaims: ExtendedExternalClaimInterface[] = [ ...externalClaims ];
        const updatedScopes: OIDCScopesClaimsListInterface[] = [];
        const scopedClaims: ExtendedExternalClaimInterface[] = [];

        if ((scopes !== null) && (scopes !== undefined) && (scopes.length !== 0) && (claims.length !== 0)) {
            scopes.map((scope: OIDCScopesListInterface) => {
                if (scope.name !== "openid"){
                    const updatedClaims: ExtendedExternalClaimInterface[] = [];
                    let scopeSelected: boolean = false;

                    scope.claims.map((scopeClaim: string) => {
                        tempClaims.map( (tempClaim: ExtendedExternalClaimInterface) => {
                            if (scopeClaim === tempClaim.claimURI) {
                                const updatedClaim: ExtendedExternalClaimInterface = {
                                    ...tempClaim,
                                    mandatory: checkInitialRequestMandatory(tempClaim.claimURI),
                                    requested: checkInitialRequested(tempClaim.claimURI)
                                };

                                if (updatedClaim.requested) {
                                    scopeSelected = true;
                                }
                                updatedClaims.push(updatedClaim);
                                scopedClaims.push(tempClaim);
                            }
                        });
                    });
                    const updatedScope: OIDCScopesClaimsListInterface = {
                        ...scope,
                        claims: updatedClaims,
                        selected: scopeSelected
                    };

                    updatedScopes.push(updatedScope);
                }
            });

            const scopelessClaims: ExtendedExternalClaimInterface[] = tempClaims.filter(
                (tempClaim: ExtendedExternalClaimInterface) => !scopedClaims.includes(tempClaim));
            const updatedScopelessClaims: ExtendedExternalClaimInterface[] = [];
            let isScopelessClaimRequested: boolean = false;

            scopelessClaims.map((tempClaim: ExtendedExternalClaimInterface) => {
                const isInitialRequested: boolean = checkInitialRequested(tempClaim.claimURI);

                updatedScopelessClaims.push({
                    ...tempClaim,
                    mandatory: checkInitialRequestMandatory(tempClaim.claimURI),
                    requested: checkInitialRequested(tempClaim.claimURI)
                });
                isScopelessClaimRequested = isInitialRequested;
            });
            updatedScopes.push({
                claims: updatedScopelessClaims,
                description: t("applications:edit.sections.attributes" +
                    ".selection.scopelessAttributes.description"),
                displayName: t("applications:edit.sections.attributes" +
                    ".selection.scopelessAttributes.displayName"),
                name: t("applications:edit.sections.attributes" +
                    ".selection.scopelessAttributes.name"),
                selected: isScopelessClaimRequested
            });
        }

        // Derive scopes for markdown guide.
        if (onlyOIDCConfigured) {
            const derivedScopesList: string[] = [ "openid" ];

            updatedScopes.forEach((scope: OIDCScopesClaimsListInterface) => {
                if (scope.selected && scope.name !== "openid" && scope.name !== "scopeless") {
                    derivedScopesList.push(scope.name);
                }
            });
            dispatch(setApplicationScopes(derivedScopesList.join(" ")));
        }

        setUnfilteredExternalClaimsGroupedByScopes(sortBy(updatedScopes, "name"));
        setExternalClaimsGroupedByScopes(sortBy(updatedScopes, "name"));
        setIsScopeExternalClaimMappingLoading(false);
    };

    return {
        getExternalClaimsGroupedByScopes,
        getMappedClaims,
        isClaimLoading
    };
}
