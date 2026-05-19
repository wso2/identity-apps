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

import Alert from "@oxygen-ui/react/Alert";
import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import CircularProgress from "@oxygen-ui/react/CircularProgress";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import {
    CommonResourcePropertiesPropsInterface
} from "@wso2is/admin.flow-builder-core.v1/components/resource-property-panel/resource-properties";
import { useGetDevicePolicies } from "@wso2is/admin.devices.v1/hooks/use-get-device-policies";
import { DevicePolicyResponseInterface } from "@wso2is/admin.devices.v1/models/devices";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useMemo } from "react";

type DeviceRegistrationPropertiesPropsInterface = CommonResourcePropertiesPropsInterface &
    IdentifiableComponentInterface;

const NO_POLICY_OPTION: DevicePolicyResponseInterface = { id: "", name: "No policy (skip check)" };

/**
 * Property panel for the DeviceRegistrationExecutor step.
 * Lets the user pick a device assurance policy (or none) to attach to the executor.
 */
const DeviceRegistrationProperties: FunctionComponent<DeviceRegistrationPropertiesPropsInterface> = ({
    resource,
    onChange,
    "data-componentid": componentId = "device-registration-properties"
}: DeviceRegistrationPropertiesPropsInterface): ReactElement => {
    const { data: policies, isLoading, error } = useGetDevicePolicies();

    const options: DevicePolicyResponseInterface[] = useMemo((): DevicePolicyResponseInterface[] => {
        return [ NO_POLICY_OPTION, ...(policies ?? []) ];
    }, [ policies ]);

    const currentPolicyName: string = resource?.data?.action?.executor?.meta?.policyName ?? "";

    const selectedPolicy: DevicePolicyResponseInterface = useMemo(
        (): DevicePolicyResponseInterface =>
            options.find((p: DevicePolicyResponseInterface): boolean => p.name === currentPolicyName)
            ?? NO_POLICY_OPTION,
        [ options, currentPolicyName ]
    );

    const handleChange = (_e: React.SyntheticEvent, value: DevicePolicyResponseInterface): void => {
        onChange(
            "action.executor.meta.policyName",
            value?.id ? value.name : "",
            resource
        );
    };

    if (error) {
        return (
            <Alert severity="error" data-componentid={ `${ componentId }-error` }>
                Failed to load device assurance policies.
            </Alert>
        );
    }

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Typography variant="body2">
                Select a device assurance policy to enforce during device registration,
                or leave unset to skip the check.
            </Typography>
            <Autocomplete
                disablePortal
                key={ resource.id }
                options={ options }
                loading={ isLoading }
                getOptionLabel={ (option: DevicePolicyResponseInterface): string => option.name }
                isOptionEqualToValue={ (
                    option: DevicePolicyResponseInterface,
                    value: DevicePolicyResponseInterface
                ): boolean => option.id === value.id }
                value={ selectedPolicy }
                onChange={ handleChange }
                renderInput={ (params: AutocompleteRenderInputParams): ReactElement => (
                    <TextField
                        { ...params }
                        label="Device assurance policy"
                        placeholder="Select a policy"
                        InputProps={ {
                            ...params.InputProps,
                            endAdornment: (
                                <>
                                    { isLoading && <CircularProgress size={ 16 } /> }
                                    { params.InputProps.endAdornment }
                                </>
                            )
                        } }
                    />
                ) }
            />
        </Stack>
    );
};

export default DeviceRegistrationProperties;
