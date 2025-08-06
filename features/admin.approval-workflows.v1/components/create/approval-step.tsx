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
import { Fab } from "@mui/material";
import Box from "@oxygen-ui/react/Box";
import Card from "@oxygen-ui/react/Card";
import List from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import Typography from "@oxygen-ui/react/Typography";
import { XMarkIcon } from "@oxygen-ui/react-icons";
import { UserBasicInterface } from "@wso2is/admin.core.v1/models/users";
import { IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import StepRolesList from "./create-step-roles";
import StepUsersList from "./create-step-users";
import { MultiStepApprovalTemplate } from "../../models/approval-workflows";
import "./approval-step.scss";


/**
 * Props for the approval step component.
 */
interface ApprovalStepProps extends IdentifiableComponentInterface {

    /**
     * Step index in the workflow.
     */
    index: number;

    /**
     * Step configuration details.
     */
    step: MultiStepApprovalTemplate;

    /**
     * Whether the step is read-only.
     */
    isReadOnly?: boolean;

    /**
     * Initial values for the step.
     */
    initialValues?: MultiStepApprovalTemplate;

    /**
     * Whether there's only one step left.
     */
    isOneStepLeft?: boolean;

    /**
     * Whether to show validation errors.
     */
    showValidationError?: boolean;

    /**
     * Whether the step has any errors.
     */
    hasErrors?: boolean;

    /**
     * Callback to update users assigned to the step.
     */
    updateUsers: (users: UserBasicInterface[]) => void;

    /**
     * Callback to update roles assigned to the step.
     */
    updateRoles?: (roles: RolesInterface[]) => void;

    /**
     * Callback to delete the step.
     */
    onDelete: (stepId: string) => void;
}

/**
 * This component renders an approval step in a multi-step workflow.
 *
 * @param props - Props injected to the component.
 *
 * @returns The general user store details form component.
 */
const ApprovalStep: FunctionComponent<ApprovalStepProps> = (
    props: ApprovalStepProps
) => {
    const {
        step,
        isReadOnly = false,
        initialValues,
        isOneStepLeft,
        hasErrors,
        updateUsers,
        updateRoles,
        onDelete,
        showValidationError,
        ["data-componentid"]: componentId
        = "workflow-model-approval-step"
    } = props;

    const [ validationError, setValidationError ] = useState<boolean>(false);
    const [ selectedUsers, setSelectedUsers ] = useState<UserBasicInterface[]>([]);
    const [ selectedRoles, setSelectedRoles ] = useState<RolesInterface[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        if (selectedUsers?.length > 0 || selectedRoles?.length > 0) {
            setValidationError(false);
        } else if (selectedUsers?.length === 0 && selectedRoles?.length === 0 && hasErrors) {
            setValidationError(true);
        }
    }, [ selectedUsers, selectedRoles, hasErrors ]);

    useEffect(() => {
        setValidationError(showValidationError);
    },[ showValidationError ]);

    const handleUsersChange = (updatedUsers: UserBasicInterface[]) => {
        setSelectedUsers(updatedUsers);
        updateUsers(updatedUsers);
    };

    const handleRolesChange = (updatedRoles: RolesInterface[]) => {
        setSelectedRoles(updatedRoles);
        updateRoles(updatedRoles);
    };

    return (
        <div className="approval-step-wrapper" data-componentid={ `${componentId}-wrapper-${step.stepNumber}` }>
            <Typography
                variant="subtitle2"
                className="approval-step-label"
                data-componentid={ `${componentId}-label-${step.stepNumber}` }
            >
                { `Step ${step.stepNumber}` }
            </Typography>
            <Card
                className="approval-step-card"
                key={ step.id }
                data-componentid={ `${componentId}-card-${step.stepNumber}` }
            >

                <List data-componentid={ `${componentId}-list-${step.stepNumber}` }>
                    <Box
                        className="box-container"
                        data-componentid={ `${componentId}-box-container-${step.stepNumber}` }
                    >
                        <ListItem
                            className="list-item-roles"
                            data-componentid={ `${componentId}-roles-list-item-${step.stepNumber}` }
                        >
                            <StepRolesList
                                initialValues={ initialValues }
                                isReadOnly={ isReadOnly }
                                onRolesChange={ handleRolesChange }
                                showValidationError={ validationError }
                                data-componentid={ `${componentId}-roles-list-${step.stepNumber}` }
                            />
                        </ListItem>
                        <Typography align="center">
                            { t("approvalWorkflows:forms.configurations.template.condition") }
                        </Typography>
                        <ListItem
                            className="list-item-users"
                            data-componentid={ `${componentId}-users-list-item-${step.stepNumber}` }
                        >
                            <StepUsersList
                                initialValues={ initialValues }
                                isReadOnly={ isReadOnly }
                                onUsersChange={ handleUsersChange }
                                showValidationError={ validationError }
                                data-componentid={ `${componentId}-users-list-${step.stepNumber}` }
                            />
                        </ListItem>
                    </Box>
                </List>
                <Fab
                    variant="circular"
                    size="small"
                    onClick={ () => onDelete(step.id) }
                    data-componentid={ `${componentId}-delete-button-${step.stepNumber}` }
                    className={ "close-button" }
                    disabled={ isReadOnly || isOneStepLeft }
                >
                    <XMarkIcon
                        size="small"
                        data-componentid={ `${componentId}-delete-icon-${step.stepNumber}` }
                    />
                </Fab>

            </Card>
        </div>
    );
};

export default ApprovalStep;
