import React, { FunctionComponent, MutableRefObject, ReactElement, useRef } from "react";
import { WorkflowModelGeneralSettingsInterface } from "./workflow-model-general-settings";
import { EmphasizedSegment, Popup, PrimaryButton } from "@wso2is/react-components";
import { Grid } from "semantic-ui-react";
import ConfigurationsForm, { ConfigurationsFormRef } from "../create/configuration-details-form";
import { ApprovalSteps, ConfigurationsFormValuesInterface } from "../../models/ui";
import { useTranslation } from "react-i18next";

export const WorkflowModelConfigurationSettings: FunctionComponent<WorkflowModelGeneralSettingsInterface> = (
    props: WorkflowModelGeneralSettingsInterface
): ReactElement => {
    const { workflowModel, isReadOnly = false, onSubmit } = props;
    const configurationsFormRef: MutableRefObject<ConfigurationsFormRef> = useRef<ConfigurationsFormRef>(null);
    const { t } = useTranslation();

    const configurationDetails: Partial<ConfigurationsFormValuesInterface> = {
        approvalSteps: workflowModel.template?.steps.map(step => {
            const stepData: ApprovalSteps = {
                roles: [],
                users: []
            };
            step.options?.forEach(option => {
                if (option.entity === "roles") {
                    stepData.roles = option.values;
                } else if (option.entity === "users") {
                    stepData.users = option.values;
                }
            });
            return stepData;
        })
    };

    const handleSubmit = (values: any) => {
      console.log("Updated Configuration Details: ", values);
      onSubmit(values);
  };

    return (
        <EmphasizedSegment padded="very">
            <Grid>
                <Grid.Row>
                    <ConfigurationsForm
                        ref={configurationsFormRef}
                        isReadOnly={false}
                        initialValues={configurationDetails}
                        onSubmit={handleSubmit}
                    />
                </Grid.Row>
            </Grid>
            <Popup
                trigger={
                    <div className="mb-1x mt-1x inline-button button-width">
                        <PrimaryButton 
                          type="submit" 
                          disabled={false}
                          onClick={() => {
                            configurationsFormRef.current?.triggerSubmit();
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
        </EmphasizedSegment>
    );
};

export default WorkflowModelConfigurationSettings;
