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

import { addUser } from "@wso2is/admin.users.v1/api/users";
import { UserDetailsInterface } from "@wso2is/admin.users.v1/models/user";
import { TestUserCredentialsInterface } from "../models";
import { generateSecurePassword } from "../utils/password-generator";

/**
 * Test user creation result.
 */
export interface TestUserCreationResultInterface {
    success: boolean;
    credentials?: TestUserCredentialsInterface;
    error?: string;
}

/**
 * Create a test user for the onboarding wizard.
 * This function creates a user with the given email that can be used to test
 * the application's login flow.
 *
 * @param email - Email address for the test user (typically the admin's email)
 * @returns Promise resolving to the creation result with credentials
 */
export const createTestUser = async (email: string): Promise<TestUserCreationResultInterface> => {
    const username: string = "testUser";
    const password: string = generateSecurePassword(14);

    try {
        const userData: UserDetailsInterface = {
            emails: [
                {
                    primary: true,
                    value: email
                }
            ],
            name: {
                familyName: "User",
                givenName: "Test"
            },
            password,
            userName: username
        };

        await addUser(userData);

        return {
            credentials: {
                email,
                password,
                username
            },
            success: true
        };
    } catch (error: unknown) {
        // Check if the error is due to user already existing
        const errorResponse: { detail?: string } | undefined =
            (error as { response?: { data?: { detail?: string } } })?.response?.data;

        if (errorResponse?.detail?.includes("already exists")) {
            return {
                error: "Test user already exists",
                success: false
            };
        }

        return {
            error: "Failed to create test user",
            success: false
        };
    }
};

/**
 * Check if test user creation should be attempted.
 *
 * @param isSubOrganization - Whether the current org is a sub-organization
 * @param isM2M - Whether this is an M2M application
 * @param adminEmail - The admin's email address
 * @returns True if test user should be created
 */
export const shouldCreateTestUser = (
    isSubOrganization: boolean,
    isM2M: boolean,
    adminEmail?: string
): boolean => {
    return isSubOrganization && !isM2M && !!adminEmail;
};
