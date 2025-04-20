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
import { EmphasizedSegment, Popup, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, MutableRefObject, ReactElement, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { WorkflowModelGeneralSettingsInterface } from "./workflow-model-general-settings";
import { OptionDetails, WorkflowTemplateParameters } from "../../models";
import { ApprovalSteps, ConfigurationsFormValuesInterface } from "../../models/ui";
import ConfigurationsForm, { ConfigurationsFormRef } from "../create/configuration-details-form";

export const WorkflowModelConfigurationSettings: FunctionComponent<WorkflowModelGeneralSettingsInterface> = (
    props: WorkflowModelGeneralSettingsInterface
): ReactElement => {
    const {
        workflowModel,
        isReadOnly = false,
        onSubmit,
        ["data-componentid"]: componentId
    } = props;
    const configurationsFormRef: MutableRefObject<ConfigurationsFormRef> = useRef<ConfigurationsFormRef>(null);
    const { t } = useTranslation();

    const configurationDetails: Partial<ConfigurationsFormValuesInterface> = {
        approvalSteps: workflowModel.template?.steps.map((step: WorkflowTemplateParameters) => {
            const stepData: ApprovalSteps = {
                roles: [],
                users: []
            };

            step.options?.forEach((option: OptionDetails) => {
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
        onSubmit(values);
    };

    return (
        <EmphasizedSegment
            padded="very"
        >
            <Grid>
                <Grid.Row>
                    <ConfigurationsForm
                        ref={ configurationsFormRef }
                        isReadOnly={ false }
                        initialValues={ configurationDetails }
                        onSubmit={ handleSubmit }
                        data-componentid={ `${componentId}-configurations-form` }
                    />
                </Grid.Row>
            </Grid>
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
                                configurationsFormRef.current?.triggerSubmit();
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
                data-componentid={ `${componentId}-update-popup` }
            />
        </EmphasizedSegment>

    );
};

export default WorkflowModelConfigurationSettings;
