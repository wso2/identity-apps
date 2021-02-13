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

import { getDialects } from "@wso2is/core/api";
import { AlertLevels, ClaimDialect, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { ListLayout, PageLayout, PrimaryButton, ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DropdownProps, Icon, PaginationProps, StrictTabProps } from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    AppState,
    ConfigReducerStateInterface,
    UIConstants,
    filterList,
    sortList
} from "../../core";
import { ClaimsList, ListType } from "../components";
import { ClaimManagementConstants } from "../constants";
import { RouterProps, RouteComponentProps, RouteChildrenProps } from "react-router";
import ExternalDialectEditPage from "./external-dialect-edit";

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
        const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

        /**
         * Sets the attributes by which the list can be sorted.
         */
        const SORT_BY = [
            {
                key: 0,
                text: t("console:manage.features.claims.dialects.attributes.dialectURI"),
                value: "dialectURI"
            }
        ];

        const [ addEditClaim, setAddEditClaim ] = useState(false);
        const [ filteredDialects, setFilteredDialects ] = useState<ClaimDialect[]>(null);
        const [ sortOrder, setSortOrder ] = useState(true);
        const [ localURI, setLocalURI ] = useState("");
        const [ searchQuery, setSearchQuery ] = useState<string>("");
        const [ isLoading, setIsLoading ] = useState(true);
        const [ sortBy, setSortBy ] = useState(SORT_BY[ 0 ]);
        const [ offset, setOffset ] = useState(0);
        const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
        const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
        const [ resetPagination, setResetPagination ] = useTrigger();
        const [ dialects, setDialects ] = useState<ClaimDialect[]>(null);

        useEffect(() => {
            getDialect();
        }, []);

        useEffect(() => {
            setFilteredDialects(sortList(filteredDialects, sortBy.value, sortOrder));
        }, [ sortBy, sortOrder ]);

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

                    const attributeMappings: ClaimDialect[] = [];

                    filteredDialect.forEach((attributeMapping: ClaimDialect) => {
                        if (
                            ClaimManagementConstants.OIDC_MAPPING.includes(attributeMapping.dialectURI) &&
                            type === ClaimManagementConstants.OIDC
                        ) {
                            attributeMappings.push(attributeMapping);
                        } else if (
                            ClaimManagementConstants.SCIM_MAPPING.includes(attributeMapping.dialectURI) &&
                            type === ClaimManagementConstants.SCIM
                        ) {
                            attributeMappings.push(attributeMapping);
                        } else if (type === ClaimManagementConstants.OTHERS) {
                            attributeMappings.push(attributeMapping);
                        }
                    });

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
                    const dialect = dialects?.find((dialect: ClaimDialect) => dialect.dialectURI === tab.uri);
                    dialect &&
                        panes.push({
                            menuItem: tab.name,
                            render: () => (
                                <ResourceTab.Pane controlledSegmentation attached={ false }>
                                    <ExternalDialectEditPage id={ dialect.id } />
                                </ResourceTab.Pane>
                            )
                        });
                });

                return panes;
            }

            return dialects?.map((dialect: ClaimDialect) => {
                return {
                    menuItem: dialect.dialectURI,
                    render: () => (
                        <ResourceTab.Pane controlledSegmentation attached={ false }>
                            <ExternalDialectEditPage id={ dialect.id } />
                        </ResourceTab.Pane>
                    )
                };
            });
        };

        return (
            <PageLayout
                action={
                    (isLoading || !(!searchQuery && filteredDialects?.length <= 0)) &&
                    config.ui?.isDialectAddingEnabled !== false && (
                        <PrimaryButton
                            onClick={ () => {
                                setAddEditClaim(true);
                            } }
                            data-testid={ `${ testId }-list-layout-add-button` }
                        >
                            <Icon name="add" />
                            { t("console:manage.features.claims.dialects.pageLayout.list.primaryAction") }
                        </PrimaryButton>
                    )
                }
                isLoading={ isLoading }
                title={ t("console:manage.features.claims.dialects.pageLayout.list.title") }
                description={ t("console:manage.features.claims.dialects.pageLayout.list.description") }
                data-testid={ `${ testId }-page-layout` }
            >
                {
                    dialects?.length > 1
                        ? (
                            <ResourceTab panes={ generatePanes() } data-testid={ `${ testId }-tabs` } />
                        )
                        : (
                            <ExternalDialectEditPage id={ dialects && dialects[ 0 ]?.id } />
                        )
                }
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
