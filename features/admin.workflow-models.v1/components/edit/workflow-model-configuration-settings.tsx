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
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
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
        // hasErrors,
        onSubmit,
        ["data-componentid"]: componentId
    } = props;

    const configurationDetails: ConfigurationsFormValuesInterface = {
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
    const configurationsFormRef: MutableRefObject<ConfigurationsFormRef> = useRef<ConfigurationsFormRef>(null);
    const { t } = useTranslation();
    const [ hasErrors, setHasErrors ] = useState<boolean>(false);
    const [ formValues, setFormValues ] = useState<ConfigurationsFormValuesInterface>(configurationDetails);

    const handleSubmit = (values: ConfigurationsFormValuesInterface) => {
        const hasInvalidSteps: boolean = values.approvalSteps.some(
            (step: ApprovalSteps) => step.users.length === 0 && step.roles.length === 0
        );

        if (hasInvalidSteps) {
            setHasErrors(true);
            setFormValues(values);

            return;
        }
        setHasErrors(false);
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
                        initialValues={ formValues }
                        onSubmit={ handleSubmit }
                        hasErrors={ hasErrors }
                        data-componentid={ `${componentId}-configurations-form` }
                    />
                </Grid.Row>
            </Grid>

            <PrimaryButton
                type="submit"
                disabled={ false }
                onClick={ () => {
                    configurationsFormRef.current?.triggerSubmit();
                } }
                data-componentid={ `${componentId}-update-button` }
            >
                { t("common:update") }
            </PrimaryButton>


        </EmphasizedSegment>

    );
};

export default WorkflowModelConfigurationSettings;
