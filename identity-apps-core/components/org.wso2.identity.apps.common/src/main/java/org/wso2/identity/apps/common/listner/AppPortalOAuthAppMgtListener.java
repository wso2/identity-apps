/*
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import org.wso2.carbon.identity.oauth.Error;
import org.wso2.carbon.identity.oauth.IdentityOAuthAdminException;
import org.wso2.carbon.identity.oauth.IdentityOAuthClientException;
import org.wso2.carbon.identity.oauth.dto.OAuthConsumerAppDTO;
import org.wso2.carbon.identity.oauth.listener.OAuthApplicationMgtListener;
import org.wso2.identity.apps.common.internal.AppsCommonDataHolder;

import java.util.Set;

/**
 * App portal OAuth application management listener.
 */
public class AppPortalOAuthAppMgtListener implements OAuthApplicationMgtListener {

    private boolean enabled;

    private Set<String> systemAppConsumerKeys;

    /**
     * Constructor for app portal OAuth application management listener with enabled flag.
     *
     * @param enabled Enabled flag.
     */
    public AppPortalOAuthAppMgtListener(boolean enabled) {

        this.enabled = enabled;
        systemAppConsumerKeys = AppsCommonDataHolder.getInstance().getSystemAppConsumerKeys();
    }

    @Override
    public boolean isEnabled() {

        return enabled;
    }

    @Override
    public int getExecutionOrder() {

        return 1;
    }

    @Override
    public void doPreUpdateConsumerApplication(OAuthConsumerAppDTO oAuthConsumerAppDTO)
            throws IdentityOAuthAdminException {

        if (!isEnabled() || systemAppConsumerKeys.stream()
                .noneMatch(oAuthConsumerAppDTO.getApplicationName()::equalsIgnoreCase)) {
            return;
        }

        throw new IdentityOAuthClientException(Error.INVALID_UPDATE.getErrorCode(),
                "System application update is not allowed. Client id: " + oAuthConsumerAppDTO.getOauthConsumerKey());
    }

    @Override
    public void doPreUpdateConsumerApplicationState(String consumerKey, String newState)
            throws IdentityOAuthAdminException {

        if (!isEnabled() || systemAppConsumerKeys.stream().noneMatch(consumerKey::equalsIgnoreCase)) {
            return;
        }

        throw new IdentityOAuthClientException(Error.INVALID_UPDATE.getErrorCode(),
                "Changing state of system application is not allowed. Client id: " + consumerKey);
    }

    @Override
    public void doPreRemoveOAuthApplicationData(String consumerKey) throws IdentityOAuthAdminException {

        if (!isEnabled() || systemAppConsumerKeys.stream().noneMatch(consumerKey::equalsIgnoreCase)) {
            return;
        }

        throw new IdentityOAuthClientException(Error.INVALID_DELETE.getErrorCode(),
                "System application deletion is not allowed. Client id: " + consumerKey);
    }
}
