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

import React, { ReactElement } from "react";
import { TypeProperty, UserStorePostData, UserStoreProperty } from "../../../models";
import { Grid } from "semantic-ui-react";

/**
 * Prop types of the `SummaryUserStores` component
 */
interface SummaryUserStoresPropsInterface {
    /**
     * The complete data ready to be submitted
     */
    data: UserStorePostData;
    /**
     * The connection properties
     */
    properties: TypeProperty[];
    /**
     * The type of the userstore
     */
    type: string;
}

/**
 * This component renders the Summary step of the wizard
 * @param {SummaryUserStoresPropsInterface} props
 * @return {ReactElement}
 */
export const SummaryUserStores = (props: SummaryUserStoresPropsInterface): ReactElement => {

    const { data, properties, type } = props;

    /**
     * This generates a summary row
     * @param {string} title 
     * @param {string | number | ReactElement} description
     */
    const generateSummaryLine = (
        title: string,
        description: string | number | ReactElement
    ): ReactElement => {
        return (
            <Grid.Row className="summary-field" columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                    <div className="label">{title}</div>
                </Grid.Column>
                <Grid.Column className="overflow-wrap" mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                    <div className="value">{description}</div>
                </Grid.Column>
            </Grid.Row>
        )
    };

    return (
        <Grid className="wizard-summary">
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } textAlign="center">
                    <div className="general-details">
                        <h3>{data?.name}</h3>
                        <div className="description">{data?.description}</div>
                    </div>
                </Grid.Column>
            </Grid.Row>
            {type ? generateSummaryLine("Userstore Type", type) : null}
            {
                properties?.map((property: TypeProperty) => {
                    if (!property.name.toLocaleLowerCase().includes("password")) {
                        return (
                            generateSummaryLine(
                                property.description.split("#")[0],
                                data?.properties?.filter(((userStoreProperty: UserStoreProperty) => {
                                    return userStoreProperty.name === property.name
                                }))[0].value
                            )
                        )
                    }
                })
            }
        </Grid>
    )
}
