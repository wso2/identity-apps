/**
 * Copyright (c) 2021-2025, WSO2 LLC. (https://www.wso2.com).
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

import { FeatureAccessConfigInterface } from "@wso2is/access-control";
import { getAllExternalClaims, getDialects } from "@wso2is/admin.claims.v1/api";
import { getTechnologyLogos } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";

import { SCIMConfigs, attributeConfig } from "@wso2is/admin.extensions.v1";
import { AGENT_USERSTORE_ID } from "@wso2is/admin.userstores.v1/constants";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { UserStoreListItem } from "@wso2is/admin.userstores.v1/models";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, ClaimDialect, ExternalClaim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    DocumentationLink,
    GenericIcon,
    PageLayout,
    ResourceTab,
    useDocumentation
} from "@wso2is/react-components";
import Axios from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteChildrenProps } from "react-router";
import { Dispatch } from "redux";
import { Image, StrictTabProps } from "semantic-ui-react";
import ExternalDialectEditPage from "./external-dialect-edit";
import { } from "../components";
import { ClaimManagementConstants } from "../constants";
import { resolveType } from "../utils";

/**
 * Props for the Edit Attribute Mappings page.
 */
type EditAttributeMappingsPropsInterface = TestableComponentInterface;

/**
 * Path parameters that are passed into this components path.
 */
interface AttributeMappingsPathParams {
    type: string;
    customAttributeMappingID?: string;
}

export const AttributeMappings: FunctionComponent<RouteChildrenProps<AttributeMappingsPathParams> &
    EditAttributeMappingsPropsInterface> = (
        props: RouteChildrenProps<AttributeMappingsPathParams> & EditAttributeMappingsPropsInterface
    ): ReactElement => {
        const {
            [ "data-testid" ]: testId,
            match: {
                params: { type, customAttributeMappingID }
            }
        } = props;

        const dispatch: Dispatch = useDispatch();
        const listAllAttributeDialects: boolean = useSelector(
            (state: AppState) => state.config.ui.listAllAttributeDialects
        );
        const userSchemaURI: string = useSelector((state: AppState) => state?.config?.ui?.userSchemaURI);

        const { t } = useTranslation();
        const { getLink } = useDocumentation();

        const [ isLoading, setIsLoading ] = useState(true);
        const [ dialects, setDialects ] = useState<ClaimDialect[]>(null);
        const [ mappedLocalclaims, setMappedLocalClaims ] = useState<string[]>([]);
        const [ triggerFetchMappedClaims, setTriggerFetchMappedClaims ] = useState<boolean>(true);
        const [ triigerFetchDialects, setTriggerFetchDialects ] = useState<boolean>(true);

        const {
            userStoresList
        } = useUserStores();

        const agentFeatureConfig: FeatureAccessConfigInterface =
            useSelector((state: AppState) => state?.config?.ui?.features?.agents);
        const isAgentManagementEnabledForOrg: boolean = useMemo((): boolean => {
            return userStoresList?.some((userStore: UserStoreListItem) => userStore.id === AGENT_USERSTORE_ID);
        }, [ userStoresList ]);

        useEffect(() => {
            getDialect();
            setTriggerFetchDialects(false);
        }, [ triigerFetchDialects ]);

        useEffect(() => {
            if ( dialects && dialects.length > 0 && triggerFetchMappedClaims ) {
                generateMappedLocalClaimList(dialects.map((dialect: ClaimDialect) => dialect.id));
                setTriggerFetchMappedClaims(false);
            }
        }, [ dialects, triggerFetchMappedClaims ]);

        /**
         * This will fetch external claims for each dialect
         * and create a list of already mapped local claims
         * for filteration purpose.
         *
         * TODO : This is not the ideal way to fetch and
         *        identify the already mapped claims. Need
         *        API support for this.
         */
        const generateMappedLocalClaimList = (dialectIdList: string[],
            limit?: number,
            offset?: number,
            sort?: string,
            filter?: string) => {

            const mappedLocalClaimPromises: Promise<ExternalClaim[]>[] = [];

            dialectIdList.forEach((id: string) => {
                mappedLocalClaimPromises.push(
                    getAllExternalClaims(id, {
                        filter,
                        limit,
                        offset,
                        sort
                    })
                );
            });

            Axios.all(mappedLocalClaimPromises).then((response: ExternalClaim[][]) => {
                const mappedClaims: string[] = [];

                response.forEach((claim: ExternalClaim[]) => {
                    mappedClaims.push(...claim.map((claim: ExternalClaim) => claim.mappedLocalClaimURI));
                });
                setMappedLocalClaims(mappedClaims);
            }).catch((error: IdentityAppsApiException) => {
                dispatch(
                    addAlert({
                        description:
                            error[0]?.response?.data?.description ||
                            t(
                                "claims:dialects.notifications." +
                                "fetchExternalClaims.genericError.description",
                                { type: resolveType(type) }
                            ),
                        level: AlertLevels.ERROR,
                        message:
                            error[0]?.response?.data?.message ||
                            t(
                                "claims:dialects.notifications." +
                                "fetchExternalClaims.genericError.message"
                            )
                    })
                );
            }).finally(() => setIsLoading(false));
        };

        /**
         * Resolves page heading based on the `type`.
         *
         * @returns The page heading.
         */
        const resolvePageHeading = (): string => {
            switch (type) {
                case ClaimManagementConstants.AGENT:
                    return t(
                        "claims:attributeMappings.agent.heading"
                    );
                case ClaimManagementConstants.OIDC:
                    return t(
                        "claims:attributeMappings.oidc.heading"
                    );
                case ClaimManagementConstants.SCIM:
                    return t(
                        "claims:attributeMappings.scim.heading"
                    );
                case ClaimManagementConstants.AXSCHEMA:
                    return t(
                        "claims:attributeMappings.axschema.heading"
                    );
                case ClaimManagementConstants.EIDAS:
                    return t(
                        "claims:attributeMappings.eidas.heading"
                    );
                case ClaimManagementConstants.OTHERS:
                    return dialects && dialects[0]?.dialectURI;
                default:
                    return t(
                        "claims:attributeMappings.custom.heading"
                    );
            }
        };

        /**
         * Resolves page description based on the `type`.
         *
         * @returns The page description.
         */
        const resolvePageDescription = (): ReactElement => {
            switch (type) {
                case ClaimManagementConstants.AGENT:
                    return (
                        <>
                            { t("claims:attributeMappings.agent.description") }
                            <DocumentationLink
                                link={ getLink("manage.attributes.oidcAttributes.learnMore") }
                            >
                                { t("common:learnMore") }
                            </DocumentationLink>
                        </>
                    );
                case ClaimManagementConstants.OIDC:
                    return (
                        <>
                            { t("claims:attributeMappings.oidc.description") }
                            <DocumentationLink
                                link={ getLink("manage.attributes.oidcAttributes.learnMore") }
                            >
                                { t("common:learnMore") }
                            </DocumentationLink>
                        </>
                    );
                case ClaimManagementConstants.SCIM:
                    return (
                        <>
                            { t("claims:attributeMappings.scim.description") }
                            <DocumentationLink
                                link={ getLink("manage.attributes.scimAttributes.learnMore") }
                            >
                                { t("common:learnMore") }
                            </DocumentationLink>
                        </>
                    );
                case ClaimManagementConstants.AXSCHEMA:
                    return t("claims:attributeMappings.axschema.description");
                case ClaimManagementConstants.EIDAS:
                    return t("claims:attributeMappings.eidas.description");
                default:
                    return t(
                        "claims:attributeMappings.custom.description"
                    );
            }
        };

        /**
         * Resolves page header image based on `type`.
         *
         * @returns Image element.
         */
        const resolvePageHeaderImage = (): ReactElement => {
            switch (type) {
                case ClaimManagementConstants.OIDC:
                    return (
                        <GenericIcon
                            verticalAlign="middle"
                            rounded
                            icon={ getTechnologyLogos().oidc }
                            spaced="right"
                            size="tiny"
                            floated="left"
                            transparent
                        />
                    );
                case ClaimManagementConstants.SCIM:
                    return (
                        <GenericIcon
                            verticalAlign="middle"
                            rounded
                            icon={ getTechnologyLogos().scim }
                            spaced="right"
                            size="tiny"
                            floated="left"
                        />
                    );
                case ClaimManagementConstants.AXSCHEMA:
                    return (
                        <GenericIcon
                            verticalAlign="middle"
                            rounded
                            icon={ getTechnologyLogos().axschema }
                            spaced="right"
                            size="tiny"
                            floated="left"
                        />
                    );
                case ClaimManagementConstants.EIDAS:
                    return (
                        <GenericIcon
                            verticalAlign="middle"
                            rounded
                            icon={ getTechnologyLogos().eidas }
                            spaced="right"
                            size="tiny"
                            floated="left"
                        />
                    );
                case ClaimManagementConstants.OTHERS:
                    return (
                        <Image floated="left" verticalAlign="middle" rounded centered size="tiny">
                            <AnimatedAvatar />
                            <span className="claims-letter">
                                {
                                    dialects &&
                                    dialects[0]?.dialectURI
                                        .charAt(0)
                                        .toUpperCase()
                                }
                            </span>
                        </Image>
                    );
                default:
                    return (
                        <Image floated="left" verticalAlign="middle" rounded centered size="tiny">
                            <AnimatedAvatar />
                            <span className="claims-letter">C</span>
                        </Image>
                    );
            }
        };

        /**
         * Fetches all the dialects.
         *
         * @param limit - Item count.
         * @param offset - Starting point to get the items.
         * @param sort - Sort order.
         * @param filter - Filtering keyword.
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
                    let filteredDialect: ClaimDialect[] = response.filter((claim: ClaimDialect) => {
                        if (!listAllAttributeDialects) {
                            return (
                                claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("LOCAL") &&
                                claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("AXSCHEMA") &&
                                claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("EIDAS_LEGAL") &&
                                claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("EIDAS_NATURAL") &&
                                claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OPENID_NET") &&
                                claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("XML_SOAP") &&
                                (attributeConfig.attributeMappings.showSCIMCore1
                                || claim.dialectURI !== "urn:scim:schemas:core:1.0")
                            );
                        }

                        return claim.id !== "local" &&
                            claim.id !== ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("XML_SOAP") &&
                            claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OPENID_NET");
                    });

                    if (!agentFeatureConfig?.enabled || !isAgentManagementEnabledForOrg) {
                        filteredDialect = filteredDialect.filter((claimDialect: ClaimDialect) => {
                            return claimDialect.id !=
                                ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_FOR_AGENTS");
                        });
                    }

                    const attributeMappings: ClaimDialect[] = [];

                    filteredDialect.forEach((attributeMapping: ClaimDialect) => {
                        if (ClaimManagementConstants.OIDC_MAPPING.includes(attributeMapping.dialectURI)) {
                            type === ClaimManagementConstants.OIDC && attributeMappings.push(attributeMapping);
                        } else if (Object.values(ClaimManagementConstants.SCIM_TABS).map(
                            (tab: { name: string; uri: string }) => tab.uri).includes(attributeMapping.dialectURI)) {
                            type === ClaimManagementConstants.SCIM && attributeMappings.push(attributeMapping);
                        } else if (ClaimManagementConstants.AXSCHEMA_MAPPING === attributeMapping.dialectURI) {
                            type === ClaimManagementConstants.AXSCHEMA && attributeMappings.push(attributeMapping);
                        } else if (Object.values(ClaimManagementConstants.EIDAS_TABS).map(
                            (tab: { name: string; uri: string }) => tab.uri).includes(attributeMapping.dialectURI)) {
                            type === ClaimManagementConstants.EIDAS && attributeMappings.push(attributeMapping);
                        } else if (type === ClaimManagementConstants.OTHERS) {
                            if (customAttributeMappingID === attributeMapping.id) {
                                attributeMappings.push(attributeMapping);
                            }
                        }
                    });

                    if (type === ClaimManagementConstants.SCIM && attributeConfig.showCustomDialectInSCIM) {
                        const customDialect: ClaimDialect = filteredDialect?.find(
                            (dialect: ClaimDialect) => dialect.dialectURI === userSchemaURI
                        );

                        if (customDialect) {
                            attributeMappings.push(customDialect);
                        }
                    }

                    setDialects(attributeMappings);
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

        const generatePanes = (): StrictTabProps[ "panes" ] => {
            if (type === ClaimManagementConstants.SCIM) {
                const panes: StrictTabProps[ "panes" ] = [];

                ClaimManagementConstants.SCIM_TABS.forEach((tab: {
                    name: string;
                    uri: string;
                    isAttributeButtonEnabled: boolean;
                    attributeButtonText: string;
                }) => {
                    if (!SCIMConfigs.hideCore1Schema || SCIMConfigs.scim.core1Schema !== tab.uri) {
                        const dialect: ClaimDialect = dialects?.find(
                            (dialect: ClaimDialect) => dialect.dialectURI === tab.uri
                        );

                        dialect &&
                            panes.push({
                                menuItem: tab.name,
                                render: () => (
                                    <ResourceTab.Pane controlledSegmentation attached={ false }>
                                        <ExternalDialectEditPage
                                            id={ dialect.id }
                                            attributeUri={ tab.uri }
                                            attributeType={ type }
                                            mappedLocalClaims={ mappedLocalclaims }
                                            updateMappedClaims={ setTriggerFetchMappedClaims }
                                            updateDialects={ setTriggerFetchDialects }
                                            isAttributeButtonEnabled={ tab.isAttributeButtonEnabled }
                                            attributeButtonText= { t(tab.attributeButtonText) }
                                        />
                                    </ResourceTab.Pane>
                                )
                            });
                    }
                });

                if (attributeConfig.showCustomDialectInSCIM) {
                    const dialect: ClaimDialect = dialects?.find((dialect: ClaimDialect) =>
                        dialect.dialectURI === userSchemaURI
                    );

                    panes.push({
                        menuItem: "Custom Schema",
                        render: () => (
                            <ResourceTab.Pane controlledSegmentation attached={ false }>
                                <ExternalDialectEditPage
                                    id={ dialect?.id }
                                    attributeType={ type }
                                    attributeUri={ userSchemaURI }
                                    mappedLocalClaims={ mappedLocalclaims }
                                    updateMappedClaims={ setTriggerFetchMappedClaims }
                                    updateDialects={ setTriggerFetchDialects }
                                    isAttributeButtonEnabled={ true }
                                    attributeButtonText=
                                        { t("claims:external.pageLayout.edit.attributePrimaryAction") }
                                />
                            </ResourceTab.Pane>
                        )
                    });
                }

                return panes;
            }

            if (type === ClaimManagementConstants.EIDAS) {
                const panes: StrictTabProps[ "panes" ] = [];

                ClaimManagementConstants.EIDAS_TABS.forEach((tab: {
                    name: string;
                    uri: string;
                    isAttributeButtonEnabled: boolean;
                    attributeButtonText: string;
                }) => {
                    const dialect: ClaimDialect = dialects?.find(
                        (dialect: ClaimDialect) => dialect.dialectURI === tab.uri
                    );

                    if (dialect) {
                        panes.push({
                            menuItem: tab.name,
                            render: () => (
                                <ResourceTab.Pane controlledSegmentation attached={ false }>
                                    <ExternalDialectEditPage
                                        id={ dialect.id }
                                        attributeUri={ tab.uri }
                                        attributeType={ type }
                                        mappedLocalClaims={ mappedLocalclaims }
                                        updateMappedClaims={ setTriggerFetchMappedClaims }
                                        updateDialects={ setTriggerFetchDialects }
                                        isAttributeButtonEnabled={ tab.isAttributeButtonEnabled }
                                        attributeButtonText= { tab.attributeButtonText }
                                    />
                                </ResourceTab.Pane>
                            )
                        });
                    }
                });

                return panes;
            }

            return dialects?.map((dialect: ClaimDialect) => {
                return {
                    menuItem: dialect.dialectURI,
                    render: () => (
                        <ResourceTab.Pane controlledSegmentation attached={ false }>
                            <ExternalDialectEditPage
                                id={ dialect.id  }
                                attributeType={ type }
                                attributeUri={ dialect.dialectURI }
                                mappedLocalClaims={ mappedLocalclaims }
                                updateMappedClaims={ setTriggerFetchMappedClaims }
                                updateDialects={ setTriggerFetchDialects }
                                isAttributeButtonEnabled={ true }
                                attributeButtonText= { t("claims:external.pageLayout.edit.attributePrimaryAction") }
                            />
                        </ResourceTab.Pane>
                    )
                };
            });
        };

        return (
            <PageLayout
                isLoading={ isLoading }
                title={ resolvePageHeading() }
                pageTitle={ resolvePageHeading() }
                description={ resolvePageDescription() }
                data-testid={ `${ testId }-page-layout` }
                image={ resolvePageHeaderImage() }
                backButton={ {
                    onClick: () => {
                        history.push(AppConstants.getPaths().get("CLAIM_DIALECTS"));
                    },
                    text: t("claims:local.pageLayout.local.back")
                } }
            >
                { dialects?.length > 1 ? (
                    <ResourceTab panes={ generatePanes() } data-testid={ `${ testId }-tabs` } />
                ) : (
                    <ExternalDialectEditPage
                        id={ dialects && dialects[ 0 ]?.id }
                        attributeType={ type }
                        attributeUri={ dialects &&  dialects[ 0 ]?.dialectURI }
                        mappedLocalClaims={ mappedLocalclaims }
                        updateMappedClaims={ setTriggerFetchMappedClaims }
                        updateDialects={ setTriggerFetchDialects }
                        isAttributeButtonEnabled={ true }
                        attributeButtonText= { t("claims:external.pageLayout.edit.attributePrimaryAction") }
                    />
                ) }
            </PageLayout>
        );
    };

/**
 * Default props for the component.
 */
AttributeMappings.defaultProps = {
    "data-testid": "edit-attribute-mappings"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default AttributeMappings;
