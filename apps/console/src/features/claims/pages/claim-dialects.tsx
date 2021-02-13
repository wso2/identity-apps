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

import { getDialects } from "@wso2is/core/api";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, ClaimDialect, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AnimatedAvatar, EmphasizedSegment, PageLayout, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Divider, Grid, Header, Icon, Image, List, Popup } from "semantic-ui-react";
import { AppConstants, AppState, FeatureConfigInterface, history } from "../../core";
import { AddDialect } from "../components";
import { ClaimManagementConstants } from "../constants";

/**
 * Props for the Claim Dialects page.
 */
type ClaimDialectsPageInterface = TestableComponentInterface;

/**
 * This displays a list fo claim dialects.
 *
 * @param {ClaimDialectsPageInterface} props - Props injected to the component.
 *
 * @return {ReactElement}
 */
const ClaimDialectsPage: FunctionComponent<ClaimDialectsPageInterface> = (
    props: ClaimDialectsPageInterface
): ReactElement => {
    const { [ "data-testid" ]: testId } = props;

    const { t } = useTranslation();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ addEditClaim, setAddEditClaim ] = useState(false);
    const [ localURI, setLocalURI ] = useState("");
    const [ isLoading, setIsLoading ] = useState(true);
    const [ oidcAttributeMappings, setOidcAttributeMappings ] = useState<ClaimDialect[]>([]);
    const [ scimAttributeMappings, setScimAttributeMappings ] = useState<ClaimDialect[]>([]);
    const [ otherAttributeMappings, setOtherAttributeMappings ] = useState<ClaimDialect[]>([]);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);
    const dispatch = useDispatch();

    const listAllAttributeDialects: boolean = useSelector(
        (state: AppState) => state.config.ui.listAllAttributeDialects
    );

    /**
     * Fetches all the dialects.
     *
     * @param {number} limit.
     * @param {number} offset.
     * @param {string} sort.
     * @param {string} filter.
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
                    if (claim.id === "local") {
                        setLocalURI(claim.dialectURI);
                    }

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
                    } else if (ClaimManagementConstants.SCIM_MAPPING.includes(attributeMapping.dialectURI)) {
                        scim.push(attributeMapping);
                    } else {
                        others.push(attributeMapping);
                    }
                });

                setOidcAttributeMappings(oidc);
                setScimAttributeMappings(scim);
                setOtherAttributeMappings(others);
            })
            .catch((error) => {
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

    return (
        <>
            { addEditClaim && (
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
                action={
                    <PrimaryButton
                        onClick={ () => {
                            setAddEditClaim(true);
                        } }
                        data-testid={ `${ testId }-list-layout-add-button` }
                    >
                        <Icon name="add" />
                        { t("console:manage.features.claims.dialects.pageLayout.list.primaryAction") }
                    </PrimaryButton>
                }
                isLoading={ isLoading }
                title={ t("console:manage.features.claims.dialects.pageLayout.list.title") }
                description={ t("console:manage.features.claims.dialects.pageLayout.list.description") }
                data-testid={ `${ testId }-page-layout` }
            >
                { hasRequiredScopes(
                    featureConfig?.attributeDialects,
                    featureConfig?.attributeDialects?.scopes?.read,
                    allowedScopes
                ) && (
                        <>
                            <Header as="h4">
                                Manage Attributes
                            <div className="sub header ellipsis">View and manage attributes native to Asgardeo.</div>
                            </Header>
                            <EmphasizedSegment data-testid={ `${ testId }-local-dialect-container` }>
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
                                                        <AnimatedAvatar primary />
                                                        <span className="claims-letter">L</span>
                                                    </Image>
                                                    <List.Header>
                                                        { t("console:manage.features.claims.dialects.localDialect") }
                                                    </List.Header>
                                                    <List.Description data-testid={ `${ testId }-local-dialect` }>
                                                        { localURI }
                                                    </List.Description>
                                                </Grid.Column>
                                                <Grid.Column width={ 4 } verticalAlign="middle" textAlign="right">
                                                    <Popup
                                                        inverted
                                                        trigger={
                                                            <span
                                                                className="local-dialect-direct"
                                                                onClick={ () => {
                                                                    history.push(
                                                                        AppConstants.getPaths().get("LOCAL_CLAIMS")
                                                                    );
                                                                } }
                                                                data-testid={ `${ testId }-local-dialect-view-button` }
                                                            >
                                                                <Icon name="arrow right" />
                                                            </span>
                                                        }
                                                        position="top center"
                                                        content={ t(
                                                            "console:manage.features.claims.dialects" +
                                                            ".pageLayout.list.view"
                                                        ) }
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </List.Item>
                                </List>
                            </EmphasizedSegment>
                        </>
                    ) }
                <Divider hidden />
                <Divider />
                <Header as="h4">
                    Manage Attribute Mappings
                    <div className="sub header ellipsis">
                        View and manage how attributes in Asgardeo are mapped and transformed when interacting with APIs
                        or your applications.
                    </div>
                </Header>
                { oidcAttributeMappings.length > 0 && (
                    <EmphasizedSegment data-testid={ `${ testId }-oidc-dialect-container` }>
                        <List>
                            <List.Item>
                                <Grid>
                                    <Grid.Row columns={ 2 }>
                                        <Grid.Column width={ 12 }>
                                            <Image floated="left" verticalAlign="middle" rounded centered size="mini">
                                                <AnimatedAvatar primary />
                                                <span className="claims-letter">L</span>
                                            </Image>
                                            <List.Header>OpenID Connect</List.Header>
                                            <List.Description data-testid={ `${ testId }-local-dialect` }>
                                                Communicate information about the user for applications that uses OpenID
                                                Connect to authenticate.
                                            </List.Description>
                                        </Grid.Column>
                                        <Grid.Column width={ 4 } verticalAlign="middle" textAlign="right">
                                            <Popup
                                                inverted
                                                trigger={
                                                    <span
                                                        className="local-dialect-direct"
                                                        onClick={ () => {
                                                            history.push(
                                                                AppConstants.getPaths()
                                                                    .get("ATTRIBUTE_MAPPINGS")
                                                                    .replace(":type", ClaimManagementConstants.OIDC)
                                                            );
                                                        } }
                                                        data-testid={ `${ testId }-oidc-dialect-view-button` }
                                                    >
                                                        <Icon name="arrow right" />
                                                    </span>
                                                }
                                                position="top center"
                                                content="View OpenID Connect Attribute Mappings"
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </List.Item>
                        </List>
                    </EmphasizedSegment>
                ) }
                { scimAttributeMappings.length > 0 && (
                    <EmphasizedSegment data-testid={ `${ testId }-scim-dialect-container` }>
                        <List>
                            <List.Item>
                                <Grid>
                                    <Grid.Row columns={ 2 }>
                                        <Grid.Column width={ 12 }>
                                            <Image floated="left" verticalAlign="middle" rounded centered size="mini">
                                                <AnimatedAvatar primary />
                                                <span className="claims-letter">L</span>
                                            </Image>
                                            <List.Header>System for Cross-Domain Identity Management </List.Header>
                                            <List.Description data-testid={ `${ testId }-local-dialect` }>
                                                Communicate information about the user via the API compliance with SCIM2
                                                standards.
                                            </List.Description>
                                        </Grid.Column>
                                        <Grid.Column width={ 4 } verticalAlign="middle" textAlign="right">
                                            <Popup
                                                inverted
                                                trigger={
                                                    <span
                                                        className="local-dialect-direct"
                                                        onClick={ () => {
                                                            history.push(
                                                                AppConstants.getPaths()
                                                                    .get("ATTRIBUTE_MAPPINGS")
                                                                    .replace(":type", ClaimManagementConstants.SCIM)
                                                            );
                                                        } }
                                                        data-testid={ `${ testId }-oidc-dialect-view-button` }
                                                    >
                                                        <Icon name="arrow right" />
                                                    </span>
                                                }
                                                position="top center"
                                                content="View SCIM Connect Attribute Mappings"
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </List.Item>
                        </List>
                    </EmphasizedSegment>
                ) }
                { otherAttributeMappings.length > 0 && (
                    <EmphasizedSegment data-testid={ `${ testId }-other-dialect-container` }>
                        <List>
                            <List.Item>
                                <Grid>
                                    <Grid.Row columns={ 2 }>
                                        <Grid.Column width={ 12 }>
                                            <Image floated="left" verticalAlign="middle" rounded centered size="mini">
                                                <AnimatedAvatar primary />
                                                <span className="claims-letter">L</span>
                                            </Image>
                                            <List.Header>System for Cross-Domain Identity Management </List.Header>
                                            <List.Description data-testid={ `${ testId }-local-dialect` }>
                                                Communicate information about the user via other mappings.
                                            </List.Description>
                                        </Grid.Column>
                                        <Grid.Column width={ 4 } verticalAlign="middle" textAlign="right">
                                            <Popup
                                                inverted
                                                trigger={
                                                    <span
                                                        className="local-dialect-direct"
                                                        onClick={ () => {
                                                            history.push(
                                                                AppConstants.getPaths()
                                                                    .get("ATTRIBUTE_MAPPINGS")
                                                                    .replace(":type", ClaimManagementConstants.OTHERS)
                                                            );
                                                            history.push(AppConstants.getPaths().get("LOCAL_CLAIMS"));
                                                        } }
                                                        data-testid={ `${ testId }-oidc-dialect-view-button` }
                                                    >
                                                        <Icon name="arrow right" />
                                                    </span>
                                                }
                                                position="top center"
                                                content="View Other Attribute Mappings"
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </List.Item>
                        </List>
                    </EmphasizedSegment>
                ) }
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
