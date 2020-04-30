/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

package org.wso2.identity.apps.common.util;

/**
 * This class holds the constants related to app portal.
 */
public class AppPortalConstants {

    public static final String INBOUND_AUTH2_TYPE = "oauth2";

    public static final String EMAIL_CLAIM_URI = "http://wso2.org/claims/emailaddress";

    public static final String DISPLAY_NAME_CLAIM_URI = "http://wso2.org/claims/displayName";

    public static final String TOKEN_BINDING_TYPE_COOKIE = "cookie";

    public static final String GRANT_TYPE_ACCOUNT_SWITCH = "account_switch";

    private AppPortalConstants() {

    }

    /**
     * Data required for the initialisation of app portals.
     */
    public enum AppPortal {

        USER_PORTAL("User Portal", "This is the user portal application.", "USER_PORTAL",
                "/user-portal/login"),
        DEVELOPER_PORTAL("Developer Portal", "This is the developer portal application.", "DEVELOPER_PORTAL",
                "/developer-portal/login");

        private final String name;

        private final String description;

        private final String consumerKey;

        private final String path;

        AppPortal(String name, String description, String consumerKey, String path) {

            this.name = name;
            this.description = description;
            this.consumerKey = consumerKey;
            this.path = path;
        }

        public String getName() {

            return name;
        }

        public String getDescription() {

            return description;
        }

        public String getConsumerKey() {

            return consumerKey;
        }

        public String getPath() {

            return path;
        }
    }
}
