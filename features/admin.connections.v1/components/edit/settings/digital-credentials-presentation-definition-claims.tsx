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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader, PrimaryButton } from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Form, Icon, Input, Label } from "semantic-ui-react";
import { getFederatedAuthenticatorDetails } from "../../../api/authenticators";
import {
    CreatePresentationDefinitionRequestInterface,
    getPresentationDefinition,
    PresentationDefinitionCredentialInterface,
    PresentationDefinitionResponseInterface,
    updatePresentationDefinition
} from "../../../api/connections";
import { ConnectionInterface, CommonPluggableComponentPropertyInterface } from "../../../models/connection";
import "./digital-credentials-presentation-definition-claims.scss";

interface DigitalCredentialsPresentationDefinitionClaimsPropsInterface extends TestableComponentInterface {
    identityProvider: ConnectionInterface;
    isReadOnly: boolean;
}

export const DigitalCredentialsPresentationDefinitionClaims: FunctionComponent<
    DigitalCredentialsPresentationDefinitionClaimsPropsInterface
> = (
    props: DigitalCredentialsPresentationDefinitionClaimsPropsInterface
): ReactElement => {

    const {
        identityProvider,
        isReadOnly,
        [ "data-testid" ]: testId = "digital-credentials-pd-claims"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ claims, setClaims ] = useState<string[]>([]);
    const [ definitionName, setDefinitionName ] = useState<string>("");
    const [ definitionDescription, setDefinitionDescription ] = useState<string>("");
    const [ issuer, setIssuer ] = useState<string>("");
    const [ vcType, setVcType ] = useState<string>("");
    const [ vcPurpose, setVcPurpose ] = useState<string>("");
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ presentationDefinitionId, setPresentationDefinitionId ] = useState<string>(undefined);

    const resolvePresentationDefinitionIdFromIdentityProvider = (): string => {
        const defaultAuthenticatorId: string = identityProvider?.federatedAuthenticators?.defaultAuthenticatorId;
        const authenticators = identityProvider?.federatedAuthenticators?.authenticators ?? [];

        const selectedAuthenticator = authenticators.find((authenticator: any) => {
            return authenticator?.authenticatorId === defaultAuthenticatorId;
        }) ?? authenticators[ 0 ];

        const authenticatorProperties: CommonPluggableComponentPropertyInterface[] =
            selectedAuthenticator?.properties ?? [];

        const pdProperty: CommonPluggableComponentPropertyInterface = authenticatorProperties.find(
            (property: CommonPluggableComponentPropertyInterface) => property.key === "presentationDefinitionId"
        );

        return pdProperty?.value;
    };

    const resolvePresentationDefinitionId = async (): Promise<void> => {
        const idFromIdentityProvider: string = resolvePresentationDefinitionIdFromIdentityProvider();

        if (!isEmpty(idFromIdentityProvider)) {
            setPresentationDefinitionId(idFromIdentityProvider);

            return;
        }

        const idpId: string = identityProvider?.id;
        const defaultAuthenticatorId: string = identityProvider?.federatedAuthenticators?.defaultAuthenticatorId;

        if (isEmpty(idpId) || isEmpty(defaultAuthenticatorId)) {
            setPresentationDefinitionId(undefined);

            return;
        }

        try {
            const authenticatorDetails: any = await getFederatedAuthenticatorDetails(idpId, defaultAuthenticatorId);
            const authenticatorProperties: CommonPluggableComponentPropertyInterface[] =
                authenticatorDetails?.properties ?? [];

            const pdProperty: CommonPluggableComponentPropertyInterface = authenticatorProperties.find(
                (property: CommonPluggableComponentPropertyInterface) => property.key === "presentationDefinitionId"
            );

            setPresentationDefinitionId(pdProperty?.value);
        } catch (error) {
            setPresentationDefinitionId(undefined);
        }
    };

    const updateFormFromDefinition = (definition: PresentationDefinitionResponseInterface): void => {
        const firstCredential: PresentationDefinitionCredentialInterface = definition?.credentials?.[ 0 ];

        setDefinitionName(definition?.name ?? "");
        setDefinitionDescription(definition?.description ?? "");
        setVcType(firstCredential?.type ?? "");
        setVcPurpose(firstCredential?.purpose ?? "");
        setIssuer(firstCredential?.issuer ?? "");
        setClaims(firstCredential?.claims ?? []);
    };

    const fetchPresentationDefinition = async (): Promise<void> => {
        if (isEmpty(presentationDefinitionId)) {
            setClaims([]);
            setDefinitionName("");
            setDefinitionDescription("");
            setVcType("");
            setVcPurpose("");
            setIssuer("");

            return;
        }

        setIsLoading(true);

        try {
            const response: AxiosResponse<PresentationDefinitionResponseInterface> =
                await getPresentationDefinition(presentationDefinitionId);

            updateFormFromDefinition(response?.data);
        } catch (error) {
            const axiosError: AxiosError = error as AxiosError;

            dispatch(addAlert({
                description: axiosError?.response?.data?.description
                    ? axiosError.response.data.description
                    : t("authenticationProvider:notifications.addIDP.genericError.description"),
                level: AlertLevels.ERROR,
                message: "Failed to fetch presentation definition claims"
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const savePresentationDefinition = async (nextClaims?: string[]): Promise<void> => {
        if (isReadOnly || isEmpty(presentationDefinitionId)) {
            return;
        }

        setIsSubmitting(true);

        const payload: CreatePresentationDefinitionRequestInterface = {
            credentials: [
                {
                    claims: nextClaims ?? claims,
                    issuer,
                    purpose: vcPurpose,
                    type: vcType
                }
            ],
            description: definitionDescription,
            name: definitionName
        };

        try {
            await updatePresentationDefinition(presentationDefinitionId, payload);

            dispatch(addAlert({
                description: "Presentation definition updated successfully.",
                level: AlertLevels.SUCCESS,
                message: "Presentation definition updated"
            }));
        } catch (error) {
            const axiosError: AxiosError = error as AxiosError;

            dispatch(addAlert({
                description: axiosError?.response?.data?.description
                    ? axiosError.response.data.description
                    : t("authenticationProvider:notifications.addIDP.genericError.description"),
                level: AlertLevels.ERROR,
                message: "Failed to update presentation definition"
            }));
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        resolvePresentationDefinitionId();
    }, [ identityProvider?.id, identityProvider?.federatedAuthenticators?.defaultAuthenticatorId ]);

    useEffect(() => {
        fetchPresentationDefinition();
    }, [ presentationDefinitionId ]);

    const onSaveChanges = (): void => {
        if (isEmpty(vcType?.trim()) || isEmpty(vcPurpose?.trim()) || isEmpty(issuer?.trim())) {
            dispatch(addAlert({
                description: "Credential Type, Request Purpose, and Trusted Issuer are required.",
                level: AlertLevels.ERROR,
                message: "Cannot update with blank required fields"
            }));

            return;
        }

        savePresentationDefinition();
    };

    if (isLoading) {
        return <ContentLoader active inline="centered" />;
    }

    return (
        <div data-testid={ testId }>
            <Form className="digital-credentials-pd-claims-form">
                <Form.Field>
                    <label>Credential Type</label>
                    <Input
                        value={ vcType }
                        readOnly={ isReadOnly }
                        onChange={ (_event: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
                            setVcType(data.value);
                        } }
                    />
                    <p className="ui-hint">
                        <Icon floated="left" aria-hidden="true" className="grey info circle icon" />
                        This must exactly match the type name defined by the issuer.
                    </p>
                </Form.Field>

                <Form.Field>
                    <label>Request Purpose</label>
                    <Input
                        value={ vcPurpose }
                        readOnly={ isReadOnly }
                        onChange={ (_event: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
                            setVcPurpose(data.value);
                        } }
                    />
                    <p className="ui-hint">
                        <Icon floated="left" aria-hidden="true" className="grey info circle icon" />
                        A short message displayed in the user&apos;s wallet app.
                    </p>
                </Form.Field>

                <Form.Field>
                    <label>Trusted Issuer</label>
                    <Input
                        value={ issuer }
                        readOnly={ isReadOnly }
                        onChange={ (_event: React.ChangeEvent<HTMLInputElement>, data: { value: string }) => {
                            setIssuer(data.value);
                        } }
                    />
                    <p className="ui-hint">
                        <Icon floated="left" aria-hidden="true" className="grey info circle icon" />
                        Credential issued organization.
                    </p>
                </Form.Field>

                <Divider hidden />

                <Form.Field>
                    <label>Requested Attributes</label>
                    <p className="ui-hint">
                        <Icon floated="left" aria-hidden="true" className="grey info circle icon" />
                        The specific pieces of data from this credential.
                    </p>
                    {
                        claims?.length > 0
                            ? claims.map((claim: string) => (
                                <Label key={ claim } size="large" style={ { marginBottom: "0.5rem" } }>
                                    { claim }
                                </Label>
                            ))
                            : <p>No claims found in the selected presentation definition.</p>
                    }
                </Form.Field>

                {
                    !isReadOnly && (
                        <>
                            <PrimaryButton
                                type="button"
                                loading={ isSubmitting }
                                disabled={
                                    isSubmitting
                                        || isEmpty(vcType?.trim())
                                        || isEmpty(vcPurpose?.trim())
                                        || isEmpty(issuer?.trim())
                                }
                                onClick={ onSaveChanges }
                            >
                                Update
                            </PrimaryButton>
                        </>
                    )
                }

            </Form>
        </div>
    );
};

export default DigitalCredentialsPresentationDefinitionClaims;
