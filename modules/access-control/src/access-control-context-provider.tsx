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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useEffect } from "react";
import { useAccess } from "react-access-control";
import { AccessControlConstants } from "./access-control-constants";

/**
 * Interface to store Access Control Context props
 */
export interface AccessControlContextInterface {
    featureConfig: any; // TODO : Properly map FeatureConfigInterface type
    allowedScopes: string;
}

/**
 * Component which will initialize the permission context
 * according to the scopes received from the backend.
 *
 * @param props
 * @returns
 */
export const AccessControlContext: FunctionComponent<PropsWithChildren<AccessControlContextInterface>> = (
    props: PropsWithChildren<AccessControlContextInterface>
): ReactElement => {

    const { isLoaded, define } = useAccess();

    const {
        allowedScopes,
        children,
        featureConfig
    } = props;

    useEffect(() => {

        if (isEmpty(allowedScopes)) {
            return;
        }

        if (isLoaded) {
            return;
        }

        define({
            permissions: {
                [ AccessControlConstants.APPLICATION ] : hasRequiredScopes(featureConfig?.applications,
                    featureConfig?.applications?.scopes?.feature, allowedScopes),
                [ AccessControlConstants.APPLICATION_READ ] : hasRequiredScopes(featureConfig?.applications,
                    featureConfig?.applications?.scopes?.read, allowedScopes),
                [ AccessControlConstants.APPLICATION_WRITE ] : hasRequiredScopes(featureConfig?.applications,
                    featureConfig?.applications?.scopes?.create, allowedScopes),
                [ AccessControlConstants.APPLICATION_EDIT ] : hasRequiredScopes(featureConfig?.applications,
                    featureConfig?.applications?.scopes?.update, allowedScopes),
                [ AccessControlConstants.APPLICATION_DELETE ] : hasRequiredScopes(featureConfig?.applications,
                    featureConfig?.applications?.scopes?.delete, allowedScopes),

                [ AccessControlConstants.ATTRIBUTE ] : hasRequiredScopes(featureConfig?.attributeDialects,
                    featureConfig?.attributeDialects?.scopes?.feature, allowedScopes),
                [ AccessControlConstants.ATTRIBUTE_READ ] : hasRequiredScopes(featureConfig?.attributeDialects,
                    featureConfig?.attributeDialects?.scopes?.read, allowedScopes),
                [ AccessControlConstants.ATTRIBUTE_WRITE ] : hasRequiredScopes(featureConfig?.attributeDialects,
                    featureConfig?.attributeDialects?.scopes?.create, allowedScopes),
                [ AccessControlConstants.ATTRIBUTE_EDIT ] : hasRequiredScopes(featureConfig?.attributeDialects,
                    featureConfig?.attributeDialects?.scopes?.update, allowedScopes),
                [ AccessControlConstants.ATTRIBUTE_DELETE ] : hasRequiredScopes(featureConfig?.attributeDialects,
                    featureConfig?.attributeDialects?.scopes?.delete, allowedScopes),

                [ AccessControlConstants.BRANDING ] : hasRequiredScopes(
                    featureConfig?.branding,
                    featureConfig?.branding?.scopes?.feature,
                    allowedScopes),
                [ AccessControlConstants.BRANDING_READ ] : hasRequiredScopes(
                    featureConfig?.branding,
                    featureConfig?.branding?.scopes?.read,
                    allowedScopes),
                [ AccessControlConstants.BRANDING_WRITE ] : hasRequiredScopes(
                    featureConfig?.branding,
                    featureConfig?.branding?.scopes?.create,
                    allowedScopes),
                [ AccessControlConstants.BRANDING_EDIT ] : hasRequiredScopes(
                    featureConfig?.branding,
                    featureConfig?.branding?.scopes?.update,
                    allowedScopes),
                [ AccessControlConstants.BRANDING_DELETE ] : hasRequiredScopes(
                    featureConfig?.branding,
                    featureConfig?.branding?.scopes?.delete,
                    allowedScopes),

                [ AccessControlConstants.GROUP ] : hasRequiredScopes(featureConfig?.groups,
                    featureConfig?.groups?.scopes?.feature, allowedScopes),
                [ AccessControlConstants.GROUP_READ ] : hasRequiredScopes(featureConfig?.groups,
                    featureConfig?.groups?.scopes?.read, allowedScopes),
                [ AccessControlConstants.GROUP_WRITE ] : hasRequiredScopes(featureConfig?.groups,
                    featureConfig?.groups?.scopes?.create, allowedScopes),
                [ AccessControlConstants.GROUP_EDIT ] : hasRequiredScopes(featureConfig?.groups,
                    featureConfig?.groups?.scopes?.update, allowedScopes),
                [ AccessControlConstants.GROUP_DELETE ] : hasRequiredScopes(featureConfig?.groups,
                    featureConfig?.groups?.scopes?.delete, allowedScopes),

                [ AccessControlConstants.ROLE ]: hasRequiredScopes(featureConfig?.roles,
                    featureConfig?.roles?.scopes?.feature, allowedScopes),
                [ AccessControlConstants.ROLE_READ ]: hasRequiredScopes(featureConfig?.roles,
                    featureConfig?.roles?.scopes?.read, allowedScopes),
                [ AccessControlConstants.ROLE_WRITE ]: hasRequiredScopes(featureConfig?.roles,
                    featureConfig?.roles?.scopes?.create, allowedScopes),
                [ AccessControlConstants.ROLE_EDIT ]: hasRequiredScopes(featureConfig?.roles,
                    featureConfig?.roles?.scopes?.update, allowedScopes),
                [ AccessControlConstants.ROLE_DELETE ]: hasRequiredScopes(featureConfig?.roles,
                    featureConfig?.roles?.scopes?.delete, allowedScopes),

                [ AccessControlConstants.IDP ] : hasRequiredScopes(featureConfig?.identityProviders,
                    featureConfig?.identityProviders?.scopes?.feature, allowedScopes),
                [ AccessControlConstants.IDP_READ ] : hasRequiredScopes(featureConfig?.identityProviders,
                    featureConfig?.identityProviders?.scopes?.read, allowedScopes),
                [ AccessControlConstants.IDP_WRITE ] : hasRequiredScopes(featureConfig?.identityProviders,
                    featureConfig?.identityProviders?.scopes?.create, allowedScopes),
                [ AccessControlConstants.IDP_EDIT ] : hasRequiredScopes(featureConfig?.identityProviders,
                    featureConfig?.identityProviders?.scopes?.update, allowedScopes),
                [ AccessControlConstants.IDP_DELETE ] : hasRequiredScopes(featureConfig?.identityProviders,
                    featureConfig?.identityProviders?.scopes?.delete, allowedScopes),

                [ AccessControlConstants.SCOPE ] : hasRequiredScopes(featureConfig?.oidcScopes,
                    featureConfig?.oidcScopes?.scopes?.feature, allowedScopes),
                [ AccessControlConstants.SCOPE_READ ] : hasRequiredScopes(featureConfig?.oidcScopes,
                    featureConfig?.oidcScopes?.scopes?.read, allowedScopes),
                [ AccessControlConstants.SCOPE_WRITE ] : hasRequiredScopes(featureConfig?.oidcScopes,
                    featureConfig?.oidcScopes?.scopes?.create, allowedScopes),
                [ AccessControlConstants.SCOPE_EDIT ] : hasRequiredScopes(featureConfig?.oidcScopes,
                    featureConfig?.oidcScopes?.scopes?.update, allowedScopes),
                [ AccessControlConstants.SCOPE_DELETE ] : hasRequiredScopes(featureConfig?.oidcScopes,
                    featureConfig?.oidcScopes?.scopes?.delete, allowedScopes),

                [ AccessControlConstants.USER ] : hasRequiredScopes(featureConfig?.users,
                    featureConfig?.users?.scopes?.feature, allowedScopes),
                [ AccessControlConstants.USER_READ ] : hasRequiredScopes(featureConfig?.users,
                    featureConfig?.users?.scopes?.read, allowedScopes),
                [ AccessControlConstants.USER_WRITE ] : hasRequiredScopes(featureConfig?.users,
                    featureConfig?.users?.scopes?.create, allowedScopes),
                [ AccessControlConstants.USER_EDIT ] : hasRequiredScopes(featureConfig?.users,
                    featureConfig?.users?.scopes?.update, allowedScopes),
                [ AccessControlConstants.USER_DELETE ] : hasRequiredScopes(featureConfig?.users,
                    featureConfig?.users?.scopes?.delete, allowedScopes),

                [AccessControlConstants.SECRET_WRITE]: hasRequiredScopes(
                    featureConfig?.secretsManagement,
                    featureConfig?.secretsManagement?.scopes?.create,
                    allowedScopes
                ),
                [AccessControlConstants.SECRET_READ]: hasRequiredScopes(
                    featureConfig?.secretsManagement,
                    featureConfig?.secretsManagement?.scopes?.read,
                    allowedScopes
                ),
                [AccessControlConstants.SECRET_EDIT]: hasRequiredScopes(
                    featureConfig?.secretsManagement,
                    featureConfig?.secretsManagement?.scopes?.update,
                    allowedScopes
                ),
                [AccessControlConstants.SECRET_DELETE]: hasRequiredScopes(
                    featureConfig?.secretsManagement,
                    featureConfig?.secretsManagement?.scopes?.delete,
                    allowedScopes
                ),

                [ AccessControlConstants.ORGANIZATION ]: hasRequiredScopes(
                    featureConfig?.organizations,
                    featureConfig?.organizations?.scopes?.feature,
                    allowedScopes
                ),
                [ AccessControlConstants.ORGANIZATION_READ ]: hasRequiredScopes(
                    featureConfig?.organizations,
                    featureConfig?.organizations?.scopes?.read,
                    allowedScopes
                ),
                [ AccessControlConstants.ORGANIZATION_EDIT ]: hasRequiredScopes(
                    featureConfig?.organizations,
                    featureConfig?.organizations?.scopes?.update,
                    allowedScopes
                ),
                [ AccessControlConstants.ORGANIZATION_DELETE ]: hasRequiredScopes(
                    featureConfig?.organizations,
                    featureConfig?.organizations?.scopes?.delete,
                    allowedScopes
                ),
                [ AccessControlConstants.ORGANIZATION_WRITE ]: hasRequiredScopes(
                    featureConfig?.organizations,
                    featureConfig?.organizations?.scopes?.create,
                    allowedScopes
                ),

                [ AccessControlConstants.ORGANIZATION_ROLES ]: hasRequiredScopes(
                    featureConfig?.organization_roles,
                    featureConfig?.organization_roles?.scopes?.feature,
                    allowedScopes
                ),
                [ AccessControlConstants.ORGANIZATION_ROLES_READ ]: hasRequiredScopes(
                    featureConfig?.organization_roles,
                    featureConfig?.organization_roles?.scopes?.read,
                    allowedScopes
                ),
                [ AccessControlConstants.ORGANIZATION_ROLES_EDIT ]: hasRequiredScopes(
                    featureConfig?.organization_roles,
                    featureConfig?.organization_roles?.scopes?.update,
                    allowedScopes
                ),
                [ AccessControlConstants.ORGANIZATION_ROLES_DELETE ]: hasRequiredScopes(
                    featureConfig?.organization_roles,
                    featureConfig?.organization_roles?.scopes?.delete,
                    allowedScopes
                ),
                [ AccessControlConstants.ORGANIZATION_ROLES_WRITE ]: hasRequiredScopes(
                    featureConfig?.organization_roles,
                    featureConfig?.organization_roles?.scopes?.create,
                    allowedScopes
                )
            }
        });

    }, [ allowedScopes ]);

    return (<> { children } </>);
};
