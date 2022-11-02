/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { ExternalClaim, TestableComponentInterface } from "@wso2is/core/models";
import {
    AnimatedAvatar,
    AppAvatar,
    Code,
    DocumentationLink,
    EmptyPlaceholder,
    Heading,
    Hint,
    Link,
    SegmentedAccordion,
    SegmentedAccordionTitleActionInterface,
    useDocumentation
} from "@wso2is/react-components";
import { OIDCScopesClaimsListInterface } from "apps/console/src/features/oidc-scopes";
import React, { Fragment, FunctionComponent, ReactElement, SyntheticEvent, useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Grid, Header, Icon, Input, Table } from "semantic-ui-react";
import { AttributeListItem } from "./attribute-list-item";
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
    getEmptyPlaceholderIllustrations,
    history
} from "../../../../core";
import {
    ClaimConfigurationInterface,
    ClaimMappingInterface,
    RequestedClaimConfigurationInterface
} from "../../../models";

interface AttributeSelectionOIDCPropsInterface extends TestableComponentInterface {
    claims: ExtendedClaimInterface[];
    externalClaims: ExtendedExternalClaimInterface[];
    externalClaimsGroupedByScopes: OIDCScopesClaimsListInterface[];
    setExternalClaimsGroupedByScopes: any;
    unfilteredExternalClaimsGroupedByScopes: OIDCScopesClaimsListInterface[];
    setUnfilteredExternalClaimsGroupedByScopes: any;
    setExternalClaims: any;
    selectedExternalClaims: ExtendedExternalClaimInterface[];
    setSelectedExternalClaims: any;
    selectedDialect: SelectedDialectInterface;
    selectedSubjectValue: string;
    claimMapping: ExtendedClaimMappingInterface[];
    claimConfigurations: ClaimConfigurationInterface;
    defaultSubjectAttribute: string;
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
export const AttributeSelectionOIDC: FunctionComponent<AttributeSelectionOIDCPropsInterface> = (
    props: AttributeSelectionOIDCPropsInterface
): ReactElement => {

    const {
        claims,
        externalClaims,
        externalClaimsGroupedByScopes,
        setExternalClaimsGroupedByScopes,
        setExternalClaims,
        unfilteredExternalClaimsGroupedByScopes,
        setUnfilteredExternalClaimsGroupedByScopes,
        selectedExternalClaims,
        selectedDialect,
        setSelectedExternalClaims,
        selectedSubjectValue,
        claimConfigurations,
        defaultSubjectAttribute,
        readOnly,
        isUserAttributesLoading,
        setUserAttributesLoading,
        onlyOIDCConfigured,
        [ "data-testid" ]: testId,
        [ "data-testid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const [ availableExternalClaims, setAvailableExternalClaims ] = useState<ExtendedExternalClaimInterface[]>([]);

    const [
        filterSelectedExternalClaims,
        setFilterSelectedExternalClaims
    ] = useState<ExtendedExternalClaimInterface[]>([]);

    const [ expandedScopes, setExpandedScopes ] = useState<string[]>([]);

    const [ searchValue, setSearchValue ] = useState<string>("");

    const [ initializationFinished, setInitializationFinished ] = useState<boolean>(false);

    const initValue = useRef(false);

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const [ openIDConnectClaims ] = useState<ExtendedExternalClaimInterface[]>(externalClaims);

    useEffect(() => {
        const tempFilterSelectedExternalClaims = [ ...filterSelectedExternalClaims ];

        claimConfigurations?.claimMappings?.map((claim: ClaimMappingInterface) => {
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

    /**
     * Stops the UI loader when the component is initialized and have fetched the availableExternalClaims.
     */
    useEffect(() => {
        if (initializationFinished && claimConfigurations) {
            //  Stop loader UI for OIDC and SP applications.
            if ( availableExternalClaims.length > 0 || selectedExternalClaims.length > 0) {
                setUserAttributesLoading(false);
            }
        }
    }, [ availableExternalClaims, claimConfigurations, initializationFinished ]);

    useEffect(() => {
        if (externalClaims) {
            setAvailableExternalClaims([ ...applicationConfig.attributeSettings
                .attributeSelection.getExternalClaims(externalClaims) ]);
        }
    }, [ externalClaims ]);

    useEffect(() => {
        if (selectedExternalClaims) {
            setFilterSelectedExternalClaims([ ...selectedExternalClaims ]);
        }
    }, [ selectedExternalClaims ]);

    useEffect(() => {
        if (!initValue.current) {
            setInitializationFinished(false);
            setInitialValues();
            initValue.current = true;
        }
    }, [ claimConfigurations ]);

    /**
     * Update mandatory user attributes
     *
     * @param claimURI - Claim URI to be checked.
     * @param mandatory - Is the user attribute mandatory or not
     */
    const updateMandatory = (claimURI: string, mandatory: boolean) => {
        const tempFilterSelectedExternalScopeClaims: OIDCScopesClaimsListInterface[]
        = [ ...unfilteredExternalClaimsGroupedByScopes ];

        tempFilterSelectedExternalScopeClaims.forEach((scope) => {
            scope.claims.forEach((claim) => {
                if (claim.claimURI === claimURI) {
                    claim.mandatory = mandatory;
                }
            });
        });
        setExternalClaimsGroupedByScopes(tempFilterSelectedExternalScopeClaims);
        setUnfilteredExternalClaimsGroupedByScopes(tempFilterSelectedExternalScopeClaims);
        searchFilter(searchValue);
    };

    /**
     * Update requested user attributes
     *
     * @param claimURI - Claim URI to be checked.
     * @param requested - Is the user attribute requested or not
     */
    const updateRequested = (claimURI: string, requested: boolean) => {
        const tempFilterSelectedExternalScopeClaims: OIDCScopesClaimsListInterface[]
        = [ ...unfilteredExternalClaimsGroupedByScopes ];

        tempFilterSelectedExternalScopeClaims.forEach((scope) => {
            let scopeSelected = false;

            scope.claims.forEach((claim) => {
                if (claim.claimURI === claimURI) {
                    claim.requested = requested;
                }

                if (claim.requested) {
                    scopeSelected = true;
                }
            });
            scope.selected = scopeSelected;
        });
        setExternalClaimsGroupedByScopes(tempFilterSelectedExternalScopeClaims);
        setUnfilteredExternalClaimsGroupedByScopes(tempFilterSelectedExternalScopeClaims);
        searchFilter(searchValue);
    };

    /**
     * Handles the selected scope list item change event
     *
     * @param event - Change Event.
     * @param value - Value of the step.
     */
    const handleSelectedScopeCheckChange =
    (event: SyntheticEvent<HTMLElement>, value: { value: string, checked: boolean }): void => {
        const tempExternalClaimsGroupedByScopes: OIDCScopesClaimsListInterface[]
        = [ ...unfilteredExternalClaimsGroupedByScopes ];

        tempExternalClaimsGroupedByScopes.find((scope) => {
            if (scope.name === value.value) {
                scope.selected = value.checked;

                return scope;
            }
        })?.claims.map((claim: ExtendedExternalClaimInterface) => {
            updateRequested(claim.claimURI, value.checked);
            if (!value.checked) {
                updateMandatory(claim.claimURI, value.checked);
            }
        });
    };

    /**
     * Resolve initially selected claims
     */
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
     *
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
     * Search operation for scopes
     *
     * @param changeValue - search value
     */
    const searchFilter = (changeValue: string) => {
        if (changeValue !== ""){
            const scopesFiltered: OIDCScopesClaimsListInterface[] = unfilteredExternalClaimsGroupedByScopes
                .filter((item: OIDCScopesClaimsListInterface) =>
                    item.name?.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1 ||
                item.displayName?.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);

            const unfilteredClaims: OIDCScopesClaimsListInterface[] = [ ...unfilteredExternalClaimsGroupedByScopes ];
            const tempExpandedScopes: string[] = [];
            const userAttributesFiltered: OIDCScopesClaimsListInterface[] = [];

            unfilteredClaims.forEach((scope: OIDCScopesClaimsListInterface) => {
                const matchedClaims = scope.claims.filter((claim: ExtendedExternalClaimInterface) =>
                    (claim.claimURI?.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1 ||
                    claim.claimDialectURI?.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1 ||
                    claim.localClaimDisplayName?.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1 ||
                    claim.mappedLocalClaimURI?.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1));

                if (matchedClaims !== undefined && matchedClaims.length !== 0) {
                    // expand the scope item if the searched term matches any claims/user attributes
                    if (!tempExpandedScopes.includes(scope.name)) {
                        tempExpandedScopes.push(scope.name);
                    }
                    const updatedScope = { 
                        ...scope,
                        claims: matchedClaims
                    };

                    userAttributesFiltered.push(updatedScope);
                }
                scopesFiltered.map((tempScope: OIDCScopesClaimsListInterface) => {
                    if (tempScope.name === scope.name && matchedClaims.length === 0){
                        userAttributesFiltered.push(scope);
                    }
                });
            });

            setExternalClaimsGroupedByScopes(userAttributesFiltered);
            setExpandedScopes(tempExpandedScopes);
        }
    };

    /**
     * Handle change event of the search input.
     *
     * @param event - Change event.
     */
    const handleChange = (event) => {
        const changeValue = event.target.value;

        setSearchValue(changeValue);
        if (changeValue.length > 0) {
            searchFilter(changeValue);
        } else {
            setExpandedScopes([]);
            setExternalClaimsGroupedByScopes(unfilteredExternalClaimsGroupedByScopes);
        }
    };

    /**
     * Set initial values for set local dialect values.
     */
    const setInitialValues = () => {
        setUserAttributesLoading(true);

        const initialRequest = getInitiallySelectedClaimsURI();
        const initialSelectedClaims: ExtendedExternalClaimInterface[] = [];
        const initialAvailableClaims: ExtendedExternalClaimInterface[] = [];

        applicationConfig.attributeSettings.attributeSelection.getExternalClaims(externalClaims)
            .map((claim: ExternalClaim) => {
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

        claimConfigurations?.claimMappings?.map((claimMapping: ClaimMappingInterface) => {
            claims?.map((claim) => {
                if (claimMapping.localClaim.uri === claim.claimURI){
                    const option: ExtendedExternalClaimInterface = {
                        claimDialectURI: claim.dialectURI,
                        claimURI: claim.claimURI,
                        id: claim.id,
                        localClaimDisplayName: claim.displayName,
                        mandatory: claim.mandatory,
                        mappedLocalClaimURI: claim.claimURI,
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
        setAvailableExternalClaims(initialAvailableClaims);
        setExternalClaims(initialAvailableClaims.concat(initialSelectedClaims));
        setInitializationFinished(true);
    };

    /**
     * Check if the claim has OIDC mapping.
     *
     * @param claiminput - Input claim.
     *
     * @returns Is a mapping or not.
     */
    const checkMapping = (claiminput: ExtendedExternalClaimInterface): boolean => {
        let isMapping = false;

        openIDConnectClaims?.map((claim: ExtendedExternalClaimInterface) => {
            if (claim.mappedLocalClaimURI === claiminput.mappedLocalClaimURI ||
                claiminput.mappedLocalClaimURI  === defaultSubjectAttribute){
                isMapping = true;
            }
        });

        return isMapping;
    };

    /**
     * Resolves the documentation link when a claim is selected.
     *
     * @returns Documentation link.
     */
    const resolveClaimDocumentationLink = (): ReactElement => {
        let docLink: string = undefined;

        docLink = getLink("develop.applications.editApplication.oidcApplication.attributes" +
                ".learnMore");

        return (
            <DocumentationLink
                link={ docLink }
            >
                { t("common:learnMore") }
            </DocumentationLink>
        );
    };

    /**
     * Resolves the Scope list item component
     *
     * @param scope - scope item
     *
     * @returns React component
     */
    const resolveScopeListItem = (scope: OIDCScopesClaimsListInterface): ReactElement => {
        return (
            <Header
                image
                as="h6"
                className="header-with-icon"
                data-testid={ `${ testId }-item-heading` }
                data-componentId={ `${ componentId }-item-heading` }
            >
                <AppAvatar
                    image={ (
                        <AnimatedAvatar
                            name={ scope.displayName }
                            size="mini"
                            data-testid={ `${ testId }-item-image-inner` }
                            data-componentId={ `${ componentId }-item-image-inner` }
                        />
                    ) }
                    size="mini"
                    spaced="right"
                    data-testid={ `${ testId }-item-image` }
                    data-componentId={ `${ componentId }-item-image` }
                />
                {
                    scope.name === "" 
                        ? (
                            <Header.Content className="align-self-center">
                                <Hint warning={ true } popup compact>
                                    {
                                        t("console:develop.features.applications.edit.sections.attributes" +
                                            ".selection.scopelessAttributes.hint")
                                    }
                                </Hint>
                                { scope.displayName }
                                <Header.Subheader>
                                    { " " + (scope.description ?? "") }
                                </Header.Subheader>
                            </Header.Content>
                        ) 
                        : (
                            <Header.Content>
                                { scope.displayName }
                                <Header.Subheader>
                                    <Code withBackground>{ scope.name }</Code>
                                </Header.Subheader>
                            </Header.Content>
                        )
                }
            </Header>
        );
    };

    /**
     * Resolves claims items under a scope
     *
     * @param claimsGroupedByScopes - claims grouped by a scope
     *
     * @returns React component
     */
    const resolveUserAttributeList = (claimsGroupedByScopes: ExtendedExternalClaimInterface[]): ReactElement => {
        return (
            <Table
                singleLine
                compact
                data-testid={ `${ testId }-list` }
                data-componentId={ `${ componentId }-list` }
                fixed
            >
                <Table.Header className="table-header-oidc-user-attribute">
                    <Table.Row>
                        <Table.HeaderCell width="1"></Table.HeaderCell>
                        <Table.HeaderCell width="10">
                            {
                                t("console:develop.features" +
                                        ".applications.edit.sections" +
                                        ".attributes.selection" +
                                        ".mappingTable.columns" +
                                        ".attribute")
                            }
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign="center" width="4">
                            {
                                t("console:develop.features" +
                                        ".applications.edit.sections" +
                                        ".attributes.selection" +
                                        ".mappingTable.columns" +
                                        ".requested")
                            }

                        </Table.HeaderCell>
                        <Table.HeaderCell width="4">
                            {
                                t("console:develop.features" +
                                    ".applications.edit.sections" +
                                    ".attributes.selection" +
                                    ".mappingTable.columns" +
                                    ".mandatory")
                            }
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
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    <>
                        {
                            claimsGroupedByScopes.map((claim: ExtendedExternalClaimInterface) => {
                                return (
                                    <AttributeListItem
                                        key={ claim.id }
                                        data-testid={ `${ testId }-${ claim.claimURI }` }
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
                                        selectRequested={ updateRequested }
                                        initialRequested={ claim.requested }
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
                    </>
                </Table.Body>
            </Table>
        );
    };

    const handleAccordionTitleClick = (scope: OIDCScopesClaimsListInterface) => {
        let tempExpandedScopes = [ ...expandedScopes ];

        if (!expandedScopes?.includes(scope.name)) {
            tempExpandedScopes.push(scope.name);
        } else {
            tempExpandedScopes =  tempExpandedScopes
                .filter((scopeDeselected: string) =>
                    scopeDeselected !== scope.name);
        }
        setExpandedScopes(tempExpandedScopes);
    };

    const createAccordionTitleAction = (scope: OIDCScopesClaimsListInterface):
        SegmentedAccordionTitleActionInterface[] => {

        return [ {
            checked: scope.selected,
            defaultChecked: scope.selected,
            disabled: false,
            onChange: handleSelectedScopeCheckChange,
            popoverText: scope.selected
                ? t("console:develop.features.applications.edit" +
                    ".sections.attributes.selection.mappingTable" +
                    ".listItem.actions.removeScopeRequested")
                : t("console:develop.features.applications.edit" +
                    ".sections.attributes.selection.mappingTable" +
                    ".listItem.actions.makeScopeRequested"),
            type: "checkbox popup",
            value: scope.name
        } ];
    };

    return (
        (!isUserAttributesLoading && claimConfigurations && initializationFinished)
            ? (
                <>
                    <Grid.Row data-testid={ testId } data-componentid={ componentId }>
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
                            <>
                                <Grid.Row className="user-role-edit-header-segment clearing attributes">
                                    <Table
                                        data-testid={ `${ testId }-action-bar` }
                                        data-componentid={  `${ componentId }-action-bar` }
                                        basic="very"
                                        compact
                                    >
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell collapsing width="16">
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
                                                        data-componentid={  `${ componentId }-search` }
                                                    />
                                                </Table.Cell>
                                                <Table.Cell textAlign="right"></Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table>
                                </Grid.Row>
                                <Grid.Row className="mb-5">
                                    {
                                        externalClaimsGroupedByScopes.length !== 0
                                            ? (
                                                <SegmentedAccordion
                                                    fluid
                                                    data-testid={ `${ testId }-oidc-scopes` }
                                                    data-componentid={  `${ componentId }-oidc-scopes` }
                                                    viewType="table-view"
                                                >
                                                    {
                                                        externalClaimsGroupedByScopes.map(
                                                            (scope: OIDCScopesClaimsListInterface) => {
                                                                if (scope.name !== ""){
                                                                    return (
                                                                        <Fragment key={ scope.name }>
                                                                            <SegmentedAccordion.Title
                                                                                id={ scope.name }
                                                                                data-testid={ 
                                                                                    `${testId}-${scope.name}-title` 
                                                                                }
                                                                                data-componentid={ 
                                                                                    `${componentId}-${scope.name}
                                                                                    -title` 
                                                                                }
                                                                                active={ 
                                                                                    expandedScopes?.
                                                                                        includes(scope.name) || false }
                                                                                accordionIndex={ scope.name }
                                                                                onClick={ 
                                                                                    () => 
                                                                                        handleAccordionTitleClick(scope)
                                                                                }
                                                                                content={ (
                                                                                    resolveScopeListItem(scope)
                                                                                ) }
                                                                                hideChevron={ false }
                                                                                actions={ 
                                                                                    createAccordionTitleAction(scope) 
                                                                                }
                                                                            />
                                                                            <SegmentedAccordion.Content
                                                                                active={ 
                                                                                    expandedScopes?.
                                                                                        includes(scope.name) || false
                                                                                }
                                                                                data-testid={ 
                                                                                    `${testId}-${scope.name}-content` 
                                                                                }
                                                                                data-componentid={ 
                                                                                    `${componentId}-${scope.name}
                                                                                    -content`
                                                                                }
                                                                                children={ 
                                                                                    resolveUserAttributeList(scope
                                                                                        .claims)
                                                                                }
                                                                            />
                                                                        </Fragment>
                                                                    );
                                                                }
                                                            }
                                                        )
                                                    }
                                                </SegmentedAccordion>
                                            ) 
                                            : (
                                                <EmptyPlaceholder
                                                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                                                    imageSize="tiny"
                                                    title={ 
                                                        t("console:develop.features.applications.edit.sections." +
                                                        "attributes.emptySearchResults.title") }
                                                    subtitle={ [
                                                        t("console:develop.features.applications.edit.sections." +
                                                        "attributes.emptySearchResults.subtitles.0",
                                                        { searchQuery: searchValue }),
                                                        t("console:develop.features.applications.edit.sections." +
                                                        "attributes.emptySearchResults.subtitles.1")
                                                    ] }
                                                    data-testid={ `${ testId }-empty-search-placeholder` }
                                                />
                                            )
                                    }
                                </Grid.Row>
                                <Grid.Row>
                                    <SegmentedAccordion
                                        fluid
                                        data-testid={ `${ testId }-oidc-scopes` }
                                        data-componentid={  `${ componentId }-oidc-scopes` }
                                        viewType="table-view"
                                    >
                                        {
                                            externalClaimsGroupedByScopes.map(
                                                (scope: OIDCScopesClaimsListInterface) => {
                                                    if (scope.name === ""){
                                                        return (
                                                            <Fragment key={ scope.name }>
                                                                <SegmentedAccordion.Title
                                                                    id={ scope.name }
                                                                    data-testid={ `${testId}-${scope.name}-title` }
                                                                    data-componentid={ `${componentId}-${scope.name}
                                                                    -title` }
                                                                    active={ expandedScopes?.includes(scope.name)
                                                                            || false }
                                                                    accordionIndex={ scope.name }
                                                                    onClick={ () => handleAccordionTitleClick(scope) }
                                                                    content={ (
                                                                        resolveScopeListItem(scope)
                                                                    ) }
                                                                    hideChevron={ false }
                                                                    actions={ createAccordionTitleAction(scope) }
                                                                />
    
                                                                <SegmentedAccordion.Content
                                                                    active={ expandedScopes?.includes(scope.name)
                                                                            || false }
                                                                    data-testid={ `${testId}-${scope.name}-content` }
                                                                    data-componentid={ `${componentId}-${scope.name}
                                                                    -content` }
                                                                    children={ resolveUserAttributeList(scope.claims) }
                                                                />
                                                            </Fragment>
                                                        );
                                                    }
                                                })
                                        }
                                    </SegmentedAccordion>
                                </Grid.Row>
                            </>
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
                                            Use
                                            <Link
                                                external={ false }
                                                onClick={ () => {
                                                    history.push(
                                                        AppConstants.getPaths().get("OIDC_SCOPES")
                                                    );
                                                } }
                                            > OpenID Connect Scopes
                                            </Link>
                                            to add/remove user attribute to a scope. You can add new 
                                            attributes by navigating to 
                                            <Link
                                                external={ false }
                                                onClick={ () => {
                                                    history.push(
                                                        AppConstants.getPaths()
                                                            .get("ATTRIBUTE_MAPPINGS")
                                                            .replace(":type", ClaimManagementConstants.OIDC)
                                                    );
                                                } }
                                            > Attributes.
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
                </>
            )
            : null
    );
};

/**
 * Default props for the application attribute selection component.
 */
AttributeSelectionOIDC.defaultProps = {
    "data-testid": "application-attribute-selection-oidc"
};
