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

import React, { useState, useEffect } from "react";
import { Button, Grid } from "semantic-ui-react";
import { Field, FormValue, Forms } from "@wso2is/forms";
import { Property, Claim, AlertLevels } from "../../../models";
import { updateAClaim } from "../../../api";
import { useDispatch } from "react-redux";
import { addAlert } from "../../../store/actions";

interface EditAdditionalPropertiesLocalClaimsPropsInterface{
    claim: Claim;
    update: () => void;
}
export const EditAdditionalPropertiesLocalClaims = (
    props: EditAdditionalPropertiesLocalClaimsPropsInterface
): React.ReactElement => {

    const { claim, update } = props;

    const dispatch = useDispatch();

    const [properties, setProperties] = useState<Set<number>>(new Set([0]));

    useEffect(() => {
        const tempProperties = new Set(properties);
        claim?.properties.forEach((property, index) => {
            tempProperties.add(index);
        });
        setProperties(tempProperties);
    }, []);

    const generateProperties = (): React.ReactElement[] => {

        const mappedElements: React.ReactElement[] = [];
        properties?.forEach((property: number) => {

            const isOnlyElement: boolean = properties.size === 1;
            const isFirstElement: boolean = property === Array.from(properties)[0];

            mappedElements.push(
                <Grid.Row attribute={property} columns={3}>
                    <Grid.Column width={7}>
                        <Field
                            type="text"
                            name={"key" + property}
                            label={isFirstElement ? "Name" : null}
                            required={false}
                            requiredErrorMessage="Enter a name"
                            placeholder="Enter a name"
                            value={claim?.properties[property]?.key}
                        />
                    </Grid.Column>
                    <Grid.Column width={7}>
                        <Field
                            type="text"
                            name={"value" + property}
                            label={isFirstElement ? "Value" : null}
                            required={false}
                            requiredErrorMessage="Enter a value or delete the property"
                            placeholder="Enter a value"
                            value={claim?.properties[property]?.value}
                        />
                    </Grid.Column>
                    <Grid.Column width={2} verticalAlign="bottom">
                        {
                            !isOnlyElement
                                ? (
                                    <Button
                                        type="button"
                                        size="mini"
                                        primary
                                        circular
                                        icon={"trash"}
                                        onClick={() => {
                                            const tempProperties = new Set(properties);
                                            if (!isOnlyElement) {
                                                tempProperties.delete(property);
                                            }
                                            setProperties(tempProperties);
                                        }}
                                    />
                                )
                                : null
                        }
                    </Grid.Column>
                </Grid.Row>
            );
        });
        const lastElement: number = Array.from(properties)[properties.size - 1];
        mappedElements.push(
            <Grid.Row key={lastElement + 1} textAlign="center" columns={1}>
                <Grid.Column width={14}>
                    <Button
                        type="button"
                        size="mini"
                        primary
                        circular
                        icon="add"
                        onClick={() => {
                            const tempProperties = new Set(properties);
                            tempProperties.add(lastElement + 1);
                            setProperties(tempProperties);
                        }}
                    />
                </Grid.Column>
            </Grid.Row>
        );
        return mappedElements;
    };

    const getProperties = (values: Map<string, FormValue>): Property[] => {
        const attributes: Property[] = [];
        properties.forEach((property: number) => {
            attributes.push({
                key: values.get("key" + property)?.toString(),
                value: values.get("value" + property)?.toString()
            });
        });
        return attributes;
    };

    return (
        <Forms
            onSubmit={(values) => {
                const { id,dialectURI, ...claimData } = claim;
                const data: Claim = {
                    ...claimData,
                    properties: getProperties(values)
                }
                updateAClaim(claim.id, data).then((response) => {
                    dispatch(addAlert(
                        {
                            description: "Additional Properties of this local claim have been updated successfully!",
                            level: AlertLevels.SUCCESS,
                            message: "Additional Properties updated successfully"
                        }
                    ));
                    update();
                }).catch(error => {
                    dispatch(addAlert(
                        {
                            description: error?.description,
                            level: AlertLevels.ERROR,
                            message: error?.message
                        }
                    ));
                })
            }}
        >
            <Grid>
                <Grid.Row columns={1} >
                    <Grid.Column width={6}>
                        <h5>Additional Properties</h5>
                        <Grid>
                            {
                                generateProperties()
                            }
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={1}>
                    <Grid.Column width={6}>
                        <Field type="submit" value="Update" />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    )
};
