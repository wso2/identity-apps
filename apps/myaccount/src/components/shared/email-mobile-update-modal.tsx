/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { HttpResponse } from "@asgardeo/auth-react";
import Stack from "@mui/material/Stack/Stack";
import Button from "@oxygen-ui/react/Button";
import IconButton from "@oxygen-ui/react/IconButton";
import InputAdornment from "@oxygen-ui/react/InputAdornment/InputAdornment";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { XMarkIcon } from "@oxygen-ui/react-icons";
import { AlertLevels, IdentifiableComponentInterface, PatchOperationRequest } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/forms";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, MouseEvent, ReactElement } from "react";
import { FieldRenderProps } from "react-final-form";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Modal } from "semantic-ui-react";
import { updateProfileInfo } from "../../api/profile";
import { ProfilePatchOperationValue } from "../../models/profile";
import { OTPVerificationChannel } from "../../models/profile-ui";

interface EmailMobileUpdateModalPropsInterface extends IdentifiableComponentInterface {
    isOpen: boolean;
    isLoading?: boolean;
    initialValue: string;
    verificationChannel: OTPVerificationChannel;
    onClose: (shouldRevalidate?: boolean) => void;
    isRequired: boolean;
    prepareUpdateData: (newValue: string) => PatchOperationRequest<ProfilePatchOperationValue>;
    onUpdateSuccess: (newValue: string, updatedData: Record<string, unknown>) => void;
    onValidate: (value: string) => string | undefined;
}

const EmailMobileUpdateModal: FunctionComponent<EmailMobileUpdateModalPropsInterface> = (
    {
        verificationChannel,
        onClose,
        initialValue,
        isRequired,
        prepareUpdateData,
        onUpdateSuccess,
        onValidate,
        isOpen = false,
        isLoading = false,
        ["data-componentid"]: componentId = "email-mobile-update-modal"
    }: EmailMobileUpdateModalPropsInterface
): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    let formSubmit: (e: MouseEvent<HTMLButtonElement>) => void;

    const [ isSubmitting, setIsSubmitting ] = React.useState(false);

    const handleUpdate = async (newValue: string): Promise<void> => {
        setIsSubmitting(true);
        const data: PatchOperationRequest<ProfilePatchOperationValue> = prepareUpdateData(newValue);

        try {
            const response: HttpResponse = await updateProfileInfo(data as unknown as Record<string, unknown>);

            if (response.status === 200) {
                onUpdateSuccess(newValue, response.data);

                if (isEmpty(newValue)) {
                    dispatch(addAlert({
                        description: t(
                            "myAccount:components.profile.notifications.updateProfileInfo.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t("myAccount:components.profile.notifications.updateProfileInfo.success.message")
                    }));
                }

                return;
            }
            throw new Error("Failed to update profile information.");
        } catch (error) {
            dispatch(addAlert({
                description:
                    error?.response?.detail ??
                    t("myAccount:components.profile.notifications.updateProfileInfo.genericError.description"),
                level: AlertLevels.ERROR,
                message:
                    error?.message ??
                    t("myAccount:components.profile.notifications.updateProfileInfo.genericError.message")
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            data-componentid={ componentId }
            dimmer="blurring"
            size="mini"
            open={ isOpen }
            className="totp"
        >
            <Modal.Header className="wizard-header" data-componentid={ `${componentId}-header` }>
                { t(`myAccount:components.verificationOnUpdate.modal.${
                    verificationChannel.toLowerCase()}.step1.heading`) }
            </Modal.Header>
            <Modal.Content data-componentid={ `${componentId}-content` }>
                <FinalForm
                    onSubmit={ (values: Record<string, string>) => {
                        handleUpdate(values?.emailOrMobile);
                    } }
                    data-componentid={ `${componentId}-edit-section-form` }
                    render={ ({ handleSubmit }: FormRenderProps) => {
                        formSubmit = handleSubmit;

                        return (
                            <form onSubmit={ handleSubmit }>
                                <FinalFormField
                                    name="emailOrMobile"
                                    initialValue={ initialValue }
                                    validate={ onValidate }
                                >
                                    { (fieldProps: FieldRenderProps<string, HTMLElement, string>): ReactElement => {
                                        const hasValue: boolean = !!fieldProps.input.value;

                                        return (
                                            <TextFieldAdapter
                                                { ...fieldProps }
                                                label={ t(`myAccount:components.verificationOnUpdate.modal.${
                                                    verificationChannel.toLowerCase()}.step1.content.label`) }
                                                data-componentid={ `${componentId}-input-field` }
                                                required={ isRequired }
                                                endAdornment={
                                                    hasValue && !isRequired && (
                                                        <InputAdornment position="end">
                                                            <Tooltip title={ t("common:clear") }>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={ () => {
                                                                        fieldProps.input.onChange("");
                                                                        fieldProps.input.onBlur();
                                                                    } }
                                                                    data-componentid={
                                                                        `${componentId}-input-clear-button` }
                                                                    aria-label={ t("common:clear") }
                                                                >
                                                                    <XMarkIcon size={ 14 } />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </InputAdornment>
                                                    )
                                                }
                                                disabled={ isSubmitting }
                                                autoFocus
                                            />
                                        );
                                    } }
                                </FinalFormField>
                            </form>
                        );
                    } }
                />
            </Modal.Content>
            <Modal.Actions data-componentid={ `${componentId}-actions` }>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Button
                        onClick={ () => onClose() }
                        className="link-button"
                        disabled={ isLoading || isSubmitting }
                        data-componentid={ `${ componentId }-actions-cancel-button` }
                    >
                        { t("common:cancel") }
                    </Button>
                    <Button
                        variant="contained"
                        onClick={ (e: MouseEvent<HTMLButtonElement>) => {
                            formSubmit(e);
                        } }
                        loading={ isLoading || isSubmitting }
                        data-componentid={ `${componentId}-actions-primary-button` }
                    >
                        { t("common:continue") }
                    </Button>
                </Stack>
            </Modal.Actions>
        </Modal>
    );
};

export default EmailMobileUpdateModal;
