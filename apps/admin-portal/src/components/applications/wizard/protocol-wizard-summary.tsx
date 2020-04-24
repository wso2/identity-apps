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
import { AppAvatar } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Grid, Label } from "semantic-ui-react";
import { MainApplicationInterface, SupportedAuthProtocolTypes } from "../../../models";
import { ApplicationManagementUtils } from "../../../utils/application-management-utils";
import { InboundProtocolLogos } from "../../../configs/ui";


/**
 * Proptypes for the wizard summary component.
 */
interface ProtocolWizardSummaryPropsInterface {
    summary: any;
    triggerSubmit: boolean;
    onSubmit: (application: MainApplicationInterface) => void;
    image: string;
}

/**
 * Wizard summary form component.
 *
 * @param {ProtocolWizardSummaryPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const ProtocolWizardSummary: FunctionComponent<ProtocolWizardSummaryPropsInterface> = (
    props: ProtocolWizardSummaryPropsInterface
): ReactElement => {

    const {
        summary,
        triggerSubmit,
        onSubmit,
        image
    } = props;

    const [protocolImage, setProtocolImage] = useState<string>("");

    /**
     * Submits the form programmatically if triggered from outside.
     */
    useEffect(() => {
        if (!triggerSubmit) {
            return;
        }

        onSubmit(summary);
    }, [triggerSubmit]);

    /**
     *  Set protocol image.
     */
    useEffect(() => {
        if (image === SupportedAuthProtocolTypes.WS_FEDERATION) {
            setProtocolImage("wsFed")
        } else if (image === SupportedAuthProtocolTypes.WS_TRUST) {
            setProtocolImage("wsTrust")
        } else {
            setProtocolImage(image);
        }
    }, [image]);

    return (
        <Grid className="wizard-summary">
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } textAlign="center">
                    <div className="general-details">
                        <AppAvatar
                            image={ ApplicationManagementUtils.findIcon(protocolImage, InboundProtocolLogos) }
                            size="tiny"
                        />
                    </div>
                </Grid.Column>
            </Grid.Row>
            { summary?.manualConfiguration?.issuer && (
                <Grid.Row className="summary-field" columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                        <div className="label">Issuer</div>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                        <div className="value url">
                            { summary.manualConfiguration?.issuer }
                        </div>
                    </Grid.Column>
                </Grid.Row>
            ) }
            {
                summary?.grantTypes
                && summary.grantTypes instanceof Array
                && summary.grantTypes.length > 0
                    ? (
                        <Grid.Row className="summary-field" columns={ 2 }>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                                <div className="label">Grant Type(s)</div>
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                                <Label.Group>
                                    {
                                        summary.grantTypes
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
                summary?.manualConfiguration?.assertionConsumerUrls && (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">Assertion consumer URL(s)</div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            {
                                summary.manualConfiguration?.assertionConsumerUrls
                                    .map((url, index) => (
                                        <div className="value url" key={ index }>{ url }</div>
                                    ))
                            }
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                summary?.metadataURL && (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">Metadata URL</div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value url">{  summary?.metadataURL }</div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                summary?.callbackURLs && (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">Callback URL(s)</div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            {
                                // Multiple callback URLs are supported through regexp only.
                                // Hence the retrieval of 0th index.
                                // TODO: Revert this once the API supports callback URLs as string arrays.
                                EncodeDecodeUtils.decodeURLRegex(
                                    summary.callbackURLs[0])
                                    .map((url, index) => (
                                        <div className="value url" key={ index }>{ url }</div>
                                    ))
                            }
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                summary?.audience && (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">Audience</div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div
                                className="value url">{ summary?.audience }</div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                summary?.certificateAlias && (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">Certificate alias</div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value">{ summary?.certificateAlias }</div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                summary?.realm && (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">Realm</div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value">{ summary?.realm }</div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                summary?.replyTo && (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">Audience</div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value url">{ summary?.replyTo }</div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
        </Grid>
    );
};
