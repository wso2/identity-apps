/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GenericIcon, Heading, Link, PageHeader, Text } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import BuildLoginFlowIllustration from "./assets/build-login-flow.png";
import { VerticalStepper, VerticalStepperStepInterface } from "../../component-extensions";
import ApplicationSelectionModal from "../../shared/application-selection-modal";

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
                            Go to <strong>Sign-in Method</strong> tab and click on <strong>Add SMS OTP as a second
                            factor</strong> to configure a basic SMS OTP flow.
                        </Trans>
                    </Text>
                    <GenericIcon inline transparent icon={ BuildLoginFlowIllustration } size="huge"/>
                </>
            ),
            stepTitle: (
                <Trans i18nKey="extensions:develop.identityProviders.smsOTP.quickStart.steps.selectSMSOTP.heading">
                    Select <strong>Add SMS OTP as a second factor</strong>
                </Trans>
            )
        }
    ];

    return (
        <>
            <Grid data-testid={ componentId } className="authenticator-quickstart-content">
                <Grid.Row textAlign="left">
                    <Grid.Column width={ 16 }>
                        <PageHeader
                            className="mb-2"
                            title={ t("extensions:develop.identityProviders.smsOTP.quickStart.heading") }
                            imageSpaced={ false }
                            bottomMargin={ false }
                        />
                        <Heading subHeading as="h6">
                            { t("extensions:develop.identityProviders.smsOTP.quickStart.subHeading") }
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
