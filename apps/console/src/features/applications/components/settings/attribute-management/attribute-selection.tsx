/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import {
    ConfirmationModal,
    DocumentationLink,
    EmptyPlaceholder,
    Heading,
    Hint,
    Link,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import sortBy from "lodash-es/sortBy";
import union from "lodash-es/union";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Checkbox, Grid, Icon, Input, Segment, Table } from "semantic-ui-react";
import { AttributeSelectionWizardOtherDialect } from "./attirbute-selection-wizard-other-dialect";
import { AttributeListItem } from "./attribute-list-item";
import { AttributeSelectionWizard } from "./attribute-selection-wizard";
import {
    ExtendedClaimInterface,
    ExtendedClaimMappingInterface,
    ExtendedExternalClaimInterface,
    SelectedDialectInterface
} from "./attribute-settings";
import { applicationConfig } from "../../../../../extensions";
import { ClaimManagementConstants } from "../../../../claims/constants";
import {
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    EventPublisher,
    getEmptyPlaceholderIllustrations,
    history
} from "../../../../core";
import {
    ClaimConfigurationInterface,
    ClaimMappingInterface,
    RequestedClaimConfigurationInterface
} from "../../../models";

interface AttributeSelectionPropsInterface extends TestableComponentInterface {
    claims: ExtendedClaimInterface[];
    setClaims: any;
    externalClaims: ExtendedExternalClaimInterface[];
    setExternalClaims: any;
    selectedClaims: ExtendedClaimInterface[];
    selectedExternalClaims: ExtendedExternalClaimInterface[];
    setSelectedClaims: any;
    setSelectedExternalClaims: any;
    selectedDialect: SelectedDialectInterface;
    selectedSubjectValue: string;
    claimMapping: ExtendedClaimMappingInterface[];
    setClaimMapping: any;
    createMapping: any;
    removeMapping: any;
    getCurrentMapping: any;
    updateClaimMapping: any;
    addToClaimMapping: any;
    claimConfigurations: ClaimConfigurationInterface;
    claimMappingOn: boolean;
    defaultSubjectAttribute: string;
    showClaimMappingRevertConfirmation?: (confirmation: boolean) => void;
    setClaimMappingOn: (mappingOn: boolean) => void;
    claimMappingError: boolean;
    updateMappings: any;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Handles loading UI.
     */
    isUserAttributesLoading?: boolean;
    setUserAttributesLoading?: any;
    onlyOIDCConfigured?: boolean;
}

/**
 * Attribute selection component.
 *
 * @param props - Props injected to the component.
 * @returns Attribute Selection component.
 */
export const AttributeSelection: FunctionComponent<AttributeSelectionPropsInterface> = (
    props: AttributeSelectionPropsInterface
): ReactElement => {

    const {
        claims,
        setClaims,
        externalClaims,
        selectedClaims,
        setExternalClaims,
        selectedExternalClaims,
        setSelectedClaims,
        setSelectedExternalClaims,
        selectedDialect,
        selectedSubjectValue,
        setClaimMapping,
        createMapping,
        removeMapping,
        getCurrentMapping,
        updateClaimMapping,
        addToClaimMapping,
        claimConfigurations,
        claimMappingOn,
        defaultSubjectAttribute,
        showClaimMappingRevertConfirmation,
        setClaimMappingOn,
        claimMappingError,
        readOnly,
        updateMappings,
        isUserAttributesLoading,
        setUserAttributesLoading,
        onlyOIDCConfigured,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const [ availableClaims, setAvailableClaims ] = useState<ExtendedClaimInterface[]>([]);
    const [ availableExternalClaims, setAvailableExternalClaims ] = useState<ExtendedExternalClaimInterface[]>([]);
    const [ isDefaultMappingChanged, setIsDefaultMappingChanged ] = useState<boolean>(false);

    const [ filterSelectedClaims, setFilterSelectedClaims ] = useState<ExtendedClaimInterface[]>([]);
    const [
        filterSelectedExternalClaims,
        setFilterSelectedExternalClaims
    ] = useState<ExtendedExternalClaimInterface[]>([]);

    const [ initializationFinished, setInitializationFinished ] = useState(false);

    const [ showSelectionModal, setShowSelectionModal ] = useState(false);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ localClaimURIToBeDeleted, setLocalClaimURIToBeDeleted ] = useState<string>();

    const initValue = useRef(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const [ openIDConnectClaims ] = useState<ExtendedExternalClaimInterface[]>(externalClaims);

    useEffect(() => {
        const tempFilterSelectedExternalClaims = [ ...filterSelectedExternalClaims ];

        claimConfigurations?.claimMappings?.map((claim) => {
            if (
                !filterSelectedExternalClaims.find(
                    (selectedExternalClaim) => selectedExternalClaim?.mappedLocalClaimURI === claim.localClaim.uri
                )
            ) {
                const availableExternalClaim = availableExternalClaims.find(
                    (availableClaim) => availableClaim?.mappedLocalClaimURI === claim.localClaim.uri
                );

                if (availableExternalClaim) {
                    tempFilterSelectedExternalClaims.push(availableExternalClaim);
                }
            }
        });
        setSelectedExternalClaims(tempFilterSelectedExternalClaims);
        setFilterSelectedExternalClaims(tempFilterSelectedExternalClaims);
    }, [ claimConfigurations ]);

    // Stops the UI loader when the component is initialized and have fetched the availableExternalClaims.
    useEffect(() => {
        if (initializationFinished && claimConfigurations) {
            // Stop loader UI for SAML applications.
            if (selectedDialect.localDialect && (availableClaims.length > 0 || selectedClaims.length > 0 )) {
                setUserAttributesLoading(false);
            }
            //  Stop loader UI for OIDC and SP applications.
            if (!selectedDialect.localDialect &&
                (availableExternalClaims.length > 0 || selectedExternalClaims.length > 0)) {
                setUserAttributesLoading(false);
            }
        }
    }, [ availableClaims, availableExternalClaims, claimConfigurations, initializationFinished ]);

    const updateMandatory = (claimURI: string, mandatory: boolean) => {
        if (selectedDialect.localDialect) {
            const localClaims = [ ...selectedClaims ];

            localClaims.forEach((mapping) => {
                if (mapping.claimURI === claimURI) {
                    mapping.mandatory = mandatory;
                }
            });
            setSelectedClaims(localClaims);
        } else {
            const externalClaims = [ ...selectedExternalClaims ];

            externalClaims.forEach((mapping) => {
                if (mapping.claimURI === claimURI) {
                    mapping.mandatory = mandatory;
                }
            });
            setSelectedExternalClaims(externalClaims);
        }
    };

    const updateRequested = (claimURI: string, requested: boolean) => {
        if (selectedDialect.localDialect) {
            const localClaims = [ ...selectedClaims ];

            localClaims.forEach((mapping) => {
                if (mapping.claimURI === claimURI) {
                    mapping.requested = requested;
                }
            });
            setSelectedClaims(localClaims);
        }
    };

    const getInitiallySelectedClaimsURI = ((): string[] => {
        const requestURI: string[] = [];

        if (claimConfigurations?.dialect === "CUSTOM") {
            claimConfigurations.claimMappings?.map((element: ClaimMappingInterface) => {
                requestURI.push(element.localClaim.uri);
            });
        } else if (claimConfigurations?.dialect === "LOCAL") {
            claimConfigurations.requestedClaims.map((element: RequestedClaimConfigurationInterface) => {
                requestURI.push(element.claim.uri);
            });
        }

        return requestURI;
    });

    /**
     * Check whether claim is mandatory or not
     *
     * @param uri - Claim URI to be checked.
     * @returns If initially requested as mandatory.
     */
    const checkInitialRequestMandatory = (uri: string): boolean => {
        let requestURI = false;

        // If custom mapping there then retrieve the relevant uri and check for requested section.
        if (claimConfigurations.dialect === "CUSTOM") {
            const requestURI = claimConfigurations.claimMappings.find(
                (mapping) => mapping?.localClaim?.uri === uri)?.applicationClaim;

            if (requestURI) {
                const checkInRequested = claimConfigurations.requestedClaims.find(
                    (requestClaims) => requestClaims?.claim?.uri === requestURI);

                if (checkInRequested) {
                    return checkInRequested.mandatory;
                }
            }
        }
        // If it is mapped directly check the requested section
        requestURI = claimConfigurations.requestedClaims.find(
            (requestClaims) => requestClaims?.claim?.uri === uri)?.mandatory;

        return requestURI;
    };

    /**
     * Check whether claim is requested or not.
     *
     * @param uri - Claim URI to be checked.
     * @returns If initially requested or not.
     */
    const checkInitialRequested = (uri: string): boolean => {
        if (claimConfigurations.dialect === "CUSTOM") {
            const requestURI = claimConfigurations.claimMappings.find(
                (mapping) => mapping?.localClaim?.uri === uri)?.applicationClaim;
            let checkInRequested;

            if (requestURI) {
                checkInRequested = claimConfigurations.requestedClaims.find(
                    (requestClaims) => requestClaims?.claim?.uri === requestURI);
            } else {
                checkInRequested = claimConfigurations.requestedClaims.find(
                    (requestClaims) => requestClaims?.claim?.uri === uri);
            }

            return !!checkInRequested;
        } else {
            // If the dialect is not custom, the initial selected claim is decided by requested claims
            // So it is always true.
            return true;
        }
    };

    // search operation for claims
    const searchFilter = (changeValue) => {

        if (selectedDialect.localDialect) {
            const displayNameFilterClaims = selectedClaims.filter((item) =>
                item.displayName.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);
            const uriFilterClaims = selectedClaims.filter((item) =>
                item.claimURI.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);

            setFilterSelectedClaims(sortBy(union(displayNameFilterClaims, uriFilterClaims), "displayName"));
        } else {
            const displayNameFilterClaims = selectedExternalClaims.filter((item) =>
                item.localClaimDisplayName.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);
            const uriFilterClaims = selectedExternalClaims.filter((item) =>
                item.claimURI.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);

            setFilterSelectedExternalClaims(sortBy(
                union(displayNameFilterClaims, uriFilterClaims),
                "localClaimDisplayName"
            ));
        }
    };

    /**
     * Handle change event of the search input.
     *
     * @param event - Change event.
     */
    const handleChange = (event) => {
        const changeValue = event.target.value;

        if (changeValue.length > 0) {
            // setSearchOn(true);
            searchFilter(changeValue);
        } else {
            // setSearchOn(false);
            if (selectedDialect.localDialect) {
                setFilterSelectedClaims(selectedClaims);
            } else {
                setFilterSelectedExternalClaims(selectedExternalClaims);
            }
        }
    };

    const setInitialValues = () => {
        // set local dialect values.
        setUserAttributesLoading(true);
        if (selectedDialect.localDialect) {
            const initialRequest = getInitiallySelectedClaimsURI();
            const initialSelectedClaims: ExtendedClaimInterface[] = [];
            const initialAvailableClaims: ExtendedClaimInterface[] = [];

            applicationConfig.attributeSettings.attributeSelection.getClaims(claims)
                .map((claim) => {
                    if (initialRequest.includes(claim.claimURI) &&
                        !(claim.claimURI === defaultSubjectAttribute && isSubjectClaimSetToDefaultWithoutMapping())) {
                        const newClaim: ExtendedClaimInterface = {
                            ...claim,
                            mandatory: checkInitialRequestMandatory(claim.claimURI),
                            requested: checkInitialRequested(claim.claimURI)
                        };

                        initialSelectedClaims.push(newClaim);
                    } else {
                        initialAvailableClaims.push(claim);
                    }
                });
            setSelectedClaims(initialSelectedClaims);
            setClaims(initialAvailableClaims);
            setAvailableClaims(initialAvailableClaims);

            //Handle claim mapping initialization
            if (claimConfigurations?.dialect === "CUSTOM") {
                const initialClaimMappingList: ExtendedClaimMappingInterface[] = [];

                claimConfigurations.claimMappings.map((claim) => {
                    if (!claim || !claim.localClaim) {
                        return;
                    }
                    if (claim.localClaim.uri === defaultSubjectAttribute &&
                        isSubjectClaimSetToDefaultWithoutMapping()) {
                        return;
                    }
                    const claimMapping: ExtendedClaimMappingInterface = {
                        addMapping: true,
                        applicationClaim: claim.applicationClaim,
                        localClaim: {
                            displayName: claim.localClaim.displayName,
                            id: claim.localClaim.id,
                            uri: claim.localClaim.uri
                        }
                    };

                    initialClaimMappingList.push(claimMapping);
                });
                setClaimMapping(initialClaimMappingList);
            } else {
                const initialClaimMappingList: ExtendedClaimMappingInterface[] = [];

                initialSelectedClaims.map((claim: ExtendedClaimInterface) => {
                    // createMapping(claim);
                    const claimMapping: ExtendedClaimMappingInterface = {
                        addMapping: false,
                        applicationClaim: "",
                        localClaim: {
                            displayName: claim.displayName,
                            id: claim.id,
                            uri: claim.claimURI
                        }
                    };

                    initialClaimMappingList.push(claimMapping);
                });
                setClaimMapping(initialClaimMappingList);
            }
            setInitializationFinished(true);
        } else {
            const initialRequest = getInitiallySelectedClaimsURI();
            const initialSelectedClaims: ExtendedExternalClaimInterface[] = [];
            const initialAvailableClaims: ExtendedExternalClaimInterface[] = [];

            applicationConfig.attributeSettings.attributeSelection.getExternalClaims(externalClaims)
                .map((claim) => {
                    if (initialRequest.includes(claim.mappedLocalClaimURI)) {
                        const newClaim: ExtendedExternalClaimInterface = {
                            ...claim,
                            mandatory: checkInitialRequestMandatory(claim.mappedLocalClaimURI),
                            requested: true
                        };

                        initialSelectedClaims.push(newClaim);

                    } else {
                        initialAvailableClaims.push(claim);
                    }
                });
            const tempFilterSelectedExternalClaims = [ ...filterSelectedExternalClaims ];

            claimConfigurations?.claimMappings?.map((claimMapping) => {
                claims?.map((claim) => {
                    if (claimMapping.localClaim.uri === claim.claimURI){
                        const option: ExtendedExternalClaimInterface = {
                            claimDialectURI: claim.dialectURI,
                            claimURI: claim.claimURI,
                            id: claim.id,
                            localClaimDisplayName: claim.displayName,
                            mandatory: claim.mandatory,
                            mappedLocalClaimURI: claimMapping.localClaim.uri,
                            requested: claim.requested
                        };

                        if (!initialSelectedClaims.find(
                            (selectedExternalClaim) => selectedExternalClaim?.mappedLocalClaimURI
                            === claimMapping.localClaim.uri)){
                            initialSelectedClaims.push(option);
                        }
                    }
                });
            });
            setFilterSelectedExternalClaims(tempFilterSelectedExternalClaims);
            setSelectedExternalClaims(initialSelectedClaims);
            setExternalClaims(initialAvailableClaims);
            setAvailableExternalClaims(initialAvailableClaims);
            setInitializationFinished(true);
        }
    };

    /**
     * When claim mappings from local to custom dialect is enabled, it is possible to set the subject claim to the
     * default value without having a claim mapping for it. To support that, we specifically add a mapping for the
     * default subject claim before updating the claim configuration. However, in such cases, the claim mappings
     * list should not show that manually added mapping which comes in the response. We can identify this scenario
     * by checking whether the response has a mapping entry for the default subject claim, but the requested claims
     * in the response do not include that claim.
     */
    const isSubjectClaimSetToDefaultWithoutMapping = (): boolean => {

        return claimConfigurations?.subject?.claim?.uri === defaultSubjectAttribute &&
            claimConfigurations.requestedClaims?.findIndex(requestedClaim =>
                requestedClaim?.claim?.uri === defaultSubjectAttribute) < 0;

    };

    const handleOpenSelectionModal = () => {
        eventPublisher.publish("application-user-attribute-click-add");
        setShowSelectionModal(true);
    };

    useEffect(() => {
        if (claims) {
            setAvailableClaims([ ...applicationConfig.attributeSettings.attributeSelection.getClaims(claims) ]);
        }
        if (externalClaims) {
            setAvailableExternalClaims([ ...applicationConfig.attributeSettings
                .attributeSelection.getExternalClaims(externalClaims) ]);
        }
    }, [ claims, externalClaims ]);


    useEffect(() => {
        if (selectedClaims) {
            setFilterSelectedClaims([ ...selectedClaims ]);
        }
        if (selectedExternalClaims) {
            setFilterSelectedExternalClaims([ ...selectedExternalClaims ]);
        }
    }, [ selectedClaims, selectedExternalClaims ]);

    useEffect(() => {
        if (!initValue.current) {
            setInitializationFinished(false);
            setInitialValues();
            initValue.current = true;
        }
    }, [ claimConfigurations ]);

    const addSelectionModal = (() => {
        if (selectedDialect.localDialect) {
            return (
                <AttributeSelectionWizard
                    selectedClaims={ selectedClaims }
                    setSelectedClaims={ setFilterSelectedClaims }
                    setInitialSelectedClaims={ setSelectedClaims }
                    showAddModal={ showSelectionModal }
                    setShowAddModal={ setShowSelectionModal }
                    availableClaims={ applicationConfig.attributeSettings.attributeSelection.getClaims(claims) }
                    setAvailableClaims={ setClaims }
                    createMapping={ createMapping }
                    removeMapping={ removeMapping }
                    updateMappings={ updateMappings }
                    data-testid={ `${ testId }-wizard` }
                />
            );
        }

        return (

            <AttributeSelectionWizardOtherDialect
                selectedExternalClaims={ selectedExternalClaims }
                setSelectedExternalClaims={ setFilterSelectedExternalClaims }
                setInitialSelectedExternalClaims={ setSelectedExternalClaims }
                showAddModal={ showSelectionModal }
                setShowAddModal={ setShowSelectionModal }
                availableExternalClaims={ applicationConfig.attributeSettings
                    .attributeSelection.getExternalClaims(externalClaims) }
                setAvailableExternalClaims={ setExternalClaims }
                data-testid={ `${ testId }-wizard-other-dialects` }
            />
        );
    }
    );

    const deleteAttribute = (claimURI: string): void => {
        if (selectedDialect.localDialect) {
            const removing = selectedClaims.find(claim => claim.claimURI === claimURI);

            setSelectedClaims(selectedClaims.filter(claim => claim.claimURI !== claimURI));
            const claim = claims.find(claim => claim.claimURI === claimURI);

            if (!claim) {
                setClaims([ removing, ...claims ]);
            }
            if (claimMappingOn) {
                removeMapping(claimURI);
            }
        } else {
            const removing = selectedExternalClaims.find(claim => claim.mappedLocalClaimURI === claimURI);

            setSelectedExternalClaims(selectedExternalClaims.filter(claim => claim.mappedLocalClaimURI !== claimURI));
            setFilterSelectedExternalClaims(filterSelectedExternalClaims
                .filter(claim => claim.mappedLocalClaimURI !== claimURI));
            const externalClaim = externalClaims.find(claim => claim.mappedLocalClaimURI === claimURI);

            if (!externalClaim) {
                setExternalClaims([ removing, ...externalClaims ]);
            }
        }
    };

    const onDeleteAttribute = (claimURI: string): void => {
        setLocalClaimURIToBeDeleted(claimURI);
        if ((selectedSubjectValue === resolveClaimValue(claimURI))
            && defaultSubjectAttribute !== claimURI) {
            setShowDeleteConfirmationModal(true);
        } else {
            deleteAttribute(claimURI);
        }
    };

    const resolveClaimValue = (localClaimURI: string): string => {
        if (claimMappingOn) {
            const claimMappingValue = getCurrentMapping(localClaimURI);

            // The mapping might not exist if it is deleted from the list.
            return claimMappingValue !== undefined ? claimMappingValue.applicationClaim : localClaimURI;
        }

        return localClaimURI;
    };

    const removeAttributeModal = () => {
        const defaultSubjectClaim = claims.find(claim => claim.claimURI === defaultSubjectAttribute);

        return (
            <ConfirmationModal
                onClose={ (): void => setShowDeleteConfirmationModal(false) }
                type="negative"
                open={ showDeleteConfirmationModal }
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ (): void => {
                    setShowDeleteConfirmationModal(false);
                } }
                onPrimaryActionClick={ () => {
                    deleteAttribute(localClaimURIToBeDeleted);
                    setShowDeleteConfirmationModal(false);
                } }
                data-testid={ `${ testId }-delete-confirmation-modal` }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header
                    data-testid={ `${ testId }-delete-confirmation-modal-header` }
                >
                    { t("console:develop.features.applications.confirmations.removeApplicationUserAttribute" +
                        ".header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    attached
                    negative
                    data-testid={ `${ testId }-delete-confirmation-modal-message` }
                >
                    { t("console:develop.features.applications.confirmations.removeApplicationUserAttribute." +
                        "subHeader") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-testid={ `${ testId }-delete-confirmation-modal-content` }
                >
                    <Trans
                        i18nKey={ "console:develop.features.applications.confirmations." +
                            "removeApplicationUserAttribute.content" }
                        i18nOptions={ { default: defaultSubjectClaim?.displayName } }
                    >
                        If you remove this, the subject attribute will be set to
                        the <strong>{ defaultSubjectClaim?.displayName }</strong>
                    </Trans>
                </ConfirmationModal.Content>
            </ConfirmationModal>
        );
    };

    /**
     * Check if the claim has OIDC mapping.
     *
     * @param claiminput - Input claim.
     * @returns Is a mapping or not.
     */
    const checkMapping = (claiminput: ExtendedExternalClaimInterface): boolean => {
        let isMapping = false;

        openIDConnectClaims?.map((claim) => {
            if (claim.mappedLocalClaimURI === claiminput.mappedLocalClaimURI ||
                claiminput.mappedLocalClaimURI  === defaultSubjectAttribute){
                isMapping = true;
            }
        });

        return isMapping;
    };

    /**
     * Resolves the documentation link when a claim is selected.
     * @returns Documentation link.
     */
    const resolveClaimDocumentationLink = (): ReactElement => {
        let docLink: string = undefined;

        if (selectedDialect.localDialect) {
            docLink = getLink("develop.applications.editApplication.samlApplication.attributes" +
                ".learnMore");
        } else {
            docLink = getLink("develop.applications.editApplication.oidcApplication.attributes" +
                ".learnMore");
        }

        return (
            <DocumentationLink
                link={ docLink }
            >
                { t("common:learnMore") }
            </DocumentationLink>
        );
    };

    return (
        (!isUserAttributesLoading && claimConfigurations && initializationFinished)
            ? (
                <>
                    <Grid.Row data-testid={ testId }>
                        <Grid.Column computer={ 16 } tablet={ 16 } largeScreen={ 12 } widescreen={ 12 } >
                            <Heading as="h4">
                                {
                                    t("console:develop.features.applications.edit.sections" +
                                        ".attributes.selection.heading")
                                }
                            </Heading>
                            <Heading as="h6" color="grey">
                                { t("console:develop.features.applications.edit.sections.attributes.selection" +
                                ".description") }
                                { resolveClaimDocumentationLink() }
                            </Heading>
                            {
                                (selectedClaims.length > 0 || selectedExternalClaims.length > 0) ? (
                                    <>
                                        <Grid.Row className="user-role-edit-header-segment clearing attributes">
                                            <Table
                                                data-testid={ `${ testId }-action-bar` }
                                                basic="very"
                                                compact
                                            >
                                                <Table.Body>
                                                    <Table.Row>
                                                        <Table.Cell collapsing width="6">
                                                            <Input
                                                                icon={ <Icon name="search" /> }
                                                                iconPosition="left"
                                                                onChange={ handleChange }
                                                                placeholder={
                                                                    t("console:develop.features.applications.edit" +
                                                                    ".sections.attributes.selection.mappingTable" +
                                                                    ".searchPlaceholder")
                                                                }
                                                                floated="left"
                                                                size="small"
                                                                data-testid={ `${ testId }-search` }
                                                            />
                                                        </Table.Cell>
                                                        { selectedDialect.localDialect &&
                                                        (
                                                            <Table.Cell textAlign="right">
                                                                <Checkbox
                                                                    slider
                                                                    checked={ claimMappingOn }
                                                                    onChange={ () => {
                                                                        if (!claimMappingOn) {
                                                                            setClaimMappingOn(true);
                                                                        } else if (isDefaultMappingChanged) {
                                                                            showClaimMappingRevertConfirmation(true);
                                                                        } else {
                                                                            setClaimMappingOn(false);
                                                                        }
                                                                    } }
                                                                    label={
                                                                        t("console:develop.features.applications" +
                                                                            ".edit.sections.attributes.selection" +
                                                                            ".mappingTable.actions.enable")
                                                                    }
                                                                    readOnly={ readOnly }
                                                                    data-testid={ `${ testId }-cliam-mapping-toggle` }
                                                                />
                                                            </Table.Cell>
                                                        )
                                                        }
                                                        {
                                                            !readOnly && (
                                                                <Table.Cell textAlign="right">
                                                                    <Button
                                                                        size="medium"
                                                                        icon="pencil"
                                                                        floated="right"
                                                                        onClick={ handleOpenSelectionModal }
                                                                        data-testid={ `${ testId }-update-button` }
                                                                    />
                                                                </Table.Cell>
                                                            )
                                                        }
                                                    </Table.Row>
                                                </Table.Body>
                                            </Table>
                                        </Grid.Row>
                                        <Segment className="user-role-edit-header-segment attributes">
                                            <Grid.Row>
                                                { selectedDialect.localDialect
                                                    ? (
                                                        <Table
                                                            singleLine
                                                            compact
                                                            data-testid={ `${ testId }-list` }
                                                            fixed
                                                        >
                                                            <Table.Header>
                                                                { claimMappingOn
                                                                    ? (
                                                                        <Table.Row>
                                                                            <Table.HeaderCell width="8">
                                                                                <strong>
                                                                                    {
                                                                                        t("console:develop.features" +
                                                                                        ".applications.edit.sections" +
                                                                                        ".attributes.selection" +
                                                                                        ".mappingTable.columns" +
                                                                                        ".attribute")
                                                                                    }
                                                                                </strong>
                                                                            </Table.HeaderCell>
                                                                            <Table.HeaderCell width="8">
                                                                                <strong>
                                                                                    {
                                                                                        t("console:develop.features" +
                                                                                        ".applications.edit.sections" +
                                                                                        ".attributes.selection" +
                                                                                        ".mappingTable.columns" +
                                                                                        ".appAttribute")
                                                                                    }
                                                                                </strong>
                                                                                <Hint icon="info circle" popup>
                                                                                    {
                                                                                        t("console:develop.features" +
                                                                                        ".applications.edit.sections" +
                                                                                        ".attributes.selection" +
                                                                                        ".mappingTable." +
                                                                                        "mappedAtributeHint")
                                                                                    }
                                                                                </Hint>
                                                                            </Table.HeaderCell>
                                                                            <Table.HeaderCell
                                                                                width="4"
                                                                                textAlign="center"
                                                                            >
                                                                                <strong>
                                                                                    {
                                                                                        t("console:develop.features" +
                                                                                        ".applications.edit.sections" +
                                                                                        ".attributes.selection" +
                                                                                        ".mappingTable.columns" +
                                                                                        ".mandatory")
                                                                                    }
                                                                                </strong>
                                                                                <Hint icon="info circle" popup>
                                                                                    {
                                                                                        t("console:develop.features" +
                                                                                        ".applications.edit.sections" +
                                                                                        ".attributes.selection" +
                                                                                        ".mandatoryAttributeHint",
                                                                                        { productName:
                                                                                            config.ui.productName })
                                                                                    }
                                                                                </Hint>
                                                                            </Table.HeaderCell>
                                                                            <Table.HeaderCell width="2">
                                                                            </Table.HeaderCell>
                                                                        </Table.Row>
                                                                    )
                                                                    :
                                                                    (
                                                                        <Table.Row>
                                                                            <Table.HeaderCell width="10">
                                                                                <strong>
                                                                                    {
                                                                                        t("console:develop.features" +
                                                                                        ".applications.edit.sections" +
                                                                                        ".attributes.selection" +
                                                                                        ".mappingTable.columns" +
                                                                                        ".attribute")
                                                                                    }
                                                                                </strong>
                                                                            </Table.HeaderCell>
                                                                            <Table.HeaderCell
                                                                                width="8"
                                                                                textAlign="center"
                                                                            >
                                                                                <strong>
                                                                                    {
                                                                                        t("console:develop.features" +
                                                                                        ".applications.edit.sections" +
                                                                                        ".attributes.selection" +
                                                                                        ".mappingTable.columns" +
                                                                                        ".mandatory")
                                                                                    }
                                                                                </strong>
                                                                                <Hint icon="info circle" popup>
                                                                                    {
                                                                                        t("console:develop.features" +
                                                                                        ".applications.edit.sections" +
                                                                                        ".attributes.selection" +
                                                                                        ".mandatoryAttributeHint",
                                                                                        { productName:
                                                                                            config.ui.productName })
                                                                                    }
                                                                                </Hint>
                                                                            </Table.HeaderCell>
                                                                            <Table.HeaderCell width="2">
                                                                            </Table.HeaderCell>
                                                                        </Table.Row>
                                                                    )
                                                                }
                                                            </Table.Header>
                                                            <Table.Body>
                                                                {
                                                                    filterSelectedClaims?.map((claim) => {
                                                                        return (
                                                                            <AttributeListItem
                                                                                key={ claim.id }
                                                                                claimURI={ claim.claimURI }
                                                                                displayName={ claim.displayName }
                                                                                mappedURI={ claim.claimURI }
                                                                                localDialect={
                                                                                    selectedDialect.localDialect
                                                                                }
                                                                                updateMapping={ updateClaimMapping }
                                                                                addToMapping={ addToClaimMapping }
                                                                                mapping={
                                                                                    getCurrentMapping(claim.claimURI)
                                                                                }
                                                                                isDefaultMappingChanged={
                                                                                    setIsDefaultMappingChanged
                                                                                }
                                                                                initialMandatory={
                                                                                    selectedSubjectValue ===
                                                                                resolveClaimValue(claim.claimURI)
                                                                                        ? true
                                                                                        : claim.mandatory
                                                                                }
                                                                                initialRequested={ claim.requested }
                                                                                selectMandatory={ updateMandatory }
                                                                                selectRequested={ updateRequested }
                                                                                claimMappingOn={ claimMappingOn }
                                                                                claimMappingError={ claimMappingError }
                                                                                readOnly={ readOnly }
                                                                                subject={
                                                                                    selectedSubjectValue ===
                                                                                    resolveClaimValue(claim.claimURI)
                                                                                }
                                                                                deleteAttribute={ () => {
                                                                                    onDeleteAttribute(claim.claimURI);
                                                                                } }
                                                                                data-testid={ claim.claimURI }
                                                                            />
                                                                        );

                                                                    })
                                                                }
                                                            </Table.Body>
                                                        </Table>
                                                    )
                                                    :
                                                    (
                                                        <Table
                                                            singleLine
                                                            compact
                                                            data-testid={ `${ testId }-list` }
                                                            fixed
                                                        >
                                                            <Table.Header>
                                                                <Table.Row>
                                                                    <Table.HeaderCell width="10">
                                                                        <strong>
                                                                            {
                                                                                t("console:develop.features" +
                                                                                ".applications.edit.sections" +
                                                                                ".attributes.selection" +
                                                                                ".mappingTable.columns" +
                                                                                ".attribute")
                                                                            }
                                                                        </strong>
                                                                    </Table.HeaderCell>
                                                                    <Table.HeaderCell textAlign="center" width="8">
                                                                        <strong>
                                                                            {
                                                                                t("console:develop.features" +
                                                                                ".applications.edit.sections" +
                                                                                ".attributes.selection" +
                                                                                ".mappingTable.columns" +
                                                                                ".mandatory")
                                                                            }
                                                                        </strong>
                                                                        <Hint icon="info circle" popup>
                                                                            {
                                                                                t("console:develop.features" +
                                                                                ".applications.edit.sections" +
                                                                                ".attributes.selection" +
                                                                                ".mandatoryAttributeHint",
                                                                                { productName:
                                                                                    config.ui.productName })
                                                                            }
                                                                        </Hint>
                                                                    </Table.HeaderCell>
                                                                    <Table.HeaderCell width="2">
                                                                    </Table.HeaderCell>
                                                                </Table.Row>
                                                            </Table.Header>
                                                            <Table.Body>
                                                                {
                                                                    filterSelectedExternalClaims?.map((claim) => {
                                                                        return (
                                                                            <AttributeListItem
                                                                                key={ claim.id }
                                                                                claimURI={ claim.claimURI }
                                                                                displayName={ claim.claimURI }
                                                                                mappedURI={ claim.mappedLocalClaimURI }
                                                                                localDialect={
                                                                                    selectedDialect.localDialect
                                                                                }
                                                                                initialMandatory={
                                                                                    (selectedSubjectValue
                                                                                    === claim.mappedLocalClaimURI &&
                                                                                    !onlyOIDCConfigured)
                                                                                        ? true
                                                                                        : claim.mandatory
                                                                                }
                                                                                selectMandatory={ updateMandatory }
                                                                                initialRequested={ claim.requested }
                                                                                data-testid={ claim.claimURI }
                                                                                readOnly={
                                                                                    (selectedSubjectValue
                                                                                    === claim.mappedLocalClaimURI &&
                                                                                    !onlyOIDCConfigured
                                                                                    || !checkMapping(claim))
                                                                                        ? true
                                                                                        : readOnly
                                                                                }
                                                                                localClaimDisplayName={
                                                                                    claim.localClaimDisplayName
                                                                                }
                                                                                deleteAttribute={
                                                                                    () => onDeleteAttribute(
                                                                                        claim.mappedLocalClaimURI)
                                                                                }
                                                                                subject={ selectedSubjectValue
                                                                                === claim.mappedLocalClaimURI &&
                                                                                !onlyOIDCConfigured }
                                                                                isOIDCMapping={
                                                                                    checkMapping(claim)
                                                                                        ? false
                                                                                        : true
                                                                                }
                                                                            />
                                                                        );
                                                                    })
                                                                }
                                                            </Table.Body>
                                                        </Table>
                                                    )
                                                }
                                            </Grid.Row>
                                        </Segment>
                                    </>
                                ) : (
                                    <Segment>
                                        <EmptyPlaceholder
                                            title={
                                                applicationConfig.attributeSettings
                                                    .attributeSelection.showAttributePlaceholderTitle &&
                                                t("console:develop.features.applications.placeholders." +
                                                    "emptyAttributesList.title")
                                            }
                                            subtitle={ [
                                                t("console:develop.features.applications.placeholders." +
                                                    "emptyAttributesList.subtitles")
                                            ] }
                                            action={
                                                !readOnly && (
                                                    <PrimaryButton basic onClick={ handleOpenSelectionModal }>
                                                        <Icon name="plus" />
                                                        { t("console:develop.features.applications.placeholders" +
                                                            ".emptyAttributesList.action") }
                                                    </PrimaryButton>
                                                )
                                            }
                                            image={ getEmptyPlaceholderIllustrations().emptyList }
                                            imageSize="tiny"
                                            data-testid={ `${ testId }-empty-placeholder` }
                                        />
                                    </Segment>
                                )
                            }
                            { !readOnly && applicationConfig.attributeSettings.attributeSelection
                                .showShareAttributesHint(selectedDialect)
                                ? (
                                    <Hint>
                                        <Trans
                                            i18nKey={
                                                "console:develop.features.applications.edit.sections." +
                                                "attributes.selection.attributeComponentHint"
                                            }
                                        >
                                            Manage the user attributes you want to share with this application via
                                            <Link
                                                external={ false }
                                                onClick={ () => {
                                                    history.push(
                                                        AppConstants.getPaths().get("OIDC_SCOPES")
                                                    );
                                                } }
                                            > OpenID Connect Scopes.
                                            </Link>
                                            You can map additional attributes under
                                            <Link
                                                external={ false }
                                                onClick={ () => {
                                                    history.push(
                                                        AppConstants.getPaths()
                                                            .get("ATTRIBUTE_MAPPINGS")
                                                            .replace(":type", ClaimManagementConstants.OIDC)
                                                    );
                                                } }
                                            > Attribute.
                                            </Link>
                                        </Trans>
                                    </Hint>
                                )
                                : (
                                    <Hint>
                                        <Trans
                                            i18nKey={
                                                "console:develop.features.applications.edit.sections.attributes." +
                                                "selection.attributeComponentHintAlt"
                                            }
                                        >
                                        Manage the user attributes you want to share with this application.
                                        You can add new attributes and mappings by navigating to
                                            <Link
                                                external={ false }
                                                onClick={ () => {
                                                    history.push(
                                                        AppConstants.getPaths()
                                                            .get("LOCAL_CLAIMS")
                                                    );
                                                } }
                                            > Attribute.
                                            </Link>
                                        </Trans>
                                    </Hint>
                                )
                            }
                        </Grid.Column>
                    </Grid.Row>
                    { addSelectionModal() }
                    { removeAttributeModal() }
                </>
            )
            : null
    );
};

/**
 * Default props for the application attribute selection component.
 */
AttributeSelection.defaultProps = {
    "data-testid": "application-attribute-selection"
};
