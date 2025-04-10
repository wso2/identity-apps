import { TrashIcon } from "@oxygen-ui/react-icons";
import React, { FunctionComponent } from "react";
import List from "@oxygen-ui/react/List";
import ListItem from "@oxygen-ui/react/ListItem";
import Grid from "@oxygen-ui/react/Grid";
import Card from "@oxygen-ui/react/Card";
import Typography from "@oxygen-ui/react/Typography";
import { Fab } from "@mui/material";
import Box from "@oxygen-ui/react/Box";
import { MultiStepApprovalTemplate } from "./configuration-details-form";
import { StepUsersList } from "./create-step-users";
import { StepRolesList } from "./create-step-roles";
import "./configuration-details-form.scss";
import { useTranslation } from "react-i18next";
import { UserBasicInterface } from "@wso2is/admin.core.v1/models/users";
import { RolesInterface } from "@wso2is/core/models";
import { ApprovalSteps, ConfigurationsFormValuesInterface } from "../../models/ui";

interface ApprovalStepProps {
    index: number;
    step: MultiStepApprovalTemplate;
    isReadOnly?: boolean;
    initialValues?: ApprovalSteps;
    updateUsers: (users: UserBasicInterface[]) => void;
    updateRoles?: (roles: RolesInterface[]) => void;
    onDelete: (stepId: string) => void;
}

const ApprovalStep: FunctionComponent<ApprovalStepProps> = ({
    index,
    step,
    isReadOnly = false,
    initialValues, 
    updateUsers,
    updateRoles,
    onDelete
}) => {
    const { t } = useTranslation();

    const handleUsersChange = (updatedUsers: UserBasicInterface[]) => {
        console.log("Updated Users are, ", updatedUsers);
        updateUsers(updatedUsers);
    }

    const handleRolesChange = (updatedRoles: RolesInterface[]) => {
        console.log("Updated Roles are, ", updatedRoles);
        updateRoles(updatedRoles);
    }

    return (
        <Card
            sx={{
                mt: 2,
                mb: 2,
                position: "relative"
            }}
            key={step.id}
        >
            <List>
                <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="body2">{`Step ${step.stepNumber}`}</Typography>
                </Grid>

                <Fab
                    color="error"
                    aria-label="delete"
                    size="small"
                    className="delete-button"
                    sx={{
                        position: "absolute",
                        right: 14,
                        top: 0.5
                    }}
                    onClick={() => onDelete(step.id)}
                >
                    <TrashIcon className="delete-button-icon" />
                </Fab>
                <div className="rules-component">
                    <Box sx={{ position: "relative" }} className="box-container">
                        <ListItem sx={{ mt: 2 }}>
                            <StepRolesList
                                initialValues={initialValues}
                                isReadOnly={ false }
                                onRolesChange={ handleRolesChange }
                            />                                                     
                        </ListItem>
                        <ListItem>
                            <StepUsersList
                                initialValues={initialValues}
                                isReadOnly={ false }
                                onUsersChange={ handleUsersChange }
                            />                               
                        </ListItem>
                    </Box>
                </div>
            </List>
        </Card>
    );
};

export default ApprovalStep;
