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

import React, { useState } from "react";
import { Forms, FormValue, Field } from "@wso2is/forms";
import { Grid, Button } from "semantic-ui-react";
import { Property } from "../../../models";

interface AdditionalPropertiesPropsInterface {
    submitState: boolean;
    onSubmit: (data: any, values: Map<string, FormValue>, properties: Set<number>) => void;
    values: Map<string, FormValue>;
    properties: Set<number>;
}
export const AdditionalProperties = (props: AdditionalPropertiesPropsInterface): React.ReactElement => {

    const { onSubmit, submitState, values } = props;

    const [properties, setProperties] = useState<Set<number>>(new Set(props.properties || [0]));

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
                            value={values?.get("key" + property)?.toString()}
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
                            value={values?.get("value" + property)?.toString()}
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
                <Grid.Column width={16}>
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
    }

    return (
        <Forms
            onSubmit={(values) => {
                const data = {
                    readOnly: values.get("readOnly").length > 0,
                    required: values.get("required").length > 0,
                    supportedByDefault: values.get("supportedByDefault").length > 0,
                    properties: getProperties(values)
                }
                onSubmit(data, values,properties);
            }}
            submitState={submitState}
        >
            <Grid>
                <Grid.Row columns={1} >
                    <Grid.Column width={16}>
                        <h5>Additional Properties</h5>
                        <Grid>
                            {
                                generateProperties()
                            }
                        </Grid>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={1}>
                    <Grid.Column width={16}>
                        <Field
                            type="checkbox"
                            toggle={true}
                            name="supportedByDefault"
                            label="Show on Profile?"
                            required={false}
                            requiredErrorMessage=""
                            children={[{ value: "Support", label: "" }]}
                            value={values?.get("supportedByDefault") as string[]}
                        />
                        <Field
                            type="checkbox"
                            toggle={true}
                            name="required"
                            label="Required"
                            required={false}
                            requiredErrorMessage=""
                            children={[{ value: "Required", label: "" }]}
                            value={values?.get("required") as string[]}
                        />
                        <Field
                            type="checkbox"
                            toggle={true}
                            name="readOnly"
                            label="Read Only"
                            required={false}
                            requiredErrorMessage=""
                            children={[{ value: "ReadOnly", label: "" }]}
                            value={values?.get("readOnly") as string[]}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    )
}