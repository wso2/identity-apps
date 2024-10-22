/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import Card from "@oxygen-ui/react/Card";
import Skeleton from "@oxygen-ui/react/Skeleton";
import Stack from "@oxygen-ui/react/Stack";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import React, { FC, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, CheckboxProps } from "semantic-ui-react";
import { AdminAdvisoryBannerConfigurationInterface } from "../..//models/system-settings/admin-advisory";
import updateAdminAdvisoryBannerConfiguration
    from "../../api/system-settings/update-admin-advisory-banner-configuration";
import useAdminAdvisoryBannerConfiguration from "../../api/system-settings/use-admin-advisory-banner-configuration";
import "./admin-session-advisory-banner.scss";

/**
 * Props interface of {@link SystemSettingsTabs}
 */
export type AdminAdvisoryBannerInterface = IdentifiableComponentInterface;

interface AdminAdvisoryConfigurationInterface {
    /**
     * Flag to enable the banner.
     */
    enableBanner: boolean;
    /**
     * Banner content.
     */
    bannerContent: string;
}

/**
 * Component to enable & configure the admin advisory banner.
 *
 * @param props - Props injected to the component.
 * @returns Admin Advisory Banner configuration component.
 */
export const AdminSessionAdvisoryBanner: FC<AdminAdvisoryBannerInterface> = ({
    ["data-componentid"]: componentId = "admin-advisory-edit"
}: AdminAdvisoryBannerInterface): ReactElement => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ adminAdvisoryBannerConfigs, setAdminAdvisoryBannerConfigs ] = useState<
        AdminAdvisoryBannerConfigurationInterface
    >(undefined);

    const {
        data: adminAdvisoryConfigs,
        isLoading: isAdminAdvisoryConfigsGetRequestLoading,
        error: adminAdvisoryConfigsGetRequestError
    } = useAdminAdvisoryBannerConfiguration();

    useEffect(() => {
        if (!adminAdvisoryConfigs) {
            return;
        }

        setAdminAdvisoryBannerConfigs(adminAdvisoryConfigs);
    }, [ adminAdvisoryConfigs ]);

    useEffect(() => {
        if (!adminAdvisoryConfigsGetRequestError) {
            return;
        }

        dispatch(
            addAlert<AlertInterface>({
                description: t("extensions:develop.branding.notifications.fetch.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:develop.branding.notifications.fetch.genericError.message")
            })
        );
    }, [ adminAdvisoryConfigsGetRequestError ]);

    const handleToggleChange = (event: React.FormEvent<HTMLInputElement>, data: CheckboxProps) => {
        event.preventDefault();

        const configs: AdminAdvisoryConfigurationInterface = {
            bannerContent: adminAdvisoryBannerConfigs?.bannerContent,
            enableBanner: data.checked
        };

        updateAdminAdvisoryBannerConfig(configs, true);
    };

    const handleBannerContentUpdate = (values: Record<string, unknown>) => {
        const configs: AdminAdvisoryConfigurationInterface = {
            bannerContent: values?.bannerContent?.toString(),
            enableBanner: adminAdvisoryBannerConfigs.enableBanner
        };

        updateAdminAdvisoryBannerConfig(configs, false);
    };

    const updateAdminAdvisoryBannerConfig = (
        configs: AdminAdvisoryConfigurationInterface,
        isFeatureStatus: boolean
    ): void => {
        updateAdminAdvisoryBannerConfiguration(configs)
            .then(() => {
                setAdminAdvisoryBannerConfigs(configs);

                if (isFeatureStatus) {
                    if (configs.enableBanner) {
                        dispatch(
                            addAlert<AlertInterface>({
                                description: t(
                                    "console:manage.features.serverConfigs.adminAdvisory.notifications." +
                                        "enableAdminAdvisoryBanner.success.description"
                                ),
                                level: AlertLevels.SUCCESS,
                                message: t(
                                    "console:manage.features.serverConfigs.adminAdvisory.notifications." +
                                        "enableAdminAdvisoryBanner.success.message"
                                )
                            })
                        );
                    } else {
                        dispatch(
                            addAlert<AlertInterface>({
                                description: t(
                                    "console:manage.features.serverConfigs.adminAdvisory.notifications." +
                                        "disbleAdminAdvisoryBanner.success.description"
                                ),
                                level: AlertLevels.SUCCESS,
                                message: t(
                                    "console:manage.features.serverConfigs.adminAdvisory.notifications." +
                                        "disbleAdminAdvisoryBanner.success.message"
                                )
                            })
                        );
                    }

                    return;
                }

                dispatch(
                    addAlert<AlertInterface>({
                        description: t(
                            "console:manage.features.serverConfigs.adminAdvisory.notifications." +
                                "updateConfigurations.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.serverConfigs.adminAdvisory.notifications." +
                                "updateConfigurations.success.message"
                        )
                    })
                );
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(
                        addAlert<AlertInterface>({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.serverConfigs.adminAdvisory.notifications." +
                                    "updateConfigurations.error.message"
                            )
                        })
                    );
                }

                dispatch(
                    addAlert<AlertInterface>({
                        description: t(
                            "console:manage.features.serverConfigs.adminAdvisory.notifications." +
                                "updateConfigurations.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.serverConfigs.adminAdvisory.notifications." +
                                "updateConfigurations.genericError.message"
                        )
                    })
                );
            });
    };

    if (isAdminAdvisoryConfigsGetRequestLoading) {
        return (
            <Card className="admin-advisory-banner-content">
                <div className="admin-advisory-banner-form">
                    <Stack direction="column" spacing={ 2 }>
                        <Skeleton variant="rectangular" height={ 7 } width="30%" />
                        <Skeleton variant="rectangular" height={ 28 } />
                        <Skeleton variant="rectangular" height={ 7 } width="90%" />
                        <Skeleton variant="rectangular" height={ 7 } />
                    </Stack>
                </div>
            </Card>
        );
    }

    return (
        <Card className="admin-advisory-banner-content">
            <Stack direction="column" spacing={ 2 }>
                <Checkbox
                    label={
                        adminAdvisoryBannerConfigs?.enableBanner
                            ? t("console:manage.features.serverConfigs.adminAdvisory.configurationSection.enabled")
                            : t("console:manage.features.serverConfigs.adminAdvisory.configurationSection.enabled")
                    }
                    toggle
                    onChange={ handleToggleChange }
                    checked={ adminAdvisoryBannerConfigs?.enableBanner }
                    readOnly={ null }
                    data-componentid={ `${componentId}-enable-toggle` }
                />
                <Form
                    id="admin-advisory-form"
                    className="admin-advisory-banner-form"
                    initialValues={ adminAdvisoryBannerConfigs }
                    uncontrolledForm={ false }
                    validate={ null }
                    onSubmit={ (values: Record<string, unknown>) => handleBannerContentUpdate(values) }
                >
                    <Field.Textarea
                        ariaLabel="Admin Advisory Banner Content"
                        name="bannerContent"
                        label={ t(
                            "console:manage.features.serverConfigs.adminAdvisory" +
                                ".configurationEditSection.form.bannerContent.label"
                        ) }
                        required={ false }
                        placeholder={ t(
                            "console:manage.features.serverConfigs.adminAdvisory" +
                                ".configurationEditSection.form.bannerContent.placeholder"
                        ) }
                        initialValue={ adminAdvisoryBannerConfigs?.bannerContent }
                        readOnly={ !adminAdvisoryBannerConfigs?.enableBanner }
                        maxLength={ 300 }
                        minLength={ 3 }
                        data-componentid={ `${componentId}-content` }
                        width={ 16 }
                        hint={ t(
                            "console:manage.features.serverConfigs.adminAdvisory" +
                                ".configurationEditSection.form.bannerContent.hint"
                        ) }
                    />
                    <Field.Button
                        form="admin-advisory-form"
                        size="small"
                        buttonType="primary_btn"
                        ariaLabel="Update button"
                        name="update-button"
                        data-componentid={ `${componentId}-update-button` }
                        label={ t("common:update") }
                        hidden={ !adminAdvisoryBannerConfigs?.enableBanner }
                    />
                </Form>
            </Stack>
        </Card>
    );
};

export default AdminSessionAdvisoryBanner;
