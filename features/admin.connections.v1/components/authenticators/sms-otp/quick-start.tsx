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

import Grid from "@oxygen-ui/react/Grid";
import {
    VerticalStepper,
    VerticalStepperStepInterface
} from "@wso2is/admin.core.v1/components/vertical-stepper/vertical-stepper";
import ApplicationSelectionModal from "@wso2is/admin.extensions.v1/components/shared/application-selection-modal";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GenericIcon, Heading, Link, PageHeader, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import BuildLoginFlowIllustration from "./assets/build-login-flow.png";

/**
 * Prop types of the component.
 */
type SMSOTPQuickStartPropsInterface = IdentifiableComponentInterface;

/**
 * Quick start content for the SMS OTP authenticator.
 *
 * @param props - Props injected into the component.
 *
 * @returns SMS OTP Quick start component.
 */
const SMSOTPQuickStart: FunctionComponent<SMSOTPQuickStartPropsInterface> = (
    props: SMSOTPQuickStartPropsInterface
): ReactElement => {

    const {
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const [ showApplicationModal, setShowApplicationModal ] = useState<boolean>(false);

    /**
     * Vertical Stepper steps.
     * @returns An array of Vertical Stepper steps.
     */
    const steps: VerticalStepperStepInterface[] = [
        {
            stepContent: (
                <>
                    <Text>
                        <Trans
                            i18nKey={
                                "extensions:develop.identityProviders.smsOTP.quickStart.steps.selectApplication.content"
                            }
                        >
                            Choose the <Link external={ false } onClick={ () => setShowApplicationModal(true) }>
                            application </Link> for which you want to set up SMS OTP login.
                        </Trans>
                    </Text>
                </>
            ),
            stepTitle: t("extensions:develop.identityProviders.smsOTP.quickStart.steps.selectApplication.heading")
        },
        {
            stepContent: (
                <>
                    <Text>
                        <Trans
                            i18nKey={ "extensions:develop.identityProviders.smsOTP.quickStart.steps.selectSMSOTP" +
                                ".content" }
                        >
                            Go to <strong>Login Flow</strong> tab and click on the <strong>Username & Password + SMS OTP
                            </strong> option from the Multi-factor login section to configure a basic SMS OTP flow.
                        </Trans>
                    </Text>
                    <GenericIcon inline transparent icon={ BuildLoginFlowIllustration } size="huge"/>
                </>
            ),
            stepTitle: (
                <Trans i18nKey="extensions:develop.identityProviders.smsOTP.quickStart.steps.selectSMSOTP.heading">
                    Select <strong>SMS OTP</strong> option
                </Trans>
            )
        }
    ];

    return (
        <>
            <Grid container spacing={ { md: 3, xs: 2  } } columns={ { md: 12, sm: 8, xs: 4 } }>
                <Grid columns={ { md: 12, sm: 8, xs: 4 } }>
                    <PageHeader
                        className="mb-2"
                        title={ t("extensions:develop.identityProviders.smsOTP.quickStart.heading") }
                        imageSpaced={ false }
                        bottomMargin={ false }
                    />
                    <Heading subHeading as="h6">
                        { t("extensions:develop.identityProviders.smsOTP.quickStart.subHeading") }
                    </Heading>
                </Grid>
                <Grid columns={ { md: 12, sm: 8, xs: 4 } }>
                    <VerticalStepper
                        alwaysOpen
                        isSidePanelOpen
                        stepContent={ steps }
                        isNextEnabled={ true }
                    />
                </Grid>
            </Grid>
            {
                showApplicationModal && (
                    <ApplicationSelectionModal
                        data-testid={ `${ componentId }-application-selection-modal` }
                        open={ showApplicationModal }
                        onClose={ () => setShowApplicationModal(false) }
                        heading={
                            t("extensions:develop.identityProviders.smsOTP.quickStart.addLoginModal.heading")
                        }
                        subHeading={
                            t("extensions:develop.identityProviders.smsOTP.quickStart.addLoginModal.subHeading")
                        }
                        data-componentid="connections"
                    />
                )
            }
        </>
    );
};

/**
 * Default props for the component
 */
SMSOTPQuickStart.defaultProps = {
    "data-componentid": "sms-otp-authenticator-quick-start"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SMSOTPQuickStart;
