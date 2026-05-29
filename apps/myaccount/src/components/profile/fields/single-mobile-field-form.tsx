/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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

import Button from "@oxygen-ui/react/Button";
import { ProfileConstants } from "@wso2is/core/constants";
import { PatchOperationRequest } from "@wso2is/core/models";
import { Popup, useMediaContext } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import isEmpty from "lodash-es/isEmpty";
import React, { Dispatch, FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Icon, List } from "semantic-ui-react";
import EmptyValueField from "./empty-value-field";
import TextFieldForm from "./text-field-form";
import { ProfilePatchOperationValue } from "../../../models/profile";
import { OTPVerificationChannel, SingleMobileFieldFormPropsInterface } from "../../../models/profile-ui";
import { getProfileInformation } from "../../../store/actions/authenticate";
import { setActiveForm } from "../../../store/actions/global";
import { EditSection } from "../../shared/edit-section";
import EmailMobileUpdateModal from "../../shared/email-mobile-update-modal";
import OTPVerificationModal from "../../shared/otp-verification-modal/otp-verification-modal";
import "./field-form.scss";

const SingleMobileFieldForm: FunctionComponent<SingleMobileFieldFormPropsInterface> = ({
    fieldSchema: schema,
    fieldLabel,
    initialValue,
    isEditable,
    isActive,
    isRequired,
    isLoading,
    isUpdating,
    onEditClicked,
    onEditCancelClicked,
    isVerificationEnabled,
    triggerUpdate,
    setIsProfileUpdating,
    ["data-componentid"]: testId = "single-mobile-field-form"
}: SingleMobileFieldFormPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const { isMobileViewport } = useMediaContext();
    const dispatch: Dispatch<any> = useDispatch();

    const [ isMobileUpdateModalOpen, setIsMobileUpdateModalOpen ] = useState<boolean>(false);
    const [ isOTPVerificationModalOpen, setIsOTPVerificationModalOpen ] = useState<boolean>(false);

    const renderFieldContent = (): ReactElement => {
        return (
            <List.Content>
                <List.Description className="with-max-length">
                    { initialValue }
                </List.Description>
            </List.Content>
        );
    };

    /**
     * Start of Utility functions for Mobile verification with OTP flow.
     */

    const prepareMobileUpdateData = (value: string): PatchOperationRequest<ProfilePatchOperationValue> => {
        const data: PatchOperationRequest<ProfilePatchOperationValue> = {
            Operations: [],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        data.Operations.push({
            op: "add",
            value: {
                [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PHONE_NUMBERS")]: [
                    { type: "mobile", value: value ?? "" }
                ]
            }
        });

        data.Operations.push({
            op: "replace",
            value: {
                [ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA] : {
                    [ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFY_MOBILE")] : true
                }
            }
        });

        return data;
    };

    const onMobileUpdateSuccess = (newValue: string, updatedData: Record<string, unknown>): void => {
        const updatedPendingMobileNumber: string = (
            updatedData?.[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA] as Record<string, unknown>)
            ?.pendingMobileNumber as string;

        setIsMobileUpdateModalOpen(false);
        if (updatedPendingMobileNumber && updatedPendingMobileNumber === newValue) {
            // Navigate to the OTP verification step.
            setIsOTPVerificationModalOpen(true);
        }
        if (isEmpty(newValue)) {
            // Re-fetch the profile information.
            dispatch(getProfileInformation(true));
            dispatch(setActiveForm(null));
        }
    };

    const handleOTPVerificationModalClose = (isRevalidate: boolean = false): void => {
        setIsOTPVerificationModalOpen(false);
        setIsProfileUpdating(false);

        if (isRevalidate) {
            // Re-fetch the profile information.
            dispatch(getProfileInformation(true));
            dispatch(setActiveForm(null));
        }
    };

    const handleMobileInputValidation = (value: string): string | undefined => {
        if (isRequired && !value) {
            return t("myAccount:components.verificationOnUpdate.modal.sms.step1.validation.required");
        }

        if (value && !FormValidation.mobileNumber(value)) {
            return t("myAccount:components.verificationOnUpdate.modal.sms.step1.validation.invalidFormat");
        }
    };

    /**
     * End of Utility functions for Mobile verification with OTP flow.
     */

    const handleSingleMobileUpdate = (_: string, value: string): void => {
        setIsProfileUpdating(true);

        const data: PatchOperationRequest<ProfilePatchOperationValue> = prepareMobileUpdateData(value);

        triggerUpdate(data);
    };

    if (isActive) {
        if (isVerificationEnabled) {
            return (
                <EditSection data-testid={ `${testId}-schema-mobile-editing-section` }>
                    <p>{ t("myAccount:components.profile.messages.mobileVerification.content") }</p>
                    <Grid padded={ true }>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 6 } tablet={ 6 } computer={ 4 } className="first-column">
                                <List.Content>{ fieldLabel }</List.Content>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 10 }>
                                <List.Content>
                                    <List.Description className="with-max-length">
                                        {
                                            !isEmpty(initialValue)
                                                ? initialValue
                                                : (
                                                    <a
                                                        className="placeholder-text"
                                                        tabIndex={ 0 }
                                                        onClick={ () => setIsMobileUpdateModalOpen(true) }
                                                        onKeyPress={ (
                                                            { key }: React.KeyboardEvent<HTMLAnchorElement>
                                                        ) => {
                                                            if (key === "Enter") {
                                                                setIsMobileUpdateModalOpen(true);
                                                            }
                                                        } }
                                                        data-testid={
                                                            `${testId}-schema-mobile-editing-section-${
                                                                schema.name.replace(".", "-")
                                                            }-placeholder`
                                                        }
                                                    >
                                                        { t("myAccount:components.profile.forms.generic." +
                                                                    "inputs.placeholder", {
                                                            fieldName: fieldLabel.toLowerCase() })
                                                        }
                                                    </a>
                                                )
                                        }
                                    </List.Description>
                                </List.Content>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row columns={ 2 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 2 }>
                                <Button variant="contained" onClick={ () => setIsMobileUpdateModalOpen(true) }>
                                    { t("common:update").toString() }
                                </Button>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 2 }>
                                <Button
                                    onClick={ onEditCancelClicked }
                                >
                                    { t("common:cancel").toString() }
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <EmailMobileUpdateModal
                        isOpen={ isMobileUpdateModalOpen }
                        verificationChannel={ OTPVerificationChannel.SMS }
                        onClose={ (shouldRevalidate?: boolean) => {
                            setIsMobileUpdateModalOpen(false);
                            if (shouldRevalidate) {
                                setIsOTPVerificationModalOpen(true);
                            }
                            onEditCancelClicked();
                        } }
                        initialValue={ initialValue }
                        isRequired={ isRequired }
                        prepareUpdateData={ prepareMobileUpdateData }
                        onUpdateSuccess={ onMobileUpdateSuccess }
                        onValidate={ handleMobileInputValidation }
                    />

                    <OTPVerificationModal
                        isOpen={ isOTPVerificationModalOpen }
                        verificationChannel={ OTPVerificationChannel.SMS }
                        onClose={ handleOTPVerificationModalClose }
                        isMultiValued={ false }
                    />
                </EditSection>
            );
        }

        return (
            <TextFieldForm
                fieldSchema={ schema }
                initialValue={ initialValue }
                fieldLabel={ fieldLabel }
                isActive={ isActive }
                isEditable={ isEditable }
                onEditClicked={ onEditClicked }
                onEditCancelClicked={ onEditCancelClicked }
                isRequired={ isRequired }
                setIsProfileUpdating={ setIsProfileUpdating }
                isLoading={ isLoading }
                isUpdating={ isUpdating }
                data-componentid={ testId }
                handleSubmit={ handleSingleMobileUpdate }
            />
        );
    }

    return (
        <Grid padded={ true }>
            <Grid.Row columns={ 3 }>
                <Grid.Column mobile={ 6 } computer={ 4 } className="first-column">
                    <List.Content className="vertical-align-center field-label">
                        <span className={ isRequired ? "required" : "" }>{ fieldLabel }</span>
                    </List.Content>
                </Grid.Column>
                <Grid.Column mobile={ 8 } computer={ 10 }>
                    <List.Content>
                        <List.Description className="with-max-length">
                            { isEmpty(initialValue) ? (
                                <EmptyValueField
                                    schema={ schema }
                                    fieldLabel={ fieldLabel }
                                    onEditClicked={ onEditClicked }
                                />
                            ) : (
                                renderFieldContent()
                            ) }
                        </List.Description>
                    </List.Content>
                </Grid.Column>
                <Grid.Column mobile={ 2 } className={ `${!isMobileViewport ? "last-column" : ""}` }>
                    <List.Content floated="right" className="vertical-align-center">
                        { isEditable && (
                            <Popup
                                trigger={
                                    (<Icon
                                        link={ true }
                                        className="list-icon"
                                        size="small"
                                        color="grey"
                                        tabIndex={ 0 }
                                        onKeyPress={ (e: React.KeyboardEvent<HTMLElement>) => {
                                            if (e.key === "Enter") {
                                                onEditClicked();
                                            }
                                        } }
                                        onClick={ onEditClicked }
                                        name="pencil alternate"
                                        data-testid={ `profile-schema-mobile-editing-section-${schema.name.replace(
                                            ".",
                                            "-"
                                        )}-edit-button` }
                                    />)
                                }
                                position="top center"
                                content={ t("common:edit") }
                                inverted={ true }
                            />
                        ) }
                    </List.Content>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

export default SingleMobileFieldForm;
