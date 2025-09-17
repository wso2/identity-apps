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

import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import Stack from "@oxygen-ui/react/Stack";
import Typography from "@oxygen-ui/react/Typography";
import { CommonResourcePropertiesPropsInterface } from "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/resource-properties";
import useAuthenticationFlowBuilderCore from "@wso2is/admin.flow-builder-core.v1/hooks/use-authentication-flow-builder-core-context";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";

/**
 * Props interface of {@link UserOnboardingProperties}
 */
export type UserOnboardingPropertiesPropsInterface = CommonResourcePropertiesPropsInterface &
    IdentifiableComponentInterface;

/**
 * User Onboarding widget properties component.
 *
 * @param props - Props injected to the component.
 * @returns UserOnboardingProperties component.
 */
const UserOnboardingProperties: FunctionComponent<UserOnboardingPropertiesPropsInterface> = ({
    resource,
    ["data-componentid"]: componentId = "user-onboarding-properties-component",
    onChange
}: UserOnboardingPropertiesPropsInterface): ReactElement => {
    const { metadata } = useAuthenticationFlowBuilderCore();

    return (
        <Stack gap={2} data-componentid={componentId}>
            <Typography>
                The <strong>End Screen</strong> defines what happens once the flow is completed. It allows you to control the user&apos;s final experience by selecting one of the following outcomes:
            </Typography>
            <FormControl>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name="radio-buttons-group"
                >
                    { metadata?.connectorConfigs?.accountVerificationEnabled && (
                        <>
                            <FormControlLabel value="accountVerificationEnabled" control={<Radio />} label="Verify the account on creation" />
                            <FormHelperText>Require the user to confirm their account (e.g., via email) before granting access.</FormHelperText>
                        </>
                    ) }
                    <FormControlLabel value="autoLogin" control={<Radio />} label="Auto Login" />
                    <FormHelperText>Immediately log the user in once the flow is completed, without additional steps.</FormHelperText>
                    <FormControlLabel value="redirect" control={<Radio />} label="Redirect to Application" />
                    <FormHelperText>Redirect the user to the specified application after the flow is completed.</FormHelperText>
                </RadioGroup>
            </FormControl>
        </Stack>
    );
};

export default UserOnboardingProperties;
