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
import { Claim, AttributeMapping } from "../../../models";
import { Grid, Icon, Label, Form, Table } from "semantic-ui-react";
import { CopyInputField } from "@wso2is/react-components";

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
            <Grid.Row className="summary-field" columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                    <div className="label">{title}</div>
                </Grid.Column>
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                    <div className="value url">{description}</div>
                </Grid.Column>
            </Grid.Row>
        )
    };

    const generateLabels = (name: string, boolean: boolean): React.ReactElement => {
        return (
            <Label basic color={ boolean ? "olive" : "yellow" }>
                <Icon name={ boolean ? "toggle on" : "toggle off" } />
                {name}
            </Label>
        )
    };

    const showClaimURI = (): React.ReactElement => {
        return (
            <Form.Field>
                <CopyInputField value={ data ? data?.claimURI : "" } />
            </Form.Field>
        )
    };

    return (
        <Grid className="wizard-summary">
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } textAlign="center">
                    <div className="general-details">
                        <h3>{data.displayName}</h3>
                        <div className="description">{data.displayName}</div>
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column textAlign="center">
                    {generateLabels("Show on Profile", data.supportedByDefault)}
                    {generateLabels("Required", data.required)}
                    {generateLabels("Read Only", data.readOnly)}
                </Grid.Column>
            </Grid.Row>
            {data.claimURI ? generateSummaryLine("Claim URI", showClaimURI()) : null}
            {data.displayOrder ? generateSummaryLine("Display Order", data.displayOrder) : null}
            {data.regEx ? generateSummaryLine("Regular Expression", data.regEx) : null}
            {
                data.attributeMapping?.length > 0 ? generateSummaryLine("Mapped attributes",
                    (
                        <Table basic="very">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>
                                        User Store
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        Attribute
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {data.attributeMapping.map((attribute: AttributeMapping, index: number) => {
                                    return (
                                        <Table.Row key={ index } columns={ 2 }>
                                            <Table.Cell>
                                                {attribute.userstore}
                                            </Table.Cell>
                                            <Table.Cell>
                                                {attribute.mappedAttribute}
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                })}
                            </Table.Body>
                        </Table>
                    )
                ) : null
            }
        </Grid>
    )
}
