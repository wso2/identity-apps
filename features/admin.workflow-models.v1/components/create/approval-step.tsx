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
import Grid from "@oxygen-ui/react/Grid";
import List from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import Typography from "@oxygen-ui/react/Typography";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { UserBasicInterface } from "@wso2is/admin.core.v1/models/users";
import { IdentifiableComponentInterface, RolesInterface } from "@wso2is/core/models";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StepRolesList } from "./create-step-roles";
import { StepUsersList } from "./create-step-users";
import { MultiStepApprovalTemplate } from "../../models";
import { ApprovalSteps } from "../../models/ui";
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
    initialValues?: ApprovalSteps;

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


const ApprovalStep: FunctionComponent<ApprovalStepProps> = (
    props: ApprovalStepProps
) => {
    const {
        step,
        isReadOnly = false,
        initialValues,
        hasErrors,
        updateUsers,
        updateRoles,
        onDelete,
        showValidationError,
        ["data-componentid"]: testId
        = "workflow-model-approval-step"
    } = props;

    const { t } = useTranslation();
    const [ validationError, setValidationError ] = useState<boolean>(false);
    const [ selectedUsers, setSelectedUsers ] = useState<UserBasicInterface[]>([]);
    const [ selectedRoles, setSelectedRoles ] = useState<RolesInterface[]>([]);

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
        <Card
            className="approval-step-card"
            key={ step.id }
            data-componentid={ `${testId}-card-${step.stepNumber}` }
        >
            <List data-componentid={ `${testId}-list-${step.stepNumber}` }>
                <Grid
                    container
                    justifyContent="space-between"
                    className="approval-step-heading"
                    data-componentid={ `${testId}-heading-${step.stepNumber}` }
                >
                    <Typography
                        variant="body2"
                        data-componentid={ `${testId}-label-${step.stepNumber}` }
                    >
                        { `Step ${step.stepNumber}` }
                    </Typography>
                </Grid>

                <Fab
                    color="error"
                    aria-label="delete"
                    size="small"
                    className="delete-button"
                    onClick={ () => onDelete(step.id) }
                    data-componentid={ `${testId}-delete-button-${step.stepNumber}` }
                >
                    <TrashIcon
                        className="delete-button-icon"
                        data-componentid={ `${testId}-delete-icon-${step.stepNumber}` }
                    />
                </Fab>

                <div
                    className="rules-component"
                    data-componentid={ `${testId}-rules-component-${step.stepNumber}` }
                >
                    <Box
                        className="box-container"
                        data-componentid={ `${testId}-box-container-${step.stepNumber}` }
                    >
                        <ListItem
                            className="list-item-roles"
                            data-componentid={ `${testId}-roles-list-item-${step.stepNumber}` }
                        >
                            <StepRolesList
                                initialValues={ initialValues }
                                isReadOnly={ isReadOnly }
                                onRolesChange={ handleRolesChange }
                                showValidationError={ validationError }
                                data-componentid={ `${testId}-roles-list-${step.stepNumber}` }
                            />
                        </ListItem>
                        <ListItem
                            className="list-item-users"
                            data-componentid={ `${testId}-users-list-item-${step.stepNumber}` }
                        >
                            <StepUsersList
                                initialValues={ initialValues }
                                isReadOnly={ isReadOnly }
                                onUsersChange={ handleUsersChange }
                                showValidationError={ validationError }
                                data-componentid={ `${testId}-users-list-${step.stepNumber}` }
                            />
                        </ListItem>
                    </Box>
                </div>
            </List>
        </Card>
    );
};

export default ApprovalStep;
