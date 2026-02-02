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

import { useAuthContext } from "@asgardeo/auth-react";
import { useEffect, useState } from "react";

/**
 * Hook to manage onboarding status.
 */
export const useOnboardingStatus = () => {
    const { getDecodedIDToken } = useAuthContext();
    const [ shouldShowOnboarding, setShouldShowOnboarding ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    useEffect(() => {
        const checkOnboardingStatus = async (): Promise<void> => {
            try {
                const idToken: any = await getDecodedIDToken();
                const userId: string = idToken?.sub;

                if (!userId) {
                    setShouldShowOnboarding(false);
                    setIsLoading(false);

                    return;
                }

                // Check if user has completed onboarding
                const hasCompletedOnboarding: string | null = localStorage.getItem(
                    `onboarding_completed_${userId}`
                );

                setShouldShowOnboarding(!hasCompletedOnboarding);
            } catch (error) {
                console.error("Error checking onboarding status:", error);
                setShouldShowOnboarding(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkOnboardingStatus();
    }, [ getDecodedIDToken ]);

    const markOnboardingComplete = async (): Promise<void> => {
        try {
            const idToken: any = await getDecodedIDToken();
            const userId: string = idToken?.sub;

            if (userId) {
                localStorage.setItem(`onboarding_completed_${userId}`, "true");
                setShouldShowOnboarding(false);
            }
        } catch (error) {
            console.error("Error marking onboarding as complete:", error);
        }
    };

    return {
        isLoading,
        markOnboardingComplete,
        shouldShowOnboarding
    };
};
