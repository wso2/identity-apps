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
import Box from "@oxygen-ui/react/Box";
import ScriptEditorPanel from "@wso2is/admin.authentication-flow-builder.v1/components/script-editor-panel/script-editor-panel";
import { getCertificateIllustrations } from "@wso2is/admin.core.v1";
import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { FilePicker, LinkButton, PickerResult, XMLFileStrategy } from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, Modal } from "semantic-ui-react";
import "./new-policy-wizard.scss";

import { userConfig } from "@wso2is/admin.extensions.v1";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import Typography from "@oxygen-ui/react/Typography/Typography";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogActions from "@oxygen-ui/react/DialogActions";
import Stack from "@oxygen-ui/react/Stack";
import Button from "@oxygen-ui/react/Button";
import Dialog from "@oxygen-ui/react/Dialog";


interface NewPolicyWizardPropsInterface extends IdentifiableComponentInterface {
    closeWizard: () => void;
    open: boolean;
}

/**
 * New Policy Wizard
 *
 * @param props - Props injected to the component.
 * @returns New Policy Wizard component.
 */

export const NewPolicyWizard: FunctionComponent<NewPolicyWizardPropsInterface> =
(props: NewPolicyWizardPropsInterface): ReactElement => {
    const { closeWizard, [ "data-componentid" ]: componentId, open } = props;
    const { t } = useTranslation();

    const [ selectedXMLFile, setSelectedXMLFile ] = useState<File>(null);

    const xmlFileProcessingStrategy: XMLFileStrategy = useMemo( () => {
        return new XMLFileStrategy(
            undefined  // Mimetype.
            // userConfig.bulkUserImportLimit.fileSize * FileStrategy.KILOBYTE,  // File Size.
            // userLimit ? userLimit : userConfig.bulkUserImportLimit.userCount  // Row Count.
        );
    }, []);


    return (
        <Dialog
            aria-labelledby="add-policy-modal"
            onClose={ closeWizard }
            data-componentid={ componentId }
            maxWidth="md"
            className="add-tenant-modal"
            open={ open }
        >
            <DialogTitle>
                <Typography variant="h4">{ t("policyAdministration:createPolicy.title") }</Typography>
                <Typography variant="body2">
                    { t("policyAdministration:createPolicy.description") }
                </Typography>
            </DialogTitle>
            <DialogContent className="policy-editor-container" dividers>
                <FilePicker
                    key={ 1 }
                    fileStrategy={ xmlFileProcessingStrategy }
                    file={ selectedXMLFile }
                    onChange={ (
                        result: PickerResult<{
                                                    headers: string[];
                                                    items: string[][];
                                                }>) => {
                        setSelectedXMLFile(result.file);

                    } }
                    uploadButtonText="Upload XML File"
                    dropzoneText="Drag and drop a XML file here."
                    data-componentid={ `${componentId}-form-wizard-csv-file-picker` }
                    icon={ getCertificateIllustrations().uploadPlaceholder }
                    placeholderIcon={ <Icon name="file code" size="huge" /> }
                    pasteAreaPlaceholderText="Paste the XACML Policy here"
                    normalizeStateOnRemoveOperations={ true }
                    emptyFileError={ false }
                    scriptEditor={
                        (<Box className={ "policy-editor" }>
                            <ScriptEditorPanel language="xml" hideMinimizeIcon={ true } hideText={ true } />
                        </Box>)
                    }
                />
            </DialogContent>
            <DialogActions>
                <Box className="add-tenant-modal-actions">
                    <Stack direction="row" justifyContent="space-between">
                        <Button
                            variant="text"
                            color="primary"
                            onClick={ (e: MouseEvent<HTMLButtonElement>) => closeWizard() }
                        >
                            { t("tenants:addTenant.actions.cancel.label") }
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            autoFocus
                            onClick={ () => {
                            } }
                        >
                            { t("tenants:addTenant.actions.save.label") }
                        </Button>
                    </Stack>
                </Box>
            </DialogActions>
        </Dialog>

    );
};
