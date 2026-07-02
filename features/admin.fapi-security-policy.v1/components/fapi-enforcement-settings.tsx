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

import Box from "@oxygen-ui/react/Box";
import FormControl from "@oxygen-ui/react/FormControl";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Checkbox, CheckboxProps } from "semantic-ui-react";
import { FapiProfile } from "../models/fapi-security-policy";
import { FapiSecurityPolicyConstants } from "../constants/fapi-security-policy-constants";

interface FapiEnforcementSettingsInterface extends IdentifiableComponentInterface {
    enableFapiEnforcement: boolean;
    selectedProfile: FapiProfile | null;
    supportedProfiles: FapiProfile[];
    onEnforcementToggle: (checked: boolean) => void;
    onProfileChange: (profile: FapiProfile | null) => void;
    isReadOnly?: boolean;
    /** Override for the checkbox label. Defaults to the DCR mandate label. */
    checkboxLabel?: string;
    /** Override for the checkbox hint. Defaults to the DCR mandate hint. */
    checkboxHint?: string;
    /** Override for the profile selector label. Defaults to the DCR profile label. */
    profileLabel?: string;
}

const FapiEnforcementSettings: FunctionComponent<FapiEnforcementSettingsInterface> = (
    {
        enableFapiEnforcement,
        selectedProfile,
        supportedProfiles,
        onEnforcementToggle,
        onProfileChange,
        isReadOnly = false,
        checkboxLabel,
        checkboxHint,
        profileLabel,
        [ "data-componentid" ]: componentId = "fapi-enforcement-settings"
    }: FapiEnforcementSettingsInterface
): ReactElement => {
    const { t } = useTranslation();

    const resolvedCheckboxLabel: string = checkboxLabel ?? t("fapiSecurityPolicy:form.dcr.fields.mandate.label");
    const resolvedCheckboxHint: string = checkboxHint ?? t("fapiSecurityPolicy:form.dcr.fields.mandate.hint");
    const resolvedProfileLabel: string = profileLabel ?? t("fapiSecurityPolicy:form.dcr.fields.profile.label");

    return (
        <Box>
            <Checkbox
                checked={ enableFapiEnforcement }
                onChange={ (_: React.FormEvent<HTMLInputElement>, data: CheckboxProps): void => {
                    const checked: boolean = data.checked ?? false;

                    onEnforcementToggle(checked);
                    if (checked && supportedProfiles.length > 0) {
                        onProfileChange(supportedProfiles[0]);
                    }
                } }
                disabled={ isReadOnly }
                label={ resolvedCheckboxLabel }
                data-componentid={ `${ componentId }-mandate-checkbox` }
            />
            <Hint icon="info circle" popup compact className="ml-1">
                { resolvedCheckboxHint }
            </Hint>

            { enableFapiEnforcement && supportedProfiles.length > 1 && (
                <Box
                    ml={ 4 }
                    mt={ 2 }
                    pl={ 2 }
                    sx={ { borderLeft: 2, borderColor: "divider" } }
                    display="flex"
                    flexDirection={ { xs: "column", sm: "row" } }
                    alignItems={ { xs: "flex-start", sm: "center" } }
                    gap={ 2 }
                >
                    <Typography
                        id={ `${ componentId }-profile-label` }
                        variant="body2"
                        color="text.secondary"
                    >
                        { resolvedProfileLabel }
                    </Typography>
                    <FormControl size="small">
                        <Select
                            aria-labelledby={ `${ componentId }-profile-label` }
                            value={ selectedProfile ?? "" }
                            displayEmpty
                            onChange={ (event: SelectChangeEvent<FapiProfile>): void =>
                                onProfileChange(event.target.value as FapiProfile) }
                            disabled={ isReadOnly }
                            data-componentid={ `${ componentId }-profile-select` }
                        >
                            { supportedProfiles.map((profile: FapiProfile): ReactElement => (
                                <MenuItem key={ profile } value={ profile }>
                                    { t(`fapiSecurityPolicy:form.profiles.options.${
                                        FapiSecurityPolicyConstants.PROFILE_TRANSLATION_SUFFIX_MAP[ profile ]
                                    }.label`) }
                                </MenuItem>
                            )) }
                        </Select>
                    </FormControl>
                </Box>
            ) }
        </Box>
    );
};

export default FapiEnforcementSettings;
