/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels, CRUDPermissionsInterface } from "@wso2is/core/models";
import {
    ApplicationInterface,
    ApplicationEditFeaturesConfigInterface,
    AuthProtocolMetaListItemInterface,
    SupportedAuthProtocolTypes
} from "../../models";
import { AdvanceSettings } from "./advance-application";
import { GeneralApplicationSettings } from "./general-application-settings";
import { ApplicationSettings } from "./settings-application";
import { SignOnMethods } from "./sign-on-methods";
import { AttributeSettings } from "./attribute-management";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../store";
import { getInboundProtocolConfig } from "../../api";
import { ApplicationManagementUtils } from "../../utils";
import { InboundProtocolsMeta } from "./meta";
import _ from "lodash";

/**
 * Proptypes for the applications edit component.
 */
interface EditApplicationPropsInterface {
    /**
     * Editing application.
     */
    application: ApplicationInterface;
    /**
     * Set of edit features.
     */
    features?: ApplicationEditFeaturesConfigInterface;
    /**
     * Is the data still loading.
     */
    isLoading?: boolean;
    /**
     * Callback to be triggered after deleting the application.
     */
    onDelete: () => void;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * CRUD permissions,
     */
    permissions?: CRUDPermissionsInterface;
}

/**
 * Application edit component.
 *
 * @param {EditApplicationPropsInterface} props - Props injected to the component.
 * @return {ReactElement}
 */
export const EditApplication: FunctionComponent<EditApplicationPropsInterface> = (
    props: EditApplicationPropsInterface
): ReactElement => {

    const {
        application,
        features,
        isLoading,
        onDelete,
        onUpdate,
        permissions
    } = props;

    const dispatch = useDispatch();

    const availableInboundProtocols = useSelector((state: AppState) => state.application.meta.inboundProtocols);

    const [ isInboundProtocolConfigRequestLoading, setIsInboundProtocolConfigRequestLoading ] = useState<boolean>(true);
    const [ selectedInboundProtocol, setSelectedInboundProtocol ] = useState<AuthProtocolMetaListItemInterface>(null);
    const [ selectedInboundProtocolConfig, setSelectedInboundProtocolConfig ] = useState<any>(undefined);
    const [ showProtocolSelection, setShowProtocolSelection ] = useState<boolean>(true);
    const [ isInboundProtocolsRequestLoading, setInboundProtocolsRequestLoading ] = useState<boolean>(false);

    /**
     * Called on `availableInboundProtocols` prop update.
     */
    useEffect(() => {
        if (!_.isEmpty(availableInboundProtocols) && application?.id) {
            findConfiguredInboundProtocol(application.id);
            return;
        }

        setInboundProtocolsRequestLoading(true);

        ApplicationManagementUtils.getInboundProtocols(InboundProtocolsMeta, false)
            .finally(() => {
                setInboundProtocolsRequestLoading(false);
            });
    }, [ availableInboundProtocols ]);

    /**
     * Finds the configured inbound protocol.
     */
    const findConfiguredInboundProtocol = (appId): void => {

        let found = false;

        for (const protocol of availableInboundProtocols) {
            if (Object.values(SupportedAuthProtocolTypes).includes(protocol.id as SupportedAuthProtocolTypes)) {

                setIsInboundProtocolConfigRequestLoading(true);

                getInboundProtocolConfig(appId, protocol.id)
                    .then((response) => {
                        found = true;

                        setSelectedInboundProtocol(protocol);
                        setSelectedInboundProtocolConfig({
                            ...selectedInboundProtocolConfig,
                            [ protocol.id ]: response
                        });
                        setShowProtocolSelection(false);
                    })
                    .catch((error) => {
                        if (error.response.status === 404) {
                            return;
                        }

                        if (error.response && error.response.data && error.response.data.description) {
                            dispatch(addAlert({
                                description: error.response.data.description,
                                level: AlertLevels.ERROR,
                                message: "Retrieval error"
                            }));

                            return;
                        }

                        dispatch(addAlert({
                            description: "An error occurred retrieving the protocol configurations.",
                            level: AlertLevels.ERROR,
                            message: "Retrieval error"
                        }));
                    })
                    .finally(() => {
                        setIsInboundProtocolConfigRequestLoading(false);
                    });
            }

            if (found) {
                break;
            }
        }
    };

    const GeneralApplicationSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <GeneralApplicationSettings
                accessUrl={ application.accessUrl }
                appId={ application.id }
                description={ application.description }
                discoverability={ application.advancedConfigurations?.discoverableByEndUsers }
                imageUrl={ application.imageUrl }
                name={ application.name }
                isLoading={ isLoading }
                onDelete={ onDelete }
                onUpdate={ onUpdate }
                permissions={ permissions }
                showRegenerate={ selectedInboundProtocol?.id === SupportedAuthProtocolTypes.OIDC }
                // TODO we need check whether application is active or not as well.
                showRevoke={ selectedInboundProtocol?.id === SupportedAuthProtocolTypes.OIDC }
            />
        </ResourceTab.Pane>
    );

    const ApplicationSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <ApplicationSettings
                appId={ application.id }
                inboundProtocols={ application.inboundProtocols }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
                isInboundProtocolConfigRequestLoading={ isInboundProtocolConfigRequestLoading }
                selectedInboundProtocol={ selectedInboundProtocol }
                selectedInboundProtocolConfig={ selectedInboundProtocolConfig }
                setSelectedInboundProtocol={ setSelectedInboundProtocol }
                showProtocolSelection={ showProtocolSelection }
                permissions={ permissions }
            />
        </ResourceTab.Pane>
    );

    const AttributeSettingTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <AttributeSettings
                appId={ application.id }
                claimConfigurations={ application.claimConfiguration }
                selectedInboundProtocol={ selectedInboundProtocol }
                permissions={ permissions }
            />
        </ResourceTab.Pane>
    );


    const SignOnMethodsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <SignOnMethods
                appId={ application.id }
                authenticationSequence={ application.authenticationSequence }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
                permissions={ permissions }
            />
        </ResourceTab.Pane>
    );

    const AdvancedSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane attached={ false }>
            <AdvanceSettings
                appId={ application.id }
                advancedConfigurations={ application.advancedConfigurations }
                onUpdate={ onUpdate }
                permissions={ permissions }
            />
        </ResourceTab.Pane>
    );

    /**
     * Resolves the tab panes based on the application config.
     *
     * @return {any[]} Resolved tab panes.
     */
    const resolveTabPanes = (): any[] => {
        const panes: any[] = [];

        if (features) {
            if (features.generalSettings === undefined || features.generalSettings.enabled !== false) {

                panes.push({
                    menuItem: "General",
                    render: GeneralApplicationSettingsTabPane
                });
            }
            if (features.accessConfiguration === undefined || features.accessConfiguration.enabled !== false) {

                panes.push({
                    menuItem: "Access",
                    render: ApplicationSettingsTabPane
                });
            }
            if (features.attributeMapping === undefined || features.attributeMapping.enabled !== false) {

                panes.push({
                    menuItem: "Attributes",
                    render: AttributeSettingTabPane
                });
            }
            if (features.signOnMethodConfiguration === undefined
                || features.signOnMethodConfiguration.enabled !== false) {

                panes.push({
                    menuItem: "Sign-on Method",
                    render: SignOnMethodsTabPane,
                });
            }
            if (features.advanceSettings === undefined || features.advanceSettings.enabled !== false) {

                panes.push({
                    menuItem: "Advanced",
                    render: AdvancedSettingsTabPane,
                });
            }

            return panes;
        }

        return [
            {
                menuItem: "General",
                render: GeneralApplicationSettingsTabPane
            },
            {
                menuItem: "Access",
                render: ApplicationSettingsTabPane
            }, {
                menuItem: "Attribute",
                render: AttributeSettingTabPane
            },
            {
                menuItem: "Sign-on Method",
                render: SignOnMethodsTabPane,
            },
            {
                menuItem: "Advance",
                render: AdvancedSettingsTabPane,
            },
        ];
    };

    return (
        application && <ResourceTab panes={ resolveTabPanes() } />
    );
};
