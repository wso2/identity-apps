/*
 * Copyright (c) 2019-2023, WSO2 LLC. (http://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

package org.wso2.identity.apps.common.listner;

import org.wso2.carbon.identity.organization.management.service.util.OrganizationManagementUtil;
import org.wso2.carbon.identity.organization.management.service.util.Utils;
import org.wso2.carbon.stratos.common.beans.TenantInfoBean;
import org.wso2.carbon.stratos.common.exception.StratosException;
import org.wso2.carbon.stratos.common.listeners.TenantMgtListener;
import org.wso2.identity.apps.common.util.AppPortalUtils;

/**
 * App portal tenant management listener.
 */
public class AppPortalTenantMgtListener implements TenantMgtListener {

    @Override
    public void onTenantCreate(TenantInfoBean tenantInfoBean) throws StratosException {

        try {
            if (OrganizationManagementUtil.isOrganization(tenantInfoBean.getTenantId())) {
                return;
            }
            if (Utils.getSubOrgStartLevel() > 1 && !"carbon.super".equals(tenantInfoBean.getTenantDomain())) {
                return;
            }
            AppPortalUtils.initiatePortals(tenantInfoBean);
        } catch (Exception e) {
            throw new StratosException("Failed to initialize UI portals for the tenant:"
                + tenantInfoBean.getTenantDomain(), e);
        }
    }

    @Override
    public void onTenantUpdate(TenantInfoBean tenantInfoBean) throws StratosException {

    }

    @Override
    public void onTenantDelete(int i) {

    }

    @Override
    public void onTenantRename(int i, String s, String s1) throws StratosException {

    }

    @Override
    public void onTenantInitialActivation(int i) throws StratosException {

    }

    @Override
    public void onTenantActivation(int i) throws StratosException {

    }

    @Override
    public void onTenantDeactivation(int i) throws StratosException {

    }

    @Override
    public void onSubscriptionPlanChange(int i, String s, String s1) throws StratosException {

    }

    @Override
    public int getListenerOrder() {

        return 100;
    }

    @Override
    public void onPreDelete(int i) throws StratosException {

    }
}
