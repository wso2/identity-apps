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

import Button from "@oxygen-ui/react/Button";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FinalForm, FinalFormField, TextFieldAdapter } from "@wso2is/forms";
import React, { FunctionComponent, ReactElement } from "react";
import { FieldRenderProps, FormRenderProps } from "react-final-form";
import { useTranslation } from "react-i18next";

/**
 * Maximum length of a device name accepted by the devices API.
 */
const DEVICE_NAME_MAX_LENGTH: number = 255;

interface RenameDeviceFormValuesInterface {
    deviceName: string;
}

interface RenameDeviceDialogPropsInterface extends IdentifiableComponentInterface {
    /**
     * Current name of the device.
     */
    initialName: string;
    isOpen: boolean;
    isSubmitting: boolean;
    onClose: () => void;
    /**
     * Called with the trimmed new name.
     */
    onSubmit: (deviceName: string) => void;
}

/**
 * Dialog to rename a registered device.
 *
 * @param props - Props injected to the component.
 * @returns Rename device dialog.
 */
export const RenameDeviceDialog: FunctionComponent<RenameDeviceDialogPropsInterface> = (
    props: RenameDeviceDialogPropsInterface
): ReactElement => {

    const {
        initialName,
        isOpen,
        isSubmitting,
        onClose,
        onSubmit,
        ["data-componentid"]: componentId = "rename-device-dialog"
    } = props;

    const { t } = useTranslation();

    const validateDeviceName = (value: string): string | undefined => {
        const trimmedValue: string = value?.trim() ?? "";

        if (trimmedValue.length === 0) {
            return t("myAccount:components.devices.modals.rename.validations.required");
        }

        if (trimmedValue.length > DEVICE_NAME_MAX_LENGTH) {
            return t("myAccount:components.devices.modals.rename.validations.maxLength",
                { max: DEVICE_NAME_MAX_LENGTH });
        }

        return undefined;
    };

    const handleClose = (): void => {
        if (!isSubmitting) {
            onClose();
        }
    };

    return (
        <Dialog
            open={ isOpen }
            onClose={ handleClose }
            fullWidth
            maxWidth="xs"
            data-componentid={ componentId }
        >
            <FinalForm<RenameDeviceFormValuesInterface>
                initialValues={ { deviceName: initialName } }
                onSubmit={ (values: RenameDeviceFormValuesInterface): void => {
                    onSubmit(values.deviceName.trim());
                } }
                render={ ({ handleSubmit, pristine }: FormRenderProps<RenameDeviceFormValuesInterface>) => (
                    <form onSubmit={ handleSubmit } noValidate>
                        <DialogTitle data-componentid={ `${ componentId }-title` }>
                            { t("myAccount:components.devices.modals.rename.heading") }
                        </DialogTitle>
                        <DialogContent data-componentid={ `${ componentId }-content` }>
                            <FinalFormField name="deviceName" validate={ validateDeviceName }>
                                { (fieldProps: FieldRenderProps<string, HTMLElement, string>): ReactElement => (
                                    <TextFieldAdapter
                                        { ...fieldProps }
                                        label={ t("myAccount:components.devices.modals.rename.label") }
                                        placeholder={ t("myAccount:components.devices.modals.rename.placeholder") }
                                        required
                                        autoFocus
                                        disabled={ isSubmitting }
                                        data-componentid={ `${ componentId }-name-input` }
                                    />
                                ) }
                            </FinalFormField>
                        </DialogContent>
                        <DialogActions data-componentid={ `${ componentId }-actions` }>
                            <Button
                                onClick={ handleClose }
                                disabled={ isSubmitting }
                                data-componentid={ `${ componentId }-cancel-button` }
                            >
                                { t("common:cancel") }
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={ pristine || isSubmitting }
                                loading={ isSubmitting }
                                data-componentid={ `${ componentId }-submit-button` }
                            >
                                { t("myAccount:components.devices.modals.rename.primaryAction") }
                            </Button>
                        </DialogActions>
                    </form>
                ) }
            />
        </Dialog>
    );
};
