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
import { Grid, Label, Divider } from "semantic-ui-react";
import { Hint } from "@wso2is/react-components";

interface BasicDetailsLocalClaimsPropsInterface {
    submitState: boolean;
    onSubmit: (data: any, values: Map<string, FormValue>) => void;
    values: Map<string, FormValue>;
    claimURIBase: string;
}
export const BasicDetailsLocalClaims = (props: BasicDetailsLocalClaimsPropsInterface): React.ReactElement => {

    const { submitState, onSubmit, values, claimURIBase } = props;

    const [claimID, setClaimID] = useState<string>(null);

    return (
        <Forms
            onSubmit={ (values) => {
                const data = {
                    claimURI: claimURIBase + "/" + values.get("claimURI").toString(),
                    description: values.get("description").toString(),
                    displayOrder: parseInt(values.get("displayOrder").toString()),
                    regEx: values.get("regularExpression").toString(),
                    displayName: values.get("name").toString() ?? "0",
                    readOnly: values.get("readOnly").length > 0,
                    required: values.get("required").length > 0,
                    supportedByDefault: values.get("supportedByDefault").length > 0,
                }
                onSubmit(data, values);
            } }
            submitState={ submitState }
        >
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column>
                        <Field
                            type="text"
                            name="name"
                            label="Name"
                            required={ true }
                            requiredErrorMessage="Name is required"
                            placeholder="Enter a name for the claim"
                            value={ values?.get("name")?.toString() }
                        />
                        <Hint>
                            Name of the claim displayed on the profile page and the self-registration page
                        </Hint>
                        <Divider hidden/>
                        <Field
                            type="textarea"
                            name="description"
                            label="Description"
                            required={ true }
                            requiredErrorMessage="Description is required"
                            placeholder="Enter a description"
                            value={ values?.get("description")?.toString() }
                        />
                        <Divider hidden />
                        <Field
                            type="text"
                            name="claimURI"
                            label="Claim ID"
                            required={ true }
                            requiredErrorMessage="Claim ID is required"
                            placeholder="Enter a claim ID"
                            value={ values?.get("claimURI")?.toString() }
                            listen={ (values: Map<string, FormValue>) => {
                                setClaimID(values.get("claimURI").toString())
                            } }
                        />
                        {claimID ? <Label><em>Claim URI</em>: {claimURIBase + "/" + claimID}</Label> : null}
                        <Hint>
                            A unique ID for the claim. The ID will be appended to the dialect URI to create a claim URI
                        </Hint>
                    </Grid.Column>
                    <Grid.Column>
                        <Field
                            type="text"
                            name="regularExpression"
                            label="Regular Expression"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder="Regular expression to validate the claim"
                            value={ values?.get("regularExpression")?.toString() }
                        />
                        <Hint>
                            Regular Expression used to validate inputs
                        </Hint>
                        <Divider hidden />
                        <Field
                            type="number"
                            min="0"
                            name="displayOrder"
                            label="Display Order"
                            required={ false }
                            requiredErrorMessage="Display Order is required"
                            placeholder="Enter the display order"
                            value={ values?.get("displayOrder")?.toString() ?? "0" }
                        />
                        <Hint>
                            Integer value to specify the order in which the claim is displayed among other claims under the same dialect
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <Field
                            type="checkbox"
                            name="supportedByDefault"
                            required={ false }
                            requiredErrorMessage=""
                            children={ [
                                {
                                    value: "Support",
                                    label: "Show on Profile"
                                }] }
                            value={ values?.get("supportedByDefault") as string[] }
                        />
                        <Hint>
                            Specifies if the claim will be prompted during user registration and displayed on the user profile
                        </Hint>
                        <Divider hidden/>
                        <Field
                            type="checkbox"
                            name="required"
                            required={ false }
                            requiredErrorMessage=""
                            children={ [{
                                value: "Required",
                                label: "Required"
                            }] }
                            value={ values?.get("required") as string[] }
                        />
                        <Hint>
                            Specifies if the claim is required for user registration
                        </Hint>
                        <Divider hidden />
                        <Field
                            type="checkbox"
                            name="readOnly"
                            required={ false }
                            requiredErrorMessage=""
                            children={ [{
                                value: "ReadOnly",
                                label: "Read Only"
                            }] }
                            value={ values?.get("readOnly") as string[] }
                        />
                        <Hint>
                            Specifies if the claim is read-only
                        </Hint>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Forms>
    )
};
