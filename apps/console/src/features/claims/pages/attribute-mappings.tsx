/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { getAllExternalClaims, getDialects } from "@wso2is/core/api";
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
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteChildrenProps } from "react-router";
import { Image, StrictTabProps } from "semantic-ui-react";
import ExternalDialectEditPage from "./external-dialect-edit";
import { SCIMConfigs, attributeConfig } from "../../../extensions";
import { AppConstants, AppState, getTechnologyLogos, history } from "../../core";
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
}

export const AttributeMappings: FunctionComponent<RouteChildrenProps<AttributeMappingsPathParams> &
    EditAttributeMappingsPropsInterface> = (
        props: RouteChildrenProps<AttributeMappingsPathParams> & EditAttributeMappingsPropsInterface
    ): ReactElement => {
        const {
            [ "data-testid" ]: testId,
            match: {
                params: { type }
            }
        } = props;

        const dispatch = useDispatch();
        const listAllAttributeDialects: boolean = useSelector(
            (state: AppState) => state.config.ui.listAllAttributeDialects
        );
        const { t } = useTranslation();
        const { getLink } = useDocumentation();

        const [ isLoading, setIsLoading ] = useState(true);
        const [ dialects, setDialects ] = useState<ClaimDialect[]>(null);
        const [ mappedLocalclaims, setMappedLocalClaims ] = useState<string[]>([]);
        const [ triggerFetchMappedClaims, setTriggerFetchMappedClaims ] = useState<boolean>(true);

        useEffect(() => {
            getDialect();
        }, []);

        useEffect(() => {
            if ( dialects && dialects.length > 0 && triggerFetchMappedClaims ) {
                generateMappedLocalClaimList(dialects.map(dialect => dialect.id));
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

            const mappedLocalClaimPromises = [];

            dialectIdList.forEach(id => {
                mappedLocalClaimPromises.push(
                    getAllExternalClaims(id, {
                        filter,
                        limit,
                        offset,
                        sort
                    })
                );
            });

            Axios.all(mappedLocalClaimPromises).then(response => {
                const mappedClaims = [];

                response.forEach(claim => {
                    // Hide identity claims in SCIM
                    const claims: ExternalClaim[] = attributeConfig.attributeMappings.getExternalAttributes(
                        type,
                        claim
                    );

                    mappedClaims.push(...claims.map(claim => claim.mappedLocalClaimURI));
                });
                setMappedLocalClaims(mappedClaims);
            }).catch(error => {
                dispatch(
                    addAlert({
                        description:
                            error[0]?.response?.data?.description ||
                            t(
                                "console:manage.features.claims.dialects.notifications." +
                                "fetchExternalClaims.genericError.description",
                                { type: resolveType(type) }
                            ),
                        level: AlertLevels.ERROR,
                        message:
                            error[0]?.response?.data?.message ||
                            t(
                                "console:manage.features.claims.dialects.notifications." +
                                "fetchExternalClaims.genericError.message"
                            )
                    })
                );
            }).finally(() => setIsLoading(false));
        };

        /**
         * Resolves page heading based on the `type`.
         *
         * @return {string} - The page heading.
         */
        const resolvePageHeading = (): string => {
            switch (type) {
                case ClaimManagementConstants.OIDC:
                    return t(
                        "console:manage.features.claims.attributeMappings.oidc.heading"
                    );
                case ClaimManagementConstants.SCIM:
                    return t(
                        "console:manage.features.claims.attributeMappings.scim.heading"
                    );
                default:
                    return t(
                        "console:manage.features.claims.attributeMappings.custom.heading"
                    );
            }
        };

        /**
         * Resolves page description based on the `type`.
         *
         * @return {ReactElement} - The page description.
         */
        const resolvePageDescription = (): ReactElement => {
            switch (type) {
                case ClaimManagementConstants.OIDC:
                    return (
                        <>
                            { t("console:manage.features.claims.attributeMappings.oidc.description") }
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
                            { t("console:manage.features.claims.attributeMappings.scim.description") }
                            <DocumentationLink
                                link={ getLink("manage.attributes.scimAttributes.learnMore") }
                            >
                                { t("common:learnMore") }
                            </DocumentationLink>
                        </>
                    );
                default:
                    return t(
                        "console:manage.features.claims.attributeMappings.custom.description"
                    );
            }
        };

        /**
         * Resolves page header image based on `type`.
         *
         * @return {ReactElement} - Image.
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

                        return claim.id !== "local";
                    });

                    const attributeMappings: ClaimDialect[] = [];

                    filteredDialect.forEach((attributeMapping: ClaimDialect) => {
                        if (ClaimManagementConstants.OIDC_MAPPING.includes(attributeMapping.dialectURI)) {
                            type === ClaimManagementConstants.OIDC && attributeMappings.push(attributeMapping);
                        } else if (ClaimManagementConstants.SCIM_MAPPING.includes(attributeMapping.dialectURI)) {
                            type === ClaimManagementConstants.SCIM && attributeMappings.push(attributeMapping);
                        } else if (type === ClaimManagementConstants.OTHERS) {
                            attributeMappings.push(attributeMapping);
                        }
                    });

                    if (type === ClaimManagementConstants.SCIM) {
                        if (attributeConfig.showCustomDialectInSCIM 
                            && filteredDialect.filter(e => e.dialectURI 
                                === attributeConfig.localAttributes.customDialectURI).length > 0  ) {
                            attributeMappings.push(filteredDialect.filter(e => e.dialectURI 
                                === attributeConfig.localAttributes.customDialectURI)[0]);
                        }
                    }

                    setDialects(attributeMappings);
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

        const generatePanes = (): StrictTabProps[ "panes" ] => {
            if (type === ClaimManagementConstants.SCIM) {
                const panes: StrictTabProps[ "panes" ] = [];

                ClaimManagementConstants.SCIM_TABS.forEach((tab: { name: string; uri: string }) => {
                    if (!SCIMConfigs.hideCore1Schema || SCIMConfigs.scim.core1Schema !== tab.uri) {
                        const dialect = dialects?.find((dialect: ClaimDialect) => dialect.dialectURI === tab.uri);

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
                                        />
                                    </ResourceTab.Pane>
                                )
                            });
                    }
                });

                if (attributeConfig.showCustomDialectInSCIM) {
                    const dialect = dialects?.find((dialect: ClaimDialect) => 
                        dialect.dialectURI === attributeConfig.localAttributes.customDialectURI
                    );

                    if (dialect) {
                        panes.push({
                            menuItem: "Custom Schema",
                            render: () => (
                                <ResourceTab.Pane controlledSegmentation attached={ false }>
                                    <ExternalDialectEditPage 
                                        id={ dialect.id } 
                                        attributeType={ type }
                                        attributeUri={ dialect.dialectURI } 
                                        mappedLocalClaims={ mappedLocalclaims }
                                        updateMappedClaims={ setTriggerFetchMappedClaims } 
                                    />
                                </ResourceTab.Pane>
                            )
                        });
                    }
                }

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
                description={ resolvePageDescription() }
                data-testid={ `${ testId }-page-layout` }
                image={ resolvePageHeaderImage() }
                backButton={ {
                    onClick: () => {
                        history.push(AppConstants.getPaths().get("CLAIM_DIALECTS"));
                    },
                    text: t("console:manage.features.claims.local.pageLayout.local.back")
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
