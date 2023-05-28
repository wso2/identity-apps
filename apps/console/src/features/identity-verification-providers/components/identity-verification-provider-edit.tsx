/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { TabProps } from "semantic-ui-react";
import { AttributeSettings, GeneralSettings } from "./settings";
import { ConfigurationSettings } from "./settings/configuration-settings";
import { IdentityVerificationProviderConstants } from "../constants";
import {
    IDVPClaimMappingInterface,
    IDVPClaimsInterface,
    IdentityVerificationProviderInterface,
    UIMetaDataForIDVP
} from "../models";
import { getContentLoader } from "../utils";

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
    onDelete: () => void;
    /**
     * Callback to be triggered on updating the identity verification provider details.
     */
    onUpdate: () => void;
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
    uiMetaData: UIMetaDataForIDVP;
    /**
     * Specifies if it is needed to redirect to a specific tabindex
     */
    isAutomaticTabRedirectionEnabled?: boolean;
    /**
     * Specifies, to which tab(tab id) it need to redirect.
     */
    tabIdentifier?: string;
}

/**
 * Identity Verification Provider edit component.
 *
 * @param props - Props injected to the component.
 * @returns React Element
 */
export const EditIdentityVerificationProvider: FunctionComponent<EditIdentityVerificationProviderPropsInterface> = (
    props: EditIdentityVerificationProviderPropsInterface
): ReactElement => {

    const {
        identityVerificationProvider,
        isLoading,
        onDelete,
        onUpdate,
        isReadOnly,
        isDeletePermitted,
        isAutomaticTabRedirectionEnabled,
        tabIdentifier,
        uiMetaData,
        ["data-componentid"]: componentId
    } = props;

    const [ defaultActiveIndex, setDefaultActiveIndex ] = useState<number | string>(0);
    const [ initialClaims, setInitialClaims ] = useState<IDVPClaimMappingInterface[]>();

    /**
     * Sets the initial claims (attributes).
     */
    useEffect(() => {
        const temp: IDVPClaimMappingInterface[] = identityVerificationProvider.claims.map(
            (claim: IDVPClaimsInterface) => {
                return {
                    idvpClaim: claim.idvpClaim,
                    localClaim: { uri: claim.localClaim }
                };
            }
        );

        setInitialClaims(temp);
    }, [ identityVerificationProvider ]);

    /**
     * Renders the general IDVP settings tab pane.
     *
     * @returns General settings tab pane for IDVP
     */
    const GeneralIDVPSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <GeneralSettings
                idvp={ identityVerificationProvider }
                isLoading={ isLoading }
                onDelete={ onDelete }
                onUpdate={ onUpdate }
                data-componentid={ `${ componentId }-general-settings` }
                isReadOnly={ isReadOnly }
                isDeletePermitted={ isDeletePermitted }
                loader={ getContentLoader }
            />
        </ResourceTab.Pane>
    );

    /**
     * Renders the configuration settings tab pane.
     *
     * @returns Configuration settings tab pane
     */
    const IDVPConfigurationSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <ConfigurationSettings
                idvp={ identityVerificationProvider }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
                data-componentid={ `${ componentId }-configuration-settings` }
                uiMetaData={ uiMetaData.pages.edit.settings }
                isReadOnly={ isReadOnly }
                loader={ getContentLoader }
            />
        </ResourceTab.Pane>
    );

    /**
     * Renders attribute settings tab pane.
     *
     * @returns Attribute settings tab pane
     */
    const AttributeSettingsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <AttributeSettings
                idvp={ identityVerificationProvider }
                initialClaims={ initialClaims }
                isLoading={ isLoading }
                onUpdate={ onUpdate }
                hideIdentityClaimAttributes={ true }
                data-componentid={ `${ componentId }-attribute-settings` }
                isReadOnly={ isReadOnly }
                loader={ getContentLoader }
            />
        </ResourceTab.Pane>
    );

    /**
     * Method for getting a collection of tab panes.
     *
     * @returns An array of tab panes.
     */
    const getPanes = () => {
        const panes: ResourceTabPaneInterface[] = [];

        panes.push({
            "data-tabid": IdentityVerificationProviderConstants.GENERAL_TAB_ID,
            menuItem: "General",
            render: GeneralIDVPSettingsTabPane
        });

        panes.push({
            "data-tabid": IdentityVerificationProviderConstants.SETTINGS_TAB_ID,
            menuItem: "Settings",
            render: IDVPConfigurationSettingsTabPane
        });

        panes.push({
            "data-tabid": IdentityVerificationProviderConstants.ATTRIBUTES_TAB_ID,
            menuItem: "Attributes",
            render: AttributeSettingsTabPane
        });

        return panes;
    };

    if (!identityVerificationProvider || isLoading) {
        return getContentLoader();
    }

    return (
        <ResourceTab
            isLoading={ isLoading }
            data-testid={ `${ componentId }-resource-tabs` }
            panes={ getPanes() }
            defaultActiveIndex={ defaultActiveIndex }
            onTabChange={ (e: React.MouseEvent<HTMLDivElement, MouseEvent>, data: TabProps) => {
                setDefaultActiveIndex(data.activeIndex);
            } }
            isAutomaticTabRedirectionEnabled={ isAutomaticTabRedirectionEnabled }
            tabIdentifier={ tabIdentifier }
        />
    );
};

/**
 * Default prop types for the identity verification provider edit component.
 */
EditIdentityVerificationProvider.defaultProps = {
    "data-componentid": "idvp-edit"
};
