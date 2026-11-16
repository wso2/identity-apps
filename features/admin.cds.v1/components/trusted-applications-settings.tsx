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
import Autocomplete, {
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@oxygen-ui/react/Autocomplete";
import Box from "@oxygen-ui/react/Box";
import Chip from "@oxygen-ui/react/Chip";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Hint } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { CDSApplicationInterface, useCDSApplications } from "../hooks/use-cds-applications";
import useConsoleApplicationIdentifier from "../hooks/use-console-application-identifier";
import { CDSConfig, CDSSettingsSectionStateInterface } from "../models/config";

/**
 * Props for the applications allowed all customer data.
 */
interface TrustedApplicationsSettingsPropsInterface extends IdentifiableComponentInterface {
    /**
     * Configuration of the organization, as stored.
     */
    config: CDSConfig;
    /**
     * Receives the applications as they stand, which the settings page saves with its other sections.
     */
    onChange: (state: CDSSettingsSectionStateInterface) => void;
    /**
     * Whether the applications can be changed.
     */
    isReadOnly?: boolean;
}

/**
 * The applications allowed all customer data on a profile, including the application data of every
 * app, where any other application gets only its own. They are stored by the identifier CDS knows them by, which
 * depends on the deployment: the app UUID or the client ID.
 */
const TrustedApplicationsSettings: FunctionComponent<TrustedApplicationsSettingsPropsInterface> = ({
    config,
    onChange,
    isReadOnly = false,
    ["data-componentid"]: componentId = "cds-trusted-applications-settings"
}: TrustedApplicationsSettingsPropsInterface): ReactElement => {

    const { t } = useTranslation();

    const {
        applications,
        getApplicationDisplayName,
        isApplicationsRequestFailed,
        isLoading: isApplicationsLoading
    } = useCDSApplications();

    const savedApplications: string[] = useMemo(
        () => config?.system_applications ?? [], [ config?.system_applications ]);

    const [ selected, setSelected ] = useState<string[]>(savedApplications);
    // Enabling CDS adds the Console, which shows profiles with the data of every app. Removing it
    // would leave the Console showing only its own, so it stays in the list. Unresolved, the
    // Console is only not locked, and the list is still saved as it stands.
    const consoleIdentifier: string | null = useConsoleApplicationIdentifier();

    useEffect(() => {
        setSelected(savedApplications);
    }, [ savedApplications ]);

    // The Console is a system portal, which the application list leaves out, so it is never
    // offered here. It is only kept when it is already in the list. Sorted by name, as on the
    // profile attribute page.
    const options: string[] = useMemo(
        () => [ ...applications ]
            .sort((first: CDSApplicationInterface, second: CDSApplicationInterface) =>
                first.name.localeCompare(second.name))
            .map((app: CDSApplicationInterface) => app.identifier)
            .filter((identifier: string) => identifier !== consoleIdentifier),
        [ applications, consoleIdentifier ]
    );

    const isDirty: boolean = useMemo(
        () => selected.length !== savedApplications.length
            || selected.some((identifier: string) => !savedApplications.includes(identifier)),
        [ selected, savedApplications ]
    );

    useEffect(() => {
        onChange({ hasError: false, isDirty, payload: { system_applications: selected } });
    }, [ selected, isDirty ]);

    const isLocked: (identifier: string) => boolean = useCallback(
        (identifier: string): boolean => identifier === consoleIdentifier, [ consoleIdentifier ]);

    const labelOf: (identifier: string) => string = useCallback(
        (identifier: string): string => isLocked(identifier)
            ? t("customerDataService:trustedApplications.console")
            : getApplicationDisplayName(identifier),
        [ isLocked, getApplicationDisplayName, t ]
    );

    // Backspace in the input removes the last application, so the Console is kept here rather
    // than only by leaving its chip without a delete button.
    const handleChange: (event: SyntheticEvent, value: string[]) => void = useCallback(
        (_event: SyntheticEvent, value: string[]): void => {
            setSelected((previous: string[]) => previous.filter(isLocked)
                .concat(value.filter((identifier: string) => !isLocked(identifier))));
        },
        [ isLocked ]
    );

    return (
        <Box
            sx={ { display: "flex", flexDirection: "column", gap: 2, maxWidth: "720px" } }
            data-componentid={ componentId }
        >
            <Typography variant="h4">
                { t("customerDataService:trustedApplications.heading") }
            </Typography>

            { isApplicationsRequestFailed && (
                <Alert severity="warning" data-componentid={ `${ componentId }-load-error` }>
                    { t("customerDataService:trustedApplications.errors.loadApplications") }
                </Alert>
            ) }

            <Box>
                <Autocomplete
                    multiple
                    disableClearable
                    filterSelectedOptions
                    options={ options }
                    value={ selected }
                    onChange={ handleChange }
                    getOptionLabel={ labelOf }
                    loading={ isApplicationsLoading }
                    readOnly={ isReadOnly }
                    noOptionsText={ t("customerDataService:trustedApplications.field.noOptions") }
                    renderTags={ (value: string[], getTagProps: AutocompleteRenderGetTagProps): ReactElement => (
                        <Box display="flex" flexWrap="wrap" gap={ 0.5 }>
                            { value.map((identifier: string, index: number): ReactElement => {
                                const { onDelete, ...tagProps }: ReturnType<AutocompleteRenderGetTagProps> =
                                    getTagProps({ index });

                                return (
                                    <Chip
                                        { ...tagProps }
                                        key={ identifier }
                                        size="small"
                                        label={ labelOf(identifier) }
                                        onDelete={ isReadOnly || isLocked(identifier) ? undefined : onDelete }
                                        data-componentid={ `${ componentId }-chip-${ identifier }` }
                                    />
                                );
                            }) }
                        </Box>
                    ) }
                    renderInput={ (params: AutocompleteRenderInputParams) => (
                        <TextField
                            { ...params }
                            placeholder={ isReadOnly
                                ? undefined
                                : t("customerDataService:trustedApplications.field.placeholder") }
                            inputProps={ {
                                ...params.inputProps,
                                "aria-label": t("customerDataService:trustedApplications.heading")
                            } }
                        />
                    ) }
                    data-componentid={ `${ componentId }-input` }
                />
                <Hint>{ t("customerDataService:trustedApplications.description") }</Hint>
            </Box>
        </Box>
    );
};

export default TrustedApplicationsSettings;
