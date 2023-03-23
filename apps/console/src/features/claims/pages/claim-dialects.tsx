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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, ClaimDialect, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    EmphasizedSegment,
    GenericIcon,
    GridLayout,
    PageLayout,
    Popup,
    PrimaryButton
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Header, Icon, Image, List, Placeholder } from "semantic-ui-react";
import { attributeConfig } from "../../../extensions";
import { getDialects } from "../../claims/api";
import {
    AppConstants,
    AppState,
    FeatureConfigInterface,
    getSidePanelIcons,
    getTechnologyLogos,
    history
} from "../../core";
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

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ addEditClaim, setAddEditClaim ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ oidcAttributeMappings, setOidcAttributeMappings ] = useState<ClaimDialect[]>([]);
    const [ scimAttributeMappings, setScimAttributeMappings ] = useState<ClaimDialect[]>([]);
    const [ otherAttributeMappings, setOtherAttributeMappings ] = useState<ClaimDialect[]>([]);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const dispatch: Dispatch = useDispatch();

    const listAllAttributeDialects: boolean = useSelector(
        (state: AppState) => state.config.ui.listAllAttributeDialects
    );

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

                    return claim.id !== "local";
                });

                const oidc: ClaimDialect[] = [];
                const scim: ClaimDialect[] = [];
                const others: ClaimDialect[] = [];

                filteredDialect.forEach((attributeMapping: ClaimDialect) => {
                    if (ClaimManagementConstants.OIDC_MAPPING.includes(attributeMapping.dialectURI)) {
                        oidc.push(attributeMapping);
                    } else if (Object.values(ClaimManagementConstants.SCIM_TABS).map(
                        (tab: { name: string; uri: string }) => tab.uri).includes(attributeMapping.dialectURI)) {
                        scim.push(attributeMapping);
                    } else {
                        if (attributeConfig.showCustomDialectInSCIM) {
                            if (attributeMapping.dialectURI !== attributeConfig.localAttributes.customDialectURI) {
                                others.push(attributeMapping);
                            }
                        } else {
                            others.push(attributeMapping);
                        }
                    }
                });

                setOidcAttributeMappings(oidc);
                setScimAttributeMappings(scim);
                setOtherAttributeMappings(others);
            })
            .catch((error: IdentityAppsApiException) => {
                dispatch(
                    addAlert({
                        description:
                            error?.response?.data?.description ||
                            t(
                                "console:manage.features.claims.dialects.notifications.fetchDialects" +
                                ".genericError.description"
                            ),
                        level: AlertLevels.ERROR,
                        message:
                            error?.response?.data?.message ||
                            t(
                                "console:manage.features.claims.dialects.notifications.fetchDialects" +
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
                action={
                    attributeConfig.addAttributeMapping && (
                        <Show when={ AccessControlConstants.ATTRIBUTE_WRITE }>
                            <PrimaryButton
                                disabled={ isLoading }
                                loading={ isLoading }
                                onClick={ () => {
                                    setAddEditClaim(true);
                                } }
                                data-testid={ `${ testId }-list-layout-add-button` }
                            >
                                <Icon name="add" />
                                { t("console:manage.features.claims.dialects.pageLayout.list.primaryAction") }
                            </PrimaryButton>
                        </Show>
                    ) }
                title={ t("console:manage.features.claims.dialects.pageLayout.list.title") }
                description={ t("console:manage.features.claims.dialects.pageLayout.list.description") }
                data-testid={ `${ testId }-page-layout` }
            >
                <GridLayout
                    showTopActionPanel={ false }
                >
                    { 
                        hasRequiredScopes(
                            featureConfig?.attributeDialects,
                            featureConfig?.attributeDialects?.scopes?.read,
                            allowedScopes
                        ) && (
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
                                            { t("console:manage.features.claims.dialects." +
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
                                                                    rounded
                                                                    icon={ getSidePanelIcons().claims }
                                                                    spaced="right"
                                                                    size="mini"
                                                                    floated="left"
                                                                />
                                                                <List.Header>
                                                                    { t(
                                                                        "console:manage.features." +
                                                                "claims.dialects.sections." +
                                                                "manageAttributes.attributes.heading"
                                                                    ) }
                                                                </List.Header>
                                                                <List.Description
                                                                    data-testid={ `${ testId }-local-dialect` }
                                                                >
                                                                    { t(
                                                                        "console:manage.features." +
                                                                "claims.dialects.sections." +
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
                                                                        hasRequiredScopes(
                                                                            featureConfig?.attributeDialects,
                                                                            featureConfig?.attributeDialects?.
                                                                                scopes?.create,
                                                                            allowedScopes
                                                                        ) ?
                                                                            t("common:edit") :
                                                                            t("common:view")
                                                                    }
                                                                    trigger={
                                                                        hasRequiredScopes(
                                                                            featureConfig?.attributeDialects,
                                                                            featureConfig?.attributeDialects?.
                                                                                scopes?.create,
                                                                            allowedScopes
                                                                        ) ?
                                                                            <Icon color="grey" name="pencil" /> :
                                                                            <Icon color="grey" name="eye" />
                                                                    }
                                                                    inverted
                                                                />
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    </Grid>
                                                </List.Item>
                                            </List>
                                        </EmphasizedSegment>
                                    </>
                                )
                        ) 
                    }
                    <Divider hidden />
                    <Divider hidden />
                    <Divider />
                    <Divider hidden />
                    { 
                        isLoading 
                            ? (
                                renderHeaderPlaceholder()
                            ) : (
                                <Header as="h4">
                                    { t(
                                        "console:manage.features.claims.dialects." + 
                                        "sections.manageAttributeMappings.heading"
                                    ) }
                                </Header>
                            )
                    }
                    <Divider hidden />
                    {
                        isLoading 
                            ? (
                                renderSegmentPlaceholder()
                            ) : (
                                oidcAttributeMappings?.length > 0 && (
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
                                                                    "console:manage.features.claims." + 
                                                                    "dialects.sections." +
                                                                    "manageAttributeMappings.oidc.heading"
                                                                ) }
                                                            </List.Header>
                                                            <List.Description
                                                                data-testid={ `${ testId }-local-dialect` }
                                                            >
                                                                { t(
                                                                    "console:manage.features." + 
                                                                    "claims.attributeMappings." +
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
                                                                    hasRequiredScopes(
                                                                        featureConfig?.attributeDialects,
                                                                        featureConfig?.
                                                                            attributeDialects?.scopes?.create,
                                                                        allowedScopes
                                                                    ) ?
                                                                        t("common:edit") :
                                                                        t("common:view")
                                                                }
                                                                trigger={
                                                                    hasRequiredScopes(
                                                                        featureConfig?.attributeDialects,
                                                                        featureConfig?.
                                                                            attributeDialects?.scopes?.create,
                                                                        allowedScopes
                                                                    ) ?
                                                                        <Icon color="grey" name="pencil" /> :
                                                                        <Icon color="grey" name="eye" />
                                                                }
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
                    }
                    {
                        isLoading 
                            ? (
                                renderSegmentPlaceholder()
                            ) : (
                                scimAttributeMappings?.length > 0 && (
                                    <EmphasizedSegment
                                        onClick={ () => {
                                            history.push(
                                                AppConstants.getPaths()
                                                    .get("ATTRIBUTE_MAPPINGS")
                                                    .replace(":type", ClaimManagementConstants.SCIM)
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
                                                                    "console:manage.features.claims." + 
                                                                    "dialects.sections." + 
                                                                    "manageAttributeMappings.scim.heading"
                                                                ) }
                                                            </List.Header>
                                                            <List.Description 
                                                                data-testid={ `${ testId }-local-dialect` }
                                                            >
                                                                { t(
                                                                    "console:manage.features.claims.attributeMappings" +
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
                                                                content={ attributeConfig.isSCIMEditable
                                                                    ? t("common:edit")
                                                                    : t("common:view") }
                                                                trigger={
                                                                    (<Icon
                                                                        color="grey"
                                                                        name={
                                                                            attributeConfig.isSCIMEditable
                                                                                ? "pencil"
                                                                                : "eye"
                                                                        } />)
                                                                }
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
                    }
                    {
                        !attributeConfig.showCustomDialectInSCIM && (
                            isLoading 
                                ? (
                                    renderSegmentPlaceholder()
                                ) : (
                                    otherAttributeMappings?.length > 0 && (
                                        <EmphasizedSegment
                                            onClick={ () => {
                                                history.push(
                                                    AppConstants.getPaths()
                                                        .get("ATTRIBUTE_MAPPINGS")
                                                        .replace(":type", ClaimManagementConstants.OTHERS)
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
                                                                    <span className="claims-letter">C</span>
                                                                </Image>
                                                                <List.Header>
                                                                    { t(
                                                                        "console:manage.features.claims.dialects." + 
                                                                        "sections.manageAttributeMappings." + 
                                                                        "custom.heading"
                                                                    ) }
                                                                </List.Header>
                                                                <List.Description 
                                                                    data-testid={ `${ testId }-local-dialect` }
                                                                >
                                                                    { t(
                                                                        "console:manage.features.claims." + 
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
                                                                    content={ hasRequiredScopes(
                                                                        featureConfig?.attributeDialects,
                                                                        featureConfig?.
                                                                            attributeDialects?.scopes?.create,
                                                                        allowedScopes
                                                                    )
                                                                        ? t("common:edit")
                                                                        : t("common:view") }
                                                                    trigger={
                                                                        (<Icon
                                                                            color="grey"
                                                                            name={
                                                                                hasRequiredScopes(
                                                                                    featureConfig?.attributeDialects,
                                                                                    featureConfig?.attributeDialects?.
                                                                                        scopes?.create,
                                                                                    allowedScopes
                                                                                )
                                                                                    ? "pencil"
                                                                                    : "eye"
                                                                            } />)
                                                                    }
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
                        )
                    }
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
