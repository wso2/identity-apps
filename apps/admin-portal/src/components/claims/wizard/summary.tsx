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

import React from "react";
import { Claim, AttributeMapping, Property } from "../../../models";
import { List, Grid, GridColumn, Icon } from "semantic-ui-react";

interface SummaryLocalClaimsPropsInterface {
    data: Claim;
}
export const SummaryLocalClaims = (props: SummaryLocalClaimsPropsInterface): React.ReactElement => {

    const { data } = props;

    const generateSummaryLine = (
        title: string,
        description: string | number | React.ReactElement
    ): React.ReactElement => {
        return (
            <Grid.Row className="summary-field" columns={2}>
                <Grid.Column mobile={16} tablet={8} computer={7} textAlign="right">
                    <div className="label">{title}</div>
                </Grid.Column>
                <Grid.Column mobile={16} tablet={8} computer={8} textAlign="left">
                    <div className="value url">{description}</div>
                </Grid.Column>
            </Grid.Row>
        )
    };

    return (
        <Grid className="wizard-summary">
            <Grid.Row>
                <Grid.Column mobile={16} tablet={16} computer={16} textAlign="center">
                    <div className="general-details">
                        <h3>{data.displayName}</h3>
                        <div className="description">{data.displayName}</div>
                    </div>
                </Grid.Column>
            </Grid.Row>
            {data.description ? generateSummaryLine("Description", data.description) : null}
            {data.claimURI ? generateSummaryLine("Claim URI", data.claimURI) : null}
            {data.displayOrder ? generateSummaryLine("Display Order", data.displayOrder) : null}
            {data.regEx ? generateSummaryLine("Regular Expression", data.regEx) : null}
            {generateSummaryLine("ReadOnly",
                <Icon
                    color={data.readOnly ? "green" : "red"}
                    name={data.readOnly ? "check circle outline" : "times circle outline"}
                />
            )}
            {generateSummaryLine("Required",
                <Icon
                    color={data.required ? "green" : "red"}
                    name={data.required ? "check circle outline" : "times circle outline"}
                />
            )}
            {generateSummaryLine("Show on Profile?",
                <Icon
                    color={data.supportedByDefault ? "green" : "red"}
                    name={data.supportedByDefault ? "check circle outline" : "times circle outline"}
                />
            )}
            {
                data.attributeMapping?.length > 0 ? generateSummaryLine("Mapped attributes",
                    (
                        <Grid>
                            {data.attributeMapping.map((attribute: AttributeMapping) => {
                                return (
                                    <Grid.Row columns={2}>
                                        <Grid.Column>
                                            {attribute.userstore}
                                        </Grid.Column>
                                        <Grid.Column>
                                            {attribute.mappedAttribute}
                                        </Grid.Column>
                                    </Grid.Row>
                                )
                            })}
                        </Grid>
                    )
                ) : null
            }
        </Grid>
    )
}