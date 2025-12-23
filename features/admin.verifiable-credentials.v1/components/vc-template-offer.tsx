/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { Config } from "@wso2is/admin.core.v1/configs/app";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    CopyInputField,
    EmphasizedSegment
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Button, Grid, Icon, Message } from "semantic-ui-react";
import { generateVCCredentialOffer } from "../api/verifiable-credentials";
import { VCTemplate } from "../models/verifiable-credentials";

/**
 * Prop types for the VC template offer component.
 */
interface VCTemplateOfferPropsInterface extends TestableComponentInterface {
    /**
     * VC Template object.
     */
    template: VCTemplate;
    /**
     * Callback to update the template details.
     */
    onUpdate: (id: string) => void;
    /**
     * Read-only mode.
     */
    readOnly?: boolean;
}

/**
 * VC Template Offer component.
 *
 * @param props - Props injected to the component.
 * @returns The VC Template Offer component.
 */
export const VCTemplateOffer: FunctionComponent<VCTemplateOfferPropsInterface> = (
    props: VCTemplateOfferPropsInterface
): ReactElement => {

    const {
        template,
        onUpdate,
        readOnly,
        ["data-testid"]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isGenerating, setIsGenerating ] = useState<boolean>(false);
    const [ showRegenerateConfirmation, setShowRegenerateConfirmation ] = useState<boolean>(false);

    /**
     * Generates or regenerates the credential offer.
     */
    const handleGenerateOffer = (): void => {
        setIsGenerating(true);
        generateVCCredentialOffer(template.id)
            .then(() => {
                dispatch(addAlert({
                    description: t("verifiableCredentials:offer.notifications.generate.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("verifiableCredentials:offer.notifications.generate.success.message")
                }));
                onUpdate(template.id);
                setShowRegenerateConfirmation(false);
            })
            .catch((error: AxiosError) => {
                dispatch(addAlert({
                    description: error?.response?.data?.description
                        || t("verifiableCredentials:offer.notifications.generate.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("verifiableCredentials:offer.notifications.generate.error.message")
                }));
            })
            .finally(() => {
                setIsGenerating(false);
            });
    };



    /**
     * Constructs the offer URI.
     */
    const getOfferURI = (): string => {
        if (!template?.offerId) {
            return "";
        }

        const host: string = Config.resolveServerHost(false, true);

        return `openid-credential-offer://?credential_offer_uri=${host}/oid4vci/credential-offer/${template.offerId}`;
    };

    return (
        <EmphasizedSegment padded="very">
            <Grid>

                <Grid.Row>
                    <Grid.Column width={ 16 }>
                        {
                            template?.offerId
                                ? (
                                    <>
                                        <Message info>
                                            <Icon name="info circle" />
                                            { t("verifiableCredentials:offer.active") }
                                        </Message>
                                        <Grid>
                                            <Grid.Row>
                                                <Grid.Column width={ 12 }>
                                                    <CopyInputField
                                                        value={ getOfferURI() }
                                                        data-testid={ `${testId}-offer-uri` }
                                                    />
                                                </Grid.Column>
                                                <Grid.Column width={ 4 }>
                                                    <Button
                                                        primary
                                                        className="fluid"
                                                        loading={ isGenerating }
                                                        disabled={ isGenerating || readOnly }
                                                        onClick={ () => setShowRegenerateConfirmation(true) }
                                                        data-testid={ `${testId}-regenerate-button` }
                                                    >
                                                        { t("verifiableCredentials:offer.regenerate") }
                                                    </Button>
                                                </Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </>
                                )
                                : (
                                    <>
                                        <Message info>
                                            <Icon name="info circle" />
                                            { t("verifiableCredentials:offer.empty") }
                                        </Message>
                                        <Button
                                            primary
                                            loading={ isGenerating }
                                            disabled={ isGenerating || readOnly }
                                            onClick={ handleGenerateOffer }
                                            data-testid={ `${testId}-generate-button` }
                                        >
                                            { t("verifiableCredentials:offer.generate") }
                                        </Button>
                                    </>
                                )
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            {
                showRegenerateConfirmation && (
                    <ConfirmationModal
                        primaryActionLoading={ isGenerating }
                        onClose={ (): void => setShowRegenerateConfirmation(false) }
                        type="warning"
                        open={ showRegenerateConfirmation }
                        assertionHint={ t("verifiableCredentials:offer.regenerate") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowRegenerateConfirmation(false) }
                        onPrimaryActionClick={ handleGenerateOffer }
                        data-testid={ `${testId}-regenerate-confirmation-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header>
                            { t("verifiableCredentials:offer.regenerate") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message attached warning>
                            { t("verifiableCredentials:offer.active") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content>
                            { t("verifiableCredentials:offer.active") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }

        </EmphasizedSegment>
    );
};
