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

import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { Field, Form, FormPropsInterface } from "@wso2is/forms";
import {
    ContentLoader,
    EmphasizedSegment,
    FilePicker,
    Hint,
    PageLayout,
    PickerResult,
    PickerStrategy,
    PrimaryButton,
    ValidationResult
} from "@wso2is/react-components";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useEffect,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Icon, Popup, Ref } from "semantic-ui-react";
import { updateOpenID4VPConfig, useOpenID4VPConfig } from "../api/openid4vp-configuration";
import { OpenID4VPConfigConstants } from "../constants/openid4vp-configuration";
import { OpenID4VPConfigAPIResponseInterface } from "../models/openid4vp-configuration";

type OpenID4VPConfigurationPageInterface = IdentifiableComponentInterface;

const FORM_ID: string = "openid4vp-configuration-form";

interface OpenID4VPConfigFormValuesInterface {
    clientIdScheme: string;
    clientId: string;
    responseMode: string;
    rejectVcWithoutStatusClaim: boolean;
}

const OpenID4VPConfigurationPage: FunctionComponent<OpenID4VPConfigurationPageInterface> = (
    props: OpenID4VPConfigurationPageInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const pageContextRef: MutableRefObject<any> = useRef(null);
    const formRef: MutableRefObject<FormPropsInterface> = useRef<FormPropsInterface>(null);

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const isReadOnly: boolean = !useRequiredScopes(
        featureConfig?.server?.scopes?.update
    );

    const dispatch: Dispatch<any> = useDispatch();
    const { t } = useTranslation();

    const [ formValues, setFormValues ] =
        useState<OpenID4VPConfigFormValuesInterface>(undefined);
    const [ registrationCertificate, setRegistrationCertificate ] = useState<string>("");
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const jwtFileStrategy: PickerStrategy<string> = {
        mimeTypes: [ ".jwt", ".txt" ],
        serialize: (data: File | string): Promise<string> => {
            if (!data) {
                return Promise.resolve("");
            }
            if (data instanceof File) {
                return new Promise<string>((resolve: (value: string) => void): void => {
                    const reader: FileReader = new FileReader();

                    reader.onload = (): void => resolve((reader.result as string ?? "").trim());
                    reader.readAsText(data, "UTF-8");
                });
            }

            return Promise.resolve((data as string).trim());
        },
        validate: (_data: File | string): Promise<ValidationResult> => {
            return Promise.resolve({ valid: true });
        }
    };

    const {
        data: originalConfig,
        isLoading: isConfigFetchRequestLoading,
        mutate: mutateConfig,
        error: configFetchRequestError
    } = useOpenID4VPConfig();

    useEffect(() => {
        if (
            originalConfig instanceof IdentityAppsApiException
            || configFetchRequestError
        ) {
            dispatch(
                addAlert({
                    description: t("openid4vp:notifications.getConfiguration.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("openid4vp:notifications.getConfiguration.error.message")
                })
            );

            return;
        }

        if (!originalConfig) {
            return;
        }

        const config: OpenID4VPConfigAPIResponseInterface =
            originalConfig as OpenID4VPConfigAPIResponseInterface;

        setFormValues({
            clientId: config.clientId ?? "",
            clientIdScheme: config.clientIdScheme ?? "",
            rejectVcWithoutStatusClaim: config.rejectVcWithoutStatusClaim ?? false,
            responseMode: config.responseMode ?? ""
        });
        setRegistrationCertificate(config.registrationCertificate ?? "");
    }, [ originalConfig ]);

    const handleSubmit = (values: OpenID4VPConfigFormValuesInterface): void => {
        setIsSubmitting(true);
        updateOpenID4VPConfig({
            clientId: values.clientId || undefined,
            clientIdScheme: values.clientIdScheme,
            registrationCertificate: registrationCertificate || undefined,
            rejectVcWithoutStatusClaim: values.rejectVcWithoutStatusClaim,
            responseMode: values.responseMode
        })
            .then(() => {
                dispatch(
                    addAlert({
                        description: t("openid4vp:notifications.updateConfiguration.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("openid4vp:notifications.updateConfiguration.success.message")
                    })
                );
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: t("openid4vp:notifications.updateConfiguration.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("openid4vp:notifications.updateConfiguration.error.message")
                    })
                );
            })
            .finally(() => {
                setIsSubmitting(false);
                mutateConfig();
            });
    };

    const onBackButtonClick = (): void => {
        history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
    };

    return (
        <PageLayout
            title={ t("openid4vp:title") }
            pageTitle={ t("openid4vp:title") }
            description={ t("openid4vp:description") }
            backButton={ {
                onClick: () => onBackButtonClick(),
                text: t("governanceConnectors:goBackLoginAndRegistration")
            } }
            bottomMargin={ false }
            contentTopMargin={ false }
            pageHeaderMaxWidth={ true }
            data-componentid={ `${ componentId }-form-layout` }
        >
            <Ref innerRef={ pageContextRef }>
                <Grid className={ "mt-2" }>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            <EmphasizedSegment className="form-wrapper" padded={ "very" }>
                                { isConfigFetchRequestLoading
                                    ? (
                                        <ContentLoader />
                                    )
                                    : (
                                        <>
                                            <Form
                                                id={ FORM_ID }
                                                uncontrolledForm={ true }
                                                onSubmit={ handleSubmit }
                                                initialValues={ formValues }
                                                enableReinitialize={ true }
                                                ref={ formRef }
                                                noValidate={ true }
                                            >
                                                <Grid>
                                                    <Grid.Row columns={ 1 }>
                                                        <Grid.Column width={ 10 }>
                                                            <Field.Dropdown
                                                                ariaLabel={
                                                                    t("openid4vp:form.clientIdScheme.label")
                                                                }
                                                                name="clientIdScheme"
                                                                label={ t("openid4vp:form.clientIdScheme.label") }
                                                                hint={ t("openid4vp:form.clientIdScheme.hint") }
                                                                options={
                                                                    OpenID4VPConfigConstants.CLIENT_ID_SCHEME_OPTIONS
                                                                }
                                                                placeholder={
                                                                    t("openid4vp:form.clientIdScheme.placeholder")
                                                                }
                                                                value={ formValues?.clientIdScheme }
                                                                readOnly={ isReadOnly }
                                                                width={ 16 }
                                                                data-componentid={
                                                                    `${ componentId }-client-id-scheme`
                                                                }
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row columns={ 1 }>
                                                        <Grid.Column width={ 10 }>
                                                            <Field.Input
                                                                ariaLabel={
                                                                    t("openid4vp:form.clientId.label")
                                                                }
                                                                inputType="default"
                                                                name="clientId"
                                                                label={ t("openid4vp:form.clientId.label") }
                                                                hint={ t("openid4vp:form.clientId.hint") }
                                                                placeholder={
                                                                    t("openid4vp:form.clientId.placeholder")
                                                                }
                                                                readOnly={ isReadOnly }
                                                                maxLength={ null }
                                                                minLength={ 0 }
                                                                width={ 16 }
                                                                data-componentid={
                                                                    `${ componentId }-client-id`
                                                                }
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row columns={ 1 }>
                                                        <Grid.Column width={ 10 }>
                                                            <label className="display-flex">
                                                                { t("openid4vp:form.responseMode.label") }
                                                            </label>
                                                            <Field.Radio
                                                                ariaLabel="direct_post"
                                                                name="responseMode"
                                                                label={
                                                                    <label>
                                                                        { "direct_post" }
                                                                        <Popup
                                                                            content={ t(
                                                                                "openid4vp:form.responseMode" +
                                                                                ".directPost.hint"
                                                                            ) }
                                                                            trigger={
                                                                                <Icon
                                                                                    name="info circle"
                                                                                    size="small"
                                                                                    color="grey"
                                                                                    className="ml-1"
                                                                                />
                                                                            }
                                                                            popper={
                                                                                <div
                                                                                    style={ { filter: "none" } }
                                                                                />
                                                                            }
                                                                        />
                                                                    </label>
                                                                }
                                                                value="direct_post"
                                                                readOnly={ isReadOnly }
                                                                data-componentid={
                                                                    `${ componentId }-response-mode-direct-post`
                                                                }
                                                            />
                                                            <Field.Radio
                                                                ariaLabel="direct_post.jwt"
                                                                name="responseMode"
                                                                label={
                                                                    <label>
                                                                        { "direct_post.jwt" }
                                                                        <Popup
                                                                            content={ t(
                                                                                "openid4vp:form.responseMode" +
                                                                                ".directPostJwt.hint"
                                                                            ) }
                                                                            trigger={
                                                                                <Icon
                                                                                    name="info circle"
                                                                                    size="small"
                                                                                    color="grey"
                                                                                    className="ml-1"
                                                                                />
                                                                            }
                                                                            popper={
                                                                                <div
                                                                                    style={ { filter: "none" } }
                                                                                />
                                                                            }
                                                                        />
                                                                    </label>
                                                                }
                                                                value="direct_post.jwt"
                                                                readOnly={ isReadOnly }
                                                                data-componentid={
                                                                    `${ componentId }-response-mode-direct-post-jwt`
                                                                }
                                                            />
                                                            <Hint>
                                                                { t("openid4vp:form.responseMode.hint") }
                                                            </Hint>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row columns={ 1 }>
                                                        <Grid.Column width={ 10 }>
                                                            <label className="display-flex">
                                                                { t("openid4vp:form.registrationCert.label") }
                                                            </label>
                                                            <FilePicker
                                                                key={ 1 }
                                                                fileStrategy={ jwtFileStrategy }
                                                                normalizeStateOnRemoveOperations={ true }
                                                                onChange={ (result: PickerResult<string>) => {
                                                                    setRegistrationCertificate(
                                                                        result.serialized ?? result.pastedContent ?? ""
                                                                    );
                                                                } }
                                                                uploadButtonText={ t(
                                                                    "openid4vp:form.registrationCert.uploadButtonText"
                                                                ) }
                                                                dropzoneText={ t(
                                                                    "openid4vp:form.registrationCert.dropzoneText"
                                                                ) }
                                                                pasteAreaPlaceholderText={ t(
                                                                    "openid4vp:form.registrationCert.placeholder"
                                                                ) }
                                                                pastedContent={ registrationCertificate }
                                                                placeholderIcon={
                                                                    <Icon name="file alternate" size="huge" />
                                                                }
                                                                data-componentid={
                                                                    `${ componentId }-registration-cert`
                                                                }
                                                            />
                                                            <Hint>
                                                                { t("openid4vp:form.registrationCert.hint") }
                                                            </Hint>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row columns={ 1 }>
                                                        <Grid.Column width={ 10 }>
                                                            <Divider horizontal className="mb-3">
                                                                <small>
                                                                    { t(
                                                                        "openid4vp:form.revocation.sectionTitle"
                                                                    ) }
                                                                </small>
                                                            </Divider>
                                                            <Field.Checkbox
                                                                ariaLabel={ t(
                                                                    "openid4vp:form.revocation" +
                                                                    ".rejectVcWithoutStatusClaim.label"
                                                                ) }
                                                                name="rejectVcWithoutStatusClaim"
                                                                label={ t(
                                                                    "openid4vp:form.revocation" +
                                                                    ".rejectVcWithoutStatusClaim.label"
                                                                ) }
                                                                hint={ t(
                                                                    "openid4vp:form.revocation" +
                                                                    ".rejectVcWithoutStatusClaim.hint"
                                                                ) }
                                                                readOnly={ isReadOnly }
                                                                width={ 16 }
                                                                data-componentid={
                                                                    `${ componentId }-reject-vc-without-status-claim`
                                                                }
                                                                toggle
                                                            />
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </Grid>
                                            </Form>
                                            { !isReadOnly && (
                                                <>
                                                    <Divider hidden />
                                                    <Grid.Row columns={ 1 }>
                                                        <Grid.Column width={ 10 }>
                                                            <PrimaryButton
                                                                size="small"
                                                                loading={ isSubmitting }
                                                                onClick={ () => {
                                                                    formRef?.current?.triggerSubmit();
                                                                } }
                                                                ariaLabel="openid4vp configuration form update button"
                                                                data-componentid={
                                                                    `${ componentId }-update-button`
                                                                }
                                                            >
                                                                { t("common:update") }
                                                            </PrimaryButton>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                </>
                                            ) }
                                        </>
                                    )
                                }
                            </EmphasizedSegment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Ref>
        </PageLayout>
    );
};

OpenID4VPConfigurationPage.defaultProps = {
    "data-componentid": "openid4vp-configuration-page"
};

export default OpenID4VPConfigurationPage;
