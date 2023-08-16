/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
import { history, store } from "../../../../features/core";
import {  updateOrganizationConfig, useOrganizationConfig } from "../api/organization";
import { UsersConstants } from "../constants";

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

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const [ isEnterpriseLoginEnabled, setIsEnterpriseLoginEnabled ] = useState<boolean>(false);
    const organizationName: string = store.getState().auth.tenantDomain;
    const {
        data: organizationConfig,
        isLoading: isOrgConfigRequestLoading,
        error: orgConfigFetchRequestError
    } = useOrganizationConfig(
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

        updateOrganizationConfig(isEnterpriseLoginEnabledConfig)
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
        history.push(UsersConstants.getPaths().get("COLLABORATOR_USERS_PATH"));
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
