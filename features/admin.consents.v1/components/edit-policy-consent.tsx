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
import Code from "@oxygen-ui/react/Code";
import Checkbox from "@oxygen-ui/react/Checkbox";
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
import { updateBrandingPreference } from "@wso2is/admin.branding.v1/api/branding-preferences";
import { BrandingPreferencesConstants } from "@wso2is/admin.branding.v1/constants/branding-preferences-constants";
import useGetBrandingPreference from "@wso2is/common.branding.v1/api/use-get-branding-preference";
import useGetBrandingPreferenceResolve from "@wso2is/common.branding.v1/api/use-get-branding-preference-resolve";
import { BrandingPreferenceInterface, BrandingPreferenceTypes } from "@wso2is/common.branding.v1/models";
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
import { FinalForm, FinalFormField, TextFieldAdapter } from "@wso2is/forms";
import { ConfirmationModal, ContentLoader, Hint, Message, PrimaryButton } from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import React, {
    FunctionComponent,
    MutableRefObject,
    type ReactElement,
    useCallback,
    useMemo,
    useRef,
    useState
} from "react";
import { Field, FieldInputProps, FormRenderProps } from "react-final-form";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { ConsentDescriptionEditor } from "./consent-description-editor";
import { PolicyConsentPreview } from "./policy-consent-preview";
import { ConsentVersionDropdown } from "./consent-version-dropdown";

interface EditPolicyConsentProps extends IdentifiableComponentInterface {
    defaultName?: string;
    isDefault?: boolean;
    purposeId?: string;
    readOnly?: boolean;
}

interface PolicyFormValuesInterface {
    description: string;
    mandatory: boolean;
    name?: string;
    policyUrl: string;
    promptOnLogin: string;
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
    const { purposeId, defaultName, isDefault = false, readOnly = false } = props;

    const isCreateMode: boolean = !purposeId;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const consentsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.consents
    );
    const serverOrigin: string = useSelector(
        (state: AppState) => state?.config?.deployment?.serverOrigin ?? ""
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
        isLoading: isVersionsLoading,
        mutate: mutateVersions
    } = useGetPurposeVersions(purposeId ?? "");

    const {
        data: brandingPreference,
        isLoading: isBrandingLoading,
        mutate: mutateBranding
    } = useGetBrandingPreferenceResolve(
        isCreateMode ? AppConstants.getTenant() : null,
        BrandingPreferenceTypes.ORG
    );

    const { error: brandingPreferenceError } = useGetBrandingPreference(
        AppConstants.getTenant(), BrandingPreferenceTypes.ORG
    );

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ showVersionWarningModal, setShowVersionWarningModal ] = useState<boolean>(false);
    const [ modalPromptOnLogin, setModalPromptOnLogin ] = useState<boolean>(false);
    const pendingValues: MutableRefObject<PolicyFormValuesInterface | null> =
        useRef<PolicyFormValuesInterface | null>(null);
    const nameValidationTokenRef: MutableRefObject<number> = useRef<number>(0);

    const brandingPolicyUrl: string = useMemo((): string => {
        if (!brandingPreference) {
            return "";
        }

        const policyName: string | undefined = consent?.name ?? defaultName;

        if (policyName === "Privacy Policy") {
            return brandingPreference.preference.urls.privacyPolicyURL
                || `${serverOrigin}/authenticationendpoint/privacy_policy.do`;
        } else if (policyName === "Terms of Service") {
            return brandingPreference.preference.urls.termsOfUseURL
                || "https://wso2.com/terms-of-use/";
        } else if (policyName === "Cookie Policy") {
            return brandingPreference.preference.urls.cookiePolicyURL
                || `${serverOrigin}/authenticationendpoint/cookie_policy.do`;
        }

        return "";
    }, [ brandingPreference, consent, defaultName, serverOrigin ]);

    const initialValues: PolicyFormValuesInterface | null = useMemo(
        (): PolicyFormValuesInterface | null => {
            if (isCreateMode) {
                return {
                    description: "",
                    mandatory: false,
                    name: defaultName ?? "",
                    policyUrl: brandingPolicyUrl,
                    promptOnLogin: "false"
                };
            }

            if (!consent) {
                return null;
            }

            return {
                description: consent.description ?? "",
                mandatory: consent.mandatory ?? false,
                policyUrl: consent.policyUrl ?? brandingPolicyUrl,
                promptOnLogin: consent.promptOnLogin ?? "false"
            };
        }, [ isCreateMode, consent, brandingPolicyUrl, defaultName ]);

    const sortedConsentVersions: PurposeVersionSummaryDTOInterface[] = useMemo(
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
     * Debounced field-level async validator for the policy name.
     * Uses a token to discard stale results from previous in-flight checks.
     */
    const validateName: (_: string) => Promise<string | undefined> | string | undefined =
        useCallback((value: string): Promise<string | undefined> | string | undefined => {
            if (!value?.trim()) {
                return t("common:required");
            }

            const token: number = ++nameValidationTokenRef.current;

            return new Promise<string | undefined>((resolve: (_: string | undefined) => void): void => {
                setTimeout(async (): Promise<void> => {
                    if (token !== nameValidationTokenRef.current) {
                        resolve(undefined);

                        return;
                    }

                    try {
                        const isAvailable: boolean = await isPolicyNameAvailable(value.trim());

                        resolve(
                            token === nameValidationTokenRef.current && !isAvailable
                                ? t("consents:policyConsents.form.name.error.duplicateName")
                                : undefined
                        );
                    } catch {
                        resolve(undefined);
                    }
                }, 500);
            });
        }, [ t ]);

    /**
     * Validates the create form fields (synchronous — name uniqueness is checked by validateName).
     */
    const validateCreateForm = (values: PolicyFormValuesInterface): PolicyFormErrorsInterface => {
        const errors: PolicyFormErrorsInterface = {};

        if (!values?.policyUrl?.trim()) {
            errors.policyUrl = t("common:required");
        } else {
            const urlValidationError: string | undefined = validateTemplatableURL(
                values.policyUrl,
                t(
                    "extensions:develop.branding" +
                    ".forms.advance.links.fields" +
                    ".common.validations.invalid"
                )
            );

            if (urlValidationError) {
                errors.policyUrl = urlValidationError;
            }
        }

        return errors;
    };

    /**
     * Creates a new purpose.
     *
     * @param values - Form values containing name, policy URL, description, consent flag, and promptOnLogin.
     */
    const createNewPurpose = (values: PolicyFormValuesInterface): void => {
        setIsSubmitting(true);

        createPurpose(
            values.name?.trim() ?? "",
            values.policyUrl?.trim() ?? "",
            values.description,
            values.mandatory,
            String(modalPromptOnLogin)
        )
            .then((created: PurposeDTOInterface): void => {
                dispatch(addAlert({
                    description: t("consents:policyConsents.notifications.create.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("consents:policyConsents.notifications.create.success.message")
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
                        description = t("consents:policyConsents.notifications.create.error.conflict.description");
                        message = t("consents:policyConsents.notifications.create.error.conflict.message");

                        break;
                    case 404:
                        description = t("consents:policyConsents.notifications.create.error.notFound.description");
                        message = t("consents:policyConsents.notifications.create.error.notFound.message");

                        break;
                    default:
                        if (status >= 500) {
                            description = t("consents:policyConsents.notifications.create.error.serverError.description");
                            message = t("consents:policyConsents.notifications.create.error.serverError.message");
                        } else {
                            description = t("consents:policyConsents.notifications.create.error.description");
                            message = t("consents:policyConsents.notifications.create.error.message");
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
     * Updates the branding preference URL for a default policy (Privacy Policy or Terms of Service).
     */
    const updateDefaultPolicyUrl = (values: PolicyFormValuesInterface): void => {
        if (!brandingPreference) {
            return;
        }

        const updatedUrls: BrandingPreferenceInterface["urls"] = { ...brandingPreference.preference.urls };
        const policyName: string = consent?.name ?? defaultName ?? "";

        if (policyName === "Privacy Policy") {
            updatedUrls.privacyPolicyURL = values.policyUrl?.trim() ?? "";
        } else if (policyName === "Terms of Service") {
            updatedUrls.termsOfUseURL = values.policyUrl?.trim() ?? "";
        } else if (policyName === "Cookie Policy") {
            updatedUrls.cookiePolicyURL = values.policyUrl?.trim() ?? "";
        }

        const updatedPreference: BrandingPreferenceInterface = {
            ...brandingPreference.preference,
            urls: updatedUrls
        };

        const isBrandingPersisted: boolean =
            brandingPreferenceError?.response?.data?.code
            !== BrandingPreferencesConstants.BRANDING_NOT_CONFIGURED_ERROR_CODE;

        updateBrandingPreference(
            isBrandingPersisted,
            AppConstants.getTenant(),
            updatedPreference,
            BrandingPreferenceTypes.ORG
        )
            .then((): void => {
                mutateBranding();
            })
            .catch((): void => {
                // Branding update is best-effort; proceed with purpose creation on failure.
            });
    };

    /**
     * Creates a new purpose version with the updated policy URL, promoted as latest in a single call.
     *
     * @param values - Form values containing the new policy URL and description.
     */
    const updatePolicyInfo = (values: PolicyFormValuesInterface): void => {
        setIsSubmitting(true);

        const nextLabel: string = generateNextVersionLabel(consent.version ?? "1");

        createPurposeVersion(
            purposeId,
            nextLabel,
            values.description,
            values.policyUrl,
            values.mandatory,
            String(modalPromptOnLogin)
        )
            .then((): void => {
                dispatch(addAlert({
                    description: t("consents:policyConsents.notifications.update.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("consents:policyConsents.notifications.update.success.message")
                }));
                mutateConsent();
                mutateVersions();
            })
            .catch((error: IdentityAppsApiException): void => {
                const status: number = error?.response?.status;
                let description: string;
                let message: string;

                switch (status) {
                    case 404:
                        description = t("consents:policyConsents.notifications.update.error.notFound.description");
                        message = t("consents:policyConsents.notifications.update.error.notFound.message");

                        break;
                    case 409:
                        description = t("consents:policyConsents.notifications.update.error.conflict.description");
                        message = t("consents:policyConsents.notifications.update.error.conflict.message");

                        break;
                    default:
                        if (status >= 500) {
                            description = t("consents:policyConsents.notifications.update.error.serverError.description");
                            message = t("consents:policyConsents.notifications.update.error.serverError.message");
                        } else {
                            description = t("consents:policyConsents.notifications.update.error.description");
                            message = t("consents:policyConsents.notifications.update.error.message");
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

    const isBrandingEnabled: boolean = !isBrandingLoading &&
        (brandingPreference?.preference?.configs?.isBrandingEnabled ?? false);

    const isEffectivelyReadOnly: boolean = readOnly || (isDefault && !isBrandingLoading && !isBrandingEnabled);

    const isLoading: boolean = !isCreateMode && (isPolicyInfoLoading || isBrandingLoading || isVersionsLoading);
    const registrationFlowBuilderPath: string = AppConstants.getPaths().get("REGISTRATION_FLOW_BUILDER");

    const handleRegFlowBuilderClick = (): void => {
        history.push(registrationFlowBuilderPath);
    };

    return (
        <>
            { isDefault && !isBrandingLoading && !isBrandingEnabled && (
                <Message warning className="mb-5">
                    <Trans i18nKey="consents:policyConsents.pages.list.brandingRequired">
                        Enable branding to update default policies.{ " " }
                        <Link onClick={ (): void => history.push(AppConstants.getPaths().get("BRANDING")) }>
                            Go to Branding
                        </Link>
                    </Trans>
                </Message>
            ) }
            <Card className="p-0 mb-5">
                <Grid container sx={ { display: { md: "flex", xs: "none" } } }>
                    <Grid
                        md={ 6 }
                        lg={ 8 }
                        sx={ {
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            borderRight: "1px solid",
                            borderRightColor: "divider"
                        } }
                        className="p-3"
                    >
                        <Typography>
                            { t("consents:tabs.content.label") }
                        </Typography>
                    </Grid>
                    <Grid
                        md={ 6 }
                        lg={ 4 }
                        sx={ { borderBottom: "1px solid", borderColor: "divider" } }
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
                                pendingValues.current = values;
                                setModalPromptOnLogin(
                                    isCreateMode ? false : values.promptOnLogin === "true"
                                );
                                setShowVersionWarningModal(true);
                            } }
                            validate={ isCreateMode ? validateCreateForm : undefined }
                            initialValues={ initialValues }
                            render={ ({
                                handleSubmit: _handleSubmit,
                                values: _values
                            }: FormRenderProps & { values: PolicyFormValuesInterface }) => {
                                const isUnchanged: boolean = !isCreateMode && (
                                    (_values?.policyUrl ?? "") === (initialValues?.policyUrl ?? "") &&
                                    (_values?.description ?? "") === (initialValues?.description ?? "") &&
                                    (_values?.mandatory ?? false) === (initialValues?.mandatory ?? false)
                                );

                                return (
                                    <form onSubmit={ _handleSubmit }>
                                        <Grid container>
                                            { /* ── Form column ── */ }
                                            <Grid
                                                xs={ 12 }
                                                md={ 6 }
                                                lg={ 8 }
                                                padding={ 2 }
                                                sx={ {
                                                    borderBottom: "1px solid",
                                                    borderColor: "divider",
                                                    borderRight: { md: "1px solid", xs: "none" },
                                                    borderRightColor: { md: "divider" }
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
                                                    { isCreateMode && !defaultName && (
                                                        <Box>
                                                            <FinalFormField
                                                                name="name"
                                                                label={ t("consents:policyConsents.form.name.label") }
                                                                placeholder={
                                                                    t("consents:policyConsents.form.name.placeholder")
                                                                }
                                                                required
                                                                type="text"
                                                                component={ TextFieldAdapter }
                                                                validate={ validateName }
                                                                disabled={ isEffectivelyReadOnly }
                                                            />
                                                        </Box>
                                                    ) }
                                                    <Box>
                                                        <FinalFormField
                                                            name="policyUrl"
                                                            label={ t("consents:policyConsents.form.policyUrl.label") }
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
                                                            disabled={ isEffectivelyReadOnly }
                                                        />
                                                        <Hint>
                                                            <Trans
                                                                i18nKey="consents:policyConsents.form.policyUrl.hint"
                                                            >
                                                                Link to the full policy document. You can use
                                                                placeholders like
                                                                <Code>&#123;&#123;lang&#125;&#125;</Code>,
                                                                <Code>&#123;&#123;country&#125;&#125;</Code>,
                                                                or <Code>&#123;&#123;locale&#125;&#125;</Code>
                                                                to customize the URL for different regions or languages.
                                                            </Trans>
                                                        </Hint>
                                                    </Box>
                                                    <Box>
                                                        <InputLabel>
                                                            { t("consents:policyConsents.form.description.label") }
                                                        </InputLabel>
                                                        <Field
                                                            name="description"
                                                            subscription={ { value: true } }
                                                            render={ (
                                                                { input }: { input: FieldInputProps<string> }
                                                            ) => {
                                                                const i18nMatch: RegExpExecArray | null =
                                                                    /^\{\{([^}]+)\}\}$/.exec(input.value ?? "");

                                                                return (
                                                                    <ConsentDescriptionEditor
                                                                        value={ i18nMatch ? "" : (input.value ?? "") }
                                                                        onChange={ input.onChange }
                                                                        policyUrl={ _values?.policyUrl }
                                                                        policyName={
                                                                            isCreateMode
                                                                                ? _values?.name
                                                                                : consent?.name
                                                                        }
                                                                        i18nKey={
                                                                            i18nMatch ? i18nMatch[1] : undefined
                                                                        }
                                                                        onI18nKeyChange={
                                                                            (key: string | null) => {
                                                                                input.onChange(
                                                                                    key ? `{{${key}}}` : ""
                                                                                );
                                                                            }
                                                                        }
                                                                        variant="policy"
                                                                        disabled={ isEffectivelyReadOnly }
                                                                    />
                                                                );
                                                            } }
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
                                                                    control={ (
                                                                        <Switch
                                                                            name={ input.name }
                                                                            checked={ input.value ?? false }
                                                                            onChange={ ( e:
                                                                                React.ChangeEvent<HTMLInputElement>
                                                                            ) => {
                                                                                input.onChange(e.target.checked);
                                                                            } }
                                                                            disabled={ isEffectivelyReadOnly }
                                                                        />
                                                                    ) }
                                                                    label={ t("consents:policyConsents.form.mandatory.label") }
                                                                    sx={ { mr: 0 } }
                                                                />
                                                                <Hint>
                                                                    { t("consents:policyConsents.form.mandatory.hint") }
                                                                </Hint>
                                                            </Box>
                                                        ) }
                                                    />
                                                    <Box>
                                                        { !isCreateMode && consent?.promptOnLogin === "true" && (
                                                            <Message
                                                                type="info"
                                                                content={ t("consents:policyConsents.form.promptOnLogin.activeHint") }
                                                            />
                                                        ) }
                                                        { !isCreateMode && (
                                                            <Message
                                                                type="info"
                                                                content={ (
                                                                    <Trans
                                                                        i18nKey=
                                                                            "consents:policyConsents.form.mandatory.linkHint"
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
                                                </Box>
                                            </Grid>
                                            { /* Preview column */ }
                                            <Grid
                                                xs={ 12 }
                                                md={ 6 }
                                                lg={ 4 }
                                                display={ "flex" }
                                                flexDirection={ "column" }
                                                sx={ { borderBottom: "1px solid", borderColor: "divider" } }
                                            >
                                                <PolicyConsentPreview
                                                    data-componentid="policy-consent-preview"
                                                    description={ _values?.description ?? "" }
                                                    mandatory={ _values?.mandatory ?? false }
                                                    policyName={ isCreateMode ? _values?.name : consent?.name }
                                                />
                                            </Grid>
                                            { (isCreateMode ? hasCreatePermission : hasUpdatePermission)
                                                && !isEffectivelyReadOnly && (
                                                <Grid xs={ 12 } padding={ 2 }>
                                                    { !isCreateMode && (
                                                        <Hint>
                                                            { t(
                                                                "consents:policyConsents.form" +
                                                                ".policyUrl.versionHint"
                                                            ) }
                                                        </Hint>
                                                    ) }
                                                    <PrimaryButton
                                                        type="submit"
                                                        loading={ isSubmitting }
                                                        disabled={
                                                            isUnchanged || (isCreateMode && isBrandingLoading)
                                                        }
                                                    >
                                                        { isCreateMode
                                                            ? t("common:create")
                                                            : t("consents:policyConsents.form.createNewVersion")
                                                        }
                                                    </PrimaryButton>
                                                </Grid>
                                            ) }
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
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ () => setShowVersionWarningModal(false) }
                onPrimaryActionClick={ () => {
                    setShowVersionWarningModal(false);
                    if (pendingValues.current) {
                        if (isDefault) {
                            updateDefaultPolicyUrl(pendingValues.current);
                        }
                        if (isCreateMode) {
                            createNewPurpose(pendingValues.current);
                        } else {
                            updatePolicyInfo(pendingValues.current);
                        }
                    }
                } }
                closeOnDimmerClick={ false }
                primaryActionLoading={ isSubmitting }
            >
                <ConfirmationModal.Header>
                    { isCreateMode
                        ? t("consents:policyConsents.form.createModal.header")
                        : t("consents:policyConsents.form.versionModal.createNewVersion")
                    }
                </ConfirmationModal.Header>
                <ConfirmationModal.Content>
                    { isCreateMode
                        ? t("consents:policyConsents.form.createModal.promptDescription")
                        : t("consents:policyConsents.form.versionModal.promptDescription")
                    }
                    <Box sx={ { mt: 2 } }>
                        <FormControlLabel
                            control={ (
                                <Checkbox
                                    checked={ modalPromptOnLogin }
                                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) => {
                                        setModalPromptOnLogin(e.target.checked);
                                    } }
                                />
                            ) }
                            label={ isCreateMode
                                ? t("consents:policyConsents.form.createModal.promptAtLogin")
                                : t("consents:policyConsents.form.versionModal.promptAtLogin")
                            }
                            sx={ { mr: 0 } }
                        />
                    </Box>
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};
