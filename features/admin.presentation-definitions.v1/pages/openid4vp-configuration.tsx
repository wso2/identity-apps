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
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ContentLoader,
    EmphasizedSegment,
    Hint,
    PageLayout,
    PrimaryButton
} from "@wso2is/react-components";
import Divider from "@oxygen-ui/react/Divider";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import MenuItem from "@oxygen-ui/react/MenuItem";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import TextField from "@oxygen-ui/react/TextField";
import Tooltip from "@oxygen-ui/react/Tooltip";
import { CircleInfoIcon } from "@oxygen-ui/react-icons";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Field, Form as FinalForm, FormRenderProps } from "react-final-form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid } from "semantic-ui-react";
import { updateOpenID4VPConfig, useOpenID4VPConfig } from "../api/openid4vp-configuration";
import { OpenID4VPConfigConstants } from "../constants/openid4vp-configuration";
import {
    OpenID4VPConfigAPIResponseInterface,
    OpenID4VPConfigFormValuesInterface,
    OpenID4VPConfigurationPagePropsInterface
} from "../models/openid4vp-configuration";

const FORM_ID: string = "openid4vp-configuration-form";

const OpenID4VPConfigurationPage: FunctionComponent<OpenID4VPConfigurationPagePropsInterface> = (
    props: OpenID4VPConfigurationPagePropsInterface
): ReactElement => {
    const { [ "data-componentid" ]: componentId } = props;

    const featureConfig: FeatureConfigInterface = useSelector(
        (state: AppState): FeatureConfigInterface => state.config.ui.features
    );

    const subFeatureConfig: Omit<FeatureAccessConfigInterface, "subFeatures"> | undefined =
        featureConfig?.presentationDefinitions?.subFeatures?.verifiablePresentationSettings;

    const hasReadPermission: boolean = useRequiredScopes(subFeatureConfig?.scopes?.read ?? []);
    const isReadOnly: boolean = !useRequiredScopes(subFeatureConfig?.scopes?.update ?? []);

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ formValues, setFormValues ] = useState<OpenID4VPConfigFormValuesInterface>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const {
        data: originalConfig,
        isLoading: isConfigFetchRequestLoading,
        mutate: mutateConfig,
        error: configFetchRequestError
    } = useOpenID4VPConfig();

    useEffect((): void => {
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
            clientIdScheme: config.clientIdScheme ?? "",
            responseMode: config.responseMode ?? ""
        });
    }, [ originalConfig, configFetchRequestError ]);

    const handleFormSubmit = (values: OpenID4VPConfigFormValuesInterface): void => {
        setIsSubmitting(true);
        updateOpenID4VPConfig({
            clientIdScheme: values.clientIdScheme,
            responseMode: values.responseMode
        })
            .then((): void => {
                dispatch(
                    addAlert({
                        description: t("openid4vp:notifications.updateConfiguration.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("openid4vp:notifications.updateConfiguration.success.message")
                    })
                );
            })
            .catch((): void => {
                dispatch(
                    addAlert({
                        description: t("openid4vp:notifications.updateConfiguration.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("openid4vp:notifications.updateConfiguration.error.message")
                    })
                );
            })
            .finally((): void => {
                setIsSubmitting(false);
                mutateConfig();
            });
    };

    return (
        <PageLayout
            title={ t("openid4vp:title") }
            pageTitle={ t("openid4vp:title") }
            description={ t("openid4vp:description") }
            backButton={ {
                onClick: (): void => history.goBack(),
                text: t("openid4vp:goBack")
            } }
            bottomMargin={ false }
            contentTopMargin={ false }
            pageHeaderMaxWidth={ true }
            data-componentid={ `${ componentId }-form-layout` }
        >
            <Grid className="mt-2">
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 16 }>
                        <EmphasizedSegment className="form-wrapper" padded="very">
                            { isConfigFetchRequestLoading
                                ? (
                                    <ContentLoader />
                                )
                                : (!subFeatureConfig?.enabled || !hasReadPermission)
                                ? null
                                : formValues && (
                                    <FinalForm
                                        initialValues={ formValues }
                                        onSubmit={ handleFormSubmit }
                                        render={ ({ handleSubmit }: FormRenderProps) => (
                                            <form
                                                id={ FORM_ID }
                                                onSubmit={ handleSubmit }
                                                data-componentid={ componentId }
                                            >
                                                <Grid>
                                                    <Grid.Row columns={ 1 }>
                                                        <Grid.Column width={ 10 }>
                                                            <Field name="clientIdScheme">
                                                                { ({ input }: { input: object }) => (
                                                                    <TextField
                                                                        { ...input }
                                                                        select
                                                                        fullWidth
                                                                        required
                                                                        margin="dense"
                                                                        label={ t(
                                                                            "openid4vp:form.clientIdScheme.label"
                                                                        ) }
                                                                        disabled={ isReadOnly }
                                                                        SelectProps={ { displayEmpty: true } }
                                                                        data-componentid={
                                                                            `${ componentId }-client-id-scheme`
                                                                        }
                                                                    >
                                                                        { OpenID4VPConfigConstants
                                                                            .CLIENT_ID_SCHEME_OPTIONS
                                                                            .map((
                                                                                option: {
                                                                                    key: string;
                                                                                    text: string;
                                                                                    value: string;
                                                                                }
                                                                            ): ReactElement => (
                                                                                <MenuItem
                                                                                    key={ option.key }
                                                                                    value={ option.value }
                                                                                >
                                                                                    { option.text }
                                                                                </MenuItem>
                                                                            )) }
                                                                    </TextField>
                                                                ) }
                                                            </Field>
                                                            <Hint>
                                                                { t("openid4vp:form.clientIdScheme.hint") }
                                                            </Hint>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    <Grid.Row columns={ 1 }>
                                                        <Grid.Column width={ 10 }>
                                                            <div className="required field">
                                                                <label>
                                                                    { t("openid4vp:form.responseMode.label") }
                                                                </label>
                                                            </div>
                                                            <Field name="responseMode">
                                                                { ({ input }: {
                                                                    input: {
                                                                        name: string;
                                                                        value: string;
                                                                        onChange: (value: string) => void;
                                                                    }
                                                                }) => (
                                                                    <RadioGroup
                                                                        name={ input.name }
                                                                        value={ input.value }
                                                                        onChange={ (
                                                                            e: React.ChangeEvent<HTMLInputElement>
                                                                        ): void => {
                                                                            input.onChange(e.target.value);
                                                                        } }
                                                                    >
                                                                        <FormControlLabel
                                                                            value="direct_post"
                                                                            disabled={ isReadOnly }
                                                                            control={ (
                                                                                <Radio
                                                                                    data-componentid={
                                                                                        `${ componentId }-response-mode-direct-post`
                                                                                    }
                                                                                />
                                                                            ) }
                                                                            label={ (
                                                                                <span
                                                                                    style={ {
                                                                                        alignItems: "center",
                                                                                        display: "inline-flex"
                                                                                    } }
                                                                                >
                                                                                    { "direct_post" }
                                                                                    <Tooltip
                                                                                        title={ t(
                                                                                            "openid4vp:form" +
                                                                                            ".responseMode" +
                                                                                            ".directPost.hint"
                                                                                        ) }
                                                                                        placement="top"
                                                                                        componentsProps={ {
                                                                                            tooltip: {
                                                                                                sx: {
                                                                                                    fontSize: "0.8rem"
                                                                                                }
                                                                                            }
                                                                                        } }
                                                                                    >
                                                                                        <span
                                                                                            style={ {
                                                                                                cursor: "help",
                                                                                                display: "inline-flex",
                                                                                                marginLeft: "4px"
                                                                                            } }
                                                                                        >
                                                                                            <CircleInfoIcon
                                                                                                size={ 14 }
                                                                                            />
                                                                                        </span>
                                                                                    </Tooltip>
                                                                                </span>
                                                                            ) }
                                                                        />
                                                                        <FormControlLabel
                                                                            value="direct_post.jwt"
                                                                            disabled={ isReadOnly }
                                                                            control={ (
                                                                                <Radio
                                                                                    data-componentid={
                                                                                        `${ componentId }-response-mode-direct-post-jwt`
                                                                                    }
                                                                                />
                                                                            ) }
                                                                            label={ (
                                                                                <span
                                                                                    style={ {
                                                                                        alignItems: "center",
                                                                                        display: "inline-flex"
                                                                                    } }
                                                                                >
                                                                                    { "direct_post.jwt" }
                                                                                    <Tooltip
                                                                                        title={ t(
                                                                                            "openid4vp:form" +
                                                                                            ".responseMode" +
                                                                                            ".directPostJwt.hint"
                                                                                        ) }
                                                                                        placement="top"
                                                                                        componentsProps={ {
                                                                                            tooltip: {
                                                                                                sx: {
                                                                                                    fontSize: "0.8rem"
                                                                                                }
                                                                                            }
                                                                                        } }
                                                                                    >
                                                                                        <span
                                                                                            style={ {
                                                                                                cursor: "help",
                                                                                                display: "inline-flex",
                                                                                                marginLeft: "4px"
                                                                                            } }
                                                                                        >
                                                                                            <CircleInfoIcon
                                                                                                size={ 14 }
                                                                                            />
                                                                                        </span>
                                                                                    </Tooltip>
                                                                                </span>
                                                                            ) }
                                                                        />
                                                                    </RadioGroup>
                                                                ) }
                                                            </Field>
                                                            <Hint>
                                                                { t("openid4vp:form.responseMode.hint") }
                                                            </Hint>
                                                        </Grid.Column>
                                                    </Grid.Row>
                                                    { !isReadOnly && (
                                                        <Grid.Row columns={ 1 }>
                                                            <Grid.Column width={ 10 }>
                                                                <Divider
                                                                    sx={ {
                                                                        borderColor: "transparent",
                                                                        mb: 1
                                                                    } }
                                                                />
                                                                <PrimaryButton
                                                                    size="small"
                                                                    type="submit"
                                                                    loading={ isSubmitting }
                                                                    ariaLabel="openid4vp configuration form update button"
                                                                    data-componentid={
                                                                        `${ componentId }-update-button`
                                                                    }
                                                                >
                                                                    { t("common:update") }
                                                                </PrimaryButton>
                                                            </Grid.Column>
                                                        </Grid.Row>
                                                    ) }
                                                </Grid>
                                            </form>
                                        ) }
                                    />
                                )
                            }
                        </EmphasizedSegment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </PageLayout>
    );
};

OpenID4VPConfigurationPage.defaultProps = {
    "data-componentid": "openid4vp-configuration-page"
};

export default OpenID4VPConfigurationPage;
