import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { WorkflowDetails, WorkflowEngineTypeDropdownOption } from "../../models";
import { DangerZone, DangerZoneGroup, EmphasizedSegment, Popup, PrimaryButton } from "@wso2is/react-components";
import { Grid } from "semantic-ui-react";
import { Field, Form } from "@wso2is/form";
import { validateInputWithRegex } from "../../utils/approvalProcess-utils";
import { APPROVALPROCESS_VALIDATION_REGEX_PATTERNS } from "../../constants/workflow-model-constants";
import { useTranslation } from "react-i18next";
import GeneralApprovalProcessDetailsForm, {
    GeneralApprovalProcessDetailsFormRef
} from "../create/general-workflow-model-details-form";
import { ConfigurationsFormValuesInterface, GeneralDetailsFormValuesInterface } from "../../models/ui";

/**
 * Props for the workflow model general settings component.
 */
export interface WorkflowModelGeneralSettingsInterface extends IdentifiableComponentInterface {
    workflowModel: WorkflowDetails;
    workflowModelId: string;
    isReadOnly?: boolean;
    onSubmit?: (values: GeneralDetailsFormValuesInterface | ConfigurationsFormValuesInterface) => void;
}

const FORM_ID = "workflow-model-general-settings-form";

const workflowEngineOptions: WorkflowEngineTypeDropdownOption[] = [
    { key: "engine_1", text: "Simple Workflow Engine", value: "workflowImplSimple" },
    { key: "engine_2", text: "Simple Workflow Engine 2", value: "workflowImplSimple 2" }
];

export const WorkflowModelGeneralSettings: FunctionComponent<WorkflowModelGeneralSettingsInterface> = (
    props: WorkflowModelGeneralSettingsInterface
): ReactElement => {
    const { workflowModel, isReadOnly = false, onSubmit } = props;
    const { t } = useTranslation();
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState<boolean>(false);
    const generalApprovalProcessDetailsFormRef: MutableRefObject<GeneralApprovalProcessDetailsFormRef> = useRef<
        GeneralApprovalProcessDetailsFormRef
    >(null);

    const [formValues, setFormValues] = useState<GeneralDetailsFormValuesInterface>({
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
    }, [workflowModel]);

    const handleSubmit = () => {
        console.log("Form values submitted:", formValues);
        if (onSubmit) {
            onSubmit(formValues);
        }
    };

    return (
        <>
            <EmphasizedSegment padded="very">
                <Grid>
                    <Grid.Row>
                        <GeneralApprovalProcessDetailsForm
                            ref={generalApprovalProcessDetailsFormRef}
                            isReadOnly={!true}
                            initialValues={formValues}
                            onSubmit={handleSubmit}
                        />
                    </Grid.Row>
                    <Popup
                        trigger={
                            <div className="mb-1x mt-1x inline-button button-width">
                                <PrimaryButton
                                    type="submit"
                                    disabled={false}
                                    onClick={() => {
                                        generalApprovalProcessDetailsFormRef.current?.triggerSubmit();
                                    }}
                                >
                                    {"Update"}
                                </PrimaryButton>
                            </div>
                        }
                        content={t("extensions:manage.features.userStores.edit.general.disable.buttonDisableHint")}
                        size="mini"
                        wide
                    />
                </Grid>
            </EmphasizedSegment>

            <DangerZoneGroup sectionHeader={t("common:dangerZone")}>
                <DangerZone
                    actionTitle={"Delete Workflow Model"}
                    header={"Delete Workflow Model"}
                    subheader={"Once you delete a workflow model, there is no going back. Please be certain"}
                    onActionClick={() => setShowDeleteConfirmationModal(true)}
                />
            </DangerZoneGroup>
        </>
    );
};

export default WorkflowModelGeneralSettings;
