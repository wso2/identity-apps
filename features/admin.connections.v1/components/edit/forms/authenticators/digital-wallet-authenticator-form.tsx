/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods, TestableComponentInterface } from "@wso2is/core/models";
import { ContentLoader, PrimaryButton } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Dropdown,
    DropdownItemProps,
    DropdownProps,
    Form,
    Icon,
    Input,
    InputOnChangeData
} from "semantic-ui-react";
import { AuthenticatorSettingsFormModes } from "../../../../models/authenticators";
import { FederatedAuthenticatorListItemInterface } from "../../../../models/connection";

interface PresentationDefinitionListItemInterface {
    id: string;
    name: string;
    description?: string;
}

interface PresentationDefinitionListInterface {
    totalResults?: number;
    presentationDefinitions: PresentationDefinitionListItemInterface[];
}

interface DigitalWalletAuthenticatorFormPropsInterface extends TestableComponentInterface {
    mode: AuthenticatorSettingsFormModes;
    metadata?: any;
    initialValues: FederatedAuthenticatorListItemInterface;
    onSubmit: (values: FederatedAuthenticatorListItemInterface) => void;
    readOnly?: boolean;
    triggerSubmit: boolean;
    enableSubmitButton: boolean;
    showCustomProperties: boolean;
    isSubmitting?: boolean;
}

const MANAGED_KEYS: string[] = [
    "presentationDefinitionId", "timeout"
];

/**
 * Authenticator settings form for Digital Credentials (OpenID4VP) connections.
 * Renders the Presentation Definition field as a dropdown populated from the
 * presentation definitions API, instead of a plain read-only text input.
 */
export const DigitalWalletAuthenticatorForm: FunctionComponent<
    DigitalWalletAuthenticatorFormPropsInterface
> = (
    props: DigitalWalletAuthenticatorFormPropsInterface
): ReactElement => {

    const {
        initialValues,
        onSubmit,
        readOnly,
        isSubmitting,
        [ "data-testid" ]: testId = "digital-wallet-authenticator-form"
    } = props;

    const { t } = useTranslation();

    const [ presentationDefinitionId, setPresentationDefinitionId ] = useState<string>("");
    const [ timeoutSeconds, setTimeoutSeconds ] = useState<string>("");

    const requestConfig: RequestConfigInterface = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.vpTemplates
    };

    const {
        data: pdListData,
        isLoading: isPdListLoading
    }: RequestResultInterface<PresentationDefinitionListInterface, RequestErrorInterface> =
        useRequest<PresentationDefinitionListInterface, RequestErrorInterface>(requestConfig);

    useEffect(() => {
        if (!initialValues?.properties) {
            return;
        }

        const getPropertyValue = (key: string): string => {
            const property: any = initialValues.properties.find((p: any) => p.key === key);

            return property?.value ?? "";
        };

        setPresentationDefinitionId(getPropertyValue("presentationDefinitionId"));
        setTimeoutSeconds(getPropertyValue("timeout"));
    }, [ initialValues ]);

    const pdOptions: DropdownItemProps[] = (pdListData?.presentationDefinitions ?? []).map(
        (pd: PresentationDefinitionListItemInterface): DropdownItemProps => ({
            description: pd.description,
            key: pd.id,
            text: pd.name,
            value: pd.id
        })
    );

    const handleSubmit = (): void => {
        const unchangedProperties: any[] = (initialValues.properties ?? []).filter(
            (p: any) => !MANAGED_KEYS.includes(p.key)
        );

        onSubmit({
            ...initialValues,
            properties: [
                ...unchangedProperties,
                { key: "presentationDefinitionId", value: presentationDefinitionId },
                { key: "timeout", value: timeoutSeconds }
            ]
        });
    };

    if (isPdListLoading) {
        return <ContentLoader active inline="centered" />;
    }

    return (
        <Grid container>
            <Grid xs={ 12 } md={ 8 } lg={ 6 }>
                <Form data-testid={ testId }>
                    <Form.Field required>
                        <label>Presentation Definition</label>
                        <Dropdown
                            placeholder={
                                pdOptions.length === 0
                                    ? "No presentation definitions available — create one first"
                                    : "Select a presentation definition"
                            }
                            fluid
                            selection
                            options={ pdOptions }
                            value={ presentationDefinitionId }
                            disabled={ readOnly }
                            onChange={ (_e: SyntheticEvent, data: DropdownProps): void => {
                                setPresentationDefinitionId(data.value as string);
                            } }
                            data-testid={ `${ testId }-presentation-definition-dropdown` }
                        />
                        <p className="ui-hint">
                            <Icon floated="left" aria-hidden="true" className="grey info circle icon" />
                            The presentation definition that specifies which credentials and claims
                            to request from the user&apos;s wallet.
                        </p>
                    </Form.Field>

                    <Form.Field>
                        <label>Timeout (seconds)</label>
                        <Input
                            type="number"
                            min="30"
                            value={ timeoutSeconds }
                            readOnly={ readOnly }
                            onChange={ (
                                _e: React.ChangeEvent<HTMLInputElement>,
                                data: InputOnChangeData
                            ): void => {
                                setTimeoutSeconds(data.value);
                            } }
                            data-testid={ `${ testId }-timeout-input` }
                        />
                        <p className="ui-hint">
                            <Icon floated="left" aria-hidden="true" className="grey info circle icon" />
                            How long (in seconds) the wallet has to submit the presentation.
                        </p>
                    </Form.Field>

                    { !readOnly && (
                        <PrimaryButton
                            type="button"
                            loading={ isSubmitting }
                            disabled={ isSubmitting || isEmpty(presentationDefinitionId) }
                            onClick={ handleSubmit }
                            data-testid={ `${ testId }-submit-button` }
                        >
                            { t("common:update") }
                        </PrimaryButton>
                    ) }
                </Form>
            </Grid>
        </Grid>
    );
};

DigitalWalletAuthenticatorForm.defaultProps = {
    "data-testid": "digital-wallet-authenticator-form",
    enableSubmitButton: true
};
