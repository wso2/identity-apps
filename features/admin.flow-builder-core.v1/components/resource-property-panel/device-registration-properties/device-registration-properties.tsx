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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import FormControl from "@oxygen-ui/react/FormControl";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import InputLabel from "@oxygen-ui/react/InputLabel";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
import Stack from "@oxygen-ui/react/Stack";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import useGetDevicePolicies from "@wso2is/admin.device-policies.v1/api/use-get-device-policies";
import {
    DevicePolicyListItemInterface,
    DevicePolicyListResponseInterface
} from "@wso2is/admin.device-policies.v1/models/device-policy";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import useExtensionExecutor from "../../../hooks/use-extension-executor";
import { ExecutorPhaseInterface, ExtensionExecutorInterface } from "../../../models/metadata";
import { DeviceRegistrationPhases, ExecutionTypes } from "../../../models/steps";
import { CommonResourcePropertiesPropsInterface } from "../resource-properties";

/**
 * Executor meta key the server reads the name of the enforced device policy from.
 */
const POLICY_NAME_META_KEY: string = "policyName";

/**
 * Number of policies listed in the picker. Typing narrows the list on the server.
 */
const POLICY_LIST_LIMIT: number = 20;

/**
 * Executor meta key of the phase the step runs.
 */
const PHASE_META_KEY: string = "phase";

/**
 * Phase a step runs when it does not name one.
 */
const DEFAULT_PHASE: string = DeviceRegistrationPhases.NativeDeviceRegistration;

/**
 * Phases that verify the device, where a device policy applies.
 */
const POLICY_PHASES: string[] = [ DEFAULT_PHASE, DeviceRegistrationPhases.ProcessDevice ];

/**
 * Fallback phases when the server does not list them.
 */
const DEFAULT_PHASES: ExecutorPhaseInterface[] = Object.values(DeviceRegistrationPhases).map(
    (phase: DeviceRegistrationPhases) => ({ name: phase })
);

/**
 * Props interface of {@link DeviceRegistrationProperties}
 */
type DeviceRegistrationPropertiesPropsInterface = CommonResourcePropertiesPropsInterface &
    IdentifiableComponentInterface;

/**
 * Properties of the device registration step: its phase and device policy.
 *
 * @param props - Props injected to the component.
 * @returns DeviceRegistrationProperties component.
 */
const DeviceRegistrationProperties: FunctionComponent<DeviceRegistrationPropertiesPropsInterface> = ({
    resource,
    onChange,
    ["data-componentid"]: componentId = "device-registration-properties"
}: DeviceRegistrationPropertiesPropsInterface): ReactElement => {
    const { t } = useTranslation();
    const executorMetadata: ExtensionExecutorInterface | null =
        useExtensionExecutor(ExecutionTypes.DeviceRegistration);

    const devicePoliciesFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features?.devicePolicies
    );
    const hasReadPermission: boolean = useRequiredScopes(devicePoliciesFeatureConfig?.scopes?.read);
    const { isSubOrganization } = useGetCurrentOrganizationType();

    // Device policies can't be managed in sub-organizations; they are inherited from the parent organization.
    const isPolicySelectionDisabled: boolean = isSubOrganization();

    const [ searchQuery, setSearchQuery ] = useState<string | undefined>(undefined);

    const { data: policyList, isLoading: isPolicyListLoading } = useGetDevicePolicies<
        DevicePolicyListResponseInterface
    >(POLICY_LIST_LIMIT, 0, searchQuery, hasReadPermission && !isPolicySelectionDisabled);

    const executorMeta: Record<string, string> = resource?.data?.action?.executor?.meta ?? {};
    const selectedPolicyName: string | null = executorMeta[ POLICY_NAME_META_KEY ] || null;
    const phases: ExecutorPhaseInterface[] = executorMetadata?.phases?.length
        ? executorMetadata.phases
        : DEFAULT_PHASES;
    const selectedPhase: string = executorMeta[ PHASE_META_KEY ] || DEFAULT_PHASE;
    const isPolicyApplicable: boolean = POLICY_PHASES.includes(selectedPhase);

    const policyNames: string[] = useMemo(() => {
        const names: string[] = (policyList?.policies ?? []).map(
            (policy: DevicePolicyListItemInterface) => policy.name
        );

        // Keep the saved policy selectable even when it is not in the current page of results.
        if (selectedPolicyName && !names.includes(selectedPolicyName)) {
            names.unshift(selectedPolicyName);
        }

        return names;
    }, [ policyList?.policies, selectedPolicyName ]);

    const handleSearch: DebouncedFunc<(query: string) => void> = useMemo(
        () => debounce((query: string): void => setSearchQuery(query?.trim() || undefined), 300),
        []
    );

    return (
        <Stack gap={ 2 } data-componentid={ componentId }>
            <Typography variant="body2">
                { t("devices:registrationStep.properties.description") }
            </Typography>
            <FormControl fullWidth size="small">
                <InputLabel id={ `${ componentId }-phase-label` }>
                    { t("devices:registrationStep.properties.phase.label") }
                </InputLabel>
                <Select
                    labelId={ `${ componentId }-phase-label` }
                    label={ t("devices:registrationStep.properties.phase.label") }
                    value={ selectedPhase }
                    onChange={ (event: SelectChangeEvent<string>): void => {
                        const phase: string = event.target.value;

                        // One change for both keys, since property changes are debounced. A policy only applies to a
                        // phase that verifies the device.
                        onChange("action.executor.meta", POLICY_PHASES.includes(phase)
                            ? { ...executorMeta, [ PHASE_META_KEY ]: phase }
                            : { ...executorMeta, [ PHASE_META_KEY ]: phase, [ POLICY_NAME_META_KEY ]: "" }, resource);
                    } }
                    data-componentid={ `${ componentId }-phase` }
                >
                    { phases.map((phase: ExecutorPhaseInterface) => (
                        <MenuItem key={ phase.name } value={ phase.name }>
                            { t(`devices:registrationStep.properties.phase.options.${ phase.name }`,
                                { defaultValue: phase.description || phase.name }) }
                        </MenuItem>
                    )) }
                </Select>
                <FormHelperText>{ t("devices:registrationStep.properties.phase.hint") }</FormHelperText>
            </FormControl>
            { isPolicyApplicable && (isPolicySelectionDisabled ? (
                <TextField
                    fullWidth
                    disabled
                    value={ selectedPolicyName ?? "" }
                    label={ t("devices:registrationStep.properties.policy.label") }
                    helperText={ t("devices:registrationStep.properties.policy.subOrganization") }
                    data-componentid={ `${ componentId }-policy` }
                />
            ) : (
                <Autocomplete
                    key={ resource?.id }
                    options={ policyNames }
                    value={ selectedPolicyName }
                    loading={ isPolicyListLoading }
                    filterOptions={ (options: string[]) => options }
                    noOptionsText={ t("devices:registrationStep.properties.noPolicies") }
                    onInputChange={ (_event: SyntheticEvent, query: string, reason: string): void => {
                        if (reason === "input") {
                            handleSearch(query);
                        }
                    } }
                    onChange={ (_event: SyntheticEvent, policyName: string | null): void => {
                        onChange(`action.executor.meta.${ POLICY_NAME_META_KEY }`, policyName ?? "", resource);
                    } }
                    renderInput={ (params: AutocompleteRenderInputParams) => (
                        <TextField
                            { ...params }
                            label={ t("devices:registrationStep.properties.policy.label") }
                            placeholder={ t("devices:registrationStep.properties.policy.placeholder") }
                            helperText={ hasReadPermission
                                ? t("devices:registrationStep.properties.policy.hint")
                                : t("devices:registrationStep.properties.policy.noPermission") }
                        />
                    ) }
                    data-componentid={ `${ componentId }-policy` }
                />
            )) }
        </Stack>
    );
};

export default DeviceRegistrationProperties;
