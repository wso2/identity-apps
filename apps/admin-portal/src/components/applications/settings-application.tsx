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

import React, { FunctionComponent, useState } from "react";
import { Card, Header } from "semantic-ui-react";
import { AdvancedConfigurationsInterface } from "../../models";
import { AdvanceConfigurations } from "./advanced-configurations";
import { OIDCForm } from "./inbound-form-oidc";
import { SettingsSection } from "./settings-section-application-variation";

interface ApplicationSettingsProps {
    appId: string;
    advancedConfigurations: AdvancedConfigurationsInterface;
}

/**
 * Contains the inbound protocols and advance settings of the application.
 *
 * @param props ApplicationSettingsProps.
 */
export const ApplicationSettings: FunctionComponent<ApplicationSettingsProps> = (props): JSX.Element => {
    const {
        appId,
        advancedConfigurations
    } = props;

    // Save the currently selected protocol
    const [enableProtocol, setProtocol] = useState({
        protocols: {
            OIDC: true,
        }
    });

    // To switch between multiple inbound protocols forms
    const toggleHandler = (id) => {
        const oldProtocol = { ...enableProtocol.protocols };
        for (const key in oldProtocol) {
            // tslint:disable-next-line:prefer-conditional-expression
            if (key === id) {
                oldProtocol[key] = true;
            } else {
                oldProtocol[key] = false;
            }
        }
        setProtocol(
            { protocols: oldProtocol }
        );
    };

    const protocolStatus = (id): boolean => {
        const oldProtocol = { ...enableProtocol.protocols };
        return (oldProtocol[id] !== null) ? oldProtocol[id] : false;
    };

    const [editOIDCForm, setEditOIDCForm] = useState({
        OIDCview: false
    });

    const renderODIC = (): void => {
        setEditOIDCForm(
            { OIDCview: true }
        );
    };

    const closeOIDC = () => {
        setEditOIDCForm(
            { OIDCview: false }
        );
    };

    return (
        <div>
            <Card fluid padded="very">
                <Card.Content>
                    <Header as="h3" className={ " " }>Protocol settings</Header>
                </Card.Content>
                <Card.Content>
                    <SettingsSection
                        header="OAuth /OpenId"
                        description="set OIDC settings"
                        primaryAction="update"
                        onPrimaryActionClick={ renderODIC }
                        showActionBar={ !editOIDCForm.OIDCview }
                        onToggle={ () => toggleHandler("OIDC") }
                        toggle={ true }
                        toggleValue={ protocolStatus("OIDC") }
                    >
                        { editOIDCForm.OIDCview && <OIDCForm appId={ appId } cancelView={ closeOIDC }/> }
                    </SettingsSection>
                </Card.Content>
            </Card>
            <AdvanceConfigurations
                appId={ appId }
                certificate={ advancedConfigurations.certificate }
                returnAuthenticatedIdpList={ advancedConfigurations.returnAuthenticatedIdpList }
                discoverableByEndUsers={ advancedConfigurations.discoverableByEndUsers }
                enableAuthorization={ advancedConfigurations.enableAuthorization }
                saas={ advancedConfigurations.saas }
                skipConsent={ advancedConfigurations.skipConsent }
            />
        </div>
    );
};
