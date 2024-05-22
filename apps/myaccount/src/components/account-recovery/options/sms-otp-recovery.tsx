/* eslint-disable header/header */
/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { GenericIcon, Hint } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Form, Grid, Icon, List } from "semantic-ui-react";
import { updateProfileInfo } from "../../../api";
import { getAccountRecoveryIcons } from "../../../configs";
import { CommonConstants } from "../../../constants";
import { commonConfig } from "../../../extensions";
import { AlertInterface, AlertLevels, BasicProfileInterface, MultiValue, ProfileSchema } from "../../../models";
import { AppState } from "../../../store";
import { getProfileInformation, setActiveForm } from "../../../store/actions";
import { EditSection } from "../../shared";

/**
 * Email key.
 */
const SMS_OTP: string = "sms_otp";

/**
 * Prop types for the SMSOTPRecoveryComponent component.
 * Also see {@link SMSOTPRecovery.defaultProps}
 */
interface SMSOTPRecoveryProps extends IdentifiableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
    enableEditMobile?: boolean;
}

/**
 * SMS-OTP recovery section.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
export const SMSOTPRecovery: React.FunctionComponent<SMSOTPRecoveryProps> = (
    props: SMSOTPRecoveryProps
): ReactElement => {

    const {
        onAlertFired,
        enableEditMobile,
        ["data-componentid"]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: ThunkDispatch<AppState, any, AnyAction> = useDispatch();

    const profileInfo: BasicProfileInterface = useSelector(
        (state: AppState) => state.authenticationInformation.profileInfo
    );
    const phoneNumberSchema: ProfileSchema = useSelector((state: AppState) => {
        const phoneNumberSchemas: ProfileSchema = state.authenticationInformation.profileSchemas.find(
            (profileSchema: ProfileSchema) => {
                return profileSchema.name === "phoneNumbers";
            });

        if (phoneNumberSchemas && phoneNumberSchemas.subAttributes) {
            const mobileSchema: ProfileSchema = phoneNumberSchemas.subAttributes?.find(
                (subAttribute: ProfileSchema) => {
                    return subAttribute.name === "mobile";
                });

            if (mobileSchema) return mobileSchema;
        }

        return phoneNumberSchemas;
    });
    const activeForm: string = useSelector((state: AppState) => state.global.activeForm);

    const [ mobile, setMobile ] = useState("");
    const [ editedMobile, setEditedMobile ] = useState("");

    let mobileType: string;

    useEffect(() => {
        if (isEmpty(profileInfo)) {
            dispatch(getProfileInformation());
        }
    }, []);

    const handleUpdate = (mobile: string) => {
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
                        "myAccount:components.accountRecovery.SMSOTPRecovery.notifications.updateMobile" +
                        ".success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.accountRecovery.SMSOTPRecovery.notifications.updateMobile.success.message"
                    )
                });

                dispatch(getProfileInformation());
                dispatch(setActiveForm(null));
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    onAlertFired({
                        description: t(
                            "myAccount:components.accountRecovery.SMSOTPRecovery." +
                            "notifications.updateMobile.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.accountRecovery.SMSOTPRecovery." +
                            "notifications.updateMobile.error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "myAccount:components.accountRecovery.SMSOTPRecovery." +
                        "notifications.updateMobile.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.accountRecovery.SMSOTPRecovery." +
                        "notifications.updateMobile.genericError.message"
                    )
                });
            });
    };

    /**
     * This function gets the mobile number from the response passed as the argument
     * and assigns it to email and editedMobile.
     * @param response - response as the parameter.
     * Temporarily the first mobile type element in the phoneNumbers array is shown.
     * In the future, we need to decide whether or not to allow multiple recovery mobiles.
     */
    const setMobileNumber = (response: BasicProfileInterface) => {
        let mobileNumber: string = "";

        if (response.phoneNumbers) {
            if (typeof response.phoneNumbers[0] === "object") {
                const mobileValue : MultiValue = response.phoneNumbers.find(
                    (phoneNumber : MultiValue) => phoneNumber.type === "mobile");

                mobileNumber = mobileValue?.value;
                mobileType = mobileValue?.type;
            } else {
                mobileNumber = response.phoneNumbers[0] as string;
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
     *
     */
    const handleEdit = () => {
        dispatch(setActiveForm(CommonConstants.SECURITY + SMS_OTP));
    };

    /**
     * This is called when the cancel button is pressed
     */
    const handleCancel = () => {
        dispatch(setActiveForm(null));
    };

    /**
     * This function masks the mobile number passed as the argument and returns
     * the masked mobile number.
     * The text between the third character of the mobile and the second last character is masked.
     * @param mobileNumber - mobile number.
     */
    const maskMobile = (mobileNumber: string) => {
        return mobileNumber.slice(0,3) + "*".repeat(mobileNumber.length - 5) + mobileNumber.slice(-2);
    };

    /**
     * This function returns the EditSection component and the recovery option
     * elements based on if the edit icon has been clicked
     */
    const showEditView = () => {
        if (activeForm!==CommonConstants.SECURITY+SMS_OTP) {
            return (
                <Grid padded={ true }>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column width={ 11 } className="first-column">
                            <List.Content floated="left">
                                <GenericIcon
                                    icon={ getAccountRecoveryIcons().sms }
                                    size="mini"
                                    twoTone={ true }
                                    transparent={ true }
                                    square={ true }
                                    rounded={ true }
                                    relaxed={ true }
                                />
                            </List.Content>
                            <List.Content>
                                <List.Header>{
                                    t("myAccount:components.accountRecovery.SMSOTPRecovery.heading")
                                }</List.Header>
                                <List.Description className="mt-2">
                                    {
                                        mobile || mobile !== "" ?
                                            t("myAccount:components.accountRecovery.SMSOTPRecovery.descriptions.update",
                                                { mobile: mobile ? maskMobile(mobile) : "" })
                                            : (
                                                <Hint>
                                                    { t("myAccount:components.accountRecovery.SMSOTPRecovery." +
                                                    "descriptions.emptyMobile") }
                                                </Hint>
                                            )
                                    }
                                </List.Description>
                            </List.Content>
                        </Grid.Column>
                        <Grid.Column width={ 5 } className="last-column">
                            <List.Content floated="right">
                                { (mobile || mobile !== "") && (
                                    enableEditMobile ? (
                                        <Icon
                                            link={ true }
                                            onClick={ handleEdit }
                                            data-testid={ `${testId}-edit-button` }
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
                                                data-testid={ `${testId}-view-button` }
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
            <EditSection data-testid={ `${testId}-edit-section` }>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <List>
                                <List.Item>
                                    <List.Content>
                                        <Forms
                                            onSubmit={ (values: Map<string, FormValue>) => {
                                                handleUpdate(values.get("mobile").toString());
                                            } }
                                            data-testid={ `${testId}-edit-section-form` }
                                        >
                                            { (mobile || mobile !== "") && (
                                                <Field
                                                    data-testid={ `${testId}-edit-section-form-mobile-field` }
                                                    autoFocus={ true }
                                                    readOnly={ !enableEditMobile }
                                                    label={ t(
                                                        "myAccount:components.accountRecovery.SMSOTPRecovery.forms" +
                                                        ".mobileResetForm.inputs.mobile.label"
                                                    ) }
                                                    name="mobile"
                                                    placeholder={ t(
                                                        "myAccount:components.accountRecovery.SMSOTPRecovery.forms" +
                                                        ".mobileResetForm.inputs.mobile.placeholder"
                                                    ) }
                                                    required={ true }
                                                    requiredErrorMessage={ t(
                                                        "myAccount:components.accountRecovery.SMSOTPRecovery.forms" +
                                                        ".mobileResetForm.inputs.mobile.validations.empty"
                                                    ) }
                                                    type="text"
                                                    validation={ (value: string, validation: Validation) => {
                                                        if (!FormValidation.mobileNumber(value)) {
                                                            validation.isValid = false;
                                                            validation.errorMessages.push(
                                                                t("myAccount:components.accountRecovery.SMSOTPRecovery"
                                                                + ".forms.mobileResetForm.inputs.mobile."
                                                                + "validations.invalidFormat"
                                                                ).toString()
                                                            );
                                                        }
                                                    } }
                                                    value={ editedMobile }
                                                    width={ 9 }
                                                />) }
                                            {
                                                enableEditMobile ? (
                                                    <>
                                                        <p style={ { fontSize: "12px" } }>
                                                            <Icon color="grey" floated="left" name="info circle" />
                                                            { t(
                                                                "myAccount:components.profile.forms.mobileChangeForm" +
                                                                ".inputs.mobile.note"
                                                            ) }
                                                        </p>
                                                        <Field
                                                            hidden={ true }
                                                            type="divider"
                                                        />
                                                        <Form.Group inline={ true }>
                                                            <Field
                                                                size="small"
                                                                type="submit"
                                                                value={ t("common:update").toString() }
                                                                data-testid={
                                                                    `${testId}--edit-section-form-sumbit-button`
                                                                }
                                                            />
                                                            <Field
                                                                className="link-button"
                                                                onClick={ handleCancel }
                                                                size="small"
                                                                type="button"
                                                                value={ t("common:cancel").toString() }
                                                                data-testid={
                                                                    `${testId}--edit-section-form-cancel-button`
                                                                }
                                                            />
                                                        </Form.Group>
                                                    </>
                                                ):
                                                    (
                                                        <Form.Group inline={ true }>
                                                            <Field
                                                                className="button"
                                                                onClick={ handleCancel }
                                                                size="small"
                                                                type="button"
                                                                value={ t("common:done").toString() }
                                                                data-testid={
                                                                    `${testId}--edit-section-form-done-button`
                                                                }
                                                            />
                                                        </Form.Group>
                                                    )
                                            }
                                        </Forms>

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
 * Default props of {@link SMSOTPRecovery} component.
 * See type definitions in {@link SMSOTPRecoveryProps}
 */
SMSOTPRecovery.defaultProps = {
    "data-componentid": "sms-recovery",
    enableEditMobile: commonConfig.accountSecurityPage.accountRecovery.smsRecovery.enableEditMobile
};
