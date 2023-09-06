/*
 * Copyright (c) 2023, WSO2 LLC. (http://www.wso2.com).
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

package org.wso2.identity.apps.common.internal;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.wso2.carbon.core.ServerStartupObserver;
import org.wso2.carbon.identity.core.util.IdentityUtil;
import org.wso2.identity.apps.common.util.AppPortalConstants;

/**
 * Use to log the portal endpoints.
 * This component will wait until server startup is completed
 */
public class AppsCommonServiceStartupObserver implements ServerStartupObserver {

    private static final Log log = LogFactory.getLog(AppsCommonServiceStartupObserver.class);

    @Override
    public void completingServerStartup() {
        // Do nothing
    }

    @Override
    public void completedServerStartup() {

        for (AppPortalConstants.AppPortal appPortal : AppPortalConstants.AppPortal.values()) {
            log.info(appPortal.getName() + " URL : " + IdentityUtil
                .getServerURL(appPortal.getEndpoint(), true, true));
        }
        log.info("Identity apps common service component activated successfully.");
    }

}
