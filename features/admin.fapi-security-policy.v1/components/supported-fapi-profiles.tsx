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
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Checkbox from "@oxygen-ui/react/Checkbox";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import FormGroup from "@oxygen-ui/react/FormGroup";
import FormHelperText from "@oxygen-ui/react/FormHelperText";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { FapiProfile } from "../models/fapi-security-policy";
import { FapiSecurityPolicyConstants } from "../constants/fapi-security-policy-constants";

/**
 * Selection mode for the FAPI profiles component.
 *
 * - `"multiple"` (default): Checkbox-based, allows selecting multiple profiles simultaneously.
 *   Used on server-level FAPI configuration pages.
 * - `"single"`: Radio-based, allows selecting exactly one profile at a time.
 *   Used on per-application protocol configuration pages.
 */
export type FapiProfileSelectionMode = "single" | "multiple";

interface SupportedFapiProfilesMultipleProps {
    selectionMode?: "multiple";
    selectedProfiles: FapiProfile[];
    onProfileToggle: (profile: FapiProfile) => void;
    hasError?: boolean;
    selectedProfile?: never;
    onProfileChange?: never;
}

interface SupportedFapiProfilesSingleProps {
    selectionMode: "single";
    selectedProfile: FapiProfile | null;
    onProfileChange: (profile: FapiProfile) => void;
    selectedProfiles?: never;
    onProfileToggle?: never;
}

type SupportedFapiProfilesInterface = IdentifiableComponentInterface & {
    isReadOnly?: boolean;
} & (SupportedFapiProfilesMultipleProps | SupportedFapiProfilesSingleProps);

const SupportedFapiProfiles: FunctionComponent<SupportedFapiProfilesInterface> = (
    props: SupportedFapiProfilesInterface
): ReactElement => {
    const {
        isReadOnly = false,
        "data-componentid": componentId = "supported-fapi-profiles"
    } = props;

    const { t } = useTranslation();

    const profiles: FapiProfile[] = Object.keys(FapiSecurityPolicyConstants.PROFILE_TRANSLATION_SUFFIX_MAP) as FapiProfile[];

    const renderProfileLabel = (profile: FapiProfile): ReactElement => {
        const translationKeySuffix: string = FapiSecurityPolicyConstants.PROFILE_TRANSLATION_SUFFIX_MAP[ profile ];

        return (
            <Box>
                <Typography variant="h6">
                    { t(`fapiSecurityPolicy:form.profiles.options.${ translationKeySuffix }.label`) }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    { t(`fapiSecurityPolicy:form.profiles.options.${ translationKeySuffix }.hint`) }
                </Typography>
            </Box>
        );
    };

    const cardGridSx = {
        display: "grid",
        gap: 2,
        gridTemplateColumns: { sm: "1fr 1fr", xs: "1fr" }
    };

    const renderCards = (): ReactElement => {
        if (props.selectionMode === "single") {
            return (
                <RadioGroup
                    value={ props.selectedProfile ?? "" }
                    onChange={ (_: React.ChangeEvent<HTMLInputElement>, value: string): void => {
                        props.onProfileChange(value as FapiProfile);
                    } }
                    sx={ cardGridSx }
                    data-componentid={ `${ componentId }-group` }
                >
                    { profiles.map((profile: FapiProfile): ReactElement => (
                        <Card key={ profile } variant="outlined">
                            <CardContent sx={ { "&:last-child": { pb: 1.5 }, p: 1.5 } }>
                                <FormControlLabel
                                    sx={ { alignItems: "flex-start" } }
                                    value={ profile }
                                    control={
                                        <Radio
                                            sx={ { pt: "1px" } }
                                            disabled={ isReadOnly }
                                            data-componentid={ `${ componentId }-profile-${ profile.toLowerCase() }` }
                                        />
                                    }
                                    label={ renderProfileLabel(profile) }
                                />
                            </CardContent>
                        </Card>
                    )) }
                </RadioGroup>
            );
        }

        return (
            <FormGroup
                sx={ cardGridSx }
                data-componentid={ `${ componentId }-group` }
            >
                { profiles.map((profile: FapiProfile): ReactElement => (
                    <Card key={ profile } variant="outlined">
                        <CardContent sx={ { "&:last-child": { pb: 1.5 }, p: 1.5 } }>
                            <FormControlLabel
                                sx={ { alignItems: "flex-start" } }
                                control={
                                    <Checkbox
                                        sx={ { pt: "1px" } }
                                        checked={ props.selectedProfiles.includes(profile) }
                                        onChange={ (): void => props.onProfileToggle(profile) }
                                        disabled={ isReadOnly }
                                        data-componentid={ `${ componentId }-profile-${ profile.toLowerCase() }` }
                                    />
                                }
                                label={ renderProfileLabel(profile) }
                            />
                        </CardContent>
                    </Card>
                )) }
            </FormGroup>
        );
    };

    return (
        <Box mb={ 4 }>
            <Typography variant="h6" mb={ 0.5 }>
                { t("fapiSecurityPolicy:form.profiles.heading") }
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={ 2 }>
                { t("fapiSecurityPolicy:form.profiles.description") }
            </Typography>
            { renderCards() }
            { props.selectionMode !== "single" && props.hasError && (
                <FormHelperText error data-componentid={ `${ componentId }-error` }>
                    { t("fapiSecurityPolicy:form.profiles.validations.atLeastOne") }
                </FormHelperText>
            ) }
        </Box>
    );
};

export default SupportedFapiProfiles;
