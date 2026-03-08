/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { Keyframes } from "@emotion/react";
import { Theme, keyframes, styled } from "@mui/material/styles";
import Fab from "@oxygen-ui/react/Fab";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useCallback } from "react";
import { ReactComponent as Rocket } from "../../assets/icons/rocket.svg";
import { OnboardingComponentIds } from "../../constants";
import { useOnboardingFabVisibility } from "../../hooks/use-onboarding-fab-visibility";

/**
 * Props interface for OnboardingFab component.
 */
type OnboardingFabPropsInterface = IdentifiableComponentInterface;

/**
 * Entrance animation: scale up with a bounce, then a subtle pulse glow.
 */
const bounceIn: Keyframes = keyframes`
    0% {
        opacity: 0;
        transform: scale(0);
    }
    60% {
        opacity: 1;
        transform: scale(1.12);
    }
    80% {
        transform: scale(0.95);
    }
    100% {
        transform: scale(1);
    }
`;

const pulseGlow: Keyframes = keyframes`
    0%, 100% {
        box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
                    0 6px 10px 0 rgba(0, 0, 0, 0.14),
                    0 1px 18px 0 rgba(0, 0, 0, 0.12);
    }
    50% {
        box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
                    0 6px 10px 0 rgba(0, 0, 0, 0.14),
                    0 1px 18px 0 rgba(0, 0, 0, 0.12),
                    0 0 16px 4px rgba(255, 115, 0, 0.3);
    }
`;

/**
 * Styled extended FAB with entrance animation.
 */
const StyledFab: typeof Fab = styled(Fab)(({ theme }: { theme: Theme }) => ({
    animation: `${bounceIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                ${pulseGlow} 2s ease-in-out 0.6s 2`,
    bottom: theme.spacing(4),
    gap: theme.spacing(1),
    position: "fixed",
    right: theme.spacing(4),
    zIndex: theme.zIndex.fab
}));

/**
 * Floating action button that navigates to the onboarding wizard.
 * Visible for eligible users (Owner/Collaborator/Customer) on root org only.
 */
const OnboardingFab: FunctionComponent<OnboardingFabPropsInterface> = (
    props: OnboardingFabPropsInterface
): ReactElement | null => {
    const {
        ["data-componentid"]: componentId = OnboardingComponentIds.FAB
    } = props;

    const { isVisible } = useOnboardingFabVisibility();

    const handleClick: () => void = useCallback((): void => {
        history.push(`${AppConstants.getPaths().get("ONBOARDING")}?source=fab`);
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <StyledFab
            color="primary"
            data-componentid={ componentId }
            onClick={ handleClick }
            variant="extended"
        >
            <Rocket width={ 20 } height={ 20 } fill="white" />
            Setup Guide
        </StyledFab>
    );
};

OnboardingFab.displayName = "OnboardingFab";

export default OnboardingFab;
