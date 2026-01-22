/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Dialog, { DialogProps } from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ChangeEvent, FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Props interface of {@link ExportApplicationModal}
 */
export interface ExportApplicationModalProps extends DialogProps, IdentifiableComponentInterface {
    /**
     * Name of the application being exported.
     */
    applicationName: string;
    /**
     * Callback to be called when the export is triggered.
     * @param exportSecrets - Whether to export secrets or not.
     */
    onExport: (exportSecrets: boolean) => void;
    /**
     * Callback to be called when the modal is closed.
     */
    onClose: () => void;
}

/**
 * Modal to confirm application export with option to include secrets.
 *
 * @param props - Props injected to the component.
 * @returns Export Application Modal component.
 */
const ExportApplicationModal: FunctionComponent<ExportApplicationModalProps> = ({
    "data-componentid": componentId = "export-application-modal",
    applicationName,
    onExport,
    onClose,
    open,
    ...rest
}: ExportApplicationModalProps): ReactElement => {
    const { t } = useTranslation();
    const [ exportSecrets, setExportSecrets ] = useState<boolean>(false);

    /**
     * Handles the radio button change.
     */
    const handleRadioChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setExportSecrets(event.target.value === "true");
    };

    /**
     * Handles the export button click.
     */
    const handleExport = (): void => {
        onExport(exportSecrets);
        onClose();
    };

    return (
        <Dialog
            aria-labelledby="export-application-modal"
            open={ open }
            onClose={ onClose }
            data-componentid={ componentId }
            maxWidth="sm"
            fullWidth
            { ...rest }
        >
            <DialogTitle>
                <Typography variant="h4">
                    { t("applications:confirmations.exportApplication.title") }
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                <Stack spacing={ 2 }>
                    <Typography variant="body2">
                        { t("applications:confirmations.exportApplication.description",
                            { appName: applicationName }) }
                    </Typography>
                    <FormControl component="fieldset" fullWidth>
                        <RadioGroup
                            value={ String(exportSecrets) }
                            onChange={ handleRadioChange }
                            data-componentid={ `${componentId}-radio-group` }
                        >
                            <FormControlLabel
                                value="false"
                                control={ <Radio /> }
                                label={
                                    <Box>
                                        <Typography variant="body1">
                                            { t("applications:confirmations.exportApplication.secretsOption" +
                                                ".withoutSecrets.label") }
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            { t("applications:confirmations.exportApplication.secretsOption" +
                                                ".withoutSecrets.hint") }
                                        </Typography>
                                    </Box>
                                }
                                data-componentid={ `${componentId}-without-secrets-option` }
                            />
                            <FormControlLabel
                                value="true"
                                control={ <Radio /> }
                                label={
                                    <Box>
                                        <Typography variant="body1">
                                            { t("applications:confirmations.exportApplication.secretsOption" +
                                                ".withSecrets.label") }
                                        </Typography>
                                        <Typography variant="caption" color="textSecondary">
                                            { t("applications:confirmations.exportApplication.secretsOption" +
                                                ".withSecrets.hint") }
                                        </Typography>
                                    </Box>
                                }
                                data-componentid={ `${componentId}-with-secrets-option` }
                            />
                        </RadioGroup>
                    </FormControl>
                    { exportSecrets && (
                        <Alert severity="warning" data-componentid={ `${componentId}-warning` }>
                            { t("applications:confirmations.exportApplication.warning") }
                        </Alert>
                    ) }
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="text"
                    color="primary"
                    onClick={ onClose }
                    data-componentid={ `${componentId}-cancel-button` }
                >
                    { t("common:cancel") }
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={ handleExport }
                    data-componentid={ `${componentId}-export-button` }
                >
                    { t("common:export") }
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExportApplicationModal;
