/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

import { Show, useRequiredScopes } from "@wso2is/access-control";
import { getAllExternalClaims, getAllLocalClaims, getDialects } from "@wso2is/admin.claims.v1/api";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import { applicationConfig } from "@wso2is/admin.extensions.v1";
import { SubjectAttributeListItem } from "@wso2is/admin.identity-providers.v1/components/settings";
import { useOIDCScopesList } from "@wso2is/admin.oidc-scopes.v1/api/oidc-scopes";
import {
    OIDCScopesClaimsListInterface,
    OIDCScopesListInterface
} from "@wso2is/admin.oidc-scopes.v1/models/oidc-scopes";
import {
    AlertLevels,
    Claim,
    ClaimDialect,
    ClaimsGetParams,
    ExternalClaim,
    IdentifiableComponentInterface,
    SBACInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, ContentLoader, EmphasizedSegment } from "@wso2is/react-components";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import sortBy from "lodash-es/sortBy";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Button, Divider, Grid } from "semantic-ui-react";
import { AdvanceAttributeSettings } from "./advance-attribute-settings";
import { AttributeSelection } from "./attribute-selection";
import { AttributeSelectionOIDC } from "./attribute-selection-oidc";
import { RoleMapping } from "./role-mapping";
import { sortSubjectAttributeOptions } from "./subject-attribute-options";
import {
    isClaimMappingInEffect as resolveClaimMappingInEffect,
    isStoredSubjectMappingRemoved as resolveStoredSubjectMappingRemoved
} from "./subject-mapping-utils";
import { updateAuthProtocolConfig, updateClaimConfiguration } from "../../../api/application";
import { ApplicationManagementConstants } from "../../../constants/application-management";
import {
    AdvancedConfigurationsInterface,
    AppClaimInterface,
    ClaimConfigurationInterface,
    ClaimMappingInterface,
    InboundProtocolListItemInterface,
    RequestedClaimConfigurationInterface,
    RoleConfigInterface,
    RoleMappingInterface,
    SubjectConfigInterface,
    additionalSpProperty
} from "../../../models/application";
import { OIDCDataInterface, SupportedAuthProtocolTypes } from "../../../models/application-inbound";

export interface SelectedDialectInterface {
    dialectURI: string;
    id: string;
    localDialect: boolean;
}

export interface DropdownOptionsInterface {
    key: string;
    text: any;
    value: string;
}

export interface ExtendedClaimMappingInterface extends ClaimMappingInterface {
    addMapping?: boolean;
}

export interface ExtendedClaimInterface extends Claim {
    mandatory?: boolean;
    requested?: boolean;
}

export interface ExtendedExternalClaimInterface extends ExternalClaim {
    mandatory?: boolean;
    requested?: boolean;
}

interface AdvanceSettingsSubmissionInterface {
    subject: SubjectConfigInterface;
    role: RoleConfigInterface;
    oidc: OIDCDataInterface;
    isSubjectClaimExplicit?: boolean;
}

interface AttributeSettingsPropsInterface extends SBACInterface<FeatureConfigInterface>,
    IdentifiableComponentInterface {
    /**
     * Id of the application.
     */
    appId: string;
    /**
     * Version of the application.
     */
    appVersion: string;
    /**
     * Application inbound protocol/s.
     */
    technology: InboundProtocolListItemInterface[];
    /**
     * Claim configurations.
     */
    claimConfigurations: ClaimConfigurationInterface;
    /**
     * If only OIDC configured for the application.
     */
    onlyOIDCConfigured: boolean;
    /**
     * Advanced configurations of the application, used to resolve its default subject identifier.
     */
    advancedConfigurations?: AdvancedConfigurationsInterface;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Template ID of the application.
     */
    applicationTemplateId?: string;
    /**
     * Protocol configurations.
     */
    inboundProtocolConfig: any;
}

const getLocalDialectURI = (): string => {

    let localDialect: string = "http://wso2.org/claims";

    getAllLocalClaims(null)
        .then((response: Claim[]) => {
            const retrieved: string = response.slice(0, 1)[0].dialectURI;

            if (!isEmpty(retrieved)) {
                localDialect = retrieved;
            }
        });

    return localDialect;
};

const DefaultSubjectAttribute: string = "http://wso2.org/claims/userid";

/**
 * Resolves the default subject identifier of an application from the useUserIdForDefaultSubject property exposed by
 * the server through the additional service provider properties. Applications that predate the user id default, such
 * as applications migrated from older releases, carry the property with the value false and default to the username.
 * When the property is absent, the user id is assumed.
 *
 * @param advancedConfigurations - Advanced configurations of the application.
 * @returns Local claim URI of the default subject identifier.
 */
const resolveDefaultSubjectAttribute = (advancedConfigurations: AdvancedConfigurationsInterface): string => {
    const useUserIdForDefaultSubject: additionalSpProperty = advancedConfigurations?.additionalSpProperties?.find(
        (property: additionalSpProperty) =>
            property?.name === ApplicationManagementConstants.USE_USER_ID_FOR_DEFAULT_SUBJECT_PROPERTY
    );

    if (useUserIdForDefaultSubject?.value?.toString().toLowerCase() === "false") {
        return ApplicationManagementConstants.USERNAME_SUBJECT_ATTRIBUTE;
    }

    return DefaultSubjectAttribute;
};

const LocalDialectURI: string = "http://wso2.org/claims";

/**
 * Attribute settings component.
 */
export const AttributeSettings: FunctionComponent<AttributeSettingsPropsInterface> = (
    props: AttributeSettingsPropsInterface
): ReactElement => {

    const {
        appId,
        appVersion,
        applicationTemplateId,
        technology,
        featureConfig,
        claimConfigurations,
        onlyOIDCConfigured,
        onUpdate,
        readOnly,
        inboundProtocolConfig,
        [ "data-componentid" ]: componentId,
        advancedConfigurations
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const hasApplicationUpdatePermissions: boolean = useRequiredScopes(featureConfig?.applications?.scopes?.update);

    const { UIConfig } = useUIConfig();

    const [ localDialectURI, setLocalDialectURI ] = useState("");

    const [ dialect, setDialect ] = useState<ClaimDialect[]>([]);

    const [ selectedDialect, setSelectedDialect ] = useState<SelectedDialectInterface>();

    // Get OIDC scope-use attributes list
    const [ scopes, setScopes ] = useState<OIDCScopesListInterface[]>(null);
    const [ externalClaimsGroupedByScopes, setExternalClaimsGroupedByScopes ]
        = useState<OIDCScopesClaimsListInterface[]>(null);
    const [ unfilteredExternalClaimsGroupedByScopes, setUnfilteredExternalClaimsGroupedByScopes ]
        = useState<OIDCScopesClaimsListInterface[]>([]);

    // Manage available claims in local and external dialects.
    const [ isClaimRequestLoading, setIsClaimRequestLoading ] = useState(true);
    const [ claims, setClaims ] = useState<ExtendedClaimInterface[]>([]);
    const [ externalClaims, setExternalClaims ] = useState<ExtendedExternalClaimInterface[]>([]);
    const [ unfilteredExternalClaims, setUnfilteredExternalClaims ] = useState<ExtendedExternalClaimInterface[]>([]);
    const [ isScopeExternalClaimMappingLoading, setIsScopeExternalClaimMappingLoading ] = useState(true);

    // Selected claims in local and external dialects.
    const [ selectedClaims, setSelectedClaims ] = useState<ExtendedClaimInterface[]>([]);
    const [ selectedExternalClaims, setSelectedExternalClaims ] = useState<ExtendedExternalClaimInterface[]>([]);
    const [ showClaimMappingConfirmation, setShowClaimMappingConfirmation ] = useState<boolean>(false);

    // Mapping operation.
    const [ claimMapping, setClaimMapping ] = useState<ExtendedClaimMappingInterface[]>([]);
    const [ claimMappingOn, setClaimMappingOn ] = useState(false);
    // Form submitted with EmptyClaim Mapping
    const [ claimMappingError, setClaimMappingError ] = useState(false);

    //Advance Settings.
    const [ advanceSettingValues, setAdvanceSettingValues ] = useState<AdvanceSettingsSubmissionInterface>();
    const [ selectedSubjectValue, setSelectedSubjectValue ] = useState<string>();
    const [ removedSubjectMapping, setRemovedSubjectMapping ] = useState<string>();
    const resolvedDefaultSubjectAttribute: string = useMemo(
        () => resolveDefaultSubjectAttribute(advancedConfigurations),
        [ advancedConfigurations ]
    );

    // Role Mapping.
    const [ roleMapping, setRoleMapping ] = useState<RoleMappingInterface[]>(claimConfigurations?.role?.mappings ?? []);

    const [ isClaimLoading, setIsClaimLoading ] = useState<boolean>(true);
    const [ isUserAttributesLoading, setUserAttributesLoading ] = useState<boolean>(undefined);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const {
        data: OIDCScopeList,
        isLoading: isOIDCScopeListLoading,
        isValidating: isOIDCScopeListValidating
    } = useOIDCScopesList();

    const [ duplicatedMappingValues,setDuplicatedMappingValues ] = useState<Array<string>>([]);

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

    useEffect(() => {
        if (!isOIDCScopeListLoading && !isOIDCScopeListValidating) {
            setScopes(OIDCScopeList);
            getClaims();
            getAllDialects();
            findLocalClaimDialectURI();

            return;
        }
    }, [ isOIDCScopeListLoading, isOIDCScopeListValidating, OIDCScopeList ]);

    useEffect(() => {
        getExternalClaimsGroupedByScopes();
    }, [ externalClaims ]);

    /**
     * Whether this tab operates on the tenant wide OIDC claim dialect rather than the local claim dialect.
     *
     * The scope grouped selector has no field for attributes renamed in a custom dialect, so it shows them
     * as unselected and saving from it drops the names. Those applications use the local dialect instead.
     *
     * Opt in through `isCustomClaimDialectRoutingEnabled`; with it off this is `onlyOIDCConfigured`.
     */
    const hasRenamedAttributes: boolean = claimConfigurations?.dialect === "CUSTOM"
        && (claimConfigurations?.claimMappings ?? []).some((mapping: ClaimMappingInterface) =>
            !!mapping?.applicationClaim && mapping.applicationClaim !== mapping?.localClaim?.uri);

    const usesOIDCClaimDialect: boolean = UIConfig?.isCustomClaimDialectRoutingEnabled
        ? onlyOIDCConfigured && !hasRenamedAttributes
        : onlyOIDCConfigured;

    /**
     * Set the dialects for inbound protocols
     */
    useEffect(() => {
        if (isEmpty(dialect)) {
            return;
        }
        //TODO  move this logic to backend
        setIsClaimRequestLoading(true);

        if (usesOIDCClaimDialect) {
            changeSelectedDialect("http://wso2.org/oidc/claim");

            return;
        }

        setIsClaimRequestLoading(false);
        changeSelectedDialect(localDialectURI);
    }, [ usesOIDCClaimDialect, dialect ]);

    useEffect(() => {
        if (advanceSettingValues) {
            const mappingList: ExtendedClaimMappingInterface[] = getFinalMappingList();

            if (mappingList !== null) {
                submitUpdateRequest(mappingList);
            }
        }
    }, [ advanceSettingValues ]);

    /**
     * Set initial value for claim mapping.
     */
    useEffect(() => {
        if (claimConfigurations?.dialect === "CUSTOM") {
            setClaimMappingOn(true);
        }
    }, [ claimConfigurations ]);

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
        setUnfilteredExternalClaimsGroupedByScopes(sortBy(updatedScopes, "name"));
        setExternalClaimsGroupedByScopes(sortBy(updatedScopes, "name"));
        setIsScopeExternalClaimMappingLoading(false);
    };

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
     * Get All Dialected
     */
    const getAllDialects = () => {
        getDialects(null)
            .then((response: ClaimDialect[]) => {
                setDialect(response);
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("claims:dialects.notifications.fetchDialects" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("claims:dialects.notifications.fetchDialects." +
                        "genericError.message")
                }));
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

    const findDialectID = (value: string) => {
        let id: string = "";

        dialect.map((element: ClaimDialect) => {
            if (element.dialectURI === value) {
                id = element.id;
            }
        });

        return id;
    };

    const createMapping = (claims: Claim[]) => {
        if (selectedDialect.localDialect) {
            const claimMappingList: ExtendedClaimMappingInterface[] = [ ...claimMapping ];

            claims.map((claim: Claim) => {
                const newClaimMapping: ExtendedClaimMappingInterface = {
                    addMapping: false,
                    applicationClaim: "",
                    localClaim: {
                        displayName: claim.displayName,
                        id: claim.id,
                        uri: claim.claimURI
                    }
                };

                if (!(claimMappingList.some((claimMapping: ExtendedClaimMappingInterface) =>
                    claimMapping.localClaim.uri === claim.claimURI))) {
                    claimMappingList.push(newClaimMapping);
                }
                setClaimMapping(claimMappingList);
            });
        }
    };

    /**
     * Update Claim Mappings
     *
     * @param addedClaims - Mappings added
     * @param removedClaims - Mappings removed
     */
    const updateMappings = (addedClaims: Claim[], removedClaims: Claim[]) => {
        if (selectedDialect.localDialect) {
            const claimMappingList: ExtendedClaimMappingInterface[] = [ ...claimMapping ];

            addedClaims.map((claim: Claim) => {
                const newClaimMapping: ExtendedClaimMappingInterface = {
                    addMapping: false,
                    applicationClaim: "",
                    localClaim: {
                        displayName: claim.displayName,
                        id: claim.id,
                        uri: claim.claimURI
                    }
                };

                if (!(claimMappingList
                    .some((claimMap: ExtendedClaimMappingInterface) => claimMap.localClaim.uri === claim.claimURI))) {

                    claimMappingList.push(newClaimMapping);
                }
            });

            const removedMappings: ExtendedClaimMappingInterface[] = [];

            removedClaims.map((claim: Claim) => {
                let mappedClaim : ExtendedClaimMappingInterface;

                claimMappingList.map((mapping: ExtendedClaimMappingInterface) => {
                    if (mapping.localClaim.uri === claim.claimURI) {
                        mappedClaim = mapping;
                    }
                });
                if (mappedClaim) {
                    removedMappings.push(mappedClaim);
                    claimMappingList.splice(claimMappingList.indexOf(mappedClaim), 1);
                }
            });
            trackRemovedSubjectMapping(removedMappings);
            setClaimMapping(claimMappingList);
        }
    };

    /**
     * Remove Claim Mappings
     *
     * @param claimURI - URI of the mapping removed
     */
    const removeMapping = (claimURI: string) => {
        const claimMappingList: ExtendedClaimMappingInterface[] = [ ...claimMapping ];
        let mappedClaim : ExtendedClaimMappingInterface;

        claimMappingList.map((mapping: ExtendedClaimMappingInterface) => {
            if (mapping.localClaim.uri === claimURI) {
                mappedClaim = mapping;
            }
        });
        if (mappedClaim) {
            trackRemovedSubjectMapping([ mappedClaim ]);
            claimMappingList.splice(claimMappingList.indexOf(mappedClaim), 1);
            setClaimMapping(claimMappingList);
        }
    };

    /**
     * Get Claim Mapping of the URI given
     *
     * @param claimURI - URI of the mapping removed
     *
     * @returns external claim with mapping
     */
    const getCurrentMapping = (claimURI: string): ExtendedClaimMappingInterface => {
        const claimMappingList: ExtendedClaimMappingInterface[] = [ ...claimMapping ];
        let result: ExtendedClaimMappingInterface;

        claimMappingList.map((mapping: ExtendedClaimMappingInterface) => {
            if (mapping.localClaim.uri === claimURI) {
                result = mapping;
            }
        });

        return result;
    };

    /**
     * Update mapping value
     *
     * @param claimURI - URI of the mapping updated
     * @param mappedValue - mapped claims value
     * @param isUpdatingOnInputChange - whether the updating happens on mapping attribute input change
     *
     */
    const updateClaimMapping = (claimURI: string, mappedValue: string, isUpdatingOnInputChange?: boolean) => {
        const claimMappingList: ExtendedClaimMappingInterface[] = [ ...claimMapping ];

        const alreadySeen: Record<string,boolean> = {};
        const duplicatedMappings: Array<string> = [];

        claimMappingList.forEach((mapping: ExtendedClaimMappingInterface) => {
            if (mapping.localClaim.uri === claimURI) {
                mapping.applicationClaim = mappedValue;
            }

            /**
             * Detect duplicate values only when updating the mapping attributes.
             * This check will not be executed on initial loading of mapping attributes.
             */
            if (isUpdatingOnInputChange) {
                if (alreadySeen[mapping.applicationClaim]) {
                    duplicatedMappings.push(mapping.applicationClaim);
                } else {
                    alreadySeen[mapping.applicationClaim] = true;
                }
            }
        });

        /**
         * Update state with duplicate values for mapping attributes.
         * This state is passed to children components for identifying duplicate values.
         */
        if (isUpdatingOnInputChange) {
            setDuplicatedMappingValues(duplicatedMappings);
        }

        setClaimMapping(claimMappingList);
    };

    /**
     * Decide whether to use mapping or not
     *
     * @param claimURI - URI of the mapping
     * @param addMapping - Whether add or not add the mapping
     */
    const addToClaimMapping = (claimURI: string, addMapping: boolean) => {
        const claimMappingList: ExtendedClaimMappingInterface[] = [ ...claimMapping ];

        claimMappingList.forEach((mapping: ExtendedClaimMappingInterface) => {
            if (mapping.localClaim.uri === claimURI) {
                mapping.addMapping = addMapping;
            }
        });
        setClaimMapping(claimMappingList);
    };

    /**
     * change selected dialect
     *
     * @param dialectURI - dialect uri
     */
    const changeSelectedDialect = (dialectURI: string) => {
        if (dialectURI !== null) {
            const selectedId: string = findDialectID(dialectURI);
            let isLocalDialect: boolean = true;

            if (dialectURI !== localDialectURI) {
                isLocalDialect = false;
            }
            setSelectedDialect({
                dialectURI: dialectURI,
                id: selectedId,
                localDialect: isLocalDialect
            });
            if (!isLocalDialect) {
                getMappedClaims(selectedId);
            }
        }
    };

    /**
     * Set local claim URI and maintain it in a state
     */
    const findLocalClaimDialectURI = () => {
        if (isEmpty(localDialectURI)) {
            setLocalDialectURI(getLocalDialectURI());
        }
    };

    /**
     * Create sorted dropdown list.
     */
    const createDropDownList = (options: DropdownOptionsInterface[]) : DropdownOptionsInterface[] => {
        let soretdDropdownList: DropdownOptionsInterface[] = [];

        soretdDropdownList = [ ...options ];

        // The dropdown lists the alternate subject identifiers only. The default identifier of the application is
        // selected by leaving the alternate subject identifier option unticked.
        const defaultSubjectClaimIndex: number =
        soretdDropdownList.findIndex(
            (option: DropdownOptionsInterface) => option?.value === resolvedDefaultSubjectAttribute
        );

        soretdDropdownList = soretdDropdownList.filter((item:DropdownOptionsInterface,
            index:number) => index !== defaultSubjectClaimIndex);

        return soretdDropdownList;
    };

    /**
     * Attribute name mapping is in effect only while it is switched on and at least one attribute of the table is
     * mapped. With no mapped row the application is saved with the local dialect, so the subject attribute follows
     * the local dialect rules and any attribute can be assigned.
     */
    const isClaimMappingInEffect: boolean = resolveClaimMappingInEffect(
        claimMappingOn,
        claimMapping,
        selectedClaims.map((claim: ExtendedClaimInterface) => claim?.claimURI),
        [ ...claims, ...selectedClaims ].map((claim: ExtendedClaimInterface) => claim?.claimURI)
    );

    /**
     * Whether the mapped attribute name the stored subject relies on is gone in this session (attribute name mapping
     * no longer in effect, or the name not mapped any more).
     */
    const isStoredSubjectMappingRemoved = (): boolean =>
        resolveStoredSubjectMappingRemoved(
            claimConfigurations, claimMapping, isClaimMappingInEffect, !!selectedDialect?.localDialect
        );

    /**
     * Records the mapped attribute name that was the subject attribute when its mapping row was removed from the
     * table, so that the subject returns to the application's default as the removal confirmation promises. Cleared
     * as soon as the subject attribute changes.
     *
     * @param removedMappings - Mapping entries that leave the table.
     */
    const trackRemovedSubjectMapping = (removedMappings: ExtendedClaimMappingInterface[]): void => {
        const removedSubject: ExtendedClaimMappingInterface = removedMappings.find(
            (mapping: ExtendedClaimMappingInterface) =>
                mapping?.addMapping && !!mapping?.applicationClaim && mapping.applicationClaim === selectedSubjectValue
                // A mapped name equal to the default needs no reset, and a recorded no-op would never be cleared.
                && mapping.applicationClaim !== resolvedDefaultSubjectAttribute
        );

        if (removedSubject) {
            setRemovedSubjectMapping(removedSubject.applicationClaim);
        }
    };

    /**
     * Takes the subject attribute the advanced settings report and clears a recorded removal once the subject has
     * moved on from the removed mapped name.
     *
     * @param value - Subject attribute selected in the advanced settings.
     */
    const handleSelectedSubjectValue = (value: string): void => {
        setSelectedSubjectValue(value);

        if (removedSubjectMapping && value !== removedSubjectMapping) {
            setRemovedSubjectMapping(undefined);
        }
    };

    /**
     * Builds the option shown, disabled, while the alternate subject identifier is unticked: the application's
     * default subject identifier as the dropdown would label it, or the local attribute when the current view does
     * not list it (the attribute name mapping view without a mapping for it), or the bare URI.
     */
    const createDefaultSubjectOption = (options: DropdownOptionsInterface[]): DropdownOptionsInterface => {
        const listedOption: DropdownOptionsInterface = options.find(
            (option: DropdownOptionsInterface) => option?.value === resolvedDefaultSubjectAttribute
        );

        if (listedOption) {
            return listedOption;
        }

        const localClaim: ExtendedClaimInterface = [ ...claims, ...selectedClaims ].find(
            (claim: ExtendedClaimInterface) => claim?.claimURI === resolvedDefaultSubjectAttribute
        );

        return {
            key: resolvedDefaultSubjectAttribute,
            text: (
                <SubjectAttributeListItem
                    key={ localClaim?.id ?? resolvedDefaultSubjectAttribute }
                    displayName={ localClaim?.displayName ?? resolvedDefaultSubjectAttribute }
                    claimURI={ resolvedDefaultSubjectAttribute }
                    value={ resolvedDefaultSubjectAttribute }
                />
            ),
            value: resolvedDefaultSubjectAttribute
        };
    };

    /**
     * Create dropdown options
     */
    const createDropdownOption = (): DropdownOptionsInterface[] => {
        const options: DropdownOptionsInterface[] = [];
        const currentSubjectUri: string = claimConfigurations?.subject?.claim?.uri;

        if (selectedDialect.localDialect) {
            if (isClaimMappingInEffect) {
                let usernameAdded: boolean = false;
                let subjectAdded: boolean = !currentSubjectUri || currentSubjectUri === DefaultSubjectAttribute;
                const claimMappingOption: DropdownOptionsInterface[] = [];
                const claimMappingList: ExtendedClaimMappingInterface[] = [ ...claimMapping ];

                claimMapping.map((element: ExtendedClaimMappingInterface) => {
                    if (!element || !element.localClaim) {
                        return;
                    }
                    const option: DropdownOptionsInterface = {
                        key: element?.localClaim.uri,
                        text: (
                            <SubjectAttributeListItem
                                key={ element.localClaim.id }
                                displayName={ element.applicationClaim ?
                                    element.applicationClaim : element.localClaim.uri }
                                claimURI={ element.localClaim.uri }
                                value={ element.applicationClaim }
                            />
                        ),
                        value: element.applicationClaim
                    };

                    if (element.localClaim.uri === DefaultSubjectAttribute) {
                        usernameAdded = true;
                    }
                    if (element.applicationClaim === currentSubjectUri) {
                        subjectAdded = true;
                    }
                    claimMappingOption.push(option);
                });
                if (claimMappingList.length === 0 || !usernameAdded) {
                    const userclaim: ExtendedClaimInterface = claims.filter(
                        (element: ExtendedClaimInterface) => element.claimURI === DefaultSubjectAttribute)[ 0 ];

                    if (userclaim !== null && typeof userclaim !== "undefined") {
                        const option: DropdownOptionsInterface = {
                            key: userclaim.claimURI,
                            text: (
                                <SubjectAttributeListItem
                                    key={ userclaim.id }
                                    displayName={ userclaim.displayName }
                                    claimURI={ userclaim.claimURI }
                                    value={ userclaim.claimURI }
                                />
                            ),
                            value: userclaim.claimURI
                        };

                        claimMappingOption.push(option);
                    }
                }
                if (!subjectAdded && claimConfigurations?.dialect === "CUSTOM" && !isStoredSubjectMappingRemoved()) {
                    // Preserve a subject claim that isn't part of the current claim mappings so the dropdown
                    // can render it and it survives round-trips through this form. Only the subject of an
                    // application saved with the custom dialect is kept here (a mapped name, or a subject set
                    // outside the Console); a local dialect subject returns to the default once mapping is in
                    // effect, because the server accepts only a mapped name then.
                    const subjectClaim: ExtendedClaimInterface = claims.filter(
                        (element: ExtendedClaimInterface) => element.claimURI === currentSubjectUri)[ 0 ];

                    if (subjectClaim !== null && typeof subjectClaim !== "undefined") {
                        claimMappingOption.push({
                            key: subjectClaim.claimURI,
                            text: (
                                <SubjectAttributeListItem
                                    key={ subjectClaim.id }
                                    displayName={ subjectClaim.displayName }
                                    claimURI={ subjectClaim.claimURI }
                                    value={ subjectClaim.claimURI }
                                />
                            ),
                            value: subjectClaim.claimURI
                        });
                    } else {
                        claimMappingOption.push({
                            key: currentSubjectUri,
                            text: (
                                <SubjectAttributeListItem
                                    key={ currentSubjectUri }
                                    displayName={ currentSubjectUri }
                                    claimURI={ currentSubjectUri }
                                    value={ currentSubjectUri }
                                />
                            ),
                            value: currentSubjectUri
                        });
                    }
                }

                return sortBy(claimMappingOption, "key");
            } else {
                let subjectAdded: boolean = !currentSubjectUri || currentSubjectUri === DefaultSubjectAttribute
                    || isStoredSubjectMappingRemoved();
                const addedClaimURIs: Set<string> = new Set<string>();

                // Any attribute may be the subject identifier, so the dropdown lists every attribute the
                // application can request (the available ones and the requested ones), not only the requested ones.
                [ ...claims, ...selectedClaims ].map((element: ExtendedClaimInterface) => {
                    if (!element || addedClaimURIs.has(element.claimURI)) {
                        return;
                    }
                    addedClaimURIs.add(element.claimURI);

                    const option: DropdownOptionsInterface = {
                        key: element.claimURI,
                        text: (
                            <SubjectAttributeListItem
                                key={ element.id }
                                displayName={ element.displayName }
                                claimURI={ element.claimURI }
                                value={ element.claimURI }
                            />
                        ),
                        value: element.claimURI
                    };

                    options.push(option);
                    if (element.claimURI === currentSubjectUri) {
                        subjectAdded = true;
                    }
                });
                if (!subjectAdded) {
                    // Preserve a subject claim that is not among the application's attributes (an excluded identity
                    // claim or an unknown URI) so the dropdown can render it and it survives round-trips.
                    options.push({
                        key: currentSubjectUri,
                        text: (
                            <SubjectAttributeListItem
                                key={ currentSubjectUri }
                                displayName={ currentSubjectUri }
                                claimURI={ currentSubjectUri }
                                value={ currentSubjectUri }
                            />
                        ),
                        value: currentSubjectUri
                    });
                }
            }
        } else {
            let subjectAdded: boolean = !currentSubjectUri || currentSubjectUri === DefaultSubjectAttribute;
            const addedLocalClaimURIs: Set<string> = new Set<string>();

            // Any attribute may be the subject identifier, so every attribute of every scope is listed, not only
            // the requested ones. An attribute that belongs to more than one scope is listed once.
            unfilteredExternalClaimsGroupedByScopes.map((scope: OIDCScopesClaimsListInterface) => {
                scope?.claims.map((element: ExtendedExternalClaimInterface) => {
                    if (!element || addedLocalClaimURIs.has(element.mappedLocalClaimURI)) {
                        return;
                    }
                    addedLocalClaimURIs.add(element.mappedLocalClaimURI);

                    const option: DropdownOptionsInterface = {
                        key: element.claimURI,
                        text: (
                            <SubjectAttributeListItem
                                key={ element.id }
                                displayName={ element.localClaimDisplayName }
                                claimURI={ element.claimURI }
                                value={ element.mappedLocalClaimURI }
                            />
                        ),
                        value: element.mappedLocalClaimURI
                    };

                    options.push(option);
                    if (element.mappedLocalClaimURI === currentSubjectUri) {
                        subjectAdded = true;
                    }
                });
            });
            if (!subjectAdded) {
                // Preserve a subject claim that is not an OpenID Connect attribute (a custom application claim or an
                // unknown URI) so the dropdown can render it and it survives round-trips.
                options.push({
                    key: currentSubjectUri,
                    text: (
                        <SubjectAttributeListItem
                            key={ currentSubjectUri }
                            displayName={ currentSubjectUri }
                            claimURI={ currentSubjectUri }
                            value={ currentSubjectUri }
                        />
                    ),
                    value: currentSubjectUri
                });
            }
        }

        return sortSubjectAttributeOptions(options);
    };

    const updateValues = () => {
        eventPublisher.publish("application-user-attribute-click-update-button");

        const mappedValues: Set<string> = new Set(
            claimMapping.map((mapping: ExtendedClaimMappingInterface) => mapping.applicationClaim)
        );

        if (!claimMappingOn || mappedValues.size === claimMapping.length) {
            submitAdvanceForm();
        }
        else {
            dispatch(addAlert({
                description: t("applications:notifications.updateClaimConfig" +
                    ".error.description", { description: "Mapped user attributes cannot be duplicated." }),
                level: AlertLevels.ERROR,
                message: t("applications:notifications.updateClaimConfig.error" +
                    ".message")
            }));
        }
    };

    /**
     *  Get the mapping for given URI
     */
    const getMapping = ((uri: string, claimMappings: ExtendedClaimMappingInterface[]) => {
        let requestURI: string = uri;

        if (claimMappings.length > 0) {
            requestURI = claimMappings.find(
                (mapping: ExtendedClaimMappingInterface) => mapping?.localClaim?.uri === uri)?.applicationClaim;
        }

        return requestURI;
    });

    /**
     *  Generate final claim mapping list.
     */
    const getFinalMappingList = ((): ExtendedClaimMappingInterface[] => {
        const claimMappingFinal: ExtendedClaimMappingInterface[] = [];
        let returnList: boolean = true;

        setClaimMappingError(false);
        // Without a mapped row the application is saved with the local dialect and no mappings.
        if (!isClaimMappingInEffect) {
            return claimMappingFinal;
        }
        const createdClaimMappings: ExtendedClaimMappingInterface[] = [ ...claimMapping ];

        createdClaimMappings.map((claimMapping: ExtendedClaimMappingInterface) => {
            if (claimMapping.addMapping) {
                if (isEmpty(claimMapping?.applicationClaim)) {
                    setClaimMappingError(true);
                    returnList = false;
                } else {
                    const claimMappedObject: ExtendedClaimMappingInterface = {
                        applicationClaim: claimMapping?.applicationClaim,
                        localClaim: {
                            uri: claimMapping?.localClaim?.uri
                        }
                    };

                    claimMappingFinal.push(claimMappedObject);
                }
            }
        });

        if (returnList) {
            return claimMappingFinal;
        } else {
            return null;
        }
    });

    /**
     *  Submit update request
     *
     *  @param claimMappingFinal - final claim mappings
     */
    const submitUpdateRequest = (claimMappingFinal: ExtendedClaimMappingInterface[]) => {
        let isSubjectSelectedWithoutMapping: boolean = false;
        const RequestedClaims: RequestedClaimConfigurationInterface[] = [];
        const subjectClaim: AppClaimInterface = advanceSettingValues?.subject?.claim;

        // When the server reported no subject identifier and the user did not pick an alternate one, leave the subject
        // out of the payload so that the default resolved at runtime is not persisted.
        const isSubjectClaimOmitted: boolean = !claimConfigurations?.subject?.claim?.uri
            && !advanceSettingValues?.isSubjectClaimExplicit;

        if (selectedDialect.localDialect) {
            selectedClaims.map((claim: ExtendedClaimInterface) => {
                // If claim mapping is there then check whether claim is requested or not.
                const claimMappingURI: string = claimMappingFinal.length > 0 ?
                    getMapping(claim.claimURI, claimMappingFinal) : null;

                if (claimMappingURI) {
                    if (claim.requested) {
                        const requestedClaim: RequestedClaimConfigurationInterface = {
                            claim: {
                                uri: claimMappingURI
                            },
                            mandatory: (subjectClaim && claimMappingURI === subjectClaim.toString()
                                && applicationConfig.attributeSettings.makeSubjectMandatory)
                                ? true
                                : claim.mandatory
                        };

                        RequestedClaims.push(requestedClaim);
                    }
                } else {
                    const requestedClaim: RequestedClaimConfigurationInterface = {
                        claim: {
                            uri: claim.claimURI
                        },
                        mandatory: (subjectClaim && claim.claimURI === subjectClaim.toString()
                            && applicationConfig.attributeSettings.makeSubjectMandatory)
                            ? true
                            : claim.mandatory
                    };

                    RequestedClaims.push(requestedClaim);
                }
            });
        } else {
            unfilteredExternalClaimsGroupedByScopes.map((scope: OIDCScopesClaimsListInterface) => {
                scope?.claims.map((claim: ExtendedExternalClaimInterface) => {
                    if (claim.requested) {
                        const requestedClaim: RequestedClaimConfigurationInterface = {
                            claim: {
                                uri: claim.mappedLocalClaimURI
                            },
                            mandatory: claim.mandatory
                        };

                        if (!RequestedClaims.find((claimRequested: RequestedClaimConfigurationInterface) =>
                            claimRequested.claim.uri === requestedClaim.claim.uri)) {
                            RequestedClaims.push(requestedClaim);
                        }
                    }
                });
            });
        }

        // The subject dropdown offers the user id and the application's default subject identifier even when the
        // application does not map them, so an identity mapping is added for whichever of them is selected.
        const subjectClaimURI: string = subjectClaim?.toString();
        const implicitlyMappedSubjectAttributes: string[] = [
            resolvedDefaultSubjectAttribute,
            DefaultSubjectAttribute
        ];

        if (subjectClaimURI
            && implicitlyMappedSubjectAttributes.includes(subjectClaimURI)
            && claimMappingFinal.findIndex((mapping: ExtendedClaimMappingInterface) =>
                mapping.localClaim.uri === subjectClaimURI) < 0) {
            isSubjectSelectedWithoutMapping = true;
        }

        if (claimMappingFinal.length > 0 && isSubjectSelectedWithoutMapping && !isSubjectClaimOmitted) {
            const claimMappedObject: ExtendedClaimMappingInterface = {
                applicationClaim: subjectClaimURI,
                localClaim: {
                    uri: subjectClaimURI
                }
            };

            claimMappingFinal.push(claimMappedObject);
        }

        // Generate Final Submit value
        const submitValue: any = {
            claimConfiguration: {
                claimMappings: claimMappingFinal.length > 0 ? claimMappingFinal : [],
                dialect: claimMappingFinal.length > 0 ? "CUSTOM" : "LOCAL",
                requestedClaims: RequestedClaims,
                role: {
                    claim: {
                        uri: advanceSettingValues?.role.claim
                    },
                    includeUserDomain: advanceSettingValues?.role.includeUserDomain,
                    mappings: roleMapping.length > 0 ? roleMapping : []
                },
                subject: {
                    claim: {
                        uri: advanceSettingValues?.subject.claim
                    },
                    includeTenantDomain: advanceSettingValues?.subject?.includeTenantDomain,
                    includeUserDomain: advanceSettingValues?.subject?.includeUserDomain,
                    mappedLocalSubjectMandatory: advanceSettingValues?.subject.mappedLocalSubjectMandatory,
                    useMappedLocalSubject: advanceSettingValues?.subject.useMappedLocalSubject
                }
            }
        };
        const oidcSubmitValue: OIDCDataInterface = advanceSettingValues?.oidc;

        if (isEmpty(submitValue.claimConfiguration.claimMappings)) {
            delete submitValue.claimConfiguration.claimMappings;
        }
        if (isEmpty(submitValue.claimConfiguration.role.mappings)) {
            delete submitValue.claimConfiguration.role.mappings;
        }
        if (!applicationConfig.attributeSettings.roleMapping) {
            delete submitValue.claimConfiguration.role;
        }
        // Stop sending subject claim for OIDC applications based on the excludeSubjectClaim configuration.
        if (applicationConfig.excludeSubjectClaim && onlyOIDCConfigured) {
            delete submitValue.claimConfiguration.subject;
        }

        if (isSubjectClaimOmitted && submitValue.claimConfiguration.subject) {
            delete submitValue.claimConfiguration.subject.claim;
        }

        // Stop sending tokenEndpointAllowReusePvtKeyJwt if tokenEndpointAuthMethod is not PRIVATE_KEY_JWT.
        const PRIVATE_KEY_JWT: string = "private_key_jwt";

        if (oidcSubmitValue?.clientAuthentication?.tokenEndpointAuthMethod == null
            || oidcSubmitValue?.clientAuthentication?.tokenEndpointAuthMethod != PRIVATE_KEY_JWT) {
            delete oidcSubmitValue?.clientAuthentication?.tokenEndpointAllowReusePvtKeyJwt;
        }

        /**
         * Handles the error scenario of the claim configuration update by displaying a generic claim configuration
         * update failure alert.
         */
        const onClaimConfigUpdateError = () => {
            dispatch(addAlert({
                description: t("applications:notifications.updateClaimConfig" +
                    ".genericError.description"),
                level: AlertLevels.ERROR,
                message: t("applications:notifications.updateClaimConfig.genericError" +
                    ".message")
            }));
        };

        /**
         * Handles the successful claim configuration update scenario by executing the `onUpdate` callback and
         * displaying a success alert.
         */
        const onSuccessfulClaimConfigUpdate = () => {
            onUpdate(appId);
            dispatch(addAlert({
                description: t("applications:notifications.updateClaimConfig.success" +
                    ".description"),
                level: AlertLevels.SUCCESS,
                message: t("applications:notifications.updateClaimConfig.success.message")
            }));
        };

        const isProtocolOAuth: boolean = !!technology?.find((protocol: InboundProtocolListItemInterface) =>
            protocol.type === SupportedAuthProtocolTypes.OAUTH2);

        updateClaimConfiguration(appId, submitValue)
            .then(() => {
                if (isProtocolOAuth) {
                    updateAuthProtocolConfig<OIDCDataInterface>(appId, oidcSubmitValue, SupportedAuthProtocolTypes.OIDC)
                        .then(onSuccessfulClaimConfigUpdate)
                        .catch(onClaimConfigUpdateError);
                } else {
                    onSuccessfulClaimConfigUpdate();
                }
            })
            .catch(onClaimConfigUpdateError);
    };

    /**
     * Util function to handle claim mapping.
     *
     * @param confirmation - confirmation state.
     */
    const handleClaimMapping = (confirmation: boolean): void => {
        if (confirmation) {
            setClaimMappingOn(true);
            setShowClaimMappingConfirmation(false);
        } else {
            setClaimMappingOn(false);
            setShowClaimMappingConfirmation(false);
        }
    };

    /**
     * submit form function.
     */
    let submitAdvanceForm: () => void;

    // The dialect is known only once the claim dialects have loaded; the option builder reads it.
    const subjectAttributeOptions: DropdownOptionsInterface[] = selectedDialect ? createDropdownOption() : [];

    return (
        !isClaimRequestLoading && selectedDialect && !(isClaimLoading && isEmpty(externalClaims))
        && !isScopeExternalClaimMappingLoading
            ? (
                <EmphasizedSegment padded="very">
                    <Grid className="claim-mapping">
                        <div className="form-container with-max-width">
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                {
                                    usesOIDCClaimDialect
                                        ? (
                                            <AttributeSelectionOIDC
                                                claims={ claims }
                                                externalClaims={ externalClaims }
                                                externalClaimsGroupedByScopes = { externalClaimsGroupedByScopes }
                                                setExternalClaimsGroupedByScopes = { setExternalClaimsGroupedByScopes }
                                                unfilteredExternalClaimsGroupedByScopes = {
                                                    unfilteredExternalClaimsGroupedByScopes
                                                }
                                                setUnfilteredExternalClaimsGroupedByScopes = {
                                                    setUnfilteredExternalClaimsGroupedByScopes
                                                }
                                                setExternalClaims={ setExternalClaims }
                                                selectedExternalClaims={ selectedExternalClaims }
                                                setSelectedExternalClaims={ setSelectedExternalClaims }
                                                selectedDialect={ selectedDialect }
                                                selectedSubjectValue={ selectedSubjectValue }
                                                claimMapping={ claimMapping }
                                                claimConfigurations={ claimConfigurations }
                                                defaultSubjectAttribute={ resolvedDefaultSubjectAttribute }
                                                readOnly={
                                                    readOnly
                                                || !hasApplicationUpdatePermissions
                                                }
                                                isUserAttributesLoading={ isUserAttributesLoading }
                                                setUserAttributesLoading={ setUserAttributesLoading }
                                                onlyOIDCConfigured={ onlyOIDCConfigured }
                                                data-testid={ `${ componentId }-attribute-selection-oidc` }
                                                data-componentid={ `${ componentId }-attribute-selection-oidc` }
                                                appVersion={ appVersion }
                                            />
                                        )
                                        : (
                                            <AttributeSelection
                                                claims={ claims }
                                                setClaims={ setClaims }
                                                externalClaims={ externalClaims }
                                                setExternalClaims={ setExternalClaims }
                                                selectedClaims={ selectedClaims }
                                                selectedExternalClaims={ selectedExternalClaims }
                                                setSelectedClaims={ setSelectedClaims }
                                                setSelectedExternalClaims={ setSelectedExternalClaims }
                                                selectedDialect={ selectedDialect }
                                                selectedSubjectValue={ selectedSubjectValue }
                                                claimMapping={ claimMapping }
                                                setClaimMapping={ setClaimMapping }
                                                createMapping={ createMapping }
                                                removeMapping={ removeMapping }
                                                updateMappings={ updateMappings }
                                                getCurrentMapping={ getCurrentMapping }
                                                updateClaimMapping={ updateClaimMapping }
                                                addToClaimMapping={ addToClaimMapping }
                                                claimConfigurations={ claimConfigurations }
                                                claimMappingOn={ claimMappingOn }
                                                defaultSubjectAttribute={ resolvedDefaultSubjectAttribute }
                                                showClaimMappingRevertConfirmation={ setShowClaimMappingConfirmation }
                                                setClaimMappingOn={ setClaimMappingOn }
                                                claimMappingError={ claimMappingError }
                                                readOnly={
                                                    readOnly
                                                || !hasApplicationUpdatePermissions
                                                }
                                                isUserAttributesLoading={ isUserAttributesLoading }
                                                setUserAttributesLoading={ setUserAttributesLoading }
                                                onlyOIDCConfigured={ onlyOIDCConfigured }
                                                duplicatedMappingValues={ duplicatedMappingValues }
                                                data-testid={ `${ componentId }-attribute-selection` }
                                            />
                                        )
                                }
                            </Grid.Column>
                        </div>
                    </Grid>
                    { isUserAttributesLoading === false ? (
                        <Grid>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <AdvanceAttributeSettings
                                        dropDownOptions={ createDropDownList(subjectAttributeOptions) }
                                        defaultSubjectOption={ createDefaultSubjectOption(subjectAttributeOptions) }
                                        isStoredSubjectMappingRemoved={ isStoredSubjectMappingRemoved() }
                                        removedSubjectMapping={ removedSubjectMapping }
                                        triggerSubmission={ (submitFunction: () => void) => {
                                            submitAdvanceForm = submitFunction;
                                        } }
                                        claimConfigurations={ claimConfigurations }
                                        setSubmissionValues={ setAdvanceSettingValues }
                                        setSelectedValue={ handleSelectedSubjectValue }
                                        defaultSubjectAttribute={ resolvedDefaultSubjectAttribute }
                                        initialRole={ claimConfigurations?.role }
                                        initialSubject={ claimConfigurations?.subject }
                                        claimMappingOn={ isClaimMappingInEffect }
                                        readOnly={
                                            readOnly
                                            || !hasApplicationUpdatePermissions
                                        }
                                        technology={ technology }
                                        applicationTemplateId={ applicationTemplateId }
                                        onlyOIDCConfigured={ onlyOIDCConfigured }
                                        oidcInitialValues={
                                            get(
                                                inboundProtocolConfig,
                                                SupportedAuthProtocolTypes.OIDC
                                            )
                                                ? inboundProtocolConfig[SupportedAuthProtocolTypes.OIDC]
                                                : undefined
                                        }
                                        data-testid={ `${ componentId }-advanced-attribute-settings-form` }
                                        appVersion={ appVersion }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <ConfirmationModal
                                onClose={ (): void => setShowClaimMappingConfirmation(false) }
                                type={ "warning" }
                                open={ showClaimMappingConfirmation }
                                primaryAction={
                                    t("applications:edit.sections.attributes.selection" +
                                        ".mappingTable.mappingRevert.confirmPrimaryAction")
                                }
                                secondaryAction={
                                    t("applications:edit.sections.attributes.selection" +
                                        ".mappingTable.mappingRevert.confirmSecondaryAction")
                                }
                                onSecondaryActionClick={ (): void => handleClaimMapping(true) }
                                onPrimaryActionClick={ (): void => handleClaimMapping(false) }
                            >
                                <ConfirmationModal.Header>
                                    {
                                        t("applications:edit.sections.attributes.selection" +
                                            ".mappingTable.mappingRevert.confirmationHeading")
                                    }
                                </ConfirmationModal.Header>
                                <ConfirmationModal.Message warning>
                                    {
                                        t("applications:edit.sections.attributes.selection" +
                                            ".mappingTable.mappingRevert.confirmationMessage")
                                    }
                                </ConfirmationModal.Message>
                                <ConfirmationModal.Content>
                                    {
                                        t("applications:edit.sections.attributes.selection" +
                                            ".mappingTable.mappingRevert.confirmationContent")
                                    }
                                </ConfirmationModal.Content>
                            </ConfirmationModal>
                            { !readOnly && applicationConfig.attributeSettings.roleMapping && (
                                <RoleMapping
                                    onChange={ setRoleMapping }
                                    initialMappings={ claimConfigurations?.role?.mappings }
                                    readOnly={
                                        readOnly
                                        || !hasApplicationUpdatePermissions
                                    }
                                    data-testid={ `${ componentId }-role-mapping` }
                                />
                            ) }
                            {
                                !readOnly
                                && (
                                    <Show
                                        when={ featureConfig?.applications?.scopes?.update }
                                    >
                                        <Divider hidden/>
                                        <Grid.Row>
                                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                                <Button
                                                    primary
                                                    size="small"
                                                    onClick={ updateValues }
                                                    data-testid={ `${ componentId }-submit-button` }
                                                >
                                                    { t("common:update") }
                                                </Button>
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Show>
                                )
                            }
                        </Grid>
                    ) : null
                    }
                </EmphasizedSegment>
            ) : (
                <EmphasizedSegment padded="very">
                    <ContentLoader inline="centered" active/>
                </EmphasizedSegment>
            )
    );
};

/**
 * Default props for the application attribute settings component.
 */
AttributeSettings.defaultProps = {
    "data-componentid": "application-attribute-settings"
};
