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

import { AttributeMapping, Claim } from "../../../models";
import { Form, Grid, Label, List, Table } from "semantic-ui-react";
import { CopyInputField } from "@wso2is/react-components";
import React from "react";

/**
 * Prop types of `SummaryLocalClaims` component
 */
interface SummaryLocalClaimsPropsInterface {
    /**
     * The complete Claim data
     */
    data: Claim;
}

/**
 * This component renders the summary view of the wizard
 * @param {SummaryLocalClaimsPropsInterface} props
 * @return {React.ReactElement}
 */
export const SummaryLocalClaims = (props: SummaryLocalClaimsPropsInterface): React.ReactElement => {

    const { data } = props;

    /**
     * This component returns a row of summary
     * @param {string} title 
     * @param {string | number | React.ReactElement} description
     * @return {React.ReactElement} A row of summary 
     */
    const generateSummaryLine = (
        title: string,
        description: string | number | React.ReactElement
    ): React.ReactElement => {
        return (
            <Grid.Row className="summary-field" columns={ 2 }>
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                    <div className="label">{ title }</div>
                </Grid.Column>
                <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                    <div className="value">{ description }</div>
                </Grid.Column>
            </Grid.Row>
        )
    };

    /**
     * This components generates labels for boolean types
     * @param {string} name 
     * @param {boolean} boolean
     * @return {React.ReactElement} 
     */
    const generateLabels = (name: string): React.ReactElement => {
        return (
            <List.Item>
                <Label basic circular>
                    { name }
                </Label>
            </List.Item>
        )
    };

    /**
     * This returns the Claim URI in a copy field
     * @return {React.ReactElement} Copy Field
     */
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
                        <h3>{ data.displayName }</h3>
                        <div className="description">{ data.description }</div>
                    </div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={ 1 }>
                <Grid.Column textAlign="center">
                    <List>
                        { generateLabels("This claim is shown on user profile and user registration page") }
                        { generateLabels("This claim is required during user registration") }
                        { generateLabels("This claim is read-only") }
                    </List>
                </Grid.Column>
            </Grid.Row>
            { data.claimURI ? generateSummaryLine("Claim URI", showClaimURI()) : null }
            { data.displayOrder ? generateSummaryLine("Display Order", data.displayOrder) : null }
            { data.regEx ? generateSummaryLine("Regular Expression", data.regEx) : null }
            {
                data.attributeMapping?.length > 0 ? generateSummaryLine("Mapped attributes",
                    (
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>
                                        Userstore
                                    </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        Attribute
                                    </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                { data.attributeMapping.map((attribute: AttributeMapping, index: number) => {
                                    return (
                                        <Table.Row key={ index } columns={ 2 }>
                                            <Table.Cell>
                                                { attribute.userstore }
                                            </Table.Cell>
                                            <Table.Cell>
                                                { attribute.mappedAttribute }
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                }) }
                            </Table.Body>
                        </Table>
                    )
                ) : null
            }
        </Grid>
    )
}
