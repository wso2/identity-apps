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
    AnimatedAvatar,
    AppAvatar,
    Code,
    DocumentationLink,
    Heading,
    Hint,
    Link,
    useDocumentation
} from "@wso2is/react-components";
import { OIDCScopesClaimsListInterface } from "apps/console/src/features/oidc-scopes";
import sortBy from "lodash-es/sortBy";
import union from "lodash-es/union";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Accordion, Checkbox, Grid, Header, Icon, Input, Popup, Segment, Table } from "semantic-ui-react";
import { AttributeListItemOIDC } from "./attribute-list-item-oidc";
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
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const [ availableExternalClaims, setAvailableExternalClaims ] = useState<ExtendedExternalClaimInterface[]>([]);
    
    const [
        filterSelectedExternalClaims,
        setFilterSelectedExternalClaims
    ] = useState<ExtendedExternalClaimInterface[]>([]);

    const [
        unfilteredExternalClaimsGroupedByScopes, 
        setUnfilteredExternalClaimsGroupedByScopes 
    ] = useState<OIDCScopesClaimsListInterface[]>(externalClaimsGroupedByScopes);

    const [ panels, setPanels ] = useState([]);

    const [ initializationFinished, setInitializationFinished ] = useState(false);

    const initValue = useRef(false);

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
            //  Stop loader UI for OIDC and SP applications.
            if ( availableExternalClaims.length > 0 || selectedExternalClaims.length > 0) {
                setUserAttributesLoading(false);
            }
        }
    }, [ availableExternalClaims, claimConfigurations, initializationFinished ]);

    const updateMandatory = (claimURI: string, mandatory: boolean) => {
        const tempFilterSelectedExternalScopeClaims = [ ...unfilteredExternalClaimsGroupedByScopes ];

        tempFilterSelectedExternalScopeClaims.forEach((scope) => {
            scope.claims.forEach((claim) => {
                if (claim.claimURI == claimURI) {
                    claim.mandatory = mandatory;
                }
            });
        });
        sortBy(tempFilterSelectedExternalScopeClaims, "name");
        setExternalClaimsGroupedByScopes(tempFilterSelectedExternalScopeClaims);
        setUnfilteredExternalClaimsGroupedByScopes(tempFilterSelectedExternalScopeClaims);
    };

    const updateRequested = (claimURI: string, requested: boolean) => {
        const tempFilterSelectedExternalScopeClaims = [ ...unfilteredExternalClaimsGroupedByScopes ];

        tempFilterSelectedExternalScopeClaims.forEach((scope) => {
            scope.claims.forEach((claim) => {
                if (claim.claimURI == claimURI) {
                    claim.requested = requested;

                    if (requested) {
                        scope.selected = true;
                    }
                }
            });
        });
        sortBy(tempFilterSelectedExternalScopeClaims, "name");
        setExternalClaimsGroupedByScopes(tempFilterSelectedExternalScopeClaims);
        setUnfilteredExternalClaimsGroupedByScopes(tempFilterSelectedExternalScopeClaims);
    };

    const handleSelectedScopeCheckChange = (event, value) => {
        event.stopPropagation();
        const tempExternalClaimsGroupedByScopes = [ ...unfilteredExternalClaimsGroupedByScopes ];

        tempExternalClaimsGroupedByScopes.find((scope) => {
            if (scope.name==value.value) {
                scope.selected = value.checked;

                return scope;
            }
        })?.claims.map((claim) => {
            claim.requested = value.checked;
            if (!value.checked) {
                claim.mandatory = value.checked;
            }
        });
        
        setExternalClaimsGroupedByScopes(tempExternalClaimsGroupedByScopes);
        setUnfilteredExternalClaimsGroupedByScopes(tempExternalClaimsGroupedByScopes);
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

    // search operation for claims
    const searchFilter = (changeValue) => {
        const scopeNameFiltered = unfilteredExternalClaimsGroupedByScopes.filter((item) => 
            item.name.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);
        const scopeDisplayNameFiltered = unfilteredExternalClaimsGroupedByScopes.filter((item) => 
            item.displayName.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);
        const scopeDescriptionFiltered = unfilteredExternalClaimsGroupedByScopes.filter((item) => 
            item.description.toLowerCase().indexOf(changeValue.toLowerCase()) !== -1);

        setExternalClaimsGroupedByScopes(sortBy(
            union(scopeNameFiltered, scopeDisplayNameFiltered, scopeDescriptionFiltered),
            "displayName"
        ));
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
            setExternalClaimsGroupedByScopes(unfilteredExternalClaimsGroupedByScopes);
        }
    };

    const setInitialValues = () => {
        // set local dialect values.
        setUserAttributesLoading(true);
        
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

    // update accordion panel
    useEffect(() => {
        if (externalClaimsGroupedByScopes.length != 0) {
            const tempPanels = [];

            externalClaimsGroupedByScopes.map((scope) => {
                if (scope.name!="openid") {
                    tempPanels.push(
                        {
                            content: {
                                content: (
                                    resolveUserAttributeList(scope.claims)
                                )
                            },
                            key: scope.name,
                            title: {
                                children: (
                                    resolveScopeListItem(scope)
                                )
                            }
                        }
                    );
                }
            });

            setPanels(tempPanels);
        }
    }, [ externalClaimsGroupedByScopes ]);

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

    // Scope list item component
    const resolveScopeListItem = (scope: OIDCScopesClaimsListInterface) => {
        return (
            <Table.Row 
                className="data-table-row">
                <Table.Cell className="data-table-cell ten wide">
                    <Header
                        image
                        as="h6"
                        className="header-with-icon"
                        data-testid={ `${ testId }-item-heading` }
                    >
                        <AppAvatar
                            image={ (
                                <AnimatedAvatar
                                    name={ scope.displayName }
                                    size="mini"
                                    data-testid={ `${ testId }-item-image-inner` }
                                />
                            ) }
                            size="mini"
                            spaced="right"
                            data-testid={ `${ testId }-item-image` }
                        />
                        <Header.Content>
                            { scope.displayName }
                            <Header.Subheader>
                                <Code withBackground>{ scope.name }</Code>
                                { " " + (scope.description ?? "") }
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell 
                    className="data-table-cell center aligned four wide">
                    <Popup
                        trigger={
                            (
                                <Checkbox
                                    checked={ scope.selected }
                                    onClick={ handleSelectedScopeCheckChange }
                                    value={  scope.name }
                                    disabled={ readOnly }
                                    readOnly={ readOnly }
                                />
                            )
                        }
                        position="top right"
                        content={
                            scope.selected ?
                                t("console:develop.features.applications.edit.sections.attributes.selection" +
                                    ".mappingTable.listItem.actions.removeScopeRequested")
                                : t("console:develop.features.applications.edit.sections.attributes.selection" +
                                ".mappingTable.listItem.actions.makeScopeRequested")
                        }
                        inverted
                        disabled={ readOnly }
                    />
                </Table.Cell>
                <Table.Cell 
                    className="data-table-cell center aligned four wide">
                    <Icon name="caret down" className="grey"/>
                </Table.Cell>
            </Table.Row>
        );
    };

    // add selected and unselected attributes under a scope here.
    const resolveUserAttributeList = (scopeGroupedClaims: ExtendedExternalClaimInterface[]): ReactElement => {
        return (
            <Segment className="user-role-edit-header-segment attributes">
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
                            <Table.HeaderCell textAlign="center" width="4">
                                <strong>
                                    {
                                        t("console:develop.features" +
                                        ".applications.edit.sections" +
                                        ".attributes.selection" +
                                        ".mappingTable.columns" +
                                        ".requested")
                                    }
                                </strong>

                            </Table.HeaderCell>
                            <Table.HeaderCell  width="4">
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
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <>
                            {
                                scopeGroupedClaims.map((claim) => {
                                    return (
                                        <AttributeListItemOIDC
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
                                            selectRequested={ updateRequested }
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
            </Segment>
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
                                                <Table.Cell textAlign="right"></Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table>
                                </Grid.Row>
                                <Grid.Row>
                                    <Table className="data-table selectable">
                                        <Accordion
                                            className="data-table-body"
                                            data-testid={ `${ testId }-oidc-scope-row` }
                                            as={  Table.Body }
                                            panels={ panels }/>
                                    </Table>
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
                </>
            )
            : null
    );
};

/**
 * Default props for the application attribute selection component.
 */
AttributeSelectionOIDC.defaultProps = {
    "data-testid": "application-attribute-selection"
};
