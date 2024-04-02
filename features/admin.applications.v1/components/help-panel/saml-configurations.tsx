/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import { ArrowRightToBracketIcon, CirclesOverlapIcon, DocumentIcon } from "@oxygen-ui/react-icons";
import { TestableComponentInterface } from "@wso2is/core/models";
import { CertificateManagementUtils } from "@wso2is/core/utils";
import { CopyInputField, GenericIcon } from "@wso2is/react-components";
import { saveAs } from "file-saver";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Form, Grid, Icon } from "semantic-ui-react";
import { AppState, FeatureConfigInterface, store } from "../../../admin.core.v1";
import { getHelpPanelIcons } from "../../configs/ui";
import { SAMLApplicationConfigurationInterface } from "../../models";

/**
 * Proptypes for the OIDC application configurations component.
 */
interface SAMLConfigurationsPropsInterface extends TestableComponentInterface {
    samlConfigurations: SAMLApplicationConfigurationInterface;
}

/**
 * OIDC application configurations Component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Help panel OIDC application configurations component.
 */
export const SAMLConfigurations: FunctionComponent<SAMLConfigurationsPropsInterface> = (
    props: SAMLConfigurationsPropsInterface
): ReactElement => {

    const {
        samlConfigurations,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const tenantName: string = store.getState().config.deployment.tenant;
    const featureConfig: FeatureConfigInterface = useSelector(
        (state: AppState) => state.config.ui.features);

    const exportMetadataFile = () => {
        const blob: Blob = new Blob([ samlConfigurations?.metadata ], {
            type: "text/xml"
        });

        saveAs(blob, "SAML-Metadata" + ".xml");
    };

    return (
        <Form>
            <Grid verticalAlign="middle">
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
                        <GenericIcon
                            icon={ getHelpPanelIcons().endpoints.issuer }
                            size="micro"
                            square
                            transparent
                            inline
                            className="left-icon"
                            verticalAlign="middle"
                            spaced="right"
                        />
                        <label data-testid={ `${ testId }-issuer-label` }>
                            { t("applications:helpPanel.tabs.start.content." +
                                "samlConfigurations.labels.issuer") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <CopyInputField
                            value={ samlConfigurations?.issuer }
                            data-testid={ `${ testId }-issuer-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
                        <GenericIcon
                            icon={ <ArrowRightToBracketIcon className="icon" /> }
                            size="micro"
                            square
                            transparent
                            inline
                            className="left-icon"
                            verticalAlign="middle"
                            spaced="right"
                        />
                        <label data-testid={ `${ testId }-sso-label` }>
                            { t("applications:helpPanel.tabs.start.content." +
                                "samlConfigurations.labels.sso") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <CopyInputField
                            value={ samlConfigurations?.ssoUrl }
                            data-testid={ `${ testId }-sso-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
                        <GenericIcon
                            icon={ getHelpPanelIcons().endpoints.logout }
                            size="micro"
                            square
                            transparent
                            inline
                            className="left-icon"
                            verticalAlign="middle"
                            spaced="right"
                        />
                        <label data-testid={ `${ testId }-slo-label` }>
                            { t("applications:helpPanel.tabs.start.content." +
                                "samlConfigurations.labels.slo") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <CopyInputField
                            value={ samlConfigurations?.sloUrl }
                            data-testid={ `${ testId }-slo-readonly-input` }
                        />
                    </Grid.Column>
                </Grid.Row>
                {
                    featureConfig?.server?.enabled && (
                        <>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
                                    <GenericIcon
                                        icon={ getHelpPanelIcons().endpoints.destination }
                                        size="micro"
                                        square
                                        transparent
                                        inline
                                        className="left-icon"
                                        verticalAlign="middle"
                                        spaced="right"
                                    />
                                    <label data-testid={ `${ testId }-destination-url-label` }>
                                        { t("applications:helpPanel.tabs.start.content." +
                                            "samlConfigurations.labels.destinationURL") }
                                    </label>
                                </Grid.Column>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                                    <CopyInputField
                                        value={ samlConfigurations?.destinationURLs?.toString()?.replace(/,/g, ", ") }
                                        data-testid={ `${ testId }-destination-url-readonly-input` }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={ 2 }>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
                                    <GenericIcon
                                        icon={ <CirclesOverlapIcon className="icon" /> }
                                        size="micro"
                                        square
                                        transparent
                                        inline
                                        className="left-icon"
                                        verticalAlign="middle"
                                        spaced="right"
                                    />
                                    <label data-testid={ `${ testId }-artifact-resolution-url-label` }>
                                        { t("applications:helpPanel.tabs.start.content." +
                                            "samlConfigurations.labels.artifactResolutionUrl") }
                                    </label>
                                </Grid.Column>
                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                                    <CopyInputField
                                        value={ samlConfigurations?.artifactResolutionUrl }
                                        data-testid={ `${ testId }-artifact-resolution-url-readonly-input` }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </>
                    )
                }
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
                        <GenericIcon
                            icon={ getHelpPanelIcons().endpoints.certificate }
                            size="micro"
                            square
                            transparent
                            inline
                            className="left-icon"
                            verticalAlign="middle"
                            spaced="right"
                        />
                        <label data-testid={ `${ testId }-certificate-label` }>
                            { t("applications:helpPanel.tabs.start.content." +
                                "samlConfigurations.labels.certificate") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <Button
                            data-testid={ `${ testId }-certificate-button` }
                            className="idp-certificate-download-button"
                            basic
                            size="tiny"
                            color="orange"
                            onClick={ () => CertificateManagementUtils.exportCertificate(
                                tenantName, samlConfigurations?.certificate) }
                        >
                            <Icon name="download" />
                            { t("applications:helpPanel.tabs.start.content." +
                                "samlConfigurations.buttons.certificate") }
                        </Button>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 2 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 5 }>
                        <GenericIcon
                            icon={ <DocumentIcon className="icon" /> }
                            size="micro"
                            square
                            transparent
                            inline
                            className="left-icon"
                            verticalAlign="middle"
                            spaced="right"
                        />
                        <label data-testid={ `${ testId }-metadata-label` }>
                            { t("applications:helpPanel.tabs.start.content." +
                                "samlConfigurations.labels.metadata") }
                        </label>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 11 }>
                        <Button
                            data-testid={ `${ testId }-metadata-button` }
                            basic
                            size="tiny"
                            color="orange"
                            onClick={ exportMetadataFile }
                        >
                            <Icon name="download" />
                            { t("applications:helpPanel.tabs.start.content." +
                                "samlConfigurations.buttons.metadata") }
                        </Button>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Form>
    );
};

/**
 * Default props for the SAML application Configurations component.
 */
SAMLConfigurations.defaultProps = {
    "data-testid": "applications-help-panel-saml-configs"
};
