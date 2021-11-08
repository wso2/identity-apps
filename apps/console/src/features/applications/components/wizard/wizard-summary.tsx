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

import { TestableComponentInterface } from "@wso2is/core/models";
import { EncodeDecodeUtils } from "@wso2is/core/utils";
import { AppAvatar, Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Label } from "semantic-ui-react";
import { MainApplicationInterface } from "../../models";

/**
 * Proptypes for the wizard summary component.
 */
interface WizardSummaryProps extends TestableComponentInterface {
    summary: MainApplicationInterface;
    triggerSubmit: boolean;
    onSubmit: (application: MainApplicationInterface) => void;
}

/**
 * Wizard summary form component.
 *
 * @param {WizardSummaryProps} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const WizardSummary: FunctionComponent<WizardSummaryProps> = (
    props: WizardSummaryProps
): ReactElement => {

    const {
        summary,
        triggerSubmit,
        onSubmit,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

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
        <Grid className="wizard-summary" data-testid={ testId }>
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
                            <Label className="info-label">
                                { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                    ".discoverable.heading") }
                            </Label>
                        ) }
                        { summary?.inboundProtocolConfiguration?.oidc?.publicClient && (
                            <Label className="info-label">
                                { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                    ".public.heading") }
                            </Label>
                        ) }
                        { summary?.inboundProtocolConfiguration?.oidc?.refreshToken?.renewRefreshToken && (
                            <Label className="info-label">
                                { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                    ".renewRefreshToken.heading") }
                            </Label>
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
                        <div className="label">
                            { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                ".accessURL.heading") }
                        </div>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                        <div className="value url">{ summary.accessUrl }</div>
                    </Grid.Column>
                </Grid.Row>
            ) }
            { summary?.inboundProtocolConfiguration?.saml?.manualConfiguration?.issuer && (
                <Grid.Row className="summary-field" columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                        <div className="label">
                            { t("console:develop.features.applications.addWizard.steps.summary.sections.issuer" +
                                ".heading") }
                        </div>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                        <div className="value">
                            { summary.inboundProtocolConfiguration.saml.manualConfiguration.issuer }
                        </div>
                    </Grid.Column>
                </Grid.Row>
            ) }
            { summary?.inboundProtocolConfiguration?.saml?.manualConfiguration?.serviceProviderQualifier && (
                <Grid.Row className="summary-field" columns={ 2 }>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                        <div className="label">
                            { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                ".applicationQualifier.heading") }
                        </div>
                    </Grid.Column>
                    <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                        <div className="value">
                            { summary.inboundProtocolConfiguration.saml.manualConfiguration.serviceProviderQualifier }
                        </div>
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
                                <div className="label">
                                    { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                        ".grantType.heading") }
                                </div>
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
                summary?.inboundProtocolConfiguration?.saml?.manualConfiguration?.assertionConsumerUrls && (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">
                                { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                    ".assertionURLs.heading") }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            {
                                summary.inboundProtocolConfiguration.saml.manualConfiguration.assertionConsumerUrls
                                    .map((url, index) => (
                                        <div className="value url" key={ index }>{ url }</div>
                                    ))
                            }
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                summary?.inboundProtocolConfiguration?.oidc?.callbackURLs && (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">
                                { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                    ".callbackURLs.heading") }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            {
                                // Multiple callback URLs are supported through regexp only.
                                // Hence the retrieval of 0th index.
                                // TODO: Revert this once the API supports callback URLs as string arrays.
                                EncodeDecodeUtils.decodeURLRegex(
                                    summary.inboundProtocolConfiguration.oidc.callbackURLs[0])
                                    .map((url, index) => (
                                        <div className="value url" key={ index }>{ url }</div>
                                    ))
                            }
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                summary?.inboundProtocolConfiguration?.wsTrust?.audience && (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">
                                { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                    ".audience.heading") }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div
                                className="value url">{ summary?.inboundProtocolConfiguration?.wsTrust?.audience }</div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                summary?.inboundProtocolConfiguration?.wsTrust?.certificateAlias && (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">
                                { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                    ".certificateAlias.heading") }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value">{ summary?.inboundProtocolConfiguration?.wsTrust
                                .certificateAlias }</div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                summary?.inboundProtocolConfiguration?.passiveSts?.realm && (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">
                                { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                    ".realm.heading") }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value">{ summary?.inboundProtocolConfiguration?.passiveSts.realm }</div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                summary?.inboundProtocolConfiguration?.passiveSts?.replyTo && (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">
                                { t("console:develop.features.applications.addWizard.steps.summary.sections.audience" +
                                    ".heading") }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value url">{ summary?.inboundProtocolConfiguration?.passiveSts
                                .replyTo }</div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
        </Grid>
    );
};

/**
 * Default props for the application wizard summary component.
 */
WizardSummary.defaultProps = {
    "data-testid": "application-wizard-summary"
};
