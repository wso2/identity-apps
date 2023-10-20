/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { Grid } from "@oxygen-ui/react";
import { VerticalStepper, VerticalStepperStepInterface } from "@wso2is/common";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EmphasizedSegment, PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { RoleBasics } from "./role-basics";
import { AppConstants } from "../../../core/constants";
import { history } from "../../../core/helpers";
import { CreateRoleFormData, CreateRoleStateInterface, CreateRoleStepsFormTypes } from "../../models";

/**
 * Interface which captures create role props.
 */
type CreateRoleProps = IdentifiableComponentInterface;

/**
 * Component to handle addition of a new role to the system.
 *
 * @param props - props related to the create role stepper
 */
export const CreateRoleWizard: FunctionComponent<CreateRoleProps> = (props: CreateRoleProps): ReactElement => {

    const { [ "data-componentid" ]: componentId } = props;

    const { t } = useTranslation();

    const [ stepperState, setStepperState ] = useState<CreateRoleStateInterface>(undefined);
    const [ isBasicDetailsNextButtonDisabled, setIsBasicDetailsNextButtonDisabled ] = useState<boolean>(true);

    //External trigger to submit the authorization step. 
    let submitRoleBasic: () => void;

    /**
     * Handles wizard step submit.
     *
     * @param values - Forms values to be stored in state.
     * @param formType - Type of the form.
     */
    const handleWizardSubmit = (values: CreateRoleFormData, formType: CreateRoleStepsFormTypes) => {
        setStepperState({ ...stepperState, [ formType ]: values });
    };

    const creationFlowSteps: VerticalStepperStepInterface[] = [
        {
            preventGoToNextStep: isBasicDetailsNextButtonDisabled,
            stepAction: () => submitRoleBasic(),
            stepContent: (
                <RoleBasics
                    triggerSubmission={ (submitFunctionCb: () => void) => {
                        submitRoleBasic = submitFunctionCb;
                    } }
                    setIsNextDisabled={ setIsBasicDetailsNextButtonDisabled  }
                    initialValues={ stepperState && stepperState[ CreateRoleStepsFormTypes.BASIC_DETAILS ] }
                    onSubmit={ (values: CreateRoleFormData) => {
                        handleWizardSubmit(values, CreateRoleStepsFormTypes.BASIC_DETAILS);
                    } }
                />
            ),
            stepTitle: t("console:manage.features.roles.addRoleWizard.wizardSteps.0")
        }
    ];

    return (
        <PageLayout
            title={ t("console:manage.features.roles.addRoleWizard.heading", { type: "Role" }) }
            contentTopMargin={ true }
            description={ t("console:manage.features.roles.addRoleWizard.subHeading", { type: "role" }) }
            backButton={ {
                "data-componentid": `${componentId}-page-back-button`,
                onClick: () => history.push(AppConstants.getPaths().get("ROLES")),
                text: t("console:manage.features.roles.addRoleWizard.back") 
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            showBottomDivider
            data-componentid={ `${componentId}-page-layout` }
        >
            <div className="remote-user-store-create-section">
                <EmphasizedSegment padded="very">
                    <Grid container>
                        <Grid>
                            <VerticalStepper
                                alwaysOpen={ false }
                                isSidePanelOpen={ false }
                                stepContent={ creationFlowSteps }
                                isNextEnabled={ true }
                                data-componentid={ `${componentId}-vertical-stepper` }
                                handleFinishAction={ () => null }
                            />
                        </Grid>
                    </Grid>
                </EmphasizedSegment>
            </div>
        </PageLayout>
    );
};

/**
 * Default props for Create role wizard component.
 */
CreateRoleWizard.defaultProps = {
    "data-componentid": "create-role-wizard"
};
