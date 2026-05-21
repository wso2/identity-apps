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

import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Box from "@oxygen-ui/react/Box";
import Card from "@oxygen-ui/react/Card";
import Grid from "@oxygen-ui/react/Grid";
import InputLabel from "@oxygen-ui/react/InputLabel";
import Link from "@oxygen-ui/react/Link";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { useRequiredScopes } from "@wso2is/access-control";
import useGetAllLocalClaims from "@wso2is/admin.claims.v1/api/use-get-all-local-claims";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    NewElementBindingInterface,
    PurposeDTOInterface,
    PurposeElementDTOInterface,
    PurposeVersionSummaryDTOInterface,
    createMarketingPurpose,
    createMarketingPurposeVersion,
    isPolicyNameAvailable,
    useGetPurpose,
    useGetPurposeVersions
} from "@wso2is/common.consents.v1";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, Claim, ClaimsGetParams, FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, TextFieldAdapter } from "@wso2is/forms";
import { ConfirmationModal, ContentLoader, Hint, Message, PrimaryButton } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    MutableRefObject,
    type ReactElement,
    SyntheticEvent,
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
import { MarketingConsentPreview } from "./marketing-consent-preview";
import { ConsentVersionDropdown } from "./consent-version-dropdown";

interface EditMarketingConsentProps extends IdentifiableComponentInterface {
    purposeId?: string;
}

interface MarketingFormValuesInterface {
    attributes: Claim[];
    description: string;
    name?: string;
}

const CLAIMS_PARAMS: ClaimsGetParams = {
    "exclude-hidden-claims": true,
    "exclude-identity-claims": true,
    filter: null,
    limit: null,
    offset: null,
    sort: null
};

interface MarketingFormErrorsInterface {
    name?: string;
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

export const EditMarketingConsent: FunctionComponent<EditMarketingConsentProps> = (
    props: EditMarketingConsentProps
): ReactElement => {
    const { purposeId } = props;

    const isCreateMode: boolean = !purposeId;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const marketingConsentsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.consents
    );
    const hasCreatePermission: boolean = useRequiredScopes(marketingConsentsFeatureConfig?.scopes?.create);
    const hasUpdatePermission: boolean = useRequiredScopes(marketingConsentsFeatureConfig?.scopes?.update);

    const {
        data: consent,
        isLoading: isConsentInfoLoading,
        mutate: mutateConsent
    } = useGetPurpose(purposeId ?? "");
    const {
        data: consentVersions,
        isLoading: isVersionsLoading,
        mutate: mutateVersions
    } = useGetPurposeVersions(purposeId ?? "");
    const {
        data: claims,
        isLoading: isClaimsLoading
    } = useGetAllLocalClaims<Claim[]>(CLAIMS_PARAMS);

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ showVersionWarningModal, setShowVersionWarningModal ] = useState<boolean>(false);
    const pendingValues: MutableRefObject<MarketingFormValuesInterface | null> =
        useRef<MarketingFormValuesInterface | null>(null);
    const nameValidationTokenRef: MutableRefObject<number> = useRef<number>(0);

    const initialValues: MarketingFormValuesInterface | null = useMemo(
        (): MarketingFormValuesInterface | null => {
            if (isCreateMode) {
                return {
                    attributes: [],
                    description: "",
                    name: ""
                };
            }

            if (!consent) {
                return null;
            }

            const prePopulatedAttributes: Claim[] = (consent.elements ?? [])
                .map((el: PurposeElementDTOInterface): Claim | undefined =>
                    (claims ?? []).find((c: Claim): boolean => c.claimURI === el.name)
                )
                .filter((c: Claim | undefined): c is Claim => c !== undefined);

            return {
                attributes: prePopulatedAttributes,
                description: consent.description ?? ""
            };
        }, [ isCreateMode, consent, claims ]);

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
     * Debounced field-level async validator for the marketing consent name.
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
                                ? t("consents:marketingConsents.form.name.error.duplicateName")
                                : undefined
                        );
                    } catch {
                        resolve(undefined);
                    }
                }, 500);
            });
        }, [ t ]);

    const registrationFlowBuilderPath: string = AppConstants.getPaths().get("REGISTRATION_FLOW_BUILDER");

    const handleRegFlowBuilderClick = (): void => {
        history.push(registrationFlowBuilderPath);
    };

    /**
     * Creates a new marketing consent purpose.
     */
    const createNewMarketingConsent = (values: MarketingFormValuesInterface): void => {
        setIsSubmitting(true);

        const attributeElements: NewElementBindingInterface[] = (values.attributes ?? []).map(
            (attr: Claim): NewElementBindingInterface => ({
                description: attr.description,
                displayName: attr.displayName,
                name: attr.claimURI
            })
        );

        createMarketingPurpose(
            values.name?.trim() ?? "",
            values.description,
            attributeElements.length > 0 ? attributeElements : undefined
        )
            .then((created: PurposeDTOInterface): void => {
                dispatch(addAlert({
                    description: t("consents:marketingConsents.notifications.create.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("consents:marketingConsents.notifications.create.success.message")
                }));
                history.replace(
                    AppConstants.getPaths().get("MARKETING_CONSENTS_EDIT").replace(":id", created.id)
                );
            })
            .catch((error: IdentityAppsApiException): void => {
                const status: number = error?.response?.status;
                let description: string;
                let message: string;

                switch (status) {
                    case 409:
                        description = t("consents:marketingConsents.notifications.create.error.conflict.description");
                        message = t("consents:marketingConsents.notifications.create.error.conflict.message");

                        break;
                    case 404:
                        description = t("consents:marketingConsents.notifications.create.error.notFound.description");
                        message = t("consents:marketingConsents.notifications.create.error.notFound.message");

                        break;
                    default:
                        if (status >= 500) {
                            description = t(
                                "consents:marketingConsents.notifications.create.error.serverError.description"
                            );
                            message = t(
                                "consents:marketingConsents.notifications.create.error.serverError.message"
                            );
                        } else {
                            description = t("consents:marketingConsents.notifications.create.error.description");
                            message = t("consents:marketingConsents.notifications.create.error.message");
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
     * Creates a new version of the marketing consent.
     */
    const updateMarketingConsent = (values: MarketingFormValuesInterface): void => {
        setIsSubmitting(true);

        const nextLabel: string = generateNextVersionLabel(consent.version ?? "1");

        const attributeElements: NewElementBindingInterface[] = (values.attributes ?? []).map(
            (attr: Claim): NewElementBindingInterface => ({
                description: attr.description,
                displayName: attr.displayName,
                name: attr.claimURI
            })
        );

        createMarketingPurposeVersion(
            purposeId,
            nextLabel,
            values.description,
            attributeElements.length > 0 ? attributeElements : undefined
        )
            .then((): void => {
                dispatch(addAlert({
                    description: t("consents:marketingConsents.notifications.update.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("consents:marketingConsents.notifications.update.success.message")
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
                        description = t(
                            "consents:marketingConsents.notifications.update.error.notFound.description"
                        );
                        message = t("consents:marketingConsents.notifications.update.error.notFound.message");

                        break;
                    case 409:
                        description = t(
                            "consents:marketingConsents.notifications.update.error.conflict.description"
                        );
                        message = t("consents:marketingConsents.notifications.update.error.conflict.message");

                        break;
                    default:
                        if (status >= 500) {
                            description = t(
                                "consents:marketingConsents.notifications.update.error.serverError.description"
                            );
                            message = t(
                                "consents:marketingConsents.notifications.update.error.serverError.message"
                            );
                        } else {
                            description = t("consents:marketingConsents.notifications.update.error.description");
                            message = t("consents:marketingConsents.notifications.update.error.message");
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

    const isLoading: boolean = !isCreateMode && (isConsentInfoLoading || isVersionsLoading || isClaimsLoading);

    return (
        <>
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
                            onSubmit={ (values: MarketingFormValuesInterface) => {
                                if (isCreateMode) {
                                    createNewMarketingConsent(values);
                                } else {
                                    pendingValues.current = values;
                                    setShowVersionWarningModal(true);
                                }
                            } }
                            initialValues={ initialValues }
                            render={ ({
                                handleSubmit: _handleSubmit,
                                values: _values
                            }: FormRenderProps & { values: MarketingFormValuesInterface }) => {
                                const isUnchanged: boolean = !isCreateMode && (
                                    (_values?.description ?? "") === (initialValues?.description ?? "")
                                    && JSON.stringify(
                                        [ ...(_values?.attributes ?? []) ]
                                            .map((a: Claim): string => a.claimURI)
                                            .sort()
                                    ) === JSON.stringify(
                                        [ ...(initialValues?.attributes ?? []) ]
                                            .map((a: Claim): string => a.claimURI)
                                            .sort()
                                    )
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
                                                    && !isConsentInfoLoading
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
                                                                label={
                                                                    t("consents:marketingConsents.form.name.label")
                                                                }
                                                                placeholder={
                                                                    t(
                                                                        "consents:marketingConsents" +
                                                                        ".form.name.placeholder"
                                                                    )
                                                                }
                                                                required
                                                                type="text"
                                                                component={ TextFieldAdapter }
                                                                validate={ validateName }
                                                            />
                                                        </Box>
                                                    ) }
                                                    <Box>
                                                        <InputLabel>
                                                            {
                                                                t(
                                                                    "consents:marketingConsents" +
                                                                    ".form.description.label"
                                                                )
                                                            }
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
                                                                        variant="marketing"
                                                                    />
                                                                );
                                                            } }
                                                        />
                                                    </Box>
                                                    <Box>
                                                        <Field
                                                            name="attributes"
                                                            subscription={ { value: true } }
                                                            render={ (
                                                                { input }: {
                                                                    input: FieldInputProps<Claim[]>
                                                                }
                                                            ) => {
                                                                const selectedAttrs: Claim[] =
                                                                    Array.isArray(input.value)
                                                                        ? input.value
                                                                        : [];

                                                                const renderInput = (
                                                                    params: AutocompleteRenderInputParams
                                                                ): ReactElement => (
                                                                    <TextField
                                                                        { ...params }
                                                                        placeholder={
                                                                            selectedAttrs.length === 0
                                                                                ? t(
                                                                                    "consents:registrationFlow" +
                                                                                    ".addAttribute"
                                                                                )
                                                                                : ""
                                                                        }
                                                                    />
                                                                );

                                                                return (
                                                                    <>
                                                                        <InputLabel
                                                                            sx={ {
                                                                                color: "text.secondary",
                                                                                mb: 0.5
                                                                            } }
                                                                        >
                                                                            { t(
                                                                                "consents:registrationFlow" +
                                                                                ".attributes"
                                                                            ) }
                                                                        </InputLabel>
                                                                        <Autocomplete
                                                                            multiple
                                                                            loading={ isClaimsLoading }
                                                                            options={ claims ?? [] }
                                                                            value={ selectedAttrs }
                                                                            getOptionLabel={
                                                                                (option: Claim): string =>
                                                                                    option.displayName
                                                                            }
                                                                            isOptionEqualToValue={
                                                                                (
                                                                                    o: Claim,
                                                                                    v: Claim
                                                                                ): boolean =>
                                                                                    o.claimURI === v.claimURI
                                                                            }
                                                                            onChange={
                                                                                (
                                                                                    _: SyntheticEvent,
                                                                                    selected: Claim[]
                                                                                ): void => {
                                                                                    input.onChange(selected);
                                                                                }
                                                                            }
                                                                            renderInput={ renderInput }
                                                                        />
                                                                    </>
                                                                );
                                                            } }
                                                        />
                                                    </Box>
                                                    <Message
                                                        type="info"
                                                        content={ (
                                                            <Trans
                                                                i18nKey="consents:form.mandatory.linkHint"
                                                            >
                                                                <Link
                                                                    onClick={ handleRegFlowBuilderClick }
                                                                    sx={ { cursor: "pointer" } }
                                                                >
                                                                    this link
                                                                </Link>
                                                            </Trans>
                                                        ) }
                                                    />
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
                                                <MarketingConsentPreview
                                                    componentId="marketing-consent-preview"
                                                    attributes={ (_values?.attributes ?? []).map(
                                                        (a: Claim): string => a.displayName
                                                    ) }
                                                    description={ _values?.description ?? "" }
                                                    policyName={ isCreateMode ? _values?.name : consent?.name }
                                                />
                                            </Grid>
                                            <Grid xs={ 12 } padding={ 2 }>
                                                {
                                                    !isCreateMode && (
                                                        <Hint>
                                                            { t(
                                                                "consents:marketingConsents" +
                                                                ".form.createNewVersion"
                                                            ) }
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
                                                            : t("consents:marketingConsents.form.createNewVersion")
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
                primaryAction={ t("common:confirm") }
                secondaryAction={ t("common:cancel") }
                onSecondaryActionClick={ () => setShowVersionWarningModal(false) }
                onPrimaryActionClick={ () => {
                    setShowVersionWarningModal(false);
                    updateMarketingConsent(pendingValues.current);
                } }
                closeOnDimmerClick={ false }
                primaryActionLoading={ isSubmitting }
            >
                <ConfirmationModal.Header>
                    { t("consents:marketingConsents.form.versionModal.createNewVersion") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Content>
                    { t("consents:marketingConsents.form.versionModal.description") }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};
