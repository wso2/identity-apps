/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { EncodeDecodeUtils } from "@wso2is/core/utils";
import { AppAvatar, UserAvatar } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Label } from "semantic-ui-react";
import { getInboundProtocolLogos } from "../../configs";
import { SubmitFormCustomPropertiesInterface, SupportedAuthProtocolTypes } from "../../models";
import { ApplicationManagementUtils } from "../../utils";

/**
 * Prop-types for the wizard summary component.
 */
interface ProtocolWizardSummaryPropsInterface extends TestableComponentInterface {
    summary: any;
    triggerSubmit: boolean;
    onSubmit: (values: any) => void;
    customProtocol: boolean;
    image: string;
    samlMetaFileSelected: boolean;
}

/**
 * Wizard summary form component.
 *
 * @param props - Props injected to the component.
 * @returns Protocol wizard summary component.
 */
export const ProtocolWizardSummary: FunctionComponent<ProtocolWizardSummaryPropsInterface> = (
    props: ProtocolWizardSummaryPropsInterface
): ReactElement => {

    const {
        summary,
        triggerSubmit,
        onSubmit,
        image,
        customProtocol,
        samlMetaFileSelected,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ protocolImage, setProtocolImage ] = useState<string>("");

    /**
     * Submits the form programmatically if triggered from outside.
     */
    useEffect(() => {
        if (!triggerSubmit) {
            return;
        }

        if (samlMetaFileSelected) {
            const newSummary = {
                metadataFile: summary?.metadataFile
            };

            onSubmit(newSummary);

            return;
        }

        onSubmit(summary);
    }, [ triggerSubmit ]);

    /**
     *  Set protocol image.
     */
    useEffect(() => {
        if (image === SupportedAuthProtocolTypes.WS_FEDERATION) {
            setProtocolImage("wsFed");
        } else if (image === SupportedAuthProtocolTypes.WS_TRUST) {
            setProtocolImage("wsTrust");
        } else {
            setProtocolImage(image);
        }
    }, [ image ]);

    return (
        <Grid className="wizard-summary" data-testid={ testId }>
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } textAlign="center">
                    <div className="general-details">
                        {
                            customProtocol
                                ? <UserAvatar name={ summary?.name } size="tiny"/>
                                : (
                                    <AppAvatar
                                        image={
                                            ApplicationManagementUtils.findIcon(
                                                protocolImage,
                                                getInboundProtocolLogos()
                                            ) as ReactNode
                                        }
                                        size="tiny"
                                    />
                                )
                        }
                    </div>
                </Grid.Column>
            </Grid.Row>
            {
                summary?.manualConfiguration?.issuer &&
                (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">
                                { t("console:develop.features.applications.addWizard.steps.summary.sections.issuer" +
                                    ".heading") }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value">
                                { summary.manualConfiguration?.issuer }
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                summary?.manualConfiguration?.serviceProviderQualifier &&
                (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">
                                { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                    ".applicationQualifier.heading") }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value">
                                { summary.manualConfiguration.serviceProviderQualifier }
                            </div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                summary?.grantTypes
                && summary.grantTypes instanceof Array
                && summary.grantTypes.length > 0
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
                summary?.manualConfiguration?.assertionConsumerUrls &&
                (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">
                                { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                    ".assertionURLs.heading") }
                            </div>
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
                summary?.metadataURL &&
                (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">
                                { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                    ".metadataURL.heading") }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value url">{ summary?.metadataURL }</div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                summary?.metadataFile &&
                (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">
                                { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                    ".metaFile.heading") }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value constrain">{ summary?.metadataFile }</div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                summary?.callbackURLs &&
                (
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
                summary?.audience &&
                (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">
                                { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                    ".audience.heading") }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div
                                className="value url">{ summary?.audience }</div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                summary?.certificateAlias &&
                (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">
                                { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                    ".certificateAlias.heading") }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value">{ summary?.certificateAlias }</div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                summary?.realm &&
                (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">
                                { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                    ".realm.heading") }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value">{ summary?.realm }</div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                summary?.replyTo &&
                (
                    <Grid.Row className="summary-field" columns={ 2 }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">
                                { t("console:develop.features.applications.addWizard.steps.summary.sections" +
                                    ".audience.heading") }
                            </div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value url">{ summary?.replyTo }</div>
                        </Grid.Column>
                    </Grid.Row>
                )
            }
            {
                customProtocol && summary?.properties.map((prop: SubmitFormCustomPropertiesInterface) => (
                    <Grid.Row className="summary-field" columns={ 2 } key={ prop.key }>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 7 } textAlign="right">
                            <div className="label">{ prop.key }</div>
                        </Grid.Column>
                        <Grid.Column mobile={ 16 } tablet={ 8 } computer={ 8 } textAlign="left">
                            <div className="value url">{ prop.value }</div>
                        </Grid.Column>
                    </Grid.Row>
                )
                )
            }
        </Grid>
    );
};

/**
 * Default props for the protocol wizard summary component.
 */
ProtocolWizardSummary.defaultProps = {
    "data-testid": "protocol-wizard-summary",
    samlMetaFileSelected: false
};
