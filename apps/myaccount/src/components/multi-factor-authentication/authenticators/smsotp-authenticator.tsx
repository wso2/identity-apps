/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { ProfileConstants } from "@wso2is/core/constants";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { SBACInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Field, Forms, Validation } from "@wso2is/forms";
import { GenericIcon, LinkButton, PrimaryButton } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Form, Grid, Icon, List } from "semantic-ui-react";
import { updateProfileInfo } from "../../../api";
import { getMFAIcons } from "../../../configs";
import { AppConstants, CommonConstants } from "../../../constants";
import { profileConfig } from "../../../extensions";
import { AlertInterface, AlertLevels, BasicProfileInterface, FeatureConfigInterface } from "../../../models";
import { AppState } from "../../../store";
import { getProfileInformation, setActiveForm } from "../../../store/actions";
import { EditSection } from "../../shared";
import { MobileUpdateWizard } from "../../shared/mobile-update-wizard";

/**
 * SMS key.
 *
 * @constant
 * @default
 * @type {string}
 */
const SMS = "sms";

/**
 * Prop types for the SMS OTP component.
 * Also see {@link SMSOTPAuthenticator.defaultProps}
 */
interface SMSOTPProps extends SBACInterface<FeatureConfigInterface>, TestableComponentInterface {
    onAlertFired: (alert: AlertInterface) => void;
    /**
     * This callback function handles the visibility of the
     * session termination modal.
     */
    handleSessionTerminationModalVisibility: (visibility: boolean) => void;
}

/**
 * SMS OTP section.
 *
 * @return {JSX.Element}
 */
export const SMSOTPAuthenticator: React.FunctionComponent<SMSOTPProps> = (props: SMSOTPProps): JSX.Element => {

    const {
        onAlertFired,
        featureConfig,
        ["data-testid"]: testId,
        handleSessionTerminationModalVisibility
    } = props;

    const [mobile, setMobile] = useState("");
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const profileInfo: BasicProfileInterface = useSelector(
        (state: any) => state.authenticationInformation.profileInfo
    );
    const activeForm: string = useSelector((state: AppState) => state.global.activeForm);
    const [ showMobileUpdateWizard, setShowMobileUpdateWizard ] = useState<boolean>(false);

    useEffect(() => {
        if (isEmpty(profileInfo)) {
            dispatch(getProfileInformation());
        }
    }, []);

    const setMobileNo = (response) => {
        let mobileNumber = "";
        response.phoneNumbers.map((mobileNo) => {
            mobileNumber = mobileNo.value;
        });
        setMobile(mobileNumber);
    };

    useEffect(() => {
        if (!isEmpty(profileInfo)) {
            setMobileNo(profileInfo);
        }
    }, [profileInfo]);

    const handleUpdate = (mobileNumber) => {
        const data = {
            Operations: [
                {
                    op: "replace",
                    value: {}
                }
            ],
            schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"]
        };

        data.Operations[0].value = {
            phoneNumbers: [
                {
                    type: "mobile",
                    value: mobileNumber
                }
            ]
        };

        updateProfileInfo(data)
            .then(() => {
                onAlertFired({
                    description: t(
                        "myAccount:components.mfa.smsOtp.notifications.updateMobile.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "myAccount:components.mfa.smsOtp.notifications.updateMobile.success.message"
                    )
                });

                dispatch(getProfileInformation());
                dispatch(setActiveForm(null));
                handleSessionTerminationModalVisibility(true);
            })
            .catch((error) => {
                if (error?.response?.data && error?.response?.detail) {
                    onAlertFired({
                        description: t(
                            "myAccount:components.mfa.smsOtp.notifications.updateMobile.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "myAccount:components.mfa.smsOtp.notifications.updateMobile.error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "myAccount:components.mfa.smsOtp.notifications.updateMobile.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "myAccount:components.mfa.smsOtp.notifications.updateMobile.genericError.message"
                    )
                });
            });
    };

    /**
     * This function generates the mobile number edit section when mobile verification is enabled.
     * @param {Profile Schema} schema.
     * @param {string} fieldName - Mobile number filed name.
     */
    const generateUpdateFormForMobileVerification = (): JSX.Element => {
        return (
            <>
                {
                    showMobileUpdateWizard
                        ? (
                            < MobileUpdateWizard
                                data-testid={ `${testId}-mobile-update-wizard` }
                                onAlertFired={ onAlertFired }
                                closeWizard={ () =>
                                    handleCloseMobileUpdateWizard()
                                }
                                wizardOpen={ true }
                                currentMobileNumber={ mobile }
                                isMobileRequired={ true }
                            />
                        )
                        : null
                }
                <EditSection data-testid={ `${testId}-mobile-verification-edit-section` }>
                    <p>
                        { t("myAccount:components.profile.messages.mobileVerification.content") }
                    </p>
                    <Grid padded={ true }>
                        <Grid.Row columns={ 2 }>
                            < Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">
                                <List.Content>{ t(
                                    "myAccount:components.profile.forms.mobileChangeForm.inputs" +
                                    ".mobile.label"
                                ) }</List.Content>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                                <List.Content>
                                    <List.Description>
                                        {
                                            mobile === ""
                                                ? (
                                                    <a
                                                        className="placeholder-text"
                                                        onClick={ () => {
                                                            setShowMobileUpdateWizard(true);
                                                        } }
                                                    >
                                                        { t(
                                                            "myAccount:components.profile.forms." +
                                                            "mobileChangeForm.inputs.mobile.label"
                                                        ) }
                                                    </a>
                                                )
                                                : mobile
                                        }
                                    </List.Description>
                                </List.Content>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 2 }>
                                <PrimaryButton
                                    floated="left"
                                    onClick={ () => {
                                        setShowMobileUpdateWizard(true);
                                    } }
                                >
                                    { t("common:update").toString() }
                                </PrimaryButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 2 }>
                                <LinkButton
                                    floated="left"
                                    onClick={ () => {
                                        dispatch(setActiveForm(null));
                                    } }
                                >
                                    { t("common:cancel").toString() }
                                </LinkButton>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid >
                </EditSection>
            </>
        );
    };

    /**
     * Handles the close action of the mobile update wizard.
     */
    const handleCloseMobileUpdateWizard = () => {
        setShowMobileUpdateWizard(false);
        dispatch(setActiveForm(null));
    };

    const handleEdit = () => {
        dispatch(setActiveForm(CommonConstants.SECURITY + SMS));
    };

    const handleCancel = () => {
        dispatch(setActiveForm(null));
    };

    const showEditView = () => {
        if (activeForm !== CommonConstants.SECURITY + SMS) {
            return (
                <Grid padded={ true }>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column width={ 1 } className="first-column">
                            <List.Content floated="left">
                                <GenericIcon
                                    icon={ getMFAIcons().sms }
                                    size="mini"
                                    twoTone={ true }
                                    transparent={ true }
                                    square={ true }
                                    rounded={ true }
                                    relaxed={ true }
                                />
                            </List.Content>
                        </Grid.Column>
                        <Grid.Column width={ 12 } className="first-column">
                            <List.Content>
                                <List.Header>{ t("myAccount:components.mfa.smsOtp.heading") }</List.Header>
                                <List.Description>
                                    { t("myAccount:components.mfa.smsOtp.descriptions.hint") }
                                </List.Description>
                            </List.Content>
                        </Grid.Column>
                        <Grid.Column width={ 3 } className="last-column">
                            <List.Content floated="right">
                                <Icon
                                    link={ true }
                                    onClick={ handleEdit }
                                    className="list-icon"
                                    size="small"
                                    color="grey"
                                    name="pencil alternate"
                                />
                            </List.Content>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            );
        }
        return (
            isFeatureEnabled(
                featureConfig?.personalInfo,
                AppConstants.FEATURE_DICTIONARY.get("PROFILEINFO_MOBILE_VERIFICATION")
            )
            ? generateUpdateFormForMobileVerification() :
            <EditSection data-testid={ `${testId}-edit-section` }>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <List>
                                <List.Item>
                                    <List.Content>
                                        <Forms
                                            onSubmit={ (values: Map<string, string>) => {
                                                handleUpdate(values.get("mobileNumber"));
                                            } }
                                        >
                                            <Field
                                                autoFocus={ true }
                                                label={ t(
                                                    "myAccount:components.profile.forms.mobileChangeForm.inputs" +
                                                    ".mobile.label"
                                                ) }
                                                name="mobileNumber"
                                                placeholder={ t(
                                                    "myAccount:components.profile.forms.mobileChangeForm" +
                                                    ".inputs.mobile.placeholder"
                                                ) }
                                                required={ true }
                                                requiredErrorMessage={ t(
                                                    "myAccount:components.profile.forms." +
                                                    "mobileChangeForm.inputs.mobile.validations.empty"
                                                ) }
                                                type="text"
                                                validation={ (value: string, validation: Validation) => {
                                                    if (!FormValidation.mobileNumber(value)) {
                                                        validation.isValid = false;
                                                        validation.errorMessages.push(t(
                                                            profileConfig?.attributes?.
                                                                getRegExpValidationError(ProfileConstants.SCIM2_SCHEMA_DICTIONARY
                                                                    .get("PHONE_NUMBERS")), 
                                                            {
                                                                fieldName: "Mobile"
                                                            }
                                                        ));
                                                    }
                                                } }
                                                value={ mobile }
                                            />
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
                                            <Form.Group>
                                                <Field
                                                    size="small"
                                                    type="submit"
                                                    value={ t("common:update").toString() }
                                                />
                                                <Field
                                                    className="link-button"
                                                    onClick={ handleCancel }
                                                    size="small"
                                                    type="button"
                                                    value={ t("common:cancel").toString() }
                                                />
                                            </Form.Group>
                                        </Forms>
                                    </List.Content>
                                </List.Item>
                            </List>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </EditSection>
        );
    };

    return <div data-testid={ testId }>{ showEditView() }</div>;
};

/**
 * Default properties of {@link SMSOTPAuthenticator}
 * See type definitions in {@link SMSOTPProps}
 */
SMSOTPAuthenticator.defaultProps = {
    "data-testid": "sms-otp-authenticator"
};
