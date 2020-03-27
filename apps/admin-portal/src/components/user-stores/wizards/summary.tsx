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

import React, { useEffect, useState } from "react";
import { Grid, } from "semantic-ui-react";
import { FormValue } from "@wso2is/forms";
import { UserStorePostData, TypeProperty, UserStoreProperty } from "../../../models";

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
     * The type of the user store
     */
    type: string;
}

/**
 * This component renders the Summary step of the wizard
 * @param {SummaryUserStoresPropsInterface} props
 * @return {React.ReactElement}
 */
export const SummaryUserStores = (props: SummaryUserStoresPropsInterface): React.ReactElement => {

    const { data, properties, type } = props;

    /**
     * This generates a summary row
     * @param {string} title 
     * @param {string | number | React.ReactElement} description
     */
    const generateSummaryLine = (
        title: string,
        description: string | number | React.ReactElement
    ): React.ReactElement => {
        return (
            <Grid.Row className="summary-field" columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                    <div className="label">{title}</div>
                </Grid.Column>
                <Grid.Column className="overflow-wrap" mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                    <div className="value url">{description}</div>
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
            {type ? generateSummaryLine("User Store Type", type) : null}
            {
                properties?.map((property: TypeProperty) => {
                    if (property.name !== "password") {
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
