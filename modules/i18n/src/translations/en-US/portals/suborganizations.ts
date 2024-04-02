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
import { SuborganizationsNS } from "../../../models";
/**
 * NOTES: No need to care about the max-len for this file since it's easier to
 * translate the strings to other languages easily with editor translation tools.
 */
/* eslint-disable max-len */
/* eslint-disable sort-keys */

export const suborganizations: SuborganizationsNS = {
    notifications: {
        duplicateOrgError: {
            description: "The organization you are trying to create already exists.",
            message: "An organization with the same name already exists."
        },
        subOrgLevelsLimitReachedError: {
            emptyPlaceholder: {
                action: "View Plans",
                subtitles:
                    "You can contact the organization administrator or (if you are the " +
                    "administrator) upgrade your subscription to increase the allowed limit.",
                title: "You have reached the maximum number of allowed organization levels."
            },
            heading: "You’ve reached the maximum organization levels allowed for the organization."
        },
        tierLimitReachedError: {
            emptyPlaceholder: {
                action: "View Plans",
                subtitles:
                    "You can contact the organization administrator or (if you are the " +
                    "administrator) upgrade your subscription to increase the allowed limit.",
                title: "You have reached the maximum number of allowed organizations."
            },
            heading: "You've reached the maximum limit for organizations"
        }
    }
};
