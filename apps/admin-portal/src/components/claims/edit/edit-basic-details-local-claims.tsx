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

import { AlertLevels, Claim } from "../../../models";
import { Divider, Form, Grid, Popup } from "semantic-ui-react";
import { Field, Forms } from "@wso2is/forms";
import React, { useState } from "react";

import { addAlert } from "@wso2is/core/store";
import { CopyInputField } from "@wso2is/react-components";
import { updateAClaim } from "../../../api";
import { useDispatch } from "react-redux";

/**
 * Prop types for `EditBasicDetailsLocalClaims` component
 */
interface EditBasicDetailsLocalClaimsPropsInterface {
    /**
     * The claim to be edited
     */
    claim: Claim;
    /**
     * The function to be called to initiate an update
     */
    update: () => void;
}

/**
 * This component renders the Basic Details pane of the edit local claim screen
 * @param {EditBasicDetailsLocalClaimsPropsInterface} props
 * @return {React.ReactElement}
 */
export const EditBasicDetailsLocalClaims = (
    props: EditBasicDetailsLocalClaimsPropsInterface
): React.ReactElement => {

    const dispatch = useDispatch();

    const [ isShowNameHint, setIsShowNameHint ] = useState(false);
    const [ isShowRegExHint, setIsShowRegExHint ] = useState(false);
    const [ isShowDisplayOrderHint, setIsShowDisplayOrderHint ] = useState(false);

    const { claim, update } = props;

    return (
        <>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column tablet={ 16 } computer={ 12 } largeScreen={ 9 } widescreen={ 6 } mobile={ 16 }>
                        <Form>
                            <Form.Field>
                                <label>Claim URI</label>
                                <CopyInputField value={ claim ? claim.claimURI : "" } />
                            </Form.Field>
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            <Forms
                onSubmit={ (values) => {
                    const data: Claim = {
                        attributeMapping: claim.attributeMapping,
                        claimURI: claim.claimURI,
                        description: values.get("description").toString(),
                        displayName: values.get("name").toString(),
                        displayOrder: parseInt(values.get("displayOrder").toString()),
                        properties: claim.properties,
                        readOnly: values.get("readOnly").length > 0,
                        regEx: values.get("regularExpression").toString(),
                        required: values.get("required").length > 0,
                        supportedByDefault: values.get("supportedByDefault").length > 0

                    }
                    updateAClaim(claim.id, data).then(() => {
                        dispatch(addAlert(
                            {
                                description: "The basic details of the local claim have been updated successfully!",
                                level: AlertLevels.SUCCESS,
                                message: "Basic details updated successfully"
                            }
                        ));
                        update();
                    }).catch(error => {
                        dispatch(addAlert(
                            {
                                description: error?.description || "There was an error while updating the local claim",
                                level: AlertLevels.ERROR,
                                message: error?.message || "Something went wrong"
                            }
                        ));
                    })
                } }
            >
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column tablet={ 16 } computer={ 12 } largeScreen={ 9 } widescreen={ 6 } mobile={ 16 }>
                            <Field
                                onMouseOver={ () => {
                                    setIsShowNameHint(true);
                                } }
                                onMouseOut={ () => {
                                    setIsShowNameHint(false);
                                } }
                                type="text"
                                name="name"
                                label="Name"
                                required={ true }
                                requiredErrorMessage="Name is required"
                                placeholder="Enter a name for the claim"
                                value={ claim?.displayName }
                            />
                            <Popup
                                content={ "Name of the claim that will be shown on the user profile " +
                                    "and user registration page" }
                                inverted
                                open={ isShowNameHint }
                                trigger={ <span></span> }
                                onClose={ () => {
                                    setIsShowNameHint(false);
                                } }
                                position="bottom left"
                            />
                            <Divider hidden />
                            <Field
                                type="textarea"
                                name="description"
                                label="Description"
                                required={ true }
                                requiredErrorMessage="Description is required"
                                placeholder="Enter a description"
                                value={ claim?.description }
                            />
                            <Field
                                type="text"
                                name="regularExpression"
                                label="Regular Expression"
                                required={ false }
                                requiredErrorMessage=""
                                placeholder="Regular expression to validate the claim"
                                value={ claim?.regEx }
                                onMouseOver={ () => {
                                    setIsShowRegExHint(true);
                                } }
                                onMouseOut={ () => {
                                    setIsShowRegExHint(false);
                                } }
                            />
                            <Popup
                                content="This regular expression is used to validate the value this claim can take"
                                inverted
                                open={ isShowRegExHint }
                                trigger={ <span></span> }
                                onClose={ () => {
                                    setIsShowRegExHint(false);
                                } }
                                position="bottom left"
                            />
                            <Divider hidden />
                            <Field
                                type="number"
                                min="0"
                                name="displayOrder"
                                label="Display Order"
                                required={ false }
                                requiredErrorMessage=""
                                placeholder="Enter the display order"
                                value={ claim?.displayOrder.toString() }
                                onMouseOver={ () => {
                                    setIsShowDisplayOrderHint(true);
                                } }
                                onMouseOut={ () => {
                                    setIsShowDisplayOrderHint(false);
                                } }
                            />
                            <Popup
                                content="This regular expression is used to validate the value this claim can take"
                                inverted
                                open={ isShowDisplayOrderHint }
                                trigger={ <span></span> }
                                onClose={ () => {
                                    setIsShowDisplayOrderHint(false);
                                } }
                                position="bottom left"
                            />
                            <Divider hidden={ true } />
                            <Field
                                type="checkbox"
                                name="supportedByDefault"
                                required={ false }
                                requiredErrorMessage=""
                                children={ [ {
                                    label: "Show this claim on user profile and user registration page",
                                    value: "Support"
                                } ] }
                                value={ claim?.supportedByDefault ? [ "Support" ] : [] }
                            />
                            <Divider hidden />
                            <Field
                                type="checkbox"
                                name="required"
                                required={ false }
                                requiredErrorMessage=""
                                children={ [ {
                                    label: "Make this claims required during user registration",
                                    value: "Required"
                                } ] }
                                value={ claim?.required ? [ "Required" ] : [] }
                            />
                            <Divider hidden />
                            <Field
                                type="checkbox"
                                name="readOnly"
                                required={ false }
                                requiredErrorMessage=""
                                children={ [ {
                                    label: "Make this claim read-only",
                                    value: "ReadOnly"
                                } ] }
                                value={ claim?.readOnly ? [ "ReadOnly" ] : [] }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 6 }>
                            <Field
                                type="submit"
                                value="Update"
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Forms>
        </>
    )
};
