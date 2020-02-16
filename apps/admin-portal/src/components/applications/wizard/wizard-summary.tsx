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

import { EncodeDecodeUtils } from "@wso2is/core/utils";
import { AppAvatar, Heading } from "@wso2is/react-components";
import React, { FunctionComponent, useEffect } from "react";
import { Grid, Label } from "semantic-ui-react";

/**
 * Proptypes for the wizard summary component.
 */
interface WizardSummaryProps {
    summary: any;
    triggerSubmit: boolean;
    onSubmit: (application: any) => void;
}

/**
 * Wizard summary form component.
 *
 * @param {WizardSummaryProps} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const WizardSummary: FunctionComponent<WizardSummaryProps> = (
    props: WizardSummaryProps
): JSX.Element => {

    const {
        summary,
        triggerSubmit,
        onSubmit
    } = props;

    /**
     * Submits the form programmatically if triggered from outside.
     */
    useEffect(() => {
        if (!triggerSubmit) {
            return;
        }

        onSubmit(summary);
    }, [ triggerSubmit ]);

    return (
        <Grid className="wizard-summary">
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } textAlign="center">
                    <div className="general-details">
                        <AppAvatar
                            name={ summary?.name }
                            image={ summary?.imageUrl }
                            size="tiny"
                        />
                        { summary?.name && (
                            <Heading size="small" className="name">{ summary.name }</Heading>
                        ) }
                        { summary?.advancedConfigurations?.discoverableByEndUsers && (
                            <Label className="info-label">Discoverable</Label>
                        ) }
                        { summary?.inboundProtocolConfiguration?.oidc?.publicClient && (
                            <Label className="info-label">Public</Label>
                        ) }
                        { summary?.description && (
                            <div className="description">{ summary.description }</div>
                        ) }
                    </div>
                </Grid.Column>
            </Grid.Row>
            { summary?.accessUrl && (
                <Grid.Row className="summary-field" columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                        <div className="label">Access URL</div>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                        <div className="value url">{ summary.accessUrl }</div>
                    </Grid.Column>
                </Grid.Row>
            ) }
            {
                summary?.inboundProtocolConfiguration?.oidc?.grantTypes
                && summary.inboundProtocolConfiguration.oidc.grantTypes instanceof Array
                && summary.inboundProtocolConfiguration.oidc.grantTypes.length > 0
                    ? (
                        <Grid.Row className="summary-field" columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                                <div className="label">Grant Type(s)</div>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                                <Label.Group>
                                    {
                                        summary.inboundProtocolConfiguration.oidc.grantTypes
                                            .map((grant, index) => (
                                                <Label key={ index } basic circular>{ grant }</Label>
                                            ))
                                    }
                                </Label.Group>
                            </Grid.Column>
                        </Grid.Row>
                    )
                    : null
            }
            {
                summary?.inboundProtocolConfiguration?.oidc?.callbackURLs && (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">Callback URL(s)</div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            {
                                EncodeDecodeUtils.decodeURLRegex(
                                    summary.inboundProtocolConfiguration.oidc.callbackURLs)
                                    .map((url, index) => (
                                        <div className="value url" key={ index }>{ url }</div>
                                    ))
                            }
                        </Grid.Column>
                    </Grid.Row>
                )
            }
        </Grid>
    );
};
