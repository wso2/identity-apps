import { UserBasicInterface } from "@wso2is/admin.core.v1/models/users";
import { RolesInterface } from "@wso2is/core/models";
import { ApprovalSteps, ConfigurationsFormValuesInterface } from "./ui";

export interface StepEditSectionsInterface {

    /**
     * Show if the user is read only.
     */
    isReadOnly: boolean;

    /**
     * active user store
     *
     * Note: used to conditionally determine whether the userstore is handled
     * outside the component.
     */
    activeUserStore?: string
    activeRoleType?: string
    initialValues?: ApprovalSteps;
    onUsersChange?: (users: UserBasicInterface[]) => void;
    onRolesChange?: (roles: RolesInterface[]) => void;
}
