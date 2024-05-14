/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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

import { Config } from "@wso2is/features/admin.core.v1/configs";
import { handlers as extendedHandlers } from "@wso2is/features/test-configs/__mocks__/server/handlers";
import { ResponseComposition, RestContext, RestHandler, RestRequest, rest } from "msw";

/**
 * MSW Request Handlers.
 * @see {@link https://mswjs.io/docs/basics/request-handler}
 */
export const handlers: RestHandler[] = [

    rest.get(Config.getServiceResourceEndpoints().users, (
        req: RestRequest,
        res: ResponseComposition,
        ctx: RestContext) => {

        return res(
            ctx.status(200)
        );
    }),
    rest.get(Config.getServiceResourceEndpoints().applications, (
        req: RestRequest,
        res: ResponseComposition,
        ctx: RestContext) => {

        return res(
            ctx.status(200)
        );
    }),
    // TODO: Use server.use once the extension model issue is fixed.
    // Tracker: https://github.com/wso2/product-is/issues/13134
    ...extendedHandlers
];
