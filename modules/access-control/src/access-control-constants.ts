/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

/**
 * This class will contain front end permissions which is required to
 * be passed on to the permission context and also while checking the
 * relvant permission is available when the show component is evaluvating.
 */
export class AccessControlConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Application Feature permisison
     */
     public static readonly APPLICATION: string = "application";

    /**
     * Application read permission
     */
    public static readonly APPLICATION_READ: string = "application:read";

    /**
     * Application write permission
     */
    public static readonly APPLICATION_WRITE: string = "application:write";

    /**
     * Application edit permission
     */
    public static readonly APPLICATION_EDIT: string = "application:edit";

    /**
     * Application delete permission
     */
    public static readonly APPLICATION_DELETE: string = "application:delete";

    /**
     * Identity provider feature permission
     */
    public static readonly IDP: string = "identity_provider";

    /**
     * Identity provider read permission
     */
    public static readonly IDP_READ: string = "identity_provider:read";

    /**
     * Identity provider write permission
     */
    public static readonly IDP_WRITE: string = "identity_provider:write";

    /**
     * Identity provider edit permission
     */
    public static readonly IDP_EDIT: string = "identity_provider:edit";

    /**
     * Identity provider delete permission
     */
    public static readonly IDP_DELETE: string = "identity_provider:delete";

    /**
     * Users feature permission
     */
    public static readonly USER: string = "user";

    /**
     * Users read permission
     */
    public static readonly USER_READ: string = "user:read";

    /**
     * Users write permission
     */
    public static readonly USER_WRITE: string = "user:write";

    /**
     * Users edit permission
     */
    public static readonly USER_EDIT: string = "user:edit";

    /**
     * Users delete permission
     */
    public static readonly USER_DELETE: string = "user:delete";

    /**
     * Group feature permission
     */
    public static readonly GROUP: string = "group";

    /**
     * Group read permission
     */
    public static readonly GROUP_READ: string = "group:read";

    /**
     * Group write permission
     */
    public static readonly GROUP_WRITE: string = "group:write";

    /**
     * Group edit permission
     */
    public static readonly GROUP_EDIT: string = "group:edit";

    /**
     * Group delete permission
     */
    public static readonly GROUP_DELETE: string = "group:delete";

    /**
     * Role feature permission
     */
    public static readonly ROLE: string = "role";

    /**
     * Role read permission
     */
    public static readonly ROLE_READ: string = "role:read";

    /**
     * Role write permission
     */
    public static readonly ROLE_WRITE: string = "role:write";

    /**
     * Role edit permission
     */
    public static readonly ROLE_EDIT: string = "role:edit";

    /**
     * Role delete permission
     */
    public static readonly ROLE_DELETE: string = "role:delete";

    /**
     * Attribute feature permission
     */
    public static readonly ATTRIBUTE: string = "attribute";

    /**
     * Attribute read permission
     */
    public static readonly ATTRIBUTE_READ: string = "attribute:read";

    /**
     * Attribute write permission
     */
    public static readonly ATTRIBUTE_WRITE: string = "attribute:write";

    /**
     * Attribute edit permission
     */
    public static readonly ATTRIBUTE_EDIT: string = "attribute:edit";

    /**
     * Attribute delete permission
     */
    public static readonly ATTRIBUTE_DELETE: string = "attribute:delete";

    /**
     * Branding feature permission
     */
    public static readonly BRANDING: string = "branding";

    /**
     * Branding read permission
     */
    public static readonly BRANDING_READ: string = "branding:read";

    /**
     * Branding write permission
     */
    public static readonly BRANDING_WRITE: string = "branding:write";

    /**
     * Branding edit permission
     */
    public static readonly BRANDING_EDIT: string = "branding:edit";

    /**
     * Branding delete permission
     */
    public static readonly BRANDING_DELETE: string = "branding:delete";

    /**
     * Scope feature permission
     */
    public static readonly SCOPE: string = "scope";

    /**
     * Scope read permission
     */
    public static readonly SCOPE_READ: string = "scope:read";

    /**
     * Scope write permission
     */
    public static readonly SCOPE_WRITE: string = "scope:write";

    /**
     * Scope edit permission
     */
    public static readonly SCOPE_EDIT: string = "scope:edit";

    /**
     * Scope delete permission
     */
    public static readonly SCOPE_DELETE: string = "scope:delete";

    /**
     * Full console scope
     */
    public static readonly FULL_UI_SCOPE: string = "console:full";

    /**
     * Secret Management Write/Create Scope.
     */
    public static readonly SECRET_WRITE: string = "internal_secret_mgt_add";

    /**
     * Secret Management Read Scope.
     */
    public static readonly SECRET_READ: string = "internal_secret_mgt_view";

    /**
     * Secret Management Edit/Update Scope.
     */
    public static readonly SECRET_EDIT: string = "internal_secret_mgt_update";

    /**
     * Secret Management Delete/Remove Scope.
     */
    public static readonly SECRET_DELETE: string = "internal_secret_mgt_delete";

}
