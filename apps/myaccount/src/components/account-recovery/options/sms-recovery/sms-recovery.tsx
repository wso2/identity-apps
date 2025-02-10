/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalForm, FinalFormField, FormRenderProps, FormValue, TextFieldAdapter } from "@wso2is/form";
import { Button, GenericIcon, Hint, PrimaryButton, SecondaryButton } from "@wso2is/react-components";
import { CommonConstants } from "@wso2is/selfcare.core.v1/constants/common-constants";
import { FormValidation } from "@wso2is/validation";
import { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Form, Grid, Icon, List } from "semantic-ui-react";
import { updateProfileInfo } from "../../../../api";
import { getAccountRecoveryIcons } from "../../../../configs";
import { commonConfig } from "../../../../extensions";
import { AlertInterface, AlertLevels, BasicProfileInterface, MultiValue, ProfileSchema } from "../../../../models";
import { AppState } from "../../../../store";
import { getProfileInformation, setActiveForm } from "../../../../store/actions";
import { EditSection } from "../../../shared";
import "./sms-recovery.scss";

/**
 * SMS form type to be used as active form key.
 */
const FORM_TYPE_SMS: string = "sms";

/**
 * Prop types for the SMSRecoveryComponent component.
 * Also see {@link SMSRecovery.defaultProps}
 */
interface SMSRecoveryProps extends IdentifiableComponentInterface {
    /**
     * The function to be called when an alert is fired.
     * @param alert - The fired event.
     */
    onAlertFired: (alert: AlertInterface) => void;
    /**
     * Enable editing mobile number.
     */
    enableEditMobile?: boolean;
}

/**
 * SMS recovery section.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
export const SMSRecovery: React.FunctionComponent<SMSRecoveryProps> = (
    props: SMSRecoveryProps
): ReactElement => {

    const {
        onAlertFired,
        enableEditMobile,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: ThunkDispatch<AppState, any, AnyAction> = useDispatch();

    const profileInfo: BasicProfileInterface = useSelector(
        (state: AppState) => state.authenticationInformation.profileInfo
    );
    const phoneNumberSchema: ProfileSchema = useSelector((state: AppState) => {
        const phoneNumberSchemas: ProfileSchema = state.authenticationInformation.profileSchemas.find(
            (profileSchema: ProfileSchema) => profileSchema.name === "phoneNumbers");

        if (phoneNumberSchemas && phoneNumberSchemas.subAttributes) {
            const mobileSchema: ProfileSchema = phoneNumberSchemas.subAttributes?.find(
                (subAttribute: ProfileSchema) => subAttribute.name === "mobile");

            if (mobileSchema) return mobileSchema;
        }

        return phoneNumberSchemas;
    });
    const activeForm: string = useSelector((state: AppState) => state.global.activeForm);

    const [ mobile, setMobile ] = useState<string>(undefined);
    const [ editedMobile, setEditedMobile ] = useState<string>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    let mobileType: string;

    useEffect(() => {
        if (isEmpty(profileInfo)) {
            dispatch(getProfileInformation());
        }
    }, []);

    const handleUpdate = (mobile: string) => {
        setIsSubmitting(true);
        const data: {
            Operations: {
                op: string;
                value: Record<string, unknown>;
            }[];
            schemas: string[];
        } = {
            Operations: [
                {
                    op: "replace",
                    value: {}
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        data.Operations[0].value = {
            phoneNumbers: mobileType || phoneNumberSchema
                ? [
                    {
                        type: mobileType || phoneNumberSchema.name,
                        value: mobile
                    }
                ]
                : [ mobile ]
        };

        updateProfileInfo(data)
            .then(() => {
                onAlertFired({
                    description: t(
                        "myAccount:components.accountRecovery.SMSRecovery.notifications.updateMobile" +
                        ".success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.accountRecovery.SMSRecovery.notifications.updateMobile.success.message"
                    )
                });

                dispatch(getProfileInformation());
                dispatch(setActiveForm(null));
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.detail) {
                    onAlertFired({
                        description: t(
                            "myAccount:components.accountRecovery.SMSRecovery." +
                            "notifications.updateMobile.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.accountRecovery.SMSRecovery." +
                            "notifications.updateMobile.error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "myAccount:components.accountRecovery.SMSRecovery." +
                        "notifications.updateMobile.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.accountRecovery.SMSRecovery." +
                        "notifications.updateMobile.genericError.message"
                    )
                });
            });
        setIsSubmitting(false);
    };

    /**
     * This function gets the mobile number from the profileInfo passed as the argument
     * and assigns it to mobile and editedMobile.
     *
     * @param profileInfo - profileInfo as the parameter.
     * @remarks
     * Temporarily the first mobile type element in the phoneNumbers array is shown.
     * In the future, we need to decide whether or not to allow multiple recovery mobiles.
     */
    const setMobileNumber = (profileInfo: BasicProfileInterface) => {
        let mobileNumber: string = "";

        if (profileInfo.phoneNumbers) {
            if (typeof profileInfo.phoneNumbers[0] === "object") {
                const mobileValue : MultiValue = profileInfo.phoneNumbers.find(
                    (phoneNumber : MultiValue) => phoneNumber.type === "mobile");

                mobileNumber = mobileValue?.value;
                mobileType = mobileValue?.type;
            } else {
                mobileNumber = profileInfo.phoneNumbers[0] as string;
                mobileType = "array";
            }
        }
        setMobile(mobileNumber);
        setEditedMobile(mobileNumber);
    };

    useEffect(() => {
        if (!isEmpty(profileInfo)) {
            setMobileNumber(profileInfo);
        }
    }, [ profileInfo ]);

    /**
     * This is called when the edit icon is clicked.
     */
    const handleEdit = () : void => {
        dispatch(setActiveForm(CommonConstants.SECURITY + FORM_TYPE_SMS));
    };

    /**
     * This is called when the cancel button is pressed
     */
    const handleCancel = () : void => {
        dispatch(setActiveForm(null));
    };

    /**
     * This function masks the mobile number passed as the argument and returns the masked mobile number.
     * The text between the third character of the mobile and the second last character is masked.
     *
     * @param mobileNumber - mobile number.
     */
    const maskMobile = (mobileNumber: string) : string => mobileNumber.slice(0,3) +
        "*".repeat(mobileNumber.length - 5) + mobileNumber.slice(-2);

    /**
     * This function returns the EditSection component and the recovery option
     * elements based on if the edit icon has been clicked
     */
    const showEditView = () : ReactElement => {
        if (activeForm !== CommonConstants.SECURITY+FORM_TYPE_SMS) {
            return (
                <Grid padded>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column width={ 11 } className="first-column">
                            <List.Content floated="left">
                                <GenericIcon
                                    icon={ getAccountRecoveryIcons().sms }
                                    size="mini"
                                    twoTone={ true }
                                    transparent={ true }
                                    shape={ "rounded" }
                                    relaxed={ true }
                                />
                            </List.Content>
                            <List.Content>
                                <List.Header>{
                                    t("myAccount:components.accountRecovery.SMSRecovery.heading")
                                }</List.Header>
                                <List.Description >
                                    {
                                        mobile ?
                                            t("myAccount:components.accountRecovery.SMSRecovery.descriptions.update",
                                                { mobile: mobile ? maskMobile(mobile) : "" })
                                            : (
                                                <Hint>
                                                    { t("myAccount:components.accountRecovery.SMSRecovery." +
                                                    "descriptions.emptyMobile") }
                                                </Hint>
                                            )
                                    }
                                </List.Description>
                            </List.Content>
                        </Grid.Column>
                        <Grid.Column width={ 5 } className="last-column">
                            <List.Content floated="right">
                                { (mobile) && (
                                    enableEditMobile ? (
                                        <Icon
                                            link={ true }
                                            onClick={ handleEdit }
                                            data-componentid={ `${componentId}-edit-button` }
                                            className="list-icon"
                                            size="small"
                                            color="grey"
                                            name="pencil alternate"
                                        />
                                    ):
                                        (
                                            <Icon
                                                link={ true }
                                                onClick={ handleEdit }
                                                data-componentid={ `${componentId}-view-button` }
                                                className="list-icon"
                                                size="small"
                                                color="grey"
                                                name="eye"
                                            />
                                        )
                                ) }
                            </List.Content>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }

        return (
            <EditSection data-componentid={ `${componentId}-edit-section` }>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <List>
                                <List.Item>
                                    <List.Content>
                                        <FinalForm
                                            onSubmit={ (values: { mobile:string }) =>
                                                handleUpdate(values.mobile.toString()) }
                                            data-componentid={ `${componentId}-edit-section-form` }
                                            render={ ({ handleSubmit }: FormRenderProps) => (
                                                <form onSubmit={ handleSubmit }>
                                                    {
                                                        (mobile) && (
                                                            <FinalFormField
                                                                className={ "mobile-field" }
                                                                data-componentid=
                                                                    { `${componentId}-edit-section-form-mobile-field` }
                                                                autoFocus={ true }
                                                                readOnly={ !enableEditMobile }
                                                                label={ t("myAccount:components.accountRecovery." +
                                                                "SMSRecovery.forms.mobileResetForm.inputs." +
                                                                "mobile.label"
                                                                ) }
                                                                onSubmit={ handleSubmit }
                                                                name="mobile"
                                                                placeholder={ t("myAccount:components." +
                                                                "accountRecovery.SMSRecovery.forms" +
                                                                ".mobileResetForm.inputs.mobile.placeholder"
                                                                ) }
                                                                required={ true }
                                                                requiredErrorMessage={ t("myAccount:" +
                                                                "components.accountRecovery.SMSRecovery.forms" +
                                                                ".mobileResetForm.inputs.mobile.validations.empty"
                                                                ) }
                                                                component={ TextFieldAdapter }
                                                                type="text"
                                                                validate={
                                                                    (value: FormValue) => {
                                                                        if (!value) {
                                                                            return t("myAccount:components." +
                                                                            "accountRecovery.SMSRecovery" +
                                                                            ".forms.mobileResetForm.inputs.mobile."
                                                                            + "validations.empty"
                                                                            ).toString();
                                                                        } else if (!FormValidation
                                                                            .mobileNumber(value.toString())) {
                                                                            return t("myAccount:components." +
                                                                            "accountRecovery.SMSRecovery" +
                                                                            ".forms.mobileResetForm.inputs.mobile."
                                                                            + "validations.invalidFormat"
                                                                            ).toString();
                                                                        } } }
                                                                initialValue={ editedMobile }
                                                            />) }
                                                    { enableEditMobile ? (
                                                        <>
                                                            <p className={ "small-description" }>
                                                                <Icon color="grey" floated="left" name="info circle" />
                                                                { t("myAccount:components.profile.forms." +
                                                                "mobileChangeForm.inputs.mobile.note"
                                                                ) }
                                                            </p>
                                                            <Form.Group inline={ true }>
                                                                <PrimaryButton
                                                                    className={ "mr-3" }
                                                                    size="small"
                                                                    disabled={ isSubmitting }
                                                                    loading={ isSubmitting }
                                                                    data-componentid={
                                                                        `${componentId}--edit-section-form" +
                                                                        "-submit-button`
                                                                    }
                                                                >
                                                                    { t("common:update").toString() }
                                                                </PrimaryButton>
                                                                <SecondaryButton
                                                                    className="link-button"
                                                                    onClick={ handleCancel }
                                                                    size="small"
                                                                    data-componentid={ `${componentId}--edit-section" +
                                                                    "-form-cancel-button` }
                                                                >
                                                                    { t("common:cancel").toString() }
                                                                </SecondaryButton>
                                                            </Form.Group>
                                                        </>
                                                    ):
                                                        (
                                                            <Button
                                                                onClick={ handleCancel }
                                                                size="small"
                                                                data-componentid={
                                                                    `${componentId}--edit-section-form-done-button`
                                                                }
                                                                className={ "mt-2" }
                                                            >
                                                                { t("common:done").toString() }
                                                            </Button>
                                                        )
                                                    }
                                                </form>) }
                                        />
                                    </List.Content>
                                </List.Item>
                            </List>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </EditSection >
        );
    };

    return showEditView();
};

/**
 * Default props of {@link SMSRecovery} component.
 * See type definitions in {@link SMSRecoveryProps}
 */
SMSRecovery.defaultProps = {
    "data-componentid": "sms-recovery",
    enableEditMobile: commonConfig.accountSecurityPage.accountRecovery.smsRecovery.enableEditMobile
};
