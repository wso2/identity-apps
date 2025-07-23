/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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
import { getDialects } from "@wso2is/admin.claims.v1/api";
import { getSidePanelIcons, getTechnologyLogos } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { attributeConfig } from "@wso2is/admin.extensions.v1";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, ClaimDialect, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    DocumentationLink,
    EmphasizedSegment,
    GenericIcon,
    GridLayout,
    PageLayout,
    Popup,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Header, Icon, Image, List, Placeholder } from "semantic-ui-react";
import { AddDialect } from "../components";
import { ClaimManagementConstants } from "../constants";

/**
 * Props for the Claim Dialects page.
 */
type ClaimDialectsPageInterface = TestableComponentInterface;

/**
 * This displays a list fo claim dialects.
 *
 * @param  props - Props injected to the component.
 *
 * @returns
 */
const ClaimDialectsPage: FunctionComponent<ClaimDialectsPageInterface> = (
    props: ClaimDialectsPageInterface
): ReactElement => {
    const { [ "data-testid" ]: testId } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const hasAttributeDialectsReadPermissions: boolean = useRequiredScopes(
        featureConfig?.attributeDialects?.scopes?.read
    );
    const hasAttributeDialectsUpdatePermissions: boolean = useRequiredScopes(
        featureConfig?.attributeDialects?.scopes?.update
    );
    const hasAttributeVerificationReadPermissions: boolean = useRequiredScopes(
        featureConfig?.attributeVerification?.scopes?.read
    );

    const { filterUserStores, userStoresList, mutateUserStoreList } = useUserStores();

    const { isSubOrganization } = useGetCurrentOrganizationType();
    const [ addEditClaim, setAddEditClaim ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ oidcAttributeMappings, setOidcAttributeMappings ] = useState<ClaimDialect[]>([]);
    const [ scimAttributeMappings, setScimAttributeMappings ] = useState<ClaimDialect[]>([]);
    const [ axschemaAttributeMappings, setAxschemaAttributeMappings ] = useState<ClaimDialect[]>([]);
    const [ eidasAttributeMappings, setEidasAttributeMappings ] = useState<ClaimDialect[]>([]);
    const [ otherAttributeMappings, setOtherAttributeMappings ] = useState<ClaimDialect[]>([]);

    const dispatch: Dispatch = useDispatch();

    const listAllAttributeDialects: boolean = useSelector(
        (state: AppState) => state.config.ui.listAllAttributeDialects
    );
    const userSchemaURI: string = useSelector((state: AppState) => state?.config?.ui?.userSchemaURI);

    const configuredUserStoreCount: number = useMemo(
        () => filterUserStores(false, false, true, true)?.length,
        [ userStoresList ]
    );

    const isAttributeDialectReadOnly: boolean = !hasAttributeDialectsUpdatePermissions
        || (isSubOrganization() && configuredUserStoreCount < 1);

    /**
     * Fetches all the dialects.
     *
     * @param limit - Limit per page.
     * @param offset - Offset value.
     * @param sort - Sort order.
     * @param filter - Filter criteria.
     */
    const getDialect = (limit?: number, offset?: number, sort?: string, filter?: string): void => {
        setIsLoading(true);
        getDialects({
            filter,
            limit,
            offset,
            sort
        })
            .then((response: ClaimDialect[]) => {
                const filteredDialect: ClaimDialect[] = response.filter((claim: ClaimDialect) => {
                    if (!listAllAttributeDialects) {
                        return (
                            claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("LOCAL") &&
                            claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("AXSCHEMA") &&
                            claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("EIDAS_LEGAL") &&
                            claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("EIDAS_NATURAL") &&
                            claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OPENID_NET") &&
                            claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("XML_SOAP")
                        );
                    }

                    // Filter xml soap dialect and local attribute dialect.
                    return claim.id !== "local" &&
                        claim.id !== ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("XML_SOAP") &&
                        claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OPENID_NET");
                });

                const oidc: ClaimDialect[] = [];
                const scim: ClaimDialect[] = [];
                const axschema: ClaimDialect[] = [];
                const eidas: ClaimDialect[] = [];
                const agent: ClaimDialect[] = [];
                const others: ClaimDialect[] = [];

                filteredDialect.forEach((attributeMapping: ClaimDialect) => {
                    if (ClaimManagementConstants.OIDC_MAPPING.includes(attributeMapping.dialectURI)) {
                        oidc.push(attributeMapping);
                    }
                    else if (ClaimManagementConstants.AGENT_SCIM_SCHEMA_MAPPING.includes(attributeMapping.dialectURI)) {
                        agent.push(attributeMapping);
                    } else if (Object.values(ClaimManagementConstants.SCIM_TABS).map(
                        (tab: { name: string; uri: string }) => tab.uri).includes(attributeMapping.dialectURI)) {
                        scim.push(attributeMapping);
                    } else if (ClaimManagementConstants.AXSCHEMA_MAPPING === attributeMapping.dialectURI) {
                        axschema.push(attributeMapping);
                    } else if (Object.values(ClaimManagementConstants.EIDAS_TABS).map(
                        (tab: { name: string; uri: string }) => tab.uri).includes(attributeMapping.dialectURI)) {
                        eidas.push(attributeMapping);
                    } else {
                        if (attributeConfig.showCustomDialectInSCIM) {
                            if (attributeMapping.dialectURI !== userSchemaURI) {
                                others.push(attributeMapping);
                            }
                        } else {
                            others.push(attributeMapping);
                        }
                    }
                });

                setOidcAttributeMappings(oidc);
                setScimAttributeMappings(scim);
                setAxschemaAttributeMappings(axschema);
                // TODO: Remove eiDAS temporally. Need to update it to version 2 and re-enable it.
                setEidasAttributeMappings(null);
                setOtherAttributeMappings(others);
            })
            .catch((error: IdentityAppsApiException) => {
                dispatch(
                    addAlert({
                        description:
                            error?.response?.data?.description ||
                            t(
                                "claims:dialects.notifications.fetchDialects" +
                                ".genericError.description"
                            ),
                        level: AlertLevels.ERROR,
                        message:
                            error?.response?.data?.message ||
                            t(
                                "claims:dialects.notifications.fetchDialects" +
                                ".genericError.message"
                            )
                    })
                );
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        getDialect();
        mutateUserStoreList();
    }, []);

    /**
     * This function returns the loading placeholder for the attribute header.
     */
    const renderHeaderPlaceholder = (): ReactElement => {
        return (
            <Placeholder>
                <Placeholder.Header>
                    <Placeholder.Line />
                </Placeholder.Header>
            </Placeholder>
        );
    };

    /**
     * This function returns the loading placeholder for the attribute segments.
     */
    const renderSegmentPlaceholder = (): ReactElement => {
        return (
            <EmphasizedSegment>
                <Placeholder fluid>
                    <Placeholder.Header image>
                        <Placeholder.Line length="very short"/>
                        <Placeholder.Line />
                    </Placeholder.Header>
                </Placeholder>
            </EmphasizedSegment>
        );
    };

    return (
        <>
            { attributeConfig.addAttributeMapping && addEditClaim && (
                <AddDialect
                    open={ addEditClaim }
                    onClose={ () => {
                        setAddEditClaim(false);
                    } }
                    update={ getDialect }
                    data-testid={ `${ testId }-add-dialect-wizard` }
                />
            ) }
            <PageLayout
                pageTitle="Attributes"
                title={ t("claims:dialects.pageLayout.list.title") }
                description={ (
                    <>
                        { t("claims:dialects.pageLayout.list.description") }
                        <DocumentationLink
                            link={ getLink("manage.userStores.attributeMappings.learnMore") }
                        >
                            { t("common:learnMore") }
                        </DocumentationLink>
                    </>
                ) }
                data-testid={ `${ testId }-page-layout` }
            >
                <GridLayout
                    showTopActionPanel={ false }
                >
                    {
                        hasAttributeDialectsReadPermissions && (
                            isLoading
                                ? (
                                    <>
                                        { renderHeaderPlaceholder() }
                                        <Divider hidden />
                                        { renderSegmentPlaceholder() }
                                    </>
                                ) : (
                                    <>
                                        <Header as="h4">
                                            { t("claims:dialects." +
                                        "sections.manageAttributes.heading") }
                                        </Header>
                                        <Divider hidden />
                                        <EmphasizedSegment
                                            onClick={ () => {
                                                history.push(AppConstants.getPaths().get("LOCAL_CLAIMS"));
                                            } }
                                            className="clickable"
                                            data-testid={ `${ testId }-local-dialect-container` }
                                        >
                                            <List>
                                                <List.Item>
                                                    <Grid>
                                                        <Grid.Row columns={ 2 }>
                                                            <Grid.Column width={ 12 }>
                                                                <GenericIcon
                                                                    verticalAlign="middle"
                                                                    fill="primary"
                                                                    transparent
                                                                    icon={ getSidePanelIcons().claims }
                                                                    spaced="right"
                                                                    size="mini"
                                                                    floated="left"
                                                                />
                                                                <List.Header>
                                                                    { t(
                                                                        "claims:dialects.sections." +
                                                                "manageAttributes.attributes.heading"
                                                                    ) }
                                                                </List.Header>
                                                                <List.Description
                                                                    data-testid={ `${ testId }-local-dialect` }
                                                                >
                                                                    { t(
                                                                        "claims:dialects.sections." +
                                                                "manageAttributes.attributes.description"
                                                                    ) }
                                                                </List.Description>
                                                            </Grid.Column>
                                                            <Grid.Column
                                                                width={ 4 }
                                                                verticalAlign="middle"
                                                                textAlign="right"
                                                                data-testid={ `${ testId }-local-dialect-` +
                                                        "attributes-edit-icon" }
                                                            >
                                                                <Popup
                                                                    content={
                                                                        isAttributeDialectReadOnly
                                                                            ? t("common:view")
                                                                            : t("common:edit")
                                                                    }
                                                                    trigger={
                                                                        isAttributeDialectReadOnly
                                                                            ? <Icon color="grey" name="eye" />
                                                                            : <Icon color="grey" name="pencil" />
                                                                    }
                                                                    inverted
                                                                />
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    </Grid>
                                                </List.Item>
                                            </List>
                                        </EmphasizedSegment>
                                        { !isSubOrganization() &&
                                        featureConfig?.attributeVerification?.enabled &&
                                        hasAttributeVerificationReadPermissions && (
                                            <EmphasizedSegment
                                                onClick={ () => {
                                                    history.push(AppConstants.getPaths()
                                                        .get("CLAIM_VERIFICATION_SETTINGS"));
                                                } }
                                                className="clickable"
                                                data-testid={ `${ testId }-attribute-verification-settings-container` }
                                            >
                                                <List>
                                                    <List.Item>
                                                        <Grid>
                                                            <Grid.Row columns={ 2 }>
                                                                <Grid.Column width={ 12 }>
                                                                    <GenericIcon
                                                                        verticalAlign="middle"
                                                                        fill="primary"
                                                                        transparent
                                                                        icon={ getSidePanelIcons().gears }
                                                                        spaced="right"
                                                                        size="mini"
                                                                        floated="left"
                                                                    />
                                                                    <List.Header>
                                                                        { t(
                                                                            "governanceConnectors:" +
                                                                            "connectorCategories.otherSettings." +
                                                                            "connectors.userClaimUpdate.friendlyName"
                                                                        ) }
                                                                    </List.Header>
                                                                    <List.Description
                                                                        data-testid={
                                                                            `${ testId }-attribute-verification` +
                                                                            "-settings"
                                                                        }
                                                                    >
                                                                        { t(
                                                                            "governanceConnectors:" +
                                                                            "connectorCategories.otherSettings." +
                                                                            "connectors.userClaimUpdate.subTitle"
                                                                        ) }
                                                                    </List.Description>
                                                                </Grid.Column>
                                                                <Grid.Column
                                                                    width={ 4 }
                                                                    verticalAlign="middle"
                                                                    textAlign="right"
                                                                    data-testid={
                                                                        `${ testId }-attribute-verification-` +
                                                                        "settings-edit-icon"
                                                                    }
                                                                >
                                                                    <Popup
                                                                        content={
                                                                            hasAttributeDialectsUpdatePermissions
                                                                                ? t("common:configure")
                                                                                : t("common:view")
                                                                        }
                                                                        trigger={
                                                                            hasAttributeDialectsUpdatePermissions
                                                                                ? <Icon color="grey" name="pencil" />
                                                                                : <Icon color="grey" name="eye" />
                                                                        }
                                                                        inverted
                                                                    />
                                                                </Grid.Column>
                                                            </Grid.Row>
                                                        </Grid>
                                                    </List.Item>
                                                </List>
                                            </EmphasizedSegment>
                                        ) }
                                    </>
                                )
                        )
                    }
                    <Divider hidden />
                    <Divider hidden />
                    { !isSubOrganization() && (
                        <>
                            <Divider />
                            <Divider hidden />
                            <Grid>
                                <Grid.Row columns={ 2 }>
                                    <Grid.Column
                                        width={ 12 }
                                        verticalAlign="middle"
                                    >
                                        { isLoading ? (
                                            renderHeaderPlaceholder()
                                        ) : (
                                            <Header as="h4">
                                                { t(
                                                    "claims:dialects." +
                                                    "sections.manageAttributeMappings.heading"
                                                ) }
                                            </Header>
                                        ) }
                                    </Grid.Column>
                                    <Grid.Column
                                        width={ 4 }
                                        verticalAlign="middle"
                                        textAlign="right"
                                    >
                                        { attributeConfig.addAttributeMapping && (
                                            <Show
                                                when={ featureConfig?.attributeDialects?.scopes?.create }
                                            >
                                                <PrimaryButton
                                                    disabled={ isLoading }
                                                    loading={ isLoading }
                                                    onClick={ () => {
                                                        setAddEditClaim(true);
                                                    } }
                                                    data-testid={ `${ testId }-list-layout-add-button` }
                                                >
                                                    <Icon name="add" />
                                                    {
                                                        t("claims:dialects." +
                                                        "pageLayout.list.primaryAction")
                                                    }
                                                </PrimaryButton>
                                            </Show>
                                        ) }
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Divider hidden />
                            { isLoading ? (
                                renderSegmentPlaceholder()
                            ) : ( oidcAttributeMappings?.length > 0 && (
                                <EmphasizedSegment
                                    className="clickable"
                                    data-testid={ `${ testId }-oidc-dialect-container` }
                                >
                                    <List>
                                        <List.Item
                                            onClick={ () => {
                                                history.push(
                                                    AppConstants.getPaths()
                                                        .get("ATTRIBUTE_MAPPINGS")
                                                        .replace(":type", ClaimManagementConstants.OIDC)
                                                        .replace(
                                                            ":customAttributeMappingID",
                                                            ""
                                                        )
                                                );
                                            } }
                                        >
                                            <Grid>
                                                <Grid.Row columns={ 2 }>
                                                    <Grid.Column width={ 12 }>
                                                        <GenericIcon
                                                            transparent
                                                            verticalAlign="middle"
                                                            rounded
                                                            icon={ getTechnologyLogos().oidc }
                                                            spaced="right"
                                                            size="mini"
                                                            floated="left"
                                                        />
                                                        <List.Header>
                                                            { t(
                                                                "claims:" +
                                                                "dialects.sections." +
                                                                "manageAttributeMappings.oidc.heading"
                                                            ) }
                                                        </List.Header>
                                                        <List.Description
                                                            data-testid={ `${ testId }-local-dialect` }
                                                        >
                                                            { t(
                                                                "claims:attributeMappings." +
                                                                "oidc.description"
                                                            ) }
                                                        </List.Description>
                                                    </Grid.Column>
                                                    <Grid.Column
                                                        width={ 4 }
                                                        verticalAlign="middle"
                                                        textAlign="right"
                                                    >
                                                        <Popup
                                                            content={
                                                                hasAttributeDialectsUpdatePermissions
                                                                    ? t("common:edit")
                                                                    : t("common:view")
                                                            }
                                                            trigger={
                                                                hasAttributeDialectsUpdatePermissions
                                                                    ? <Icon color="grey" name="pencil" />
                                                                    : <Icon color="grey" name="eye" />
                                                            }
                                                            inverted
                                                        />
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </List.Item>
                                    </List>
                                </EmphasizedSegment>
                            )) }
                            { isLoading ? ( renderSegmentPlaceholder()
                            ) : ( scimAttributeMappings?.length > 0 && (
                                <EmphasizedSegment
                                    onClick={ () => {
                                        history.push(
                                            AppConstants.getPaths()
                                                .get("ATTRIBUTE_MAPPINGS")
                                                .replace(":type", ClaimManagementConstants.SCIM)
                                                .replace(
                                                    ":customAttributeMappingID",
                                                    ""
                                                )
                                        );
                                    } }
                                    className="clickable"
                                    data-testid={ `${ testId }-scim-dialect-container` }
                                >
                                    <List>
                                        <List.Item>
                                            <Grid>
                                                <Grid.Row columns={ 2 }>
                                                    <Grid.Column width={ 12 }>
                                                        <GenericIcon
                                                            verticalAlign="middle"
                                                            rounded
                                                            icon={ getTechnologyLogos().scim }
                                                            spaced="right"
                                                            size="mini"
                                                            floated="left"
                                                        />
                                                        <List.Header>
                                                            { t(
                                                                "claims:" +
                                                                "dialects.sections." +
                                                                "manageAttributeMappings.scim.heading"
                                                            ) }
                                                        </List.Header>
                                                        <List.Description
                                                            data-testid={ `${ testId }-local-dialect` }
                                                        >
                                                            { t(
                                                                "claims:attributeMappings" +
                                                        ".scim.description"
                                                            ) }
                                                        </List.Description>
                                                    </Grid.Column>
                                                    <Grid.Column
                                                        width={ 4 }
                                                        verticalAlign="middle"
                                                        textAlign="right"
                                                    >
                                                        <Popup
                                                            content={ (hasAttributeDialectsUpdatePermissions &&
                                                                attributeConfig.isSCIMEditable)
                                                                ? t("common:edit")
                                                                : t("common:view") }
                                                            trigger={ (hasAttributeDialectsUpdatePermissions &&
                                                                attributeConfig.isSCIMEditable)
                                                                ? <Icon color="grey" name="pencil" />
                                                                : <Icon color="grey" name="eye" />
                                                            }
                                                            inverted
                                                        />
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </List.Item>
                                    </List>
                                </EmphasizedSegment>
                            )) }
                            { isLoading ? ( renderSegmentPlaceholder()
                            ) : ( axschemaAttributeMappings?.length > 0 && (
                                <EmphasizedSegment
                                    className="clickable"
                                    data-testid={ `${ testId }-axschema-dialect-container` }
                                >
                                    <List>
                                        <List.Item
                                            onClick={ () => {
                                                history.push(
                                                    AppConstants.getPaths()
                                                        .get("ATTRIBUTE_MAPPINGS")
                                                        .replace(":type", ClaimManagementConstants.AXSCHEMA)
                                                        .replace(
                                                            ":customAttributeMappingID",
                                                            ""
                                                        )
                                                );
                                            } }
                                        >
                                            <Grid>
                                                <Grid.Row columns={ 2 }>
                                                    <Grid.Column width={ 12 }>
                                                        <GenericIcon
                                                            verticalAlign="middle"
                                                            rounded
                                                            icon={ getTechnologyLogos().axschema }
                                                            spaced="right"
                                                            size="mini"
                                                            floated="left"
                                                        />
                                                        <List.Header>
                                                            { t(
                                                                "claims:attributeMappings." +
                                                                "axschema.heading"
                                                            ) }
                                                        </List.Header>
                                                        <List.Description
                                                            data-testid={ `${ testId }-local-dialect` }
                                                        >
                                                            { t(
                                                                "claims:attributeMappings." +
                                                                "axschema.description"
                                                            ) }
                                                        </List.Description>
                                                    </Grid.Column>
                                                    <Grid.Column
                                                        width={ 4 }
                                                        verticalAlign="middle"
                                                        textAlign="right"
                                                    >
                                                        <Popup
                                                            content={
                                                                hasAttributeDialectsUpdatePermissions
                                                                    ? t("common:edit")
                                                                    : t("common:view")
                                                            }
                                                            trigger={
                                                                hasAttributeDialectsUpdatePermissions
                                                                    ? <Icon color="grey" name="pencil" />
                                                                    : <Icon color="grey" name="eye" />
                                                            }
                                                            inverted
                                                        />
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </List.Item>
                                    </List>
                                </EmphasizedSegment>
                            )) }
                            { isLoading ? (
                                renderSegmentPlaceholder()
                            ) : ( eidasAttributeMappings?.length > 0 && (
                                <EmphasizedSegment
                                    className="clickable"
                                    data-testid={ `${ testId }-eidas-dialect-container` }
                                >
                                    <List>
                                        <List.Item
                                            onClick={ () => {
                                                history.push(
                                                    AppConstants.getPaths()
                                                        .get("ATTRIBUTE_MAPPINGS")
                                                        .replace(":type", ClaimManagementConstants.EIDAS)
                                                        .replace(
                                                            ":customAttributeMappingID",
                                                            ""
                                                        )
                                                );
                                            } }
                                        >
                                            <Grid>
                                                <Grid.Row columns={ 2 }>
                                                    <Grid.Column width={ 12 }>
                                                        <GenericIcon
                                                            transparent
                                                            verticalAlign="middle"
                                                            rounded
                                                            icon={ getTechnologyLogos().eidas }
                                                            spaced="right"
                                                            size="mini"
                                                            floated="left"
                                                        />
                                                        <List.Header>
                                                            { t(
                                                                "claims:attributeMappings." +
                                                                "eidas.heading"
                                                            ) }
                                                        </List.Header>
                                                        <List.Description
                                                            data-testid={ `${ testId }-local-dialect` }
                                                        >
                                                            { t(
                                                                "claims:attributeMappings." +
                                                                "eidas.description"
                                                            ) }
                                                        </List.Description>
                                                    </Grid.Column>
                                                    <Grid.Column
                                                        width={ 4 }
                                                        verticalAlign="middle"
                                                        textAlign="right"
                                                    >
                                                        <Popup
                                                            content={
                                                                hasAttributeDialectsUpdatePermissions
                                                                    ? t("common:edit")
                                                                    : t("common:view")
                                                            }
                                                            trigger={
                                                                hasAttributeDialectsUpdatePermissions
                                                                    ? <Icon color="grey" name="pencil" />
                                                                    : <Icon color="grey" name="eye" />
                                                            }
                                                            inverted
                                                        />
                                                    </Grid.Column>
                                                </Grid.Row>
                                            </Grid>
                                        </List.Item>
                                    </List>
                                </EmphasizedSegment>
                            )) }
                            { attributeConfig.showCustomAttributeMapping && (
                                isLoading ? (
                                    renderSegmentPlaceholder()
                                ) : (
                                    otherAttributeMappings?.length > 0 && otherAttributeMappings.map(
                                        (customAttributeMapping: ClaimDialect) => (
                                            <EmphasizedSegment
                                                key={ customAttributeMapping.dialectURI }
                                                onClick={ () => {
                                                    history.push(
                                                        AppConstants.getPaths()
                                                            .get("ATTRIBUTE_MAPPINGS")
                                                            .replace(":type", ClaimManagementConstants.OTHERS)
                                                            .replace(
                                                                ":customAttributeMappingID",
                                                                customAttributeMapping.id
                                                            )
                                                    );
                                                } }
                                                className="clickable"
                                                data-testid={ `${ testId }-other-dialect-container` }
                                            >
                                                <List>
                                                    <List.Item>
                                                        <Grid>
                                                            <Grid.Row columns={ 2 }>
                                                                <Grid.Column width={ 12 }>
                                                                    <Image
                                                                        floated="left"
                                                                        verticalAlign="middle"
                                                                        rounded
                                                                        centered
                                                                        size="mini"
                                                                    >
                                                                        <AnimatedAvatar />
                                                                        <span className="claims-letter">
                                                                            {
                                                                                customAttributeMapping.dialectURI
                                                                                    .charAt(0)
                                                                                    .toUpperCase()
                                                                            }
                                                                        </span>
                                                                    </Image>
                                                                    <List.Header>
                                                                        { customAttributeMapping.dialectURI }
                                                                    </List.Header>
                                                                    <List.Description
                                                                        data-testid={ `${ testId }-local-dialect` }
                                                                    >
                                                                        { t(
                                                                            "claims:" +
                                                                            "attributeMappings." +
                                                                            "custom.description"
                                                                        ) }
                                                                    </List.Description>
                                                                </Grid.Column>
                                                                <Grid.Column
                                                                    width={ 4 }
                                                                    verticalAlign="middle"
                                                                    textAlign="right"
                                                                >
                                                                    <Popup
                                                                        content={ hasAttributeDialectsUpdatePermissions
                                                                            ? t("common:edit")
                                                                            : t("common:view")
                                                                        }
                                                                        trigger={ (
                                                                            <Icon
                                                                                color="grey"
                                                                                name={
                                                                                    // Added as this cannot be avoided.
                                                                                    // eslint-disable-next-line max-len
                                                                                    hasAttributeDialectsUpdatePermissions
                                                                                        ? "pencil"
                                                                                        : "eye"
                                                                                }
                                                                            />
                                                                        ) }
                                                                        inverted
                                                                    />
                                                                </Grid.Column>
                                                            </Grid.Row>
                                                        </Grid>
                                                    </List.Item>
                                                </List>
                                            </EmphasizedSegment>
                                        )
                                    )
                                ))
                            }
                        </>
                    ) }
                </GridLayout>
            </PageLayout>
        </>
    );
};

/**
 * Default props for the component.
 */
ClaimDialectsPage.defaultProps = {
    "data-testid": "attribute-dialects"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ClaimDialectsPage;
