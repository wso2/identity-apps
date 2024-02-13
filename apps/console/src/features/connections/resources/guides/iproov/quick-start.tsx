/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { VerticalStepper, VerticalStepperStepInterface} from "@wso2is/common/src";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GenericIcon, Heading, Link, PageHeader, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import BuildLoginFlowIllustration from "./assets/build-login-flow.png";
import CustomizeStepsIllustration from "./assets/customize-steps.png";
import {
    ConnectionInterface,
    ConnectionTemplateInterface
} from "../../../../../features/connections/models/connection";
import ApplicationSelectionModal
from "../../../../../extensions/components/shared/application-selection-modal";

interface IproovAuthenticatorQuickStartPropsInterface extends IdentifiableComponentInterface {
    /**
     * Identity provider object.
     */
    identityProvider: ConnectionInterface;
    /**
     * Identity provider template object.
     */
    template: ConnectionTemplateInterface;
}

const IproovAuthenticatorQuickStart: FunctionComponent<IproovAuthenticatorQuickStartPropsInterface> = (
    props: IproovAuthenticatorQuickStartPropsInterface
): ReactElement => {

    const {
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const [ showApplicationModal, setShowApplicationModal ] = useState<boolean>(false);

    /**
     * Vertical Stepper steps.
     * @returns VerticalStepperStepInterface
     */
    const steps: VerticalStepperStepInterface[] = [
        {
            stepContent: (
                <Text>
                    <Trans
                        i18nKey={
                            "extensions:develop.identityProviders.iproov.quickStart.steps.selectApplication.content"
                        }
                    >
                        Choose the
                        <Link external={ false } onClick={ () => setShowApplicationModal(true) }> application </Link>
                        for which you want to set up iProov login.
                    </Trans>
                </Text>
            ),
            stepTitle: t("extensions:develop.identityProviders.iproov.quickStart.steps.selectApplication.heading")
        },
        {
            stepContent: (
                <>
                    <Text>
                        <Trans
                            i18nKey={
                                "extensions:develop.identityProviders.iproov.quickStart.steps." +
                                "selectDefaultConfig.content"
                            }
                        >
                            Go to the <strong>Sign-in Method</strong> tab and click on <strong>Start with default
                            configuration</strong>.
                        </Trans>
                    </Text>
                    <GenericIcon inline transparent icon={ BuildLoginFlowIllustration } size="huge"/>
                </>
            ),
            stepTitle: (
                <Trans
                    i18nKey={
                        "extensions:develop.identityProviders.iproov.quickStart.steps.selectDefaultConfig.heading"
                    }
                >
                    Select <strong>Start with default configuration</strong>
                </Trans>
            )
        },
        {
            stepContent: (
                <>
                    <Text>
                        <Trans
                            i18nKey={
                                "extensions:develop.identityProviders.iproov.quickStart.steps.configureLogin.addIproov"
                            }
                        >
                            Add iProov authenticator to step 2 by clicking on
                            the <strong>Add Authentication</strong> button.
                        </Trans>
                    </Text>

                    <GenericIcon inline transparent icon={ CustomizeStepsIllustration } size="huge"/>

                    <Text>
                        <Trans
                            i18nKey={
                                "extensions:develop.identityProviders.iproov.quickStart.steps.configureLogin.update"
                            }
                        >
                            Click <strong>Update</strong> to confirm.
                        </Trans>
                    </Text>
                </>
            ),
            stepTitle: t("extensions:develop.identityProviders.iproov.quickStart.steps.configureLogin.heading")
        }
    ];

    return (
        <>
            <Grid data-componentid={ componentId } className="authenticator-quickstart-content">
                <Grid.Row textAlign="left">
                    <Grid.Column width={ 16 }>
                        <PageHeader
                            className="mb-2"
                            title={ t("extensions:develop.identityProviders.iproov.quickStart.heading") }
                            imageSpaced={ false }
                            bottomMargin={ false }
                        />
                        <Heading subHeading as="h6">
                            { t("extensions:develop.identityProviders.iproov.quickStart.subHeading") }
                        </Heading>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row textAlign="left">
                    <Grid.Column width={ 16 }>
                        <VerticalStepper
                            alwaysOpen
                            isSidePanelOpen
                            stepContent={ steps }
                            isNextEnabled={ true }
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            {
                showApplicationModal && (
                    <ApplicationSelectionModal
                        data-componentid={ `${ componentId }-application-selection-modal` }
                        open={ showApplicationModal }
                        onClose={ () => setShowApplicationModal(false) }
                        heading={
                            t("extensions:develop.identityProviders.iproov.quickStart.addLoginModal.heading")
                        }
                        subHeading={
                            t("extensions:develop.identityProviders.iproov.quickStart.addLoginModal.subHeading")
                        }
                    />
                )
            }
        </>
    );

};

/**
 * Default props for the component.
 */
IproovAuthenticatorQuickStart.defaultProps = {
    "data-componentid": "iproov-authenticator-quick-start"
};

export default IproovAuthenticatorQuickStart;
