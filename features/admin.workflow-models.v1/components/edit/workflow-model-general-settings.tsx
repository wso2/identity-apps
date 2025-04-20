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
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, DangerZone, DangerZoneGroup, EmphasizedSegment, 
    Popup, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid } from "semantic-ui-react";
import { deleteWorkflowById } from "../../api";
import { WorkflowDetails } from "../../models";
import { ConfigurationsFormValuesInterface, GeneralDetailsFormValuesInterface } from "../../models/ui";
import GeneralWorkflowModelDetailsForm, {
    GeneralWorkflowModelDetailsFormRef
} from "../create/general-workflow-model-details-form";

/**
 * Props for the workflow model general settings component.
 */
export interface WorkflowModelGeneralSettingsInterface extends IdentifiableComponentInterface {
    workflowModel: WorkflowDetails;
    workflowModelId: string;
    isReadOnly?: boolean;
    onSubmit?: (values: GeneralDetailsFormValuesInterface | ConfigurationsFormValuesInterface) => void;
}

export const WorkflowModelGeneralSettings: FunctionComponent<WorkflowModelGeneralSettingsInterface> = (
    props: WorkflowModelGeneralSettingsInterface
): ReactElement => {
    const {
        workflowModel,
        isReadOnly = false,
        onSubmit,
        ["data-componentid"]: componentId
    } = props;

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();
    const [ showWorkflowModelDeleteConfirmation, setShowWorkflowModelDeleteConfirmationModal ] = useState(false);
    const generalWorkflowModelDetailsFormRef: MutableRefObject<GeneralWorkflowModelDetailsFormRef> = useRef<
        GeneralWorkflowModelDetailsFormRef
    >(null);

    const [ formValues, setFormValues ] = useState<GeneralDetailsFormValuesInterface>({
        name: workflowModel.name,
        description: workflowModel.description,
        engine: workflowModel.engine
    });

    // Update formValues when the workflowModel changes
    useEffect(() => {
        setFormValues({
            name: workflowModel.name,
            description: workflowModel.description,
            engine: workflowModel.engine
        });
    }, [ workflowModel ]);

    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(formValues);
        }
    };

    const handleAlerts = (alert: AlertInterface) => {
        dispatch(addAlert(alert));
    };

    const handleWorkflowModelDelete = (workflowModelId: string): void => {
        deleteWorkflowById(workflowModelId)
            .then(() => {
                handleAlerts({
                    description: t(
                        "console:manage.features.workflowModels.notifications.deleteWorkflowModel.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.workflowModels.notifications.deleteWorkflowModel.success.message"
                    )
                });
                history.push(AppConstants.getPaths().get("WORKFLOW_MODELS"));
            })
            .catch(() => {
                handleAlerts({
                    description: t(
                        "console:manage.features.workflowModels.notifications." +
                                "deleteWorkflowModel.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.workflowModels.notifications." + "deleteWorkflowModel.error.message"
                    )
                });
            });
    };


    /**
         * The following function  renders the user store delete confirmation modal.
         *
         * @returns delete confirmation modal.
         */
    const deleteConfirmation = (): ReactElement => (
        <ConfirmationModal
            data-componentid={ `${componentId}-delete-confirmation-modal` }
            onClose={ (): void => setShowWorkflowModelDeleteConfirmationModal(false) }
            type="negative"
            open={ showWorkflowModelDeleteConfirmation }
            assertionHint={ t("roles:list.confirmations.deleteItem.assertionHint") }
            assertionType="checkbox"
            primaryAction="Confirm"
            secondaryAction="Cancel"
            onSecondaryActionClick={ (): void => setShowWorkflowModelDeleteConfirmationModal(false) }
            onPrimaryActionClick={ (): void => {
                handleWorkflowModelDelete(workflowModel.id);
                setShowWorkflowModelDeleteConfirmationModal(false);
            } }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header data-componentid={ `${componentId}-delete-confirmation-modal-header` }>
                { t("roles:list.confirmations.deleteItem.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                negative
                data-componentid={ `${componentId}-delete-confirmation-modal-message` }
            >
                { t("roles:list.confirmations.deleteItem.message", { type: "workflow model" }) }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-componentid={ `${componentId}-delete-confirmation-modal-content` }>
                { t("roles:list.confirmations.deleteItem.content", { type: "workflow model" }) }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );


    return (
        <>
            <EmphasizedSegment
                padded="very"
            >
                <Grid >
                    <Grid.Row>
                        <GeneralWorkflowModelDetailsForm
                            ref={ generalWorkflowModelDetailsFormRef }
                            isReadOnly={ !true }
                            initialValues={ formValues }
                            onSubmit={ handleSubmit }
                            data-componentid={ `${componentId}-general-details-form` }
                        />
                    </Grid.Row>
                    <Popup
                        trigger={
                            (<div
                                className="mb-1x mt-1x inline-button button-width"
                                data-componentid={ `${componentId}-update-button-wrapper` }
                            >
                                <PrimaryButton
                                    type="submit"
                                    disabled={ false }
                                    onClick={ () => {
                                        generalWorkflowModelDetailsFormRef.current?.triggerSubmit();
                                    } }
                                    data-componentid={ `${componentId}-update-button` }
                                >
                                    { "Update" }
                                </PrimaryButton>
                            </div>)
                        }
                        content={ t("extensions:manage.features.userStores.edit.general.disable.buttonDisableHint") }
                        size="mini"
                        wide
                        readOnly={ isReadOnly }
                        data-componentid={ `${componentId}-update-popup` }
                    />
                </Grid>
            </EmphasizedSegment>

            <DangerZoneGroup
                sectionHeader={ t("common:dangerZone") }
                data-componentid={ `${componentId}-danger-zone-group` }
            >
                <DangerZone
                    actionTitle={ "Delete Workflow Model" }
                    header={ "Delete Workflow Model" }
                    subheader={ "Once you delete a workflow model, there is no going back. Please be certain" }
                    onActionClick={ () => setShowWorkflowModelDeleteConfirmationModal(true) }
                    data-componentid={ `${componentId}-danger-zone` }
                />
            </DangerZoneGroup>
            { showWorkflowModelDeleteConfirmation && deleteConfirmation() }
        </>
    );

};

export default WorkflowModelGeneralSettings;
