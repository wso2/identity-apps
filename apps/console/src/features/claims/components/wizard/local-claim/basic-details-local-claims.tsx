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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Field, FormValue, Forms } from "@wso2is/forms";
import React, { ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Label, Popup } from "semantic-ui-react";

/**
 * Prop types of `BasicDetailsLocalClaims` component
 */
interface BasicDetailsLocalClaimsPropsInterface extends TestableComponentInterface {
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
 *
 * @param {BasicDetailsLocalClaimsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const BasicDetailsLocalClaims = (props: BasicDetailsLocalClaimsPropsInterface): ReactElement => {

    const {
        submitState,
        onSubmit,
        values,
        claimURIBase,
        [ "data-testid" ]: testId
    } = props;

    const [ claimID, setClaimID ] = useState<string>(null);
    const [ isShow, setIsShow ] = useState(false);
    const [ isShowNameHint, setIsShowNameHint ] = useState(false);
    const [ isShowClaimIDHint, setIsShowClaimIDHint ] = useState(false);
    const [ isShowRegExHint, setIsShowRegExHint ] = useState(false);
    const [ isShowDisplayOrderHint, setIsShowDisplayOrderHint ] = useState(false);

    const nameField = useRef<HTMLElement>(null);
    const claimField = useRef<HTMLElement>(null);
    const regExField = useRef<HTMLElement>(null);
    const displayOrderField = useRef<HTMLElement>(null);

    const nameTimer = useRef(null);
    const claimTimer = useRef(null);
    const regExTimer = useRef(null);
    const displayTimer = useRef(null);

    const { t } = useTranslation();

    /**
     * Set the if show on profile is selected or not
     * and the claim ID from the received `values` prop
     */
    useEffect(() => {
        setIsShow(values?.get("supportedByDefault").length > 0);
        setClaimID(values?.get("claimURI").toString());
    }, [ values ]);

    /**
     * This shows a popup with a delay of 500 ms.
     * 
     * @param {React.Dispatch<React.SetStateAction<boolean>>} callback The state dispatch method.
     * @param {React.MutableRefObject<any>} ref The ref object carrying the `setTimeout` ID.
     */
    const delayPopup = (
        callback: React.Dispatch<React.SetStateAction<boolean>>,
        ref: React.MutableRefObject<any>
    ): void => {
        ref.current = setTimeout(() => callback(true), 500);
    };

    /**
     * This closes the popup.
     * 
     * @param {React.Dispatch<React.SetStateAction<boolean>>} callback The state dispatch method.
     * @param {React.MutableRefObject<any>} ref The ref object carrying the `setTimeout` ID.
     */
    const closePopup = (
        callback: React.Dispatch<React.SetStateAction<boolean>>,
        ref: React.MutableRefObject<any>
    ): void => {
        clearTimeout(ref.current);
        callback(false);
    };

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
                };
                onSubmit(data, values);
            } }
            submitState={ submitState }
        >
            <Grid>
                <Grid.Row columns={ 2 }>
                    <Grid.Column width={ 8 }>
                        <Field
                            onMouseOver={ () => {
                                delayPopup(setIsShowNameHint, nameTimer);
                            } }
                            onMouseOut={ () => {
                                closePopup(setIsShowNameHint, nameTimer);
                            } }
                            type="text"
                            name="name"
                            label={ t("console:manage.features.claims.local.forms.name.label") }
                            required={ true }
                            requiredErrorMessage={ t("console:manage.features.claims.local.forms." +
                                "name.requiredErrorMessage") }
                            placeholder={ t("console:manage.features.claims.local.forms.name.placeholder") }
                            value={ values?.get("name")?.toString() }
                            ref={ nameField }
                            data-testid={ `${ testId }-form-name-input` }
                        />
                        <Popup
                            content={ t("console:manage.features.claims.local.forms.nameHint") }
                            inverted
                            open={ isShowNameHint }
                            trigger={ <span></span> }
                            onClose={ () => {
                                closePopup(setIsShowNameHint, nameTimer);
                            } }
                            position="bottom left"
                            context={ nameField }
                        />
                    </Grid.Column>
                    <Grid.Column width={ 8 }>
                        <Field
                            type="text"
                            name="claimURI"
                            label={ t("console:manage.features.claims.local.forms.attributeID.label") }
                            required={ true }
                            requiredErrorMessage={ t("console:manage.features.claims.local.forms." +
                                "attributeID.requiredErrorMessage") }
                            placeholder={ t("console:manage.features.claims.local.forms.attributeID.placeholder") }
                            value={ values?.get("claimURI")?.toString() }
                            listen={ (values: Map<string, FormValue>) => {
                                setClaimID(values.get("claimURI").toString());
                            } }
                            onMouseOver={ () => {
                                delayPopup(setIsShowClaimIDHint, claimTimer);
                            } }
                            onMouseOut={ () => {
                                closePopup(setIsShowClaimIDHint, claimTimer);
                            } }
                            ref={ claimField }
                            data-testid={ `${ testId }-form-claim-uri-input` }
                        />
                        <Popup
                            content={ t("console:manage.features.claims.local.forms.attributeHint") }
                            inverted
                            open={ isShowClaimIDHint }
                            trigger={ <p></p> }
                            onClose={ () => {
                                closePopup(setIsShowClaimIDHint, claimTimer);
                            } }
                            position="bottom left"
                            context={ claimField }
                        />
                        {
                            claimID
                                ? <Label>
                                    <em>Attribute URI</em>:&nbsp;
                                        { claimURIBase + "/" + claimID }
                                </Label>
                                : null
                        }
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column width={ 8 }>
                        <Field
                            type="text"
                            name="description"
                            label={ t("console:manage.features.claims.local.forms.description.label") }
                            required={ true }
                            requiredErrorMessage={ t("console:manage.features.claims.local.forms.description." +
                                "requiredErrorMessage") }
                            placeholder={ t("console:manage.features.claims.local.forms.description.placeholder") }
                            value={ values?.get("description")?.toString() }
                            data-testid={ `${ testId }-form-description-input` }
                        />
                    </Grid.Column>
                    <Grid.Column width={ 8 }>
                        <Field
                            type="text"
                            name="regularExpression"
                            label={ t("console:manage.features.claims.local.forms.regEx.label") }
                            required={ false }
                            requiredErrorMessage=""
                            placeholder={ t("console:manage.features.claims.local.forms.regEx.placeholder") }
                            value={ values?.get("regularExpression")?.toString() }
                            onMouseOver={ () => {
                                delayPopup(setIsShowRegExHint, regExTimer);
                            } }
                            onMouseOut={ () => {
                                closePopup(setIsShowRegExHint, regExTimer);
                            } }
                            ref={ regExField }
                            data-testid={ `${ testId }-form-regex-input` }
                        />
                        <Popup
                            content={ t("console:manage.features.claims.local.forms.regExHint") }
                            inverted
                            open={ isShowRegExHint }
                            trigger={ <span></span> }
                            onClose={ () => {
                                closePopup(setIsShowRegExHint, regExTimer);
                            } }
                            position="bottom left"
                            context={ regExField }
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
                                    label: t("console:manage.features.claims.local.forms.supportedByDefault.label"),
                                    value: "Support"
                                } ] }
                            value={ values?.get("supportedByDefault") as string[] }
                            listen={ (values: Map<string, FormValue>) => {
                                setIsShow(values?.get("supportedByDefault").length > 0);
                            } }
                            data-testid={ `${ testId }-form-supported-by-default-checkbox` }
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
                                    label={ t("console:manage.features.claims.local.forms.displayOrder.label") }
                                    required={ false }
                                    requiredErrorMessage=""
                                    placeholder={ t("console:manage.features.claims.local.forms." +
                                        "displayOrder.placeholder") }
                                    value={ values?.get("displayOrder")?.toString() ?? "0" }
                                    onMouseOver={ () => {
                                        delayPopup(setIsShowDisplayOrderHint, displayTimer);
                                    } }
                                    onMouseOut={ () => {
                                        closePopup(setIsShowDisplayOrderHint, displayTimer);
                                    } }
                                    ref={ displayOrderField }
                                    data-testid={ `${ testId }-form-display-order-input` }
                                />
                                <Popup
                                    content={
                                        t("console:manage.features.claims.local.forms.displayOrderHint")
                                    }
                                    inverted
                                    open={ isShowDisplayOrderHint }
                                    trigger={ <span></span> }
                                    onClose={ () => {
                                        closePopup(setIsShowDisplayOrderHint, displayTimer);
                                    } }
                                    position="bottom left"
                                    context={ displayOrderField }
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
                                label: t("console:manage.features.claims.local.forms.required.label"),
                                value: "Required"
                            } ] }
                            value={ values?.get("required") as string[] }
                            data-testid={ `${ testId }-form-required-checkbox` }
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
                                label: t("console:manage.features.claims.local.forms.readOnly.label"),
                                value: "ReadOnly"
                            } ] }
                            value={ values?.get("readOnly") as string[] }
                            data-testid={ `${ testId }-form-readonly-checkbox` }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid >
        </Forms >
    );
};

/**
 * Default props for the application creation wizard.
 */
BasicDetailsLocalClaims.defaultProps = {
    currentStep: 0,
    "data-testid": "local-claim-basic-details-form"
};
