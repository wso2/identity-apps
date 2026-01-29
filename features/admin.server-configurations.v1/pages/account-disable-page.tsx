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

import Grid from "@oxygen-ui/react/Grid";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ContentLoader,
    DangerZone,
    DangerZoneGroup,
    DocumentationLink,
    EmphasizedSegment,
    Hint,
    PageLayout,
    useDocumentation
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FC, FormEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, CheckboxProps } from "semantic-ui-react";
import { revertGovernanceConnectorProperties,
    updateGovernanceConnector,
    useGetGovernanceConnectorById
} from "../api/governance-connectors";
import { ServerConfigurationsConstants } from "../constants/server-configurations-constants";
import {
    ConnectorPropertyInterface,
    RevertGovernanceConnectorConfigInterface,
    UpdateGovernanceConnectorConfigInterface,
    UpdateGovernanceConnectorConfigPropertyInterface
} from "../models/governance-connectors";

/**
 * Props for the Account Disable configuration page.
 */
type AccountDisablePageInterface = IdentifiableComponentInterface;

/**
 * Account Disable configuration page.
 *
 * @param props - Props injected to the component.
 * @returns Account Disable configuration page.
 */
export const AccountDisablePage: FC<AccountDisablePageInterface> = (
    { [ "data-componentid" ]: componentId = "account-disable" }: AccountDisablePageInterface
): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();
    const { getLink } = useDocumentation();

    const {
        data: accountDisableConnectorData,
        isLoading: accountDisableFetchRequestLoading,
        error: accountDisableFetchRequestError,
        mutate: mutateAccountDisableFetchRequest
    } = useGetGovernanceConnectorById(ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CATEGORY_ID,
        ServerConfigurationsConstants.ACCOUNT_DISABLE_CONNECTOR_ID);

    const [ isAccountDisableEnabled, setIsAccountDisableEnabled ] = useState<boolean>(false);

    useEffect(() => {
        const accountDisableProperty: UpdateGovernanceConnectorConfigPropertyInterface =
            accountDisableConnectorData?.properties?.find((property: ConnectorPropertyInterface) =>
                property.name === ServerConfigurationsConstants.ACCOUNT_DISABLING_ENABLE
            );

        if (!accountDisableProperty) {
            return;
        }

        setIsAccountDisableEnabled(accountDisableProperty?.value === "true");
    }, [ accountDisableConnectorData ]);

    useEffect(() => {
        if (accountDisableFetchRequestError) {
            dispatch(
                addAlert({
                    description: t(
                        "governanceConnectors:notifications." +
                        "getConnector.error.description",
                        { description: accountDisableFetchRequestError }
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "governanceConnectors:notifications." +
                        "getConnector.error.message"
                    )
                })
            );
        }
    }, [ accountDisableFetchRequestError ]);

    const onConfigRevert = (): void => {
        const revertData: RevertGovernanceConnectorConfigInterface = {
            properties: [
                ServerConfigurationsConstants.ACCOUNT_DISABLING_ENABLE
            ]
        };

        revertGovernanceConnectorProperties(
            ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CATEGORY_ID,
            ServerConfigurationsConstants.ACCOUNT_DISABLE_CONNECTOR_ID,
            revertData
        )
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "governanceConnectors:connectorCategories.accountManagement.connectors" +
                            ".accountDisableHandler.notifications.revertConfiguration.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "governanceConnectors:connectorCategories.accountManagement.connectors" +
                            ".accountDisableHandler.notifications.revertConfiguration.success.message"
                        )
                    })
                );
                setIsAccountDisableEnabled(false);
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "governanceConnectors:connectorCategories.accountManagement.connectors" +
                                ".accountDisableHandler.notifications.revertConfiguration.error.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "governanceConnectors:connectorCategories.accountManagement.connectors" +
                                ".accountDisableHandler.notifications.revertConfiguration.error.message"
                        )
                    })
                );
            })
            .finally(() => {
                mutateAccountDisableFetchRequest();
            }
            );
    };

    /**
     * Update Account Disable Config Value
     */
    const updateAccountDisableConnector = (value: boolean): void => {
        const data: UpdateGovernanceConnectorConfigInterface = {
            operation: "UPDATE",
            properties: [
                {
                    "name": ServerConfigurationsConstants.ACCOUNT_DISABLING_ENABLE,
                    "value": value
                }
            ]
        };

        updateGovernanceConnector(
            data,
            ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CATEGORY_ID,
            ServerConfigurationsConstants.ACCOUNT_DISABLE_CONNECTOR_ID
        )
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "governanceConnectors:connectorCategories.accountManagement.connectors" +
                            ".accountDisableHandler.notifications.configurationUpdate.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "governanceConnectors:connectorCategories.accountManagement.connectors" +
                            ".accountDisableHandler.notifications.configurationUpdate.success.message"
                        )
                    })
                );
                setIsAccountDisableEnabled(value);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    dispatch(
                        addAlert({
                            description: t(
                                "governanceConnectors:connectorCategories.accountManagement.connectors" +
                                ".accountDisableHandler.notifications.configurationUpdate.error.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:connectorCategories.accountManagement.connectors" +
                                ".accountDisableHandler.notifications.configurationUpdate.error.message"
                            )
                        })
                    );
                } else {
                    // Generic error message
                    dispatch(
                        addAlert({
                            description: t(
                                "governanceConnectors:notifications." +
                                "updateConnector.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "updateConnector.genericError.message"
                            )
                        })
                    );
                }
            }).finally(() => {
                mutateAccountDisableFetchRequest();
            });
    };

    /**
     * Handles the back button click event.
     */
    const handleBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
    };

    /**
     * Handles the checkbox toggle action.
     *
     * @param value - Checkbox values.
     */
    const handleCheckboxToggle = (value: CheckboxProps): void => {
        updateAccountDisableConnector(value?.checked);
    };

    return (
        <PageLayout
            title={ t("governanceConnectors:connectorCategories.accountManagement.connectors." +
                "accountDisableHandler.friendlyName") }
            pageTitle={ t("governanceConnectors:connectorCategories.accountManagement.connectors." +
                "accountDisableHandler.friendlyName") }
            description={
                (<>
                    { t("governanceConnectors:connectorCategories.accountManagement.connectors." +
                        "accountDisableHandler.description") }
                    <DocumentationLink
                        link={ getLink("manage.accountDisable.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>)
            }
            data-componentid={ `${ componentId }-page-layout` }
            backButton={ {
                "data-testid": `${ componentId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("governanceConnectors:goBackLoginAndRegistration")
            } }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ true }
            isLoading={ accountDisableFetchRequestLoading }
        >
            <Grid container spacing={ 2 } direction="column">
                <Grid xs = { 12 }>
                    <EmphasizedSegment className="form-wrapper" padded={ "very" }>
                        {
                            accountDisableFetchRequestLoading
                                ? <ContentLoader />
                                : (
                                    <>
                                        <Checkbox
                                            ariaLabel={ t("governanceConnectors:connectorCategories." +
                                            "accountManagement.connectors.accountDisableHandler.properties." +
                                            "accountDisableHandlerEnable.label") }
                                            name="accountDisable"
                                            label={ t("governanceConnectors:connectorCategories." +
                                            "accountManagement.connectors.accountDisableHandler.properties." +
                                            "accountDisableHandlerEnable.label") }
                                            width={ 16 }
                                            data-componentid={
                                                `${componentId}-toggle` }
                                            toggle
                                            onChange={ (event: FormEvent<HTMLInputElement>, data: CheckboxProps) => {
                                                handleCheckboxToggle(data);
                                            } }
                                            checked={ isAccountDisableEnabled }
                                        />
                                        <Hint>
                                            { t("governanceConnectors:connectorCategories." +
                                            "accountManagement.connectors.accountDisableHandler.properties." +
                                            "accountDisableHandlerEnable.hint") }
                                        </Hint>
                                    </>
                                )
                        }
                    </EmphasizedSegment>
                </Grid>
                <Grid xs={ 12 }>
                    <DangerZoneGroup sectionHeader={ t("common:dangerZone") }>
                        <DangerZone
                            actionTitle= { t("governanceConnectors:dangerZone.actionTitle") }
                            header= { t("governanceConnectors:dangerZone.heading") }
                            subheader= { t("governanceConnectors:dangerZone.subHeading") }
                            onActionClick={ () => onConfigRevert() }
                            data-testid={ `${ componentId }-danger-zone` }
                        />
                    </DangerZoneGroup>
                </Grid>
            </Grid>
        </PageLayout>
    );
};

export default AccountDisablePage;
