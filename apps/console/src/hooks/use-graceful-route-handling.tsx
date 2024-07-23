/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { DecodedIDTokenPayload, useAuthContext } from "@asgardeo/auth-react";
import { RouteUtils } from "@wso2is/admin.core.v1/utils/route-utils";
import { RouteInterface } from "@wso2is/core/models";

const useGracefulRouteHandling = (): {
    gracefullyHandleRouting: (routes: RouteInterface[], view: string, pathname: string) => void
} => {
    const { getDecodedIDToken } = useAuthContext();

    const shouldRunGracefulRouteHandling = async () => {
        const __experimental__platformIdP: {
            enabled: boolean;
            homeRealmId: string;
        } = window["AppUtils"].getConfig()?.__experimental__platformIdP;

        if (__experimental__platformIdP?.enabled) {
            const idToken: DecodedIDTokenPayload = await getDecodedIDToken();

            if (idToken?.default_tenant !== "carbon.super") {
                return false;
            }
        }

        return true;
    };

    const gracefullyHandleRouting = (routes: RouteInterface[], view: string, pathname: string) => {
        shouldRunGracefulRouteHandling().then((shouldRun: boolean) => {
            if (shouldRun) {
                RouteUtils.gracefullyHandleRouting(
                    routes,
                    view,
                    pathname
                );
            }
        });
    };

    return {
        gracefullyHandleRouting
    };

};

export default useGracefulRouteHandling;
