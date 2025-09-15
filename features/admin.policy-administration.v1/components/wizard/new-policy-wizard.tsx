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
import Button from "@oxygen-ui/react/Button";
import Dialog from "@oxygen-ui/react/Dialog";
import DialogActions from "@oxygen-ui/react/DialogActions";
import DialogContent from "@oxygen-ui/react/DialogContent";
import DialogTitle from "@oxygen-ui/react/DialogTitle";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography/Typography";
import { getCertificateIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FilePicker, PickerResult, XMLFileStrategy } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Icon } from "semantic-ui-react";
import "./new-policy-wizard.scss";
import { createPolicy } from "../../api/entitlement-policies";
import { PolicyInterface } from "../../models/policies";
import { unformatXML } from "../../utils/utils";
import  PolicyEditor  from "../policy-editor/policy-editor";


interface NewPolicyWizardPropsInterface extends IdentifiableComponentInterface {
    closeWizard: () => void;
    open: boolean;
    mutateInactivityList: () => void;
}

/**
 * New Policy Wizard
 *
 * @param props - Props injected to the component.
 * @returns New Policy Wizard component.
 */

export const NewPolicyWizard: FunctionComponent<NewPolicyWizardPropsInterface> =
(props: NewPolicyWizardPropsInterface): ReactElement => {
    const { closeWizard, [ "data-componentid" ]: componentId, open, mutateInactivityList } = props;
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ selectedXMLFile, setSelectedXMLFile ] = useState<File>(null);
    const [ pastedContent, setPastedContent ] = useState<string>("");
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);


    const handleSave = async (): Promise<void> => {
        if (!pastedContent || pastedContent.trim().length === 0) {
            dispatch(
                addAlert({
                    description: t("policyAdministration:alerts.createFailure.description"),
                    level: AlertLevels.ERROR,
                    message: t("policyAdministration:alerts.createFailure.message")
                })
            );

            return;
        }

        setIsSubmitting(true);

        const rawXml: string = selectedXMLFile
            ? unformatXML(await selectedXMLFile.text())
            : unformatXML(pastedContent);

        const policy: PolicyInterface = {
            active: true,
            attributeDTOs: [],
            lastModifiedTime: null,
            lastModifiedUser: null,
            policy: rawXml,
            policyEditor: null,
            policyEditorData: [],
            policyId: "",
            policyIdReferences: [],
            policyOrder: 0,
            policySetIdReferences: [],
            policyType: null,
            promote: false,
            version: null
        };

        try {
            await createPolicy(policy);

            dispatch(
                addAlert({
                    description: t("policyAdministration:alerts.createSuccess.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("policyAdministration:alerts.createSuccess.message")
                })
            );

            closeWizard();
            mutateInactivityList();
        } catch (error) {
            dispatch(
                addAlert({
                    description: t("policyAdministration:alerts.createFailure.description"),
                    level: AlertLevels.ERROR,
                    message: t("policyAdministration:alerts.createFailure.message")
                })
            );
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    fileStrategy={ XML_FILE_PROCESSING_STRATEGY }
                    file={ selectedXMLFile }
                    onChange={ (result: PickerResult<any>) => {

                        setSelectedXMLFile(result?.file || null);

                        if (result?.file) {
                            const decodedXml: string = result.serialized ? atob(result.serialized) : "";

                            setPastedContent(decodedXml);
                        } else {
                            setPastedContent(result?.pastedContent || "");
                        }
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
                            <PolicyEditor
                                policyScript={ pastedContent }
                                onScriptChange={ (script: string) => {
                                    setPastedContent(script);
                                } }
                            />
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
                            onClick={ () => closeWizard() }
                        >
                            { t("tenants:addTenant.actions.cancel.label") }
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            autoFocus
                            disabled={ isSubmitting }
                            onClick={ handleSave }
                        >
                            { t("tenants:addTenant.actions.save.label") }
                        </Button>
                    </Stack>
                </Box>
            </DialogActions>
        </Dialog>

    );
};

const XML_FILE_PROCESSING_STRATEGY: XMLFileStrategy = new XMLFileStrategy([
    "text/xml",
    "application/xml",
    ".xml"
]);

