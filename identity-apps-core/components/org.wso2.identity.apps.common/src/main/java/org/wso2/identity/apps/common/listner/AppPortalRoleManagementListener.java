package org.wso2.identity.apps.common.listner;

import org.apache.commons.lang.StringUtils;
import org.wso2.carbon.identity.role.v2.mgt.core.exception.IdentityRoleManagementException;
import org.wso2.carbon.identity.role.v2.mgt.core.listener.AbstractRoleManagementListener;
import org.wso2.carbon.identity.role.v2.mgt.core.model.GroupBasicInfo;
import org.wso2.carbon.identity.role.v2.mgt.core.model.IdpGroup;
import org.wso2.carbon.identity.role.v2.mgt.core.model.Permission;
import org.wso2.carbon.identity.role.v2.mgt.core.model.Role;
import org.wso2.carbon.identity.role.v2.mgt.core.model.RoleBasicInfo;
import org.wso2.carbon.identity.role.v2.mgt.core.model.UserBasicInfo;
import org.wso2.identity.apps.common.internal.AppsCommonDataHolder;

import java.util.List;

import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.ADMINISTRATOR;
import static org.wso2.carbon.identity.role.v2.mgt.core.RoleConstants.ORGANIZATION;

public class AppPortalRoleManagementListener extends AbstractRoleManagementListener {

    @Override
    public int getExecutionOrderId() {

        return 0;
    }

    @Override
    public int getDefaultOrderId() {

        return 0;
    }

    @Override
    public boolean isEnable() {

        return false;
    }

    @Override
    public boolean preUpdateRoleName(String roleId, String newRoleName, String tenantDomain)
        throws IdentityRoleManagementException {

        Role role = AppsCommonDataHolder.getInstance().getRoleManagementServiceV2().getRole(roleId, tenantDomain);
        if (role == null || !StringUtils.equals(ADMINISTRATOR, role.getName()) ||
            role.getAssociatedApplications() == null || StringUtils.equals(ORGANIZATION, role.getAudience())) {
            
            return true;
        }


        return false;
    }

    @Override
    public boolean preDeleteRole(String roleId, String tenantDomain) throws IdentityRoleManagementException {

        return false;
    }

    @Override
    public boolean preUpdateUserListOfRole(String roleId, List<String> newUserIDList, List<String> deletedUserIDList,
                                           String tenantDomain) throws IdentityRoleManagementException {

        return false;
    }

    @Override
    public boolean preUpdatePermissionsForRole(String roleId, List<Permission> addedPermissions,
                                               List<Permission> deletedPermissions, String audience, String audienceId,
                                               String tenantDomain) throws IdentityRoleManagementException {

        return false;
    }

    @Override
    public boolean preDeleteRolesByApplication(String applicationId, String tenantDomain)
        throws IdentityRoleManagementException {

        return false;
    }
}
