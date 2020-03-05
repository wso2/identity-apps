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

import React, { useRef, useState, useEffect } from "react";
import { Claim, AttributeMapping, Property } from "../../../models";
import { List, Grid, GridColumn, Icon, Input, Label, Button, Popup, Form, Table, Tab } from "semantic-ui-react";

interface SummaryLocalClaimsPropsInterface {
    data: Claim;
}
export const SummaryLocalClaims = (props: SummaryLocalClaimsPropsInterface): React.ReactElement => {

    const { data } = props;

    const claimURIText = useRef(null);
    const copyButton = useRef(null);

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            copyButton.current.focus();
        }
    }, [copied]);

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

    const generateLabels = (name: string, boolean: boolean): React.ReactElement => {
        return (
            <Label basic color={boolean ? "olive" : "yellow"}>
                <Icon name={boolean ? "toggle on" : "toggle off"} />
                {name}
            </Label>
        )
    };

    const showClaimURI = (): React.ReactElement => {
        return (
            <Form.Field>
                <Input
                    ref={claimURIText}
                    value={data ? data?.claimURI : ""}
                    labelPosition="right"
                    action
                    fluid
                >
                    <input />
                    <Popup
                        trigger={
                            (
                                <Button
                                    icon="copy"
                                    type="button"
                                    ref={copyButton}
                                    onMouseEnter={() => {
                                        setCopied(false);
                                    }
                                    }
                                    onClick={(event: React.MouseEvent) => {
                                        claimURIText.current.select();
                                        document.execCommand("copy");
                                        setCopied(true);
                                        copyButton?.current?.blur();
                                        if (window.getSelection) {
                                            window.getSelection().removeAllRanges();
                                        }
                                    }}
                                />
                            )
                        }
                        openOnTriggerFocus
                        closeOnTriggerBlur
                        position="top center"
                        content={copied ? "Copied!" : "Copy to clipboard"}
                        inverted
                    />
                </Input>
            </Form.Field>
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
            <Grid.Row columns={1}>
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
                                {data.attributeMapping.map((attribute: AttributeMapping, index:number) => {
                                    return (
                                        <Table.Row key={index} columns={2}>
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