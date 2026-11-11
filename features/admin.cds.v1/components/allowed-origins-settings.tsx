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
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Hint, URLInput } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import { CDSConfig, CDSSettingsSectionStateInterface } from "../models/config";
import {
    AllowedOriginCheckInterface,
    AllowedOriginError,
    checkAllowedOrigin,
    normalizeAllowedOrigin
} from "../utils/allowed-origin-utils";

interface AllowedOriginsSettingsPropsInterface extends IdentifiableComponentInterface {
    config: CDSConfig;
    /**
     * Receives the origins as they stand, which the settings page saves with its other sections.
     */
    onChange: (state: CDSSettingsSectionStateInterface) => void;
    isReadOnly?: boolean;
    /**
     * A child organization uses the origins of its root organization and cannot change them.
     */
    isInherited?: boolean;
}

/**
 * Splits the comma-separated value of the URL input into the stored origins, without duplicates.
 */
const toOrigins = (urlState: string): string[] => [
    ...new Set<string>((urlState ?? "")
        .split(",")
        .map((origin: string) => normalizeAllowedOrigin(origin))
        .filter((origin: string) => origin !== ""))
];

/**
 * The browser origins of the organization's own apps that may call CDS, entered the way the
 * allowed origins of an application are.
 */
const AllowedOriginsSettings: FunctionComponent<AllowedOriginsSettingsPropsInterface> = ({
    config,
    onChange,
    isReadOnly = false,
    isInherited = false,
    ["data-componentid"]: componentId = "cds-allowed-origins-settings"
}: AllowedOriginsSettingsPropsInterface): ReactElement => {

    const { t } = useTranslation();

    const savedOrigins: string[] = useMemo(
        () => config?.cors_allowed_origins ?? [], [ config?.cors_allowed_origins ]);

    const [ origins, setOrigins ] = useState<string[]>(savedOrigins);
    const [ originError, setOriginError ] = useState<AllowedOriginError | null>(null);

    useEffect(() => {
        setOrigins(savedOrigins);
    }, [ savedOrigins ]);

    const isEditable: boolean = !isReadOnly && !isInherited;

    const isDirty: boolean = useMemo(
        () => origins.length !== savedOrigins.length
            || origins.some((origin: string) => !savedOrigins.includes(origin)),
        [ origins, savedOrigins ]
    );

    // The input drops a trailing slash after validating, as it does for the allowed origins of an
    // application, so the check runs on the origin that would be added.
    const validateOrigin: (value: string) => boolean = useCallback((value: string): boolean => {
        const check: AllowedOriginCheckInterface = checkAllowedOrigin(value.replace(/\/$/, ""), origins);

        setOriginError(check.error ?? null);

        return !check.error;
    }, [ origins ]);

    // Every origin is checked as it is added, so the list as it stands is always valid.
    useEffect(() => {
        onChange({ hasError: false, isDirty, payload: { cors_allowed_origins: origins } });
    }, [ origins, isDirty ]);

    return (
        <Box
            sx={ { display: "flex", flexDirection: "column", gap: 2, maxWidth: "720px" } }
            data-componentid={ componentId }
        >
            <Typography variant="h4">
                { t("customerDataService:allowedOrigins.heading") }
            </Typography>

            { isInherited && (
                <Alert severity="info" data-componentid={ `${ componentId }-inherited` }>
                    { t("customerDataService:allowedOrigins.inherited") }
                </Alert>
            ) }

            { isInherited && origins.length === 0 ? (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    data-componentid={ `${ componentId }-empty` }
                >
                    { t("customerDataService:allowedOrigins.emptyInherited") }
                </Typography>
            ) : (
                // Laid out as on the allowed origins of an application, whose spacing comes from the grid.
                <Box className="ui form">
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } className="field">
                                <URLInput
                                    onlyOrigin
                                    skipInternalValidation
                                    showPredictions={ false }
                                    labelName=""
                                    urlState={ origins.join(",") }
                                    setURLState={ (urlState: string): void => {
                                        // The input still adds a typed origin on Enter while it is read only.
                                        if (isEditable) {
                                            setOrigins(toOrigins(urlState));
                                        }
                                    } }
                                    placeholder={ t("customerDataService:allowedOrigins.field.placeholder") }
                                    validation={ validateOrigin }
                                    validationErrorMsg={ originError
                                        ? t(`customerDataService:allowedOrigins.errors.${ originError }`)
                                        : "" }
                                    duplicateURLErrorMessage={ t("common:duplicateURLError") }
                                    addURLTooltip={ t("common:addURL") }
                                    computerWidth={ 16 }
                                    readOnly={ !isEditable }
                                    data-componentid={ `${ componentId }-input` }
                                />
                                { /* Below the origins, as on the allowed origins of an application. */ }
                                <Hint>{ t("customerDataService:allowedOrigins.description") }</Hint>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Box>
            ) }
        </Box>
    );
};

export default AllowedOriginsSettings;
