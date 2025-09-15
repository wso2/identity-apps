/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { RouteUtils } from "../route-utils";

describe("Test util functions in route-utils.", () => {

    describe("getOrganizationEnabledRoutes", () => {

        test("Should return array as-is when organizationRouteConfig is an array", () => {
            const routeConfigArray: string[] = [ "route1", "route2", "route3" ];
            const result: string[] = RouteUtils.getOrganizationEnabledRoutes(routeConfigArray, "v1.0.0");

            expect(result).toEqual(routeConfigArray);
        });

        test("Should return only v0.0.0 routes when organizationVersion is not provided", () => {
            const routeConfig: Record<string, string> = {
                "route1": "v0.0.0",
                "route2": "v1.0.0",
                "route3": "v0.0.0",
                "route4": "v2.0.0"
            };
            const result: string[] = RouteUtils.getOrganizationEnabledRoutes(routeConfig, "");

            expect(result).toEqual([ "route1", "route3" ]);
        });

        test("Should return only v0.0.0 routes when organizationVersion is null", () => {
            const routeConfig: Record<string, string> = {
                "route1": "v0.0.0",
                "route2": "v1.0.0",
                "route3": "v0.0.0"
            };
            const result: string[] = RouteUtils.getOrganizationEnabledRoutes(routeConfig, null as any);

            expect(result).toEqual([ "route1", "route3" ]);
        });

        test("Should return only v0.0.0 routes when organizationVersion is undefined", () => {
            const routeConfig: Record<string, string> = {
                "route1": "v0.0.0",
                "route2": "v1.0.0",
                "route3": "v0.0.0"
            };
            const result: string[] = RouteUtils.getOrganizationEnabledRoutes(routeConfig, undefined as any);

            expect(result).toEqual([ "route1", "route3" ]);
        });

        test("Should return routes with version less than or equal to organization version", () => {
            const routeConfig: Record<string, string> = {
                "route1": "v1.0.0",
                "route2": "v1.2.0",
                "route3": "v2.0.0",
                "route4": "v0.9.0"
            };
            const result: string[] = RouteUtils.getOrganizationEnabledRoutes(routeConfig, "v1.2.0");

            expect(result).toEqual([ "route1", "route2", "route4" ]);
        });

        test("Should return all routes when organization version is higher than all required versions", () => {
            const routeConfig: Record<string, string> = {
                "route1": "v1.0.0",
                "route2": "v1.2.0",
                "route3": "v2.0.0"
            };
            const result: string[] = RouteUtils.getOrganizationEnabledRoutes(routeConfig, "v3.0.0");

            expect(result).toEqual([ "route1", "route2", "route3" ]);
        });

        test("Should return empty array when organization version is lower than all required versions", () => {
            const routeConfig: Record<string, string> = {
                "route1": "v1.0.0",
                "route2": "v1.2.0",
                "route3": "v2.0.0"
            };
            const result: string[] = RouteUtils.getOrganizationEnabledRoutes(routeConfig, "v0.9.0");

            expect(result).toEqual([]);
        });

        test("Should handle exact version matches", () => {
            const routeConfig: Record<string, string> = {
                "route1": "v1.0.0",
                "route2": "v1.0.0",
                "route3": "v1.0.1"
            };
            const result: string[] = RouteUtils.getOrganizationEnabledRoutes(routeConfig, "v1.0.0");

            expect(result).toEqual([ "route1", "route2" ]);
        });

        test("Should handle patch version differences", () => {
            const routeConfig: Record<string, string> = {
                "route1": "v1.0.0",
                "route2": "v1.0.1",
                "route3": "v1.0.2",
                "route4": "v1.1.0"
            };
            const result: string[] = RouteUtils.getOrganizationEnabledRoutes(routeConfig, "v1.0.1");

            expect(result).toEqual([ "route1", "route2" ]);
        });

        test("Should handle minor version differences", () => {
            const routeConfig: Record<string, string> = {
                "route1": "v1.0.0",
                "route2": "v1.1.0",
                "route3": "v1.2.0",
                "route4": "v2.0.0"
            };
            const result: string[] = RouteUtils.getOrganizationEnabledRoutes(routeConfig, "v1.1.5");

            expect(result).toEqual([ "route1", "route2" ]);
        });

        test("Should handle major version differences", () => {
            const routeConfig: Record<string, string> = {
                "route1": "v1.0.0",
                "route2": "v2.0.0",
                "route3": "v3.0.0"
            };
            const result: string[] = RouteUtils.getOrganizationEnabledRoutes(routeConfig, "v2.5.0");

            expect(result).toEqual([ "route1", "route2" ]);
        });
    });
});
