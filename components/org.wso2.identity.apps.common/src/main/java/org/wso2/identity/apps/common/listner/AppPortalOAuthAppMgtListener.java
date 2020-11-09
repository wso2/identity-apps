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

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;
import org.wso2.carbon.identity.oauth.Error;
import org.wso2.carbon.identity.oauth.IdentityOAuthAdminException;
import org.wso2.carbon.identity.oauth.IdentityOAuthClientException;
import org.wso2.carbon.identity.oauth.IdentityOAuthServerException;
import org.wso2.carbon.identity.oauth.common.exception.InvalidOAuthClientException;
import org.wso2.carbon.identity.oauth.dao.OAuthAppDO;
import org.wso2.carbon.identity.oauth.dto.OAuthConsumerAppDTO;
import org.wso2.carbon.identity.oauth.listener.OAuthApplicationMgtListener;
import org.wso2.carbon.identity.oauth2.IdentityOAuth2Exception;
import org.wso2.carbon.identity.oauth2.util.OAuth2Util;
import org.wso2.identity.apps.common.internal.AppsCommonDataHolder;

import java.util.Arrays;
import java.util.Set;

/**
 * App portal OAuth application management listener.
 */
public class AppPortalOAuthAppMgtListener implements OAuthApplicationMgtListener {

    private boolean enabled;

    private Set<String> systemAppConsumerKeys;

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

        if (!isEnabled() || !this.systemAppConsumerKeys.contains(oAuthConsumerAppDTO.getOauthConsumerKey())) {
            return;
        }

        OAuthAppDO systemApplication;
        try {
            systemApplication = OAuth2Util.getAppInformationByClientId(oAuthConsumerAppDTO.getOauthConsumerKey());
        } catch (IdentityOAuth2Exception e) {
            throw new IdentityOAuthServerException(
                    "Failed to retrieve the application with client id: " + oAuthConsumerAppDTO.getOauthConsumerKey(),
                    e);
        } catch (InvalidOAuthClientException e) {
            throw new IdentityOAuthClientException(
                    "Failed to retrieve the application with client id: " + oAuthConsumerAppDTO.getOauthConsumerKey(),
                    e);
        }

        if (systemApplication == null) {
            return;
        }

        // Changing the grant types not allowed.
        if (!isSameGrantTypes(systemApplication.getGrantTypes(), oAuthConsumerAppDTO.getGrantTypes())) {
            throw new IdentityOAuthClientException(Error.INVALID_UPDATE.getErrorCode(),
                    "Changing the grant types not allowed for application with client id: " + oAuthConsumerAppDTO
                            .getOauthConsumerKey());
        }
    }

    @Override
    public void doPreUpdateConsumerApplicationState(String consumerKey, String newState)
            throws IdentityOAuthAdminException {

        if (!isEnabled() || !this.systemAppConsumerKeys.contains(consumerKey)) {
            return;
        }

        throw new IdentityOAuthClientException(Error.INVALID_UPDATE.getErrorCode(),
                "Changing the state is not allowed for application with client id: " + consumerKey);

    }

    @Override
    public void doPreRemoveOAuthApplicationData(String consumerKey) throws IdentityOAuthAdminException {

        if (!isEnabled() || !this.systemAppConsumerKeys.contains(consumerKey)) {
            return;
        }

        throw new IdentityOAuthClientException(Error.INVALID_DELETE.getErrorCode(),
                "Application deletion is not allowed for the application with client id: " + consumerKey);
    }

    private boolean isSameGrantTypes(String currentGrantTypesStr, String newGrantTypesStr) {

        String[] currentGrantTypes = getGrantTypes(currentGrantTypesStr);
        String[] newGrantTypes = getGrantTypes(newGrantTypesStr);

        if (currentGrantTypes.length != newGrantTypes.length) {
            return false;
        }

        Arrays.sort(currentGrantTypes);
        Arrays.sort(newGrantTypes);
        return Arrays.equals(currentGrantTypes, newGrantTypes);
    }

    private String[] getGrantTypes(String grantTypes) {

        if (StringUtils.isBlank(grantTypes)) {
            return ArrayUtils.EMPTY_STRING_ARRAY;
        }

        return grantTypes.trim().split(" ");
    }
}
