/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Divider, Grid } from "semantic-ui-react";
import { TypeProperty, UserStorePostData, UserStoreProperty } from "../../models";

/**
 * Prop types of the `SummaryUserStores` component
 */
interface SummaryUserStoresPropsInterface extends TestableComponentInterface {
    /**
     * The connection properties.
     */
    connectionProperties: TypeProperty[];
    /**
     * The user properties.
     */
    userProperties: TypeProperty[];
    /**
     * The group properties.
     */
    groupProperties: TypeProperty[];
    /**
     * The basic properties.
     */
    basicProperties: TypeProperty[];
    /**
     * The userstore data ready to be posted.
     */
    data: UserStorePostData;
    /**
     * The type of the userstore.
     */
    type: string;
}

/**
 * This component renders the Summary step of the wizard.
 *
 * @param {SummaryUserStoresPropsInterface} props - Props injected to the component.
 *
 * @return {ReactElement}
 */
export const SummaryUserStores: FunctionComponent<SummaryUserStoresPropsInterface> = (
    props: SummaryUserStoresPropsInterface
): ReactElement => {

    const {
        data,
        connectionProperties,
        userProperties,
        groupProperties,
        basicProperties,
        type,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    /**
     * This generates a summary row
     * @param {string} title
     * @param {string | number | ReactElement} description
     * @param {number} key - Row key.
     */
    const generateSummaryLine = (
        title: string,
        description: string | number | ReactElement,
        key?: number
    ): ReactElement => {
        return (
            <Grid.Row key={ key } className="summary-field" columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                    <div className="label">{ title }</div>
                </Grid.Column>
                <Grid.Column className="overflow-wrap" mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                    <div className="value">{ description }</div>
                </Grid.Column>
            </Grid.Row>
        );
    };

    return (
        <Grid className="wizard-summary" data-testid={ testId }>
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } textAlign="center">
                    <div className="general-details">
                        <h3>{ data?.name }</h3>
                        <div className="description">{ data?.description }</div>
                    </div>
                </Grid.Column>
            </Grid.Row>
            { type ? generateSummaryLine("Userstore Type", type) : null }

            <Divider horizontal>{ t("console:manage.features.userstores.wizard.steps.general") }</Divider>

            {
                basicProperties?.map((property: TypeProperty, index: number) => {
                    if (!(property.attributes.find(attribute => attribute.name === "type")?.value === "password")) {
                        return (
                            generateSummaryLine(
                                property.description.split("#")[ 0 ],
                                data?.properties?.find((userStoreProperty: UserStoreProperty) => {
                                    return userStoreProperty.name === property.name;
                                })?.value,
                                index
                            )
                        );
                    }
                })
            }
            {
                connectionProperties?.map((property: TypeProperty, index: number) => {
                    if (!(property.attributes.find(attribute => attribute.name === "type")?.value === "password")) {
                        return (
                            generateSummaryLine(
                                property.description.split("#")[ 0 ],
                                data?.properties?.find((userStoreProperty: UserStoreProperty) => {
                                    return userStoreProperty.name === property.name;
                                })?.value,
                                index
                            )
                        );
                    }
                })
            }

            <Divider horizontal>{ t("console:manage.features.userstores.wizard.steps.user") }</Divider>

            {
                userProperties?.map((property: TypeProperty, index: number) => {
                    if (!(property.attributes.find(attribute => attribute.name === "type")?.value === "password")) {
                        return (
                            generateSummaryLine(
                                property.description.split("#")[ 0 ],
                                data?.properties?.find((userStoreProperty: UserStoreProperty) => {
                                    return userStoreProperty.name === property.name;
                                })?.value,
                                index
                            )
                        );
                    }
                })
            }

            <Divider horizontal>{ t("console:manage.features.userstores.wizard.steps.group") }</Divider>

            {
                groupProperties?.map((property: TypeProperty, index: number) => {
                    if (!(property.attributes.find(attribute => attribute.name === "type")?.value === "password")) {
                        return (
                            generateSummaryLine(
                                property.description.split("#")[ 0 ],
                                data?.properties?.find((userStoreProperty: UserStoreProperty) => {
                                    return userStoreProperty.name === property.name;
                                })?.value,
                                index
                            )
                        );
                    }
                })
            }
        </Grid>
    );
};

/**
 * Default props for the component.
 */
SummaryUserStores.defaultProps = {
    "data-testid": "userstore-summary"
};
