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

import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import FormControl from "@oxygen-ui/react/FormControl";
import FormLabel from "@oxygen-ui/react/FormLabel";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Select, { SelectChangeEvent } from "@oxygen-ui/react/Select";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Hint } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CDSConfig, CDSSettingsSectionStateInterface, CDS_TEMPORARY_PROFILE_CLEANUP } from "../models/config";

interface TemporaryProfileRetentionSettingsPropsInterface extends IdentifiableComponentInterface {
    config: CDSConfig;
    /**
     * Receives the settings as they stand, which the settings page saves with its other sections.
     */
    onChange: (state: CDSSettingsSectionStateInterface) => void;
    isReadOnly?: boolean;
    /**
     * A child organization uses the settings of its root organization and cannot change them.
     */
    isInherited?: boolean;
}

/**
 * The settings as the dropdowns hold them.
 */
interface SettingsStateInterface {
    intervalDays: number;
    retentionDays: number;
}

type SettingKey = keyof SettingsStateInterface;

const SETTING_KEYS: SettingKey[] = [ "retentionDays", "intervalDays" ];

/**
 * A setting as the server reports it, or its default when it reports none. The server reads a value at
 * or below zero as unset, so it is shown as the default rather than as a setting.
 */
const toSetting = (value: number | undefined, key: SettingKey): number =>
    value !== undefined && value > 0 ? value : CDS_TEMPORARY_PROFILE_CLEANUP[ key ].default;

const toState = (config: CDSConfig): SettingsStateInterface => ({
    intervalDays: toSetting(config?.temporary_profile_cleanup_interval_days, "intervalDays"),
    retentionDays: toSetting(config?.temporary_profile_retention_days, "retentionDays")
});

/**
 * The values a dropdown offers: the options, plus the stored value when it is not one of them, so that
 * a value set through the API is shown instead of being dropped.
 */
const optionsFor = (key: SettingKey, stored: number): number[] =>
    [ ...new Set<number>([ ...CDS_TEMPORARY_PROFILE_CLEANUP[ key ].options, stored ]) ]
        .sort((first: number, second: number) => first - second);

/**
 * How temporary profiles are cleaned up: how long one is kept without an update before the server deletes it,
 * with its cookies, and how often the server cleans up. Profiles that belong to a user, or that are merged
 * with another profile, are not affected.
 */
const TemporaryProfileRetentionSettings: FunctionComponent<TemporaryProfileRetentionSettingsPropsInterface> = ({
    config,
    onChange,
    isReadOnly = false,
    isInherited = false,
    ["data-componentid"]: componentId = "cds-temporary-profile-retention-settings"
}: TemporaryProfileRetentionSettingsPropsInterface): ReactElement => {

    const { t } = useTranslation();

    const [ settings, setSettings ] = useState<SettingsStateInterface>(() => toState(config));

    // The configuration arrives asynchronously, so seed the dropdowns again whenever a fresh copy lands
    // rather than leaving the defaults showing over the saved values.
    useEffect(() => {
        setSettings(toState(config));
    }, [ config?.temporary_profile_retention_days, config?.temporary_profile_cleanup_interval_days ]);

    const isEditable: boolean = !isReadOnly && !isInherited;

    const saved: SettingsStateInterface = useMemo(() => toState(config), [
        config?.temporary_profile_retention_days,
        config?.temporary_profile_cleanup_interval_days
    ]);

    const isDirty: boolean = SETTING_KEYS.some((key: SettingKey) => settings[ key ] !== saved[ key ]);

    useEffect(() => {
        onChange({
            // A dropdown only offers values the server accepts, so there is nothing to get wrong.
            hasError: false,
            isDirty,
            payload: {
                temporary_profile_cleanup_interval_days: settings.intervalDays,
                temporary_profile_retention_days: settings.retentionDays
            }
        });
    }, [ settings, isDirty ]);

    const optionLabel = (key: SettingKey, value: number): string =>
        t(`customerDataService:temporaryProfileRetention.fields.${ key }.${ value === 1 ? "optionOne" : "option" }`,
            { count: value });

    return (
        <Box
            sx={ { display: "flex", flexDirection: "column", gap: 2, maxWidth: "720px" } }
            data-componentid={ componentId }
        >
            <Box>
                <Typography variant="h4">
                    { t("customerDataService:temporaryProfileRetention.heading") }
                </Typography>
                <Hint compact>
                    { t("customerDataService:temporaryProfileRetention.description") }
                </Hint>
            </Box>

            { isInherited && (
                <Alert severity="info" data-componentid={ `${ componentId }-inherited` }>
                    { t("customerDataService:temporaryProfileRetention.inherited") }
                </Alert>
            ) }

            { SETTING_KEYS.map((key: SettingKey) => (
                <FormControl
                    key={ key }
                    fullWidth
                    disabled={ !isEditable }
                    data-componentid={ `${ componentId }-${ key }` }
                >
                    <FormLabel id={ `${ componentId }-${ key }-label` }>
                        { t(`customerDataService:temporaryProfileRetention.fields.${ key }.label`) }
                    </FormLabel>
                    <Select
                        fullWidth
                        size="small"
                        value={ settings[ key ] }
                        disabled={ !isEditable }
                        labelId={ `${ componentId }-${ key }-label` }
                        onChange={ (event: SelectChangeEvent<number>): void =>
                            setSettings((previous: SettingsStateInterface) =>
                                ({ ...previous, [ key ]: Number(event.target.value) })) }
                        data-componentid={ `${ componentId }-${ key }-select` }
                    >
                        { optionsFor(key, saved[ key ]).map((value: number) => (
                            <MenuItem key={ value } value={ value }>{ optionLabel(key, value) }</MenuItem>
                        )) }
                    </Select>
                    <Hint compact>
                        { t(`customerDataService:temporaryProfileRetention.fields.${ key }.hint`, {
                            default: optionLabel(key, CDS_TEMPORARY_PROFILE_CLEANUP[ key ].default)
                        }) }
                    </Hint>
                </FormControl>
            )) }
        </Box>
    );
};

export default TemporaryProfileRetentionSettings;
