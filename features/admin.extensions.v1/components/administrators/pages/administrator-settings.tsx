/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DocumentationLink, PageLayout, useDocumentation } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, CheckboxProps, Icon, Message } from "semantic-ui-react";
import useAuthorization from "../../../../admin.authorization.v1/hooks/use-authorization";
import { history, store } from "../../../../admin.core.v1";
import {
    updateOrganizationConfigV2
} from "../../../../admin.extensions.v2/components/administrators/api/updateOrganizationConfigV2";
import {
    useOrganizationConfigV2
} from "../../../../admin.extensions.v2/components/administrators/api/useOrganizationConfigV2";
import { updateOrganizationConfig, useOrganizationConfig } from "../api/organization";
import { AdministratorConstants } from "../constants";
import { OrganizationInterface, UseOrganizationConfigType } from "../models/organization";

/**
 * Props for the Administration Settings page.
 */
type AdminSettingsPageInterface = IdentifiableComponentInterface;

interface EnterpriseLoginEnabledConfigInterface {
    isEnterpriseLoginEnabled: boolean;
}

/**
 * Administration settings edit page.
 *
 * @param props - Props injected to the component.
 *
 * @returns Admin settings page.
 */
export const AdminSettingsPage: FunctionComponent<AdminSettingsPageInterface> = (
    props: AdminSettingsPageInterface
): ReactElement => {

    const { ["data-componentid"]: testId } = props;

    const dispatch: Dispatch = useDispatch();
    const { legacyAuthzRuntime }  = useAuthorization();

    const useOrgConfig: UseOrganizationConfigType = legacyAuthzRuntime
        ? useOrganizationConfig : useOrganizationConfigV2;
    const updateOrgConfig: (isEnterpriseLoginEnabled: OrganizationInterface) =>
        Promise<any> = legacyAuthzRuntime ? updateOrganizationConfig : updateOrganizationConfigV2;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const [ isEnterpriseLoginEnabled, setIsEnterpriseLoginEnabled ] = useState<boolean>(false);
    const organizationName: string = store.getState().auth.tenantDomain;
    const {
        data: organizationConfig,
        isLoading: isOrgConfigRequestLoading,
        error: orgConfigFetchRequestError
    } = useOrgConfig(
        organizationName,
        {
            revalidateIfStale: false
        }
    );

    useEffect(() => {
        setIsEnterpriseLoginEnabled(organizationConfig?.isEnterpriseLoginEnabled);
    }, [ isOrgConfigRequestLoading ]);

    /**
     * Dispatches error notifications if Organization config fetch request fails.
     */
    useEffect(() => {
        if (!orgConfigFetchRequestError) {
            return;
        }

        if (orgConfigFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: orgConfigFetchRequestError?.response?.data?.description
                    ?? orgConfigFetchRequestError?.response?.data?.detail
                        ?? t("extensions:manage.users.administratorSettings.error.description"),
                level: AlertLevels.ERROR,
                message: orgConfigFetchRequestError?.response?.data?.message
                    ?? t("extensions:manage.users.administratorSettings.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("extensions:manage.users.administratorSettings.genericError." +
                        "description"),
            level: AlertLevels.ERROR,
            message: t("extensions:manage.users.administratorSettings.genericError.message")
        }));
    }, [ orgConfigFetchRequestError ]);

    /**
     * Handles updating the enterprise login toggle.
     *
     * @param e - Update event fired from checkbox.
     * @param data - Data received from checkbox on click.
     */
    const handleUpdate = (e: SyntheticEvent, data: CheckboxProps) => {
        const isEnterpriseLoginEnabledConfig: EnterpriseLoginEnabledConfigInterface = {
            isEnterpriseLoginEnabled: data.checked
        };

        setIsEnterpriseLoginEnabled(data.checked);

        updateOrgConfig(isEnterpriseLoginEnabledConfig)
            .then(() => {
                dispatch(addAlert({
                    description: t("extensions:manage.users.administratorSettings.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:manage.users.administratorSettings.success.message")
                }));

            }).catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                            ?? t("extensions:manage.users.administratorSettings.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                            ?? t("extensions:manage.users.administratorSettings.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("extensions:manage.users.administratorSettings.genericError." +
                        "description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:manage.users.administratorSettings.genericError.message")
                }));
            });
    };

    /**
     * This handles back button navigation
     */
    const handleBackButtonClick = () => {
        history.push(AdministratorConstants.getPaths().get("COLLABORATOR_USERS_PATH"));
    };

    /**
     * This renders the enable toggle.
     */
    const connectorToggle = (): ReactElement => {
        return (
            <>
                <Checkbox
                    label={ isEnterpriseLoginEnabled
                        ? t("extensions:manage.users.administratorSettings.enableToggleMessage")
                        : t("extensions:manage.users.administratorSettings.disableToggleMessage")
                    }
                    toggle
                    onChange={
                        handleUpdate
                    }
                    checked={ isEnterpriseLoginEnabled }
                    readOnly={ false }
                    data-componentid={ `${ testId }-enable-toggle` }
                />
            </>
        );
    };

    return (
        <PageLayout
            title={ t("extensions:manage.users.administratorSettings.administratorSettingsTitle") }
            description={ (
                <>
                    { t("extensions:manage.users.administratorSettings.administratorSettingsSubtitle") }
                    <DocumentationLink
                        link={ getLink("manage.users.collaboratorAccounts.adminSettingsLearnMore") }
                    >
                        { t("extensions:common.learnMore") }
                    </DocumentationLink>
                </>
            ) }
            backButton={ {
                "data-componentid": `${ testId }-page-back-button`,
                onClick:  handleBackButtonClick,
                text: t("extensions:manage.users.administratorSettings.backButton")
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ true }
            data-componentid={ `${ testId }-page-layout` }
        >
            {
                connectorToggle()
            }
            <Message
                info
                content={
                    (<>
                        <Icon name="info circle"/>
                        { t("extensions:manage.users.administratorSettings.toggleHint") }
                    </>)
                }
            />
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
AdminSettingsPage.defaultProps = {
    "data-componentid": "administrator-settings-page"
};

export default AdminSettingsPage;
