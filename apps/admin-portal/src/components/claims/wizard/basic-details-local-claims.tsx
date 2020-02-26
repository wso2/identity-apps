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
import { Forms, FormValue, Field, Validation } from "@wso2is/forms";
import { Grid, Button } from "semantic-ui-react";
import { AttributeMapping } from "../../../models";
import { getUserStoreList, getADialect } from "../../../api";

interface BasicDetailsLocalClaimsPropsInterface {
    submitState: boolean;
    onSubmit: (data: any, values: Map<string, FormValue>) => void;
    values: Map<string, FormValue>;
}
export const BasicDetailsLocalClaims = (props: BasicDetailsLocalClaimsPropsInterface): React.ReactElement => {

    const [claimURIBase, setClaimURIBase] = useState("");

    const { submitState, onSubmit, values } = props;

    useEffect(() => {
        getADialect("local").then((response) => {
            setClaimURIBase(response.dialectURI);
        }).catch(error => {
            // TODO:Notify
        })
    }, []);

    return (
        <Forms
            onSubmit={(values) => {
                const data = {
                    claimURI: claimURIBase+"/"+values.get("claimURI").toString(),
                    description: values.get("description").toString(),
                    displayOrder: parseInt(values.get("displayOrder").toString()),
                    regEx: values.get("regularExpression").toString(),
                    displayName: values.get("name").toString(),
                    readOnly: values.get("readOnly").length > 0,
                    required: values.get("required").length > 0,
                    supportedByDefault: values.get("supportedByDefault").length > 0,
                }
                onSubmit(data, values);
            }}
            submitState={submitState}
        >
            <Grid>
                <Grid.Row columns={2}>
                    <Grid.Column>
                        <Field
                            type="text"
                            name="name"
                            label="Name"
                            required={true}
                            requiredErrorMessage="Name is required"
                            placeholder="Enter a name for the claim"
                            value={values?.get("name")?.toString()}
                        />
                        <Field
                            type="text"
                            name="description"
                            label="Description"
                            required={true}
                            requiredErrorMessage="Description is required"
                            placeholder="Enter a description"
                            value={values?.get("description")?.toString()}
                        />
                        <Field
                            type="text"
                            name="claimURI"
                            label="Claim ID"
                            required={true}
                            requiredErrorMessage="Claim URI is required"
                            placeholder="Enter a claim URI"
                            value={values?.get("claimURI")?.toString()}
                        />
                    </Grid.Column>
                    <Grid.Column>
                        <Field
                            type="text"
                            name="regularExpression"
                            label="Regular Expression"
                            required={false}
                            requiredErrorMessage=""
                            placeholder="Regular expression to validate the claim"
                            value={values?.get("regularExpression")?.toString()}
                        />
                        <Field
                            type="number"
                            min="0"
                            name="displayOrder"
                            label="Display Order"
                            required={false}
                            requiredErrorMessage=""
                            placeholder="Enter the display order"
                            value={values?.get("displayOrder")?.toString()}
                        />
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
};
