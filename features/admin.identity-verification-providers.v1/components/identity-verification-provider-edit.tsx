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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { ResourceTab, ResourceTabPaneInterface } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import AttributeMappings from "./edit/attribute-mappings";
import DynamicSettingsForm from "./edit/dynamic-settings-form";
import SetupGuide from "./edit/setup-guide";
import {
    IdVPConfigPropertiesInterface,
    IdVPEditTabContentType,
    IdVPEditTabIDs,
    IdVPEditTabMetadataInterface,
    IdVPTemplateInterface,
    IdVPTemplateMetadataInterface,
    IdentityVerificationProviderInterface
} from "../models/identity-verification-providers";

/**
 * Prop types for the identity verification provider edit component.
 */
interface EditIdentityVerificationProviderPropsInterface extends IdentifiableComponentInterface {
    /**
     * IDVP that is being edited.
     */
    identityVerificationProvider: IdentityVerificationProviderInterface;
    /**
     * Is the data still loading.
     */
    isLoading?: boolean;
    /**
     * Callback to be triggered after deleting the identity verification provider.
     */
    handleDelete: () => void;
    /**
     * Callback to be triggered on updating the identity verification provider details.
     */
    handleUpdate: (data: IdentityVerificationProviderInterface, callback?: () => void) => void;
    /**
     * Specifies if the component should only be read-only.
     */
    isReadOnly: boolean;
    /**
     * Specifies if the IDVP can be deleted.
     */
    isDeletePermitted: boolean;
    /**
     * Specifies the UI metadata for the IDVP.
     */
    uiMetaData: IdVPTemplateMetadataInterface;
    /**
     * Specifies, to which tab(tab id) it need to redirect.
     */
    tabIdentifier?: string;
    /**
     * Template data related to the editing IdVP.
     */
    templateData: IdVPTemplateInterface;
}

/**
 * Identity Verification Provider edit component.
 *
 * @param props - Props injected to the component.
 * @returns React Element
 */
export const EditIdentityVerificationProvider: FunctionComponent<EditIdentityVerificationProviderPropsInterface> = (
    {
        identityVerificationProvider,
        isLoading,
        isReadOnly,
        uiMetaData,
        templateData,
        tabIdentifier,
        handleUpdate,
        handleDelete,
        ["data-componentid"]: componentId = "idvp-edit"
    }: EditIdentityVerificationProviderPropsInterface
): ReactElement => {

    const initialFormValues: Record<string, unknown> = useMemo(() => {
        if (!identityVerificationProvider) {
            return {};
        }

        const configPropertiesInitialValues: Record<string, unknown> = identityVerificationProvider.configProperties
            .reduce((defaultValues: Record<string, unknown>, { key, value }: IdVPConfigPropertiesInterface) => {
                defaultValues[key] = value;

                return defaultValues;
            }, {} as Record<string, unknown>);

        return {
            ...identityVerificationProvider,
            configProperties: configPropertiesInitialValues
        };

    }, [ identityVerificationProvider, identityVerificationProvider?.isEnabled ]);

    const MarkdownGuideTabPane = (guideContent: string): ReactElement => {
        return (
            <ResourceTab.Pane controlledSegmentation>
                <SetupGuide
                    content={ guideContent }
                    identityVerificationProviderId={ identityVerificationProvider?.id }
                    data-componentid={ `${ componentId }-setup-guide` }
                />
            </ResourceTab.Pane>
        );
    };

    /**
     * Renders a dynamic form tab pane. Used for General and Settings tabs.
     *
     * @param tab - The metadata for the tab.
     * @returns The rendered tab pane.
     */
    const DynamicFormTabPane = (tab: IdVPEditTabMetadataInterface): ReactElement => {
        return (
            <ResourceTab.Pane controlledSegmentation>
                <DynamicSettingsForm
                    tabMetadata={ tab }
                    templateData={ templateData }
                    initialValues={ initialFormValues }
                    isReadOnly={ isReadOnly }
                    handleUpdate={ handleUpdate }
                    handleDelete={ handleDelete }
                    isLoading={ isLoading }
                    data-componentid={ `${ componentId }-${ tab.id }-form` }
                />
            </ResourceTab.Pane>
        );
    };

    /**
     * Renders a predefined tab pane. Used for Attributes tab.
     *
     * @param tab - The metadata for the tab.
     * @returns The rendered tab pane.
     */
    const PredefinedTabPane = (tab: IdVPEditTabMetadataInterface): ReactElement => {
        switch (tab.id) {
            case IdVPEditTabIDs.ATTRIBUTES:
                return (
                    <ResourceTab.Pane controlledSegmentation>
                        <AttributeMappings
                            identityVerificationProvider={ identityVerificationProvider }
                            handleUpdate={ handleUpdate }
                            mandatoryClaims={ templateData?.payload?.claims }
                        />
                    </ResourceTab.Pane>
                );

            default:
                break;
        }
    };

    const tabPanes: ResourceTabPaneInterface[] = useMemo(() => {
        if (!uiMetaData) {
            return [];
        }

        const _tabPanes: ResourceTabPaneInterface[] = [];
        const { tabs: editTabsMetadata } = uiMetaData.edit;

        for (const tab of editTabsMetadata) {
            switch (tab.contentType) {
                case IdVPEditTabContentType.GUIDE:
                    if (tab?.guide) {
                        _tabPanes.push({
                            componentId: tab?.id,
                            "data-tabid": tab?.id,
                            menuItem: tab?.displayName,
                            render: () => MarkdownGuideTabPane(tab?.guide)
                        });
                    }

                    break;

                case IdVPEditTabContentType.FORM:
                    _tabPanes.push({
                        componentId: tab?.id,
                        "data-tabid": tab?.id,
                        menuItem: tab?.displayName,
                        render: () => DynamicFormTabPane(tab)
                    });

                    break;

                default:
                    _tabPanes.push({
                        componentId: tab?.id,
                        "data-tabid": tab?.id,
                        menuItem: tab?.displayName,
                        render: () => PredefinedTabPane(tab)
                    });

                    break;
            }
        }

        return _tabPanes;
    }, [ uiMetaData, identityVerificationProvider ]);

    /**
     * Resolve the default tab index based on the metadata.
     */
    const defaultActiveTabIndex: number = useMemo(() => {
        const selectedTabPaneIndex: number = tabPanes
            .findIndex((tabPane: ResourceTabPaneInterface) => tabPane["data-tabid"] === tabIdentifier);

        if (selectedTabPaneIndex > -1) {
            return selectedTabPaneIndex;
        }

        return 0;
    }, [ tabIdentifier ]);

    return (
        <ResourceTab
            isLoading={ isLoading }
            data-testid={ `${ componentId }-resource-tabs` }
            panes={ tabPanes }
            defaultActiveTab={ defaultActiveTabIndex }
            controlTabRedirectionInternally
        />
    );
};
