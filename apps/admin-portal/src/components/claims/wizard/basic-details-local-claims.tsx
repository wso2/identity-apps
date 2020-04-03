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

import { Field, Forms, FormValue } from "@wso2is/forms";
import { Grid, Label, Popup } from "semantic-ui-react";
import React, { useEffect, useState } from "react";

/**
 * Prop types of `BasicDetailsLocalClaims` component
 */
interface BasicDetailsLocalClaimsPropsInterface {
    /**
     * Triggers submit
     */
    submitState: boolean;
    /**
     * Called to initiate update
     */
    onSubmit: (data: any, values: Map<string, FormValue>) => void;
    /**
     * Form Values to be saved 
     */
    values: Map<string, FormValue>;
    /**
     * The base claim URI string
     */
    claimURIBase: string;
}

/**
 * This component renders the basic details step of the add local claim wizard
 * @param {BasicDetailsLocalClaimsPropsInterface} props
 * @return {React.ReactElement}
 */
export const BasicDetailsLocalClaims = (props: BasicDetailsLocalClaimsPropsInterface): React.ReactElement => {

    const { submitState, onSubmit, values, claimURIBase } = props;

    const [ claimID, setClaimID ] = useState<string>(null);
    const [ isShow, setIsShow ] = useState(false);
    const [ isShowNameHint, setIsShowNameHint ] = useState(false);
    const [ isShowClaimIDHint, setIsShowClaimIDHint ] = useState(false);
    const [ isShowRegExHint, setIsShowRegExHint ] = useState(false);
    const [ isShowDisplayOrderHint, setIsShowDisplayOrderHint ] = useState(false);

    /**
     * Set the if show on profile is selected or not
     * and the claim ID from the received `values` prop
     */
    useEffect(() => {
        setIsShow(values?.get("supportedByDefault").length > 0)
        setClaimID(values?.get("claimURI").toString())
    }, [ values ]);

    return (
        <Forms
            onSubmit={ (values) => {
                const data = {
                    claimURI: claimURIBase + "/" + values.get("claimURI").toString(),
                    description: values.get("description").toString(),
                    displayName: values.get("name").toString(),
                    displayOrder: values.get("displayOrder") ? parseInt(values.get("displayOrder").toString()) : "0",
                    readOnly: values.get("readOnly").length > 0,
                    regEx: values.get("regularExpression").toString(),
                    required: values.get("required").length > 0,
                    supportedByDefault: values.get("supportedByDefault").length > 0
                }
                onSubmit(data, values);
            } }
            submitState={ submitState }
        >
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column width={ 8 }>
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
                            value={ values?.get("name")?.toString() }
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
                    </Grid.Column>
                    <Grid.Column width={ 8 }>
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
                            onMouseOver={ () => {
                                setIsShowClaimIDHint(true);
                            } }
                            onMouseOut={ () => {
                                setIsShowClaimIDHint(false);
                            } }
                        />
                        <Popup
                            content={ "A unique ID for the claim." +
                                " The ID will be appended to the dialect URI to create a claim URI" }
                            inverted
                            open={ isShowClaimIDHint }
                            trigger={ <span></span> }
                            onClose={ () => {
                                setIsShowClaimIDHint(false);
                            } }
                            position="bottom left"
                        />
                        {
                            claimID
                                ? <Label>
                                    <em>Claim URI</em>:&nbsp;
                                        { claimURIBase + "/" + claimID }
                                </Label>
                                : null
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column width={ 8 }>
                        <Field
                            type="textarea"
                            name="description"
                            label="Description"
                            required={ true }
                            requiredErrorMessage="Description is required"
                            placeholder="Enter a description"
                            value={ values?.get("description")?.toString() }
                        />
                    </Grid.Column>
                    <Grid.Column width={ 8 }>
                        <Field
                            type="text"
                            name="regularExpression"
                            label="Regular Expression"
                            required={ false }
                            requiredErrorMessage=""
                            placeholder="Regular expression to validate the claim"
                            value={ values?.get("regularExpression")?.toString() }
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
                                    label: "Show this claim on user profile and user registration page",
                                    value: "Support"
                                } ] }
                            value={ values?.get("supportedByDefault") as string[] }
                            listen={ (values: Map<string, FormValue>) => {
                                setIsShow(values?.get("supportedByDefault").length > 0);
                            } }
                        />
                    </Grid.Column>
                </Grid.Row>
                {
                    isShow && (
                        <Grid.Row columns={ 16 }>
                            <Grid.Column width={ 8 }>
                                <Field
                                    type="number"
                                    min="0"
                                    name="displayOrder"
                                    label="Display Order"
                                    required={ false }
                                    requiredErrorMessage="Display Order is required"
                                    placeholder="Enter the display order"
                                    value={ values?.get("displayOrder")?.toString() ?? "0" }
                                    onMouseOver={ () => {
                                        setIsShowDisplayOrderHint(true);
                                    } }
                                    onMouseOut={ () => {
                                        setIsShowDisplayOrderHint(false);
                                    } }
                                />
                                <Popup
                                    content={
                                        "This determines the position at which this claim is displayed" +
                                        " in the user profile and the user registration page"
                                    }
                                    inverted
                                    open={ isShowDisplayOrderHint }
                                    trigger={ <span></span> }
                                    onClose={ () => {
                                        setIsShowDisplayOrderHint(false);
                                    } }
                                    position="bottom left"
                                />
                            </Grid.Column>
                        </Grid.Row>
                    )
                }
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <Field
                            type="checkbox"
                            name="required"
                            required={ false }
                            requiredErrorMessage=""
                            children={ [ {
                                label: "Make this claims required during user registration",
                                value: "Required"
                            } ] }
                            value={ values?.get("required") as string[] }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row column={ 1 }>
                    <Grid.Column>
                        <Field
                            type="checkbox"
                            name="readOnly"
                            required={ false }
                            requiredErrorMessage=""
                            children={ [ {
                                label: "Make this claim read-only",
                                value: "ReadOnly"
                            } ] }
                            value={ values?.get("readOnly") as string[] }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid >
        </Forms >
    )
};
