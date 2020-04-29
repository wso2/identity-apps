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

import { Field, FormValue, Forms } from "@wso2is/forms";
import React, { ReactElement, useState } from "react";
import { Grid } from "semantic-ui-react";
import { TypeProperty } from "../../../models";

/**
 * Prop types of the `GroupDetails` component 
 */
interface GroupDetailsPropsInterface {
    /**
     * Trigger submit
     */
    submitState: boolean;
    /**
     * Submits values
     */
    onSubmit: (values: Map<string, FormValue>) => void;
    /**
     * The saved values
     */
    values: Map<string, FormValue>;
    /**
     * The properties to be shown in this component.
     */
    properties: TypeProperty[];
}

/**
 * This component renders the Group Details step of the wizard
 * @param {GroupDetailsPropsInterface} props
 * @returns {Promise<any>}
 */
export const GroupDetails = (
    props: GroupDetailsPropsInterface
): ReactElement => {

    const { submitState, onSubmit, values, properties } = props;

    const [ disabled, setDisabled ] = useState(false);

    return (
        <Grid>
            <Grid.Row columns={ 1 }>
                <Grid.Column>
                    <Forms
                        onSubmit={ (values: Map<string, FormValue>) => {
                            onSubmit(values);
                        } }
                        submitState={ submitState }
                    >
                        {
                            properties.map(
                                (selectedTypeDetail: TypeProperty, index: number) => {
                                    const name = selectedTypeDetail.description.split("#")[ 0 ];
                                    const toggle = selectedTypeDetail.attributes
                                        .find(attribute => attribute.name === "type")?.value === "boolean";
                                    const master = selectedTypeDetail.name === "ReadGroups";

                                    return (
                                        toggle
                                            ? master
                                                ? (
                                                    <Field
                                                        key={ index }
                                                        label={ name }
                                                        name={ selectedTypeDetail.name }
                                                        type="toggle"
                                                        required={ false }
                                                        requiredErrorMessage={ name + " is a required field" }
                                                        value={
                                                            values?.get(selectedTypeDetail?.name)?.toString()
                                                            ?? selectedTypeDetail.defaultValue
                                                        }
                                                        toggle
                                                        listen={ (values: Map<string, FormValue>) => {
                                                            setDisabled(
                                                                values.get(selectedTypeDetail.name)
                                                                    .toString() === "false"
                                                            )
                                                        } }
                                                    />
                                                )
                                                : (
                                                    <Field
                                                        key={ index }
                                                        label={ name }
                                                        name={ selectedTypeDetail.name }
                                                        type="toggle"
                                                        required={ false }
                                                        requiredErrorMessage={ name + " is a required field" }
                                                        value={
                                                            values?.get(selectedTypeDetail?.name)?.toString()
                                                            ?? selectedTypeDetail.defaultValue
                                                        }
                                                        toggle
                                                        disabled={ disabled }
                                                    />
                                                )
                                            : (
                                                <Field
                                                    key={ index }
                                                    label={ name }
                                                    name={ selectedTypeDetail.name }
                                                    type="text"
                                                    required={ !disabled }
                                                    requiredErrorMessage={ name + " is a required field" }
                                                    placeholder={ "Enter a " + name }
                                                    value={
                                                        values?.get(selectedTypeDetail?.name)?.toString()
                                                        ?? selectedTypeDetail.defaultValue
                                                    }
                                                    disabled={ disabled }
                                                />

                                            )
                                    )
                                })
                        }
                    </Forms>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    )
}
