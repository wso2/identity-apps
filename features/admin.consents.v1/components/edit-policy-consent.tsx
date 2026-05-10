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

import Box from "@oxygen-ui/react/Box";
import Card from "@oxygen-ui/react/Card";
import InputLabel from "@oxygen-ui/react/InputLabel";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Grid from "@oxygen-ui/react/Grid";
import Link from "@oxygen-ui/react/Link";
import Switch from "@oxygen-ui/react/Switch";
import Typography from "@oxygen-ui/react/Typography";
import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import useGetBrandingPreferenceResolve from "@wso2is/common.branding.v1/api/use-get-branding-preference-resolve";
import { BrandingPreferenceTypes } from "@wso2is/common.branding.v1/models";
import {
    PurposeDTOInterface,
    PurposeVersionSummaryDTOInterface,
    createPurpose,
    createPurposeVersion,
    isPolicyNameAvailable,
    useGetPurpose,
    useGetPurposeVersions
} from "@wso2is/common.consents.v1";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { URLUtils } from "@wso2is/core/utils";
import { FinalForm, FinalFormField, TextFieldAdapter } from "@wso2is/form";
import { ConfirmationModal, ContentLoader, Hint, Message, PrimaryButton } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, { FunctionComponent, type ReactElement } from "react";
import { Field, FieldInputProps, FormRenderProps } from "react-final-form";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { ConsentDescriptionEditor } from "./consent-description-editor";
import { ConsentDescriptionPreview } from "./consent-description-preview";
import { ConsentVersionDropdown } from "./consent-version-dropdown";

interface EditPolicyConsentProps extends IdentifiableComponentInterface {
    purposeId?: string;
}

interface PolicyFormValuesInterface {
    description: string;
    mandatory: boolean;
    name?: string;
    policyUrl: string;
}

interface PolicyFormErrorsInterface {
    name?: string;
    policyUrl?: string;
}

/**
 * Generates the next version label from the current label.
 *
 * @param currentLabel - Current version label (e.g. "1").
 * @returns Next version label (e.g. "2").
 */
const generateNextVersionLabel = (currentLabel: string): string => {
    const match: RegExpMatchArray | null = currentLabel.match(/^(\d+)$/);

    if (!match) {
        return "1";
    }

    const nextNumber: number = parseInt(match[ 1 ], 10) + 1;

    return `${ nextNumber }`;
};

const URL_PLACEHOLDERS_PATTERN: string = "\\{\\{lang\\}\\}|\\{\\{country\\}\\}|\\{\\{locale\\}\\}";

/**
 * Validates a URL that may contain templating placeholders.
 */
const validateTemplatableURL = (value: string, errorMessage: string): string | undefined => {
    const moderated: string = value?.trim().replace(new RegExp(URL_PLACEHOLDERS_PATTERN, "g"), "");

    if (moderated && (!URLUtils.isURLValid(moderated, true) || !FormValidation.url(moderated))) {
        return errorMessage;
    }

    return undefined;
};


export const EditPolicyConsent: FunctionComponent<EditPolicyConsentProps> = (
    props: EditPolicyConsentProps
): ReactElement => {
    const { purposeId } = props;

    const isCreateMode: boolean = !purposeId;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const consentsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.consents
    );
    const hasCreatePermission: boolean = useRequiredScopes(consentsFeatureConfig?.scopes?.create);
    const hasUpdatePermission: boolean = useRequiredScopes(consentsFeatureConfig?.scopes?.update);

    const {
        data: consent,
        isLoading: isPolicyInfoLoading,
        mutate: mutateConsent
    } = useGetPurpose(purposeId ?? "");
    const {
        data: consentVersions,
        isLoading: isVersionsLoading
    } = useGetPurposeVersions(purposeId ?? "");

    const {
        data: brandingPreference,
        isLoading: isBrandingLoading
    } = useGetBrandingPreferenceResolve(AppConstants.getTenant(), BrandingPreferenceTypes.ORG);

    const [ isSubmitting, setIsSubmitting ] = React.useState<boolean>(false);
    const [ showVersionWarningModal, setShowVersionWarningModal ] = React.useState<boolean>(false);
    const pendingValues: React.MutableRefObject<PolicyFormValuesInterface | null> =
        React.useRef<PolicyFormValuesInterface | null>(null);

    const brandingPolicyUrl: string = React.useMemo((): string => {
        if (!brandingPreference) {
            return "";
        }

        if (consent?.name === "privacy_policy") {
            return brandingPreference.preference.urls.privacyPolicyURL;
        } else if (consent?.name === "terms_and_conditions") {
            return brandingPreference.preference.urls.termsOfUseURL;
        } else if (consent?.name === "cookie_policy") {
            return brandingPreference.preference.urls.cookiePolicyURL;
        }

        return "";
    }, [ brandingPreference, consent ]);

    const initialValues: PolicyFormValuesInterface | null = React.useMemo(
        (): PolicyFormValuesInterface | null => {
            if (isCreateMode) {
                return {
                    description: "",
                    mandatory: false,
                    name: "",
                    policyUrl: ""
                };
            }

            if (!consent) {
                return null;
            }

            return {
                description: consent.description ?? "",
                mandatory: consent.mandatory ?? false,
                policyUrl: consent.policyUrl ?? brandingPolicyUrl
            };
        }, [ isCreateMode, consent, brandingPolicyUrl ]);

    const sortedConsentVersions: PurposeVersionSummaryDTOInterface[] = React.useMemo(
        (): PurposeVersionSummaryDTOInterface[] => {
            if (!consentVersions) {
                return [];
            }

            return [ ...consentVersions ].sort(
                (a: PurposeVersionSummaryDTOInterface, b: PurposeVersionSummaryDTOInterface): number => {
                    const aVersionNumber: number = Number.parseInt(a.version, 10);
                    const bVersionNumber: number = Number.parseInt(b.version, 10);
                    const areBothNumeric: boolean = !Number.isNaN(aVersionNumber) && !Number.isNaN(bVersionNumber);

                    if (areBothNumeric) {
                        return bVersionNumber - aVersionNumber;
                    }

                    return b.version.localeCompare(a.version);
                }
            );
        }, [ consentVersions ]);

    /**
     * Validates the create form fields.
     */
    const validateCreateForm = async (values: PolicyFormValuesInterface): Promise<PolicyFormErrorsInterface> => {
        const errors: PolicyFormErrorsInterface = {};

        if (!values?.name?.trim()) {
            errors.name = t("common:required");
        } else {
            try {
                const isAvailable: boolean = await isPolicyNameAvailable(values.name);

                if (!isAvailable) {
                    errors.name = t("consents:form.name.error.duplicateName");
                }
            } catch {
                // Let the API error surface during submission
            }
        }

        if (!values?.policyUrl?.trim()) {
            errors.policyUrl = t("common:required");
        }

        return errors;
    };

    /**
     * Creates a new purpose.
     *
     * @param values - Form values containing name, policy URL, description and consent flag.
     */
    const createNewPurpose = (values: PolicyFormValuesInterface): void => {
        setIsSubmitting(true);

        createPurpose(values.name, values.policyUrl ?? "", values.description, values.mandatory)
            .then((created: PurposeDTOInterface): void => {
                dispatch(addAlert({
                    description: t("consents:notifications.create.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("consents:notifications.create.success.message")
                }));
                history.replace(
                    AppConstants.getPaths().get("POLICY_CONSENTS_EDIT").replace(":id", created.id)
                );
            })
            .catch((error: IdentityAppsApiException): void => {
                const status: number = error?.response?.status;
                let description: string;
                let message: string;

                switch (status) {
                    case 409:
                        description = t("consents:notifications.create.error.conflict.description");
                        message = t("consents:notifications.create.error.conflict.message");

                        break;
                    case 404:
                        description = t("consents:notifications.create.error.notFound.description");
                        message = t("consents:notifications.create.error.notFound.message");

                        break;
                    default:
                        if (status >= 500) {
                            description = t("consents:notifications.create.error.serverError.description");
                            message = t("consents:notifications.create.error.serverError.message");
                        } else {
                            description = t("consents:notifications.create.error.description");
                            message = t("consents:notifications.create.error.message");
                        }
                }

                dispatch(addAlert({
                    description,
                    level: AlertLevels.ERROR,
                    message
                }));
            })
            .finally((): void => {
                setIsSubmitting(false);
            });
    };

    /**
     * Creates a new purpose version with the updated policy URL, promoted as latest in a single call.
     *
     * @param values - Form values containing the new policy URL.
     */
    const updatePolicyInfo = (values: PolicyFormValuesInterface): void => {
        setIsSubmitting(true);

        const nextLabel: string = generateNextVersionLabel(consent.version ?? "1");

        createPurposeVersion(purposeId, nextLabel, values.description, values.policyUrl, values.mandatory)
            .then((): void => {
                dispatch(addAlert({
                    description: t("consents:notifications.updatePolicy.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("consents:notifications.updatePolicy.success.message")
                }));
                mutateConsent();
            })
            .catch((error: IdentityAppsApiException): void => {
                const status: number = error?.response?.status;
                let description: string;
                let message: string;

                switch (status) {
                    case 404:
                        description = t("consents:notifications.updatePolicy.error.notFound.description");
                        message = t("consents:notifications.updatePolicy.error.notFound.message");

                        break;
                    case 409:
                        description = t("consents:notifications.updatePolicy.error.conflict.description");
                        message = t("consents:notifications.updatePolicy.error.conflict.message");

                        break;
                    default:
                        if (status >= 500) {
                            description = t("consents:notifications.updatePolicy.error.serverError.description");
                            message = t("consents:notifications.updatePolicy.error.serverError.message");
                        } else {
                            description = t("consents:notifications.updatePolicy.error.description");
                            message = t("consents:notifications.updatePolicy.error.message");
                        }
                }

                dispatch(addAlert({
                    description,
                    level: AlertLevels.ERROR,
                    message
                }));
            })
            .finally((): void => {
                setIsSubmitting(false);
            });
    };

    const isLoading: boolean = !isCreateMode && (isPolicyInfoLoading || isBrandingLoading || isVersionsLoading);
    const registrationFlowBuilderPath: string = AppConstants.getPaths().get("REGISTRATION_FLOW_BUILDER");

    const handleRegFlowBuilderClick = (): void => {
        history.push(registrationFlowBuilderPath);
    };

    return (
        <>
            <Card className="p-0 mb-5">
                <Grid container>
                    <Grid
                        xs={ 8 }
                        sx={ {
                            borderBottom: "1px solid var(--oxygen-palette-divider)",
                            borderRight: "1px solid var(--oxygen-palette-divider)"
                        } }
                        className="p-3"
                    >
                        <Typography>
                            { t("consents:tabs.content.label") }
                        </Typography>
                    </Grid>
                    <Grid
                        xs={ 4 }
                        sx={ { borderBottom: "1px solid var(--oxygen-palette-divider)" } }
                        className="p-3"
                    >
                        <Typography>
                            { t("consents:tabs.preview.label") }
                        </Typography>
                    </Grid>
                </Grid>
                {
                    isLoading ? <ContentLoader /> : (
                        <FinalForm
                            key={ isCreateMode ? "create" : consent?.version }
                            onSubmit={ (values: PolicyFormValuesInterface) => {
                                if (isCreateMode) {
                                    createNewPurpose(values);
                                } else {
                                    pendingValues.current = values;
                                    setShowVersionWarningModal(true);
                                }
                            } }
                            validate={ isCreateMode ? validateCreateForm : undefined }
                            initialValues={ initialValues }
                            render={ ({
                                handleSubmit: _handleSubmit,
                                values: _values
                            }: FormRenderProps & { values: PolicyFormValuesInterface }) => {
                                const isUnchanged: boolean = !isCreateMode && (
                                    (_values?.policyUrl ?? "") === (initialValues?.policyUrl ?? "") &&
                                    (_values?.description ?? "") === (initialValues?.description ?? "")
                                );

                                return (
                                    <form onSubmit={ _handleSubmit }>
                                        <Grid container>
                                            { /* ── Form column ── */ }
                                            <Grid
                                                xs={ 8 }
                                                padding={ 2 }
                                                sx={ {
                                                    borderBottom: "1px solid var(--oxygen-palette-divider)",
                                                    borderRight: "1px solid var(--oxygen-palette-divider)"
                                                } }
                                            >
                                                {
                                                    !isCreateMode
                                                    && !isPolicyInfoLoading
                                                    && !isBrandingLoading
                                                    && !isVersionsLoading
                                                    && consent?.version !== undefined
                                                    && (
                                                        <ConsentVersionDropdown
                                                            currentVersion={ consent.version }
                                                            versions={ sortedConsentVersions }
                                                        />
                                                    )
                                                }
                                                <Box sx={ { display: "flex", flexDirection: "column", gap: 2 } }>
                                                    { isCreateMode && (
                                                        <Box>
                                                            <FinalFormField
                                                                name="name"
                                                                label={ t("consents:form.name.label") }
                                                                placeholder={
                                                                    t("consents:form.name.placeholder")
                                                                }
                                                                required
                                                                type="text"
                                                                component={ TextFieldAdapter }
                                                            />
                                                        </Box>
                                                    ) }
                                                    <Box>
                                                        <FinalFormField
                                                            name="policyUrl"
                                                            label={ t("consents:form.policyUrl.label") }
                                                            type="text"
                                                            component={ TextFieldAdapter }
                                                            required
                                                            placeholder={
                                                                t(
                                                                    "extensions:develop.branding.forms" +
                                                                    ".advance.links.fields" +
                                                                    ".privacyPolicyURL.placeholder"
                                                                )
                                                            }
                                                            validate={ isCreateMode
                                                                ? undefined
                                                                : (value: string) =>
                                                                    validateTemplatableURL(
                                                                        value,
                                                                        t(
                                                                            "extensions:develop.branding" +
                                                                            ".forms.advance.links.fields" +
                                                                            ".common.validations.invalid"
                                                                        )
                                                                    )
                                                            }
                                                        />
                                                        <Hint>
                                                            { t("consents:form.policyUrl.hint") }
                                                        </Hint>
                                                    </Box>
                                                    <Box>
                                                        <InputLabel>
                                                            { t("consents:form.description.label") }
                                                        </InputLabel>
                                                        <Field
                                                            name="description"
                                                            subscription={ { value: true } }
                                                            render={ (
                                                                { input }: { input: FieldInputProps<string> }
                                                            ) => (
                                                                <ConsentDescriptionEditor
                                                                    value={ input.value ?? "" }
                                                                    onChange={ input.onChange }
                                                                    policyUrl={ _values?.policyUrl }
                                                                    policyName={
                                                                        isCreateMode
                                                                            ? _values?.name
                                                                            : consent?.name
                                                                    }
                                                                />
                                                            ) }
                                                        />
                                                    </Box>
                                                    <Field
                                                        name="mandatory"
                                                        subscription={ { value: true } }
                                                        render={ (
                                                            { input }: { input: FieldInputProps<boolean> }
                                                        ) => (
                                                            <Box>
                                                                <FormControlLabel
                                                                    disabled={ !isCreateMode }
                                                                    control={ (
                                                                        <Switch
                                                                            name={ input.name }
                                                                            checked={ input.value ?? false }
                                                                            onChange={ (
                                                                                e: React.ChangeEvent<HTMLInputElement>
                                                                            ) => {
                                                                                input.onChange(e.target.checked);
                                                                            } }
                                                                            disabled={ !isCreateMode }
                                                                        />
                                                                    ) }
                                                                    label={ t("consents:form.mandatory.label") }
                                                                    sx={ { mr: 0 } }
                                                                />
                                                                <Hint>
                                                                    { t("consents:form.mandatory.hint") }
                                                                </Hint>
                                                                { !isCreateMode && (
                                                                    <Message
                                                                        type="info"
                                                                        content={ (
                                                                            <Trans
                                                                                i18nKey=
                                                                                    "consents:form.mandatory.linkHint"
                                                                            >
                                                                                <Link
                                                                                    onClick={
                                                                                        handleRegFlowBuilderClick
                                                                                    }
                                                                                    sx={ { cursor: "pointer" } }
                                                                                >
                                                                                    this link
                                                                                </Link>
                                                                            </Trans>
                                                                        ) }
                                                                    />
                                                                ) }
                                                            </Box>
                                                        ) }
                                                    />
                                                </Box>
                                            </Grid>
                                            { /* Preview column */ }
                                            <Grid
                                                xs={ 4 }
                                                display={ "flex" }
                                                flexDirection={ "column" }
                                                sx={ { borderBottom: "1px solid var(--oxygen-palette-divider)" } }
                                            >
                                                <Message
                                                    type="info"
                                                    className="mb-0"
                                                    content = { t("consents:wizard.create.preview.appLoginMessage") }
                                                />
                                                <ConsentDescriptionPreview
                                                    description={ _values?.description ?? "" }
                                                    mandatory={ _values?.mandatory ?? false }
                                                    policyName={ isCreateMode ? _values?.name : consent?.name }
                                                    policyUrl={ _values?.policyUrl }
                                                />
                                            </Grid>
                                            <Grid xs={ 12 } padding={ 2 }>
                                                {
                                                    !isCreateMode && (
                                                        <Hint>
                                                            { t("consents:form.policyUrl.versionHint") }
                                                        </Hint>
                                                    )
                                                }
                                                { (isCreateMode ? hasCreatePermission : hasUpdatePermission) && (
                                                    <PrimaryButton
                                                        type="submit"
                                                        loading={ isSubmitting }
                                                        disabled={ isUnchanged }
                                                    >
                                                        { isCreateMode
                                                            ? t("common:create")
                                                            : t("consents:form.createNewVersion")
                                                        }
                                                    </PrimaryButton>
                                                ) }
                                            </Grid>
                                        </Grid>
                                    </form>
                                );
                            } }
                        />
                    )
                }
            </Card>
            <ConfirmationModal
                onClose={ () => setShowVersionWarningModal(false) }
                type="warning"
                open={ showVersionWarningModal }
                primaryAction={ t("consents:form.versionModal.primaryAction") }
                secondaryAction={ t("consents:form.versionModal.secondaryAction") }
                onSecondaryActionClick={ () => setShowVersionWarningModal(false) }
                onPrimaryActionClick={ () => {
                    setShowVersionWarningModal(false);
                    updatePolicyInfo(pendingValues.current);
                } }
                closeOnDimmerClick={ false }
                primaryActionLoading={ isSubmitting }
            >
                <ConfirmationModal.Header>
                    { t("consents:form.versionModal.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message attached negative>
                    { t("consents:form.versionModal.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content>
                    { t("consents:form.versionModal.content") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};
