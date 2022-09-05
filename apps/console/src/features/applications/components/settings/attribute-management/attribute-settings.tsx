/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import {
    AlertLevels,
    Claim,
    ClaimDialect,
    ClaimsGetParams,
    ExternalClaim,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, ContentLoader, EmphasizedSegment } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import sortBy from "lodash-es/sortBy";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid } from "semantic-ui-react";
import { AdvanceAttributeSettings } from "./advance-attribute-settings";
import { AttributeSelection } from "./attribute-selection";
import { RoleMapping } from "./role-mapping";
import { applicationConfig } from "../../../../../extensions";
import { getAllExternalClaims, getAllLocalClaims, getDialects } from "../../../../claims/api";
import { AppState, EventPublisher, FeatureConfigInterface } from "../../../../core";
import { SubjectAttributeListItem } from "../../../../identity-providers/components/settings";
import { updateClaimConfiguration } from "../../../api/";
import {
    ClaimConfigurationInterface,
    ClaimMappingInterface,
    InboundProtocolListItemInterface,
    RoleConfigInterface,
    RoleMappingInterface,
    SubjectConfigInterface
} from "../../../models";

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

export interface AdvanceSettingsSubmissionInterface {
    subject: SubjectConfigInterface;
    role: RoleConfigInterface;
}

interface AttributeSelectionPropsInterface extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    /**
     * Id of the application.
     */
    appId: string;
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
}

export const getLocalDialectURI = (): string => {

    let localDialect = "http://wso2.org/claims";

    getAllLocalClaims(null)
        .then((response) => {
            // setClaims(response.slice(0, 10));
            const retrieved = response.slice(0, 1)[0].dialectURI;

            if (!isEmpty(retrieved)) {
                localDialect = retrieved;
            }
        });

    return localDialect;
};

export const DefaultSubjectAttribute = "http://wso2.org/claims/username";

export const LocalDialectURI = "http://wso2.org/claims";

export function isIdentityClaim(claim: ExtendedClaimInterface | ExtendedExternalClaimInterface): boolean {

    const identityRegex = new RegExp("wso2.org/claims/identity");

    if (isClaimInterface(claim)) {
        return identityRegex.test(claim.claimURI);
    }

    return identityRegex.test(claim.mappedLocalClaimURI);
}

function isClaimInterface(claim: ExtendedClaimInterface | ExtendedExternalClaimInterface):
    claim is ExtendedClaimInterface {

    if ((claim as ExtendedExternalClaimInterface).mappedLocalClaimURI == undefined) {
        return true;
    }

    return false;
}

/**
 * Attribute settings component.
 *
 * @param {AttributeSelectionPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AttributeSettings: FunctionComponent<AttributeSelectionPropsInterface> = (
    props: AttributeSelectionPropsInterface
): ReactElement => {

    const {
        appId,
        applicationTemplateId,
        technology,
        featureConfig,
        claimConfigurations,
        onlyOIDCConfigured,
        onUpdate,
        readOnly,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    // Manage Local Dialect URI
    const [ localDialectURI, setLocalDialectURI ] = useState("");

    // available dialects.
    const [ dialect, setDialect ] = useState<ClaimDialect[]>([]);

    // Manage selected dialect
    const [ selectedDialect, setSelectedDialect ] = useState<SelectedDialectInterface>();

    // Manage available claims in local and external dialects.
    const [ isClaimRequestLoading, setIsClaimRequestLoading ] = useState(true);
    const [ claims, setClaims ] = useState<ExtendedClaimInterface[]>([]);
    const [ externalClaims, setExternalClaims ] = useState<ExtendedExternalClaimInterface[]>([]);

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

    // Role Mapping.
    const [ roleMapping, setRoleMapping ] = useState<RoleMappingInterface[]>(claimConfigurations?.role?.mappings ?? []);

    const [ isClaimLoading, setIsClaimLoading ] = useState<boolean>(true);
    const [ isUserAttributesLoading, setUserAttributesLoading ] = useState<boolean>(undefined);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const getClaims = () => {
        setIsClaimLoading(true);
        const params: ClaimsGetParams = {
            "exclude-identity-claims": applicationConfig.excludeIdentityClaims,
            filter: null,
            limit: null,
            offset: null,
            sort: null
        };

        getAllLocalClaims(params)
            .then((response) => {
                setClaims(response);
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("console:manage.features.claims.local.notifications.fetchLocalClaims.genericError" +
                        ".description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.claims.local.notifications.fetchLocalClaims." +
                        "genericError.message")
                }));
            }).finally(() => {
                setIsClaimLoading(false);
            });
    };

    const getAllDialects = () => {
        getDialects(null)
            .then((response) => {
                setDialect(response);
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("console:manage.features.claims.dialects.notifications.fetchDialects" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.claims.dialects.notifications.fetchDialects." +
                        "genericError.message")
                }));
            });
    };

    const getMappedClaims = (newClaimId) => {
        if (newClaimId !== null) {
            getAllExternalClaims(newClaimId, null)
                .then((response) => {
                    setIsClaimRequestLoading(true);
                    setExternalClaims(response);
                })
                .catch(() => {
                    dispatch(addAlert({
                        description: t("console:manage.features.claims.external.notifications.fetchExternalClaims" +
                            ".genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.claims.external.notifications.fetchExternalClaims" +
                            ".genericError.message")
                    }));
                })
                .finally(() => {
                    setIsClaimRequestLoading(false);
                });
        }
    };

    //Get local mapped claim display name for external claims
    useEffect(() => {
        externalClaims.forEach((externalClaim) => {
            const mappedLocalClaimUri = externalClaim.mappedLocalClaimURI;
            const matchedLocalClaim = claims.filter(localClaim => {
                return localClaim.claimURI === mappedLocalClaimUri;
            });

            if (matchedLocalClaim && matchedLocalClaim[0] && matchedLocalClaim[0].displayName) {
                externalClaim.localClaimDisplayName = matchedLocalClaim[0].displayName;
            }
        });
        setExternalClaims(externalClaims);
    }, [ claims, externalClaims ]);

    const findDialectID = (value) => {
        let id = "";

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

            claims.map((claim) => {
                const newClaimMapping: ExtendedClaimMappingInterface = {
                    addMapping: false,
                    applicationClaim: "",
                    localClaim: {
                        displayName: claim.displayName,
                        id: claim.id,
                        uri: claim.claimURI
                    }
                };

                if (!(claimMappingList.some((claimMap) => claimMap.localClaim.uri === claim.claimURI))) {
                    claimMappingList.push(newClaimMapping);
                }
                setClaimMapping(claimMappingList);
            });
        }
    };

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

            removedClaims.map((claim: Claim) => {
                let mappedClaim : ExtendedClaimMappingInterface;

                claimMappingList.map((mapping: ExtendedClaimMappingInterface) => {
                    if (mapping.localClaim.uri === claim.claimURI) {
                        mappedClaim = mapping;
                    }
                });
                if (mappedClaim) {
                    claimMappingList.splice(claimMappingList.indexOf(mappedClaim), 1);
                }
            });
            setClaimMapping(claimMappingList);
        }
    };

    const removeMapping = (claimURI: string) => {
        const claimMappingList = [ ...claimMapping ];
        let mappedClaim : ExtendedClaimMappingInterface;

        claimMappingList.map((mapping: ExtendedClaimMappingInterface) => {
            if (mapping.localClaim.uri === claimURI) {
                mappedClaim = mapping;
            }
        });
        if (mappedClaim) {
            claimMappingList.splice(claimMappingList.indexOf(mappedClaim), 1);
            setClaimMapping(claimMappingList);
        }
    };

    const getCurrentMapping = (claimURI: string): ExtendedClaimMappingInterface => {
        const claimMappingList = [ ...claimMapping ];
        let result: ExtendedClaimMappingInterface;

        claimMappingList.map((mapping) => {
            if (mapping.localClaim.uri === claimURI) {
                result = mapping;
            }
        });

        return result;
    };

    // Update mapping value
    const updateClaimMapping = (claimURI: string, mappedValue: string) => {
        const claimMappingList = [ ...claimMapping ];

        claimMappingList.forEach((mapping) => {
            if (mapping.localClaim.uri === claimURI) {
                mapping.applicationClaim = mappedValue;
            }
        });
        setClaimMapping(claimMappingList);
    };

    // Decide whether to use mapping or not
    const addToClaimMapping = (claimURI: string, addMapping: boolean) => {
        const claimMappingList = [ ...claimMapping ];

        claimMappingList.forEach((mapping) => {
            if (mapping.localClaim.uri === claimURI) {
                mapping.addMapping = addMapping;
            }
        });
        setClaimMapping(claimMappingList);
    };

    const changeSelectedDialect = (dialectURI: string) => {
        if (dialectURI !== null) {
            const selectedId = findDialectID(dialectURI);
            let isLocalDialect = true;

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

    // Set local claim URI and maintain it in a state
    const findLocalClaimDialectURI = () => {
        getLocalDialectURI();
        if (isEmpty(localDialectURI)) {
            setLocalDialectURI(getLocalDialectURI());
        }
    };

    const createDropdownOption = () => {
        const options: DropdownOptionsInterface[] = [];

        if (selectedDialect.localDialect) {
            if (claimMappingOn) {
                let usernameAdded: boolean = false;
                const claimMappingOption: DropdownOptionsInterface[] = [];
                const claimMappingList = [ ...claimMapping ];

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

                return sortBy(claimMappingOption, "key");
            } else {
                let usernameAdded: boolean = false;

                selectedClaims.map((element: ExtendedClaimInterface) => {
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
                    if (element.claimURI === DefaultSubjectAttribute) {
                        usernameAdded = true;
                    }
                });
                if (!usernameAdded) {
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

                        options.push(option);
                    }
                }
            }
        } else {
            let usernameAdded: boolean = false;

            selectedExternalClaims.map((element: ExtendedExternalClaimInterface) => {
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
                if (element.mappedLocalClaimURI === DefaultSubjectAttribute) {
                    usernameAdded = true;
                }
            });
            if (!usernameAdded) {
                const allExternalClaims = [ ...externalClaims, ...selectedExternalClaims ];
                const userclaim: ExtendedExternalClaimInterface = allExternalClaims.filter(
                    (element: ExtendedExternalClaimInterface) =>
                        element.mappedLocalClaimURI === DefaultSubjectAttribute)[ 0 ];

                if (userclaim !== null && typeof userclaim !== "undefined") {
                    const option: DropdownOptionsInterface = {
                        key: userclaim.claimURI,
                        text: (
                            <SubjectAttributeListItem
                                key={ userclaim.id }
                                displayName={ userclaim.localClaimDisplayName }
                                claimURI={ userclaim.claimURI }
                                value={ userclaim.mappedLocalClaimURI }
                            />
                        ),
                        value: userclaim.mappedLocalClaimURI
                    };

                    options.push(option);
                }
            }
        }

        return sortBy(options, "value");
    };

    const updateValues = () => {
        eventPublisher.publish("application-user-attribute-click-update-button");

        const mappedValues = new Set(
            claimMapping.map((mapping) => mapping.applicationClaim)
        );

        if (!claimMappingOn || mappedValues.size === claimMapping.length) {
            submitAdvanceForm();
        }
        else {
            dispatch(addAlert({
                description: t("console:develop.features.applications.notifications.updateClaimConfig" +
                    ".error.description", { description: "Mapped user attributes cannot be duplicated." }),
                level: AlertLevels.ERROR,
                message: t("console:develop.features.applications.notifications.updateClaimConfig.error" +
                    ".message")
            }));
        }
    };

    /**
     *  Get the mapping for given URI
     */
    const getMapping = ((uri: string, claimMappings: ExtendedClaimMappingInterface[]) => {
        let requestURI = uri;

        if (claimMappings.length > 0) {
            requestURI = claimMappings.find(
                (mapping) => mapping?.localClaim?.uri === uri)?.applicationClaim;
        }

        return requestURI;
    });

    /**
     *  Generate final claim mapping list.
     */
    const getFinalMappingList = ((): ExtendedClaimMappingInterface[] => {
        const claimMappingFinal = [];
        let returnList = true;

        setClaimMappingError(false);
        const createdClaimMappings: ExtendedClaimMappingInterface[] = [ ...claimMapping ];

        createdClaimMappings.map((claimMapping) => {
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

    const submitUpdateRequest = (claimMappingFinal) => {
        let isSubjectSelectedWithoutMapping = false;
        const RequestedClaims = [];
        const subjectClaim = advanceSettingValues?.subject?.claim;

        if (selectedDialect.localDialect) {
            selectedClaims.map((claim: ExtendedClaimInterface) => {
                // If claim mapping is there then check whether claim is requested or not.
                const claimMappingURI = claimMappingFinal.length > 0 ?
                    getMapping(claim.claimURI, claimMappingFinal) : null;

                if (claimMappingURI) {
                    if (claim.requested) {
                        const requestedClaim = {
                            claim: {
                                uri: claimMappingURI
                            },
                            mandatory: (subjectClaim && claimMappingURI === subjectClaim.toString())
                                ? applicationConfig.attributeSettings.makeSubjectMandatory
                                : claim.mandatory
                        };

                        RequestedClaims.push(requestedClaim);
                    }
                } else {
                    const requestedClaim = {
                        claim: {
                            uri: claim.claimURI
                        },
                        mandatory: (subjectClaim && claim.claimURI === subjectClaim.toString())
                            ? applicationConfig.attributeSettings.makeSubjectMandatory
                            : claim.mandatory
                    };

                    RequestedClaims.push(requestedClaim);
                }
            });
        } else {
            selectedExternalClaims.map((claim: ExtendedExternalClaimInterface) => {
                const requestedClaim = {
                    claim: {
                        uri: claim.mappedLocalClaimURI
                    },
                    mandatory: claim.mandatory
                };

                RequestedClaims.push(requestedClaim);
            });
        }

        if (claimMappingFinal.findIndex(mapping => mapping.localClaim.uri === DefaultSubjectAttribute) < 0
            && subjectClaim && subjectClaim.toString() === DefaultSubjectAttribute) {
            isSubjectSelectedWithoutMapping = true;
        }

        if (claimMappingFinal.length > 0 && isSubjectSelectedWithoutMapping) {
            const claimMappedObject: ExtendedClaimMappingInterface = {
                applicationClaim: DefaultSubjectAttribute,
                localClaim: {
                    uri: DefaultSubjectAttribute
                }
            };

            claimMappingFinal.push(claimMappedObject);
        }

        // Generate Final Submit value
        const submitValue = {
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
                    includeTenantDomain: advanceSettingValues?.subject.includeTenantDomain,
                    includeUserDomain: advanceSettingValues?.subject.includeUserDomain,
                    useMappedLocalSubject: advanceSettingValues?.subject.useMappedLocalSubject
                }
            }
        };

        if (isEmpty(submitValue.claimConfiguration.claimMappings)) {
            delete submitValue.claimConfiguration.claimMappings;
        }
        if (isEmpty(submitValue.claimConfiguration.role.mappings)) {
            delete submitValue.claimConfiguration.role.mappings;
        }
        if (!applicationConfig.attributeSettings.roleMapping) {
            delete submitValue.claimConfiguration.role;
        }
        // Stop sending subject claim for OIDC applications.
        if (applicationConfig.excludeSubjectClaim && onlyOIDCConfigured) {
            delete submitValue.claimConfiguration.subject;
        }

        updateClaimConfiguration(appId, submitValue)
            .then(() => {
                onUpdate(appId);
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.updateClaimConfig.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.applications.notifications.updateClaimConfig.success.message")
                }));
            })
            .catch(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.applications.notifications.updateClaimConfig" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.applications.notifications.updateClaimConfig.genericError" +
                        ".message")
                }));
            });
    };

    useEffect(() => {
        getClaims();
        getAllDialects();
        findLocalClaimDialectURI();
    }, []);

    // Set the dialects for inbound protocols
    useEffect(() => {
        if (isEmpty(dialect)) {
            return;
        }
        //TODO  move this logic to backend
        setIsClaimRequestLoading(true);

        if (onlyOIDCConfigured) {
            changeSelectedDialect("http://wso2.org/oidc/claim");

            return;
        }

        setIsClaimRequestLoading(false);
        changeSelectedDialect(localDialectURI);
    }, [ onlyOIDCConfigured, dialect ]);

    useEffect(() => {

        if (advanceSettingValues) {
            const mappingList = getFinalMappingList();

            if (mappingList !== null) {
                submitUpdateRequest(mappingList);
            }
        }
    }, [ advanceSettingValues ]);

    /**
     * Util function to handle claim mapping.
     *
     * @param confirmation confirmation state
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
     * Set initial value for claim mapping.
     */
    useEffect(() => {
        if (claimConfigurations?.dialect === "CUSTOM") {
            setClaimMappingOn(true);
        }
    }, [ claimConfigurations ]);

    /**
     * submit form function.
     */
    let submitAdvanceForm: () => void;

    return (
        !isClaimRequestLoading && selectedDialect && !(isClaimLoading && isEmpty(externalClaims))
            ? (
                <EmphasizedSegment padded="very">
                    <Grid className="claim-mapping">
                        <div className="form-container with-max-width">
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
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
                                    defaultSubjectAttribute={ DefaultSubjectAttribute }
                                    showClaimMappingRevertConfirmation={ setShowClaimMappingConfirmation }
                                    setClaimMappingOn={ setClaimMappingOn }
                                    claimMappingError={ claimMappingError }
                                    readOnly={
                                        readOnly
                                        || !hasRequiredScopes(featureConfig?.applications,
                                            featureConfig?.applications?.scopes?.update,
                                            allowedScopes)
                                    }
                                    isUserAttributesLoading={ isUserAttributesLoading }
                                    setUserAttributesLoading={ setUserAttributesLoading }
                                    onlyOIDCConfigured={ onlyOIDCConfigured }
                                    data-testid={ `${ testId }-attribute-selection` }
                                />
                            </Grid.Column>
                        </div>
                    </Grid>
                    { isUserAttributesLoading === false ? (
                        <Grid>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                    <AdvanceAttributeSettings
                                        dropDownOptions={ createDropdownOption() }
                                        triggerSubmission={ (submitFunction: () => void) => {
                                            submitAdvanceForm = submitFunction;
                                        } }
                                        setSubmissionValues={ setAdvanceSettingValues }
                                        setSelectedValue={ setSelectedSubjectValue }
                                        defaultSubjectAttribute={ DefaultSubjectAttribute }
                                        initialRole={ claimConfigurations?.role }
                                        initialSubject={ claimConfigurations?.subject }
                                        claimMappingOn={ claimMappingOn }
                                        readOnly={
                                            readOnly
                                            || !hasRequiredScopes(featureConfig?.applications,
                                                featureConfig?.applications?.scopes?.update,
                                                allowedScopes)
                                        }
                                        technology={ technology }
                                        applicationTemplateId={ applicationTemplateId }
                                        onlyOIDCConfigured={ onlyOIDCConfigured }
                                        data-testid={ `${ testId }-advanced-attribute-settings-form` }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <ConfirmationModal
                                onClose={ (): void => setShowClaimMappingConfirmation(false) }
                                type={ "warning" }
                                open={ showClaimMappingConfirmation }
                                primaryAction={
                                    t("console:develop.features.applications.edit.sections.attributes.selection" +
                                        ".mappingTable.mappingRevert.confirmPrimaryAction")
                                }
                                secondaryAction={
                                    t("console:develop.features.applications.edit.sections.attributes.selection" +
                                        ".mappingTable.mappingRevert.confirmSecondaryAction")
                                }
                                onSecondaryActionClick={ (): void => handleClaimMapping(true) }
                                onPrimaryActionClick={ (): void => handleClaimMapping(false) }
                            >
                                <ConfirmationModal.Header>
                                    {
                                        t("console:develop.features.applications.edit.sections.attributes.selection" +
                                            ".mappingTable.mappingRevert.confirmationHeading")
                                    }
                                </ConfirmationModal.Header>
                                <ConfirmationModal.Message warning>
                                    {
                                        t("console:develop.features.applications.edit.sections.attributes.selection" +
                                            ".mappingTable.mappingRevert.confirmationMessage")
                                    }
                                </ConfirmationModal.Message>
                                <ConfirmationModal.Content>
                                    {
                                        t("console:develop.features.applications.edit.sections.attributes.selection" +
                                            ".mappingTable.mappingRevert.confirmationContent")
                                    }
                                </ConfirmationModal.Content>
                            </ConfirmationModal>
                            { applicationConfig.attributeSettings.roleMapping && (
                                <RoleMapping
                                    onChange={ setRoleMapping }
                                    initialMappings={ claimConfigurations?.role?.mappings }
                                    readOnly={
                                        readOnly
                                        || !hasRequiredScopes(featureConfig?.applications,
                                            featureConfig?.applications?.scopes?.update,
                                            allowedScopes)
                                    }
                                    data-testid={ `${ testId }-role-mapping` }
                                />
                            ) }
                            {
                                !readOnly
                                && hasRequiredScopes(featureConfig?.applications,
                                    featureConfig?.applications?.scopes?.update,
                                    allowedScopes)
                                && (
                                    <Grid.Row>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                            <Button
                                                primary
                                                size="small"
                                                onClick={ updateValues }
                                                data-testid={ `${ testId }-submit-button` }
                                            >
                                                { t("common:update") }
                                            </Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                )
                            }
                        </Grid>
                    ) : null
                    }
                </EmphasizedSegment>
            ) :
            (
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
    "data-testid": "application-attribute-settings"
};

export default AttributeSettings;
