import { TestableComponentInterface } from "@wso2is/core/models";
import { SCheckboxAdapter, SSelectFieldAdapter, STextFieldAdapter } from "@wso2is/form";
import { QueryParameters } from "@wso2is/forms";
import { Code, FormSection, Hint, PrimaryButton } from "@wso2is/react-components";
import classNames from "classnames";
import { FormApi, SubmissionErrors } from "final-form";
import React, { FC, PropsWithChildren, ReactElement, useMemo } from "react";
import {
    Field as FinalFormField,
    FieldRenderProps,
    Form as ReactFinalForm,
    FormRenderProps,
    FormSpy,
    FormSpyRenderProps
} from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Form as SemanticUIForm, Grid, SemanticWIDTHS } from "semantic-ui-react";
import { AppState, ConfigReducerStateInterface } from "../../../../core";
import {
    CommonAuthenticatorFormInitialValuesInterface,
    FederatedAuthenticatorWithMetaInterface
} from "../../../models";
import {
    castToBool,
    composeValidators,
    fastSearch,
    getAvailableNameIDFormats,
    getAvailableProtocolBindingTypes,
    getDigestAlgorithmOptionsMapped,
    getSignatureAlgorithmOptionsMapped,
    hasLength,
    IDENTITY_PROVIDER_ENTITY_ID_LENGTH,
    isUrl,
    LOGOUT_URL_LENGTH,
    required,
    SERVICE_PROVIDER_ENTITY_ID_LENGTH,
    SSO_URL_LENGTH
} from "../../utils/saml-idp-utils";

/**
 * SamlSettingsForm Properties interface. The data-testid is added in
 * {@link SamlAuthenticatorSettingsForm.defaultProps}.
 */
interface SamlSettingsFormProps extends TestableComponentInterface {
    /**
     * Authenticator instance. This object contains both the initial values
     * for the form and the required metadata for form fields.
     */
    authenticator: FederatedAuthenticatorWithMetaInterface;
    /**
     * Callback for form submit.
     * @param {CommonAuthenticatorFormInitialValuesInterface} values - Resolved Form Values.
     */
    onSubmit: (values: CommonAuthenticatorFormInitialValuesInterface) => void;
}

export interface SamlProperties {
    // These are the properties we have ignored.
    // Keeping them as a reference for future implementations.
    //
    // ACSUrl: string;
    // AttributeConsumingServiceIndex: string;
    // AuthnContextClassRef: string;
    // AuthnContextComparisonLevel: string;
    // ForceAuthentication: string;
    // ISArtifactBindingEnabled: boolean;
    // IncludeAuthnContext: string;
    // IncludeCert: boolean;
    // IncludeNameIDPolicy: boolean;
    // IsAssertionEncrypted: boolean;
    // SelectMode: string;
    // ResponseAuthnContextClassRef: string;
    // isAssertionSigned: boolean;
    // meta_data_saml: string;
    // SignatureAlgorithmPost: string;
    // CustomAuthnContextClassRef: string;
    DigestAlgorithm?: string;
    ISAuthnReqSigned?: boolean;
    IdPEntityId?: string;
    IncludeProtocolBinding?: boolean;
    IsAuthnRespSigned?: boolean;
    IsLogoutEnabled?: boolean;
    IsLogoutReqSigned?: boolean;
    IsSLORequestAccepted?: boolean;
    IsUserIdInClaims?: boolean;
    LogoutReqUrl?: string;
    NameIDType?: string;
    RequestMethod?: string;
    SPEntityId?: string;
    SSOUrl?: string;
    SignatureAlgorithm?: string;
    commonAuthQueryParams?: string;
}

export const SamlAuthenticatorSettingsForm: FC<SamlSettingsFormProps> = (
    props: SamlSettingsFormProps
): ReactElement => {

    const {
        authenticator,
        onSubmit,
        [ "data-testid" ]: testId
    } = props;

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const { t } = useTranslation();

    const initialFormValues = useMemo<SamlProperties>(() => {

        /**
         * What the heck is this?
         *
         * This function is a faster way to search properties and metadata in a
         * authenticator. What you need to understand is that `fastSearch` will
         * return two functions. One is `findPropVal` and the other `findMeta`
         *
         * > `findPropVal` is a generic function; you specify the value type of the key
         * and give the `key` it will return the value or the strict `defaultValue`.
         *
         * > `findMeta` is a function; you specify the `key` and you will get the
         * property metadata interface. It may return null if specified key is not
         * available.
         */
        const [ findPropVal, findMeta ] = fastSearch(authenticator);

        return {
            DigestAlgorithm: findPropVal<string>({
                defaultValue: findMeta({ key: "DigestAlgorithm" })?.defaultValue ?? "SHA1",
                key: "DigestAlgorithm"
            }),
            ISAuthnReqSigned: findPropVal<boolean>({
                defaultValue: castToBool(findMeta({ key: "ISAuthnReqSigned" })?.defaultValue) ?? false,
                key: "ISAuthnReqSigned"
            }),
            IdPEntityId: findPropVal<string>({
                defaultValue: findMeta({ key: "IdPEntityId" })?.defaultValue ?? "",
                key: "IdPEntityId"
            }),
            IncludeProtocolBinding: findPropVal<boolean>({
                defaultValue: castToBool(findMeta({ key: "IncludeProtocolBinding" })?.defaultValue) ?? false,
                key: "IncludeProtocolBinding"
            }),
            IsAuthnRespSigned: findPropVal<boolean>({
                defaultValue: castToBool(findMeta({ key: "IsAuthnRespSigned" })?.defaultValue) ?? false,
                key: "IsAuthnRespSigned"
            }),
            IsLogoutEnabled: findPropVal<boolean>({
                defaultValue: castToBool(findMeta({ key: "IsLogoutEnabled" })?.defaultValue) ?? false,
                key: "IsLogoutEnabled"
            }),
            IsLogoutReqSigned: findPropVal<boolean>({
                defaultValue: castToBool(findMeta({ key: "IsLogoutReqSigned" })?.defaultValue) ?? false,
                key: "IsLogoutReqSigned"
            }),
            IsSLORequestAccepted: findPropVal<boolean>({
                defaultValue: castToBool(findMeta({ key: "IsSLORequestAccepted" })?.defaultValue) ?? true,
                key: "IsSLORequestAccepted"
            }),
            IsUserIdInClaims: findPropVal<boolean>({
                defaultValue: castToBool(findMeta({ key: "IsUserIdInClaims" })?.defaultValue) ?? true,
                key: "IsUserIdInClaims"
            }),
            LogoutReqUrl: findPropVal<string>({
                defaultValue: findMeta({ key: "LogoutReqUrl" })?.defaultValue ?? "",
                key: "LogoutReqUrl"
            }),
            NameIDType: findPropVal<string>({
                defaultValue: findMeta({ key: "NameIDType" })?.defaultValue ?? "",
                key: "NameIDType"
            }),
            RequestMethod: findPropVal<string>({
                defaultValue: findMeta({ key: "RequestMethod" })?.defaultValue ?? "",
                key: "RequestMethod"
            }),
            SPEntityId: findPropVal<string>({
                defaultValue: findMeta({ key: "SPEntityId" })?.defaultValue ?? "",
                key: "SPEntityId"
            }),
            SSOUrl: findPropVal<string>({
                defaultValue: findMeta({ key: "SSOUrl" })?.defaultValue ?? "",
                key: "SSOUrl"
            }),
            SignatureAlgorithm: findPropVal<string>({
                defaultValue: findMeta({ key: "SignatureAlgorithm" })?.defaultValue ?? "RSA with SHA1",
                key: "SignatureAlgorithm"
            }),
            commonAuthQueryParams: findPropVal<string>({
                defaultValue: findMeta({ key: "commonAuthQueryParams" })?.defaultValue ?? "",
                key: "commonAuthQueryParams"
            })
        } as SamlProperties;

    }, []);

    /**
     * Form submission.
     * @param values
     * @param _ form
     * @param __ callback
     */
    const onFormSubmit = (
        values: { [ key: string ]: any },
        _: FormApi,
        __?: (errors?: SubmissionErrors) => void
    ) => {
        /**
         * Just pass the existing authenticator data with the new
         * properties values.
         */
        onSubmit({
            ...authenticator.data,
            properties: Object.keys(values).map((key) => ({ key, value: values[ key ] }))
        });
    };

    /**
     * This is recommended way to check existing state and manipulate the form in
     * react-final-form. We utilize <FormSpy> to get the current state of
     * the form and <OnChange> to conditionally manipulate the form values.
     *
     * If you're looking for how the dropdowns gets disabled, then check the dropdown
     * field disabled prop. the disabling logic is not tied to this function. Instead this
     * only checks the inter-dependency state of checkboxes.
     *
     * @constructor
     */
    const ReactFinalFormListeners = (): ReactElement => (
        <>
            <WhenForm
                field="IsLogoutReqSigned"
                becomes={ false }
                execute={ (fieldValue, fieldRenderProps, formSpyRenderProps) => {
                    /**
                     * If the `IsLogoutReqSigned` is unchecked and at the same time
                     * if `ISAuthnReqSigned` also unchecked then we have to remove the
                     * value of `SignatureAlgorithm` or add the API default value.
                     */
                    if (!formSpyRenderProps.values?.ISAuthnReqSigned) {
                        formSpyRenderProps.form.change(
                            "SignatureAlgorithm",
                            initialFormValues?.SignatureAlgorithm
                        );
                        formSpyRenderProps.form.change(
                            "DigestAlgorithm",
                            initialFormValues?.DigestAlgorithm
                        );
                    }
                } }
            />
            <WhenForm
                field="ISAuthnReqSigned"
                becomes={ false }
                execute={ (fieldValue, fieldRenderProps, formSpyRenderProps) => {
                    // Same as above vice versa. Now it checks `IsLogoutReqSigned`
                    if (!formSpyRenderProps.values?.IsLogoutReqSigned) {
                        formSpyRenderProps.form.change(
                            "SignatureAlgorithm",
                            initialFormValues?.SignatureAlgorithm
                        );
                        formSpyRenderProps.form.change(
                            "DigestAlgorithm",
                            initialFormValues?.DigestAlgorithm
                        );
                    }
                } }
            />
        </>
    );

    /**
     * Render the form fields. This method should only be responsible for
     * rendering the form field and implement scoped transformers and nothing else.
     * @param rProps {FormRenderProps<Record<string, ?>, Partial<Record<string, ?>>>}
     */
    const renderFields = (rProps: FormRenderProps<Record<string, any>, Partial<Record<string, any>>>) => {

        const { values, errors, valid, pristine } = rProps;
        /**
         * This function will check the current form value of SSOUrl property and return the value or a
         * default value. Added this for the use-case `LogoutReqUrl` field should have the current
         * SSOUrl value. If it's invalid then we need to keep a valid example because it's the hint.
         *
         * @return {string} transformed value.
         */
        const readAndTransformSSOUrl = (): string => {
            if (values.SSOUrl && !Object.hasOwnProperty.call(errors, "SSOUrl")) {
                return values.SSOUrl;
            }
            return "https://ENTERPRISE_IDP/samlsso";
        };

        /**
         * Tests whether one of two checkboxes values is true or not.
         * @param a {string} form checkbox / toggle field key a
         * @param b {string} form checkbox / toggle field key b
         * @returns one is checked or not
         */
        const eitherOneFieldIsChecked = (a: string, b: string): boolean => {
            return values[ a ] === true || values[ b ] === true;
        };

        /**
         * What the heck is this?
         *
         * When dynamically changing field level validators react-final-form has a
         * limitation on mutating the validate prop. We use this recommended workaround
         * for this limitation. In some form fields I have inlined this behaviour
         * to reduce functions. This is here in place to avoid duplication on two
         * fields.
         *
         * From the library author:
         * https://codesandbox.io/s/changing-field-level-validators-zc8ei?fontsize=14&file=/src/index.js
         */
        const getAlgorithmsDropdownFieldValidators = () => {
            const shouldValidate = eitherOneFieldIsChecked(
                "IsLogoutReqSigned",
                "ISAuthnReqSigned"
            );
            // Do you want to have multiple validators? then wrap them in
            // `composeValidators` function to make it happen.
            return shouldValidate ? required : () => void 0;
        };

        return (
            <React.Fragment>

                <GridItem width={ 13 }>
                    <FinalFormField
                        required={ true }
                        name="SPEntityId"
                        placeholder={ "Enter service provider entity ID" }
                        aria-label={ "Service provider entity ID" }
                        type="text"
                        component={ STextFieldAdapter }
                        maxLength={ SERVICE_PROVIDER_ENTITY_ID_LENGTH.max }
                        minLength={ SERVICE_PROVIDER_ENTITY_ID_LENGTH.min }
                        label={ (
                            <RichLabel htmlFor="SPEntityId">
                                Service provider <Code>entityID</Code>
                            </RichLabel>
                        ) }
                        validate={ composeValidators(required, hasLength(SERVICE_PROVIDER_ENTITY_ID_LENGTH)) }
                    />
                    <Hint icon="info circle">
                        Enter identity provider&apos;s SAML2 Web SSO URL value.
                    </Hint>
                </GridItem>

                <GridItem width={ 13 }>
                    <FinalFormField
                        required={ true }
                        name="SSOUrl"
                        type="text"
                        placeholder={ "https://ENTERPRISE_IDP/samlsso" }
                        aria-label={ "Single Sign-On URL" }
                        data-testid={ `${ testId }-SSOUrl-field` }
                        label={ (
                            <RichLabel htmlFor="SSOUrl">
                                Single Sign-On <Code>URL</Code>
                            </RichLabel>
                        ) }
                        component={ STextFieldAdapter }
                        maxLength={ SSO_URL_LENGTH.max }
                        minLength={ SSO_URL_LENGTH.min }
                        validate={ composeValidators(
                            required,
                            isUrl,
                            hasLength(SSO_URL_LENGTH)
                        ) }
                    />
                    <Hint icon="info circle">
                        Enter identity provider&apos;s SAML2 Web Single Sign-On URL value.
                    </Hint>
                </GridItem>

                <GridItem width={ 13 }>
                    <FinalFormField
                        required={ true }
                        name="IdPEntityId"
                        type="select"
                        placeholder={ "Enter identity provider entity ID" }
                        aria-label={ "Identity provider entity ID" }
                        data-testid={ `${ testId }-IdPEntityId-field` }
                        component={ STextFieldAdapter }
                        label={ (
                            <RichLabel htmlFor="IdPEntityId" disabled>
                                Identity provider <Code>entityID</Code>
                            </RichLabel>
                        ) }
                        maxLength={ IDENTITY_PROVIDER_ENTITY_ID_LENGTH.max }
                        minLength={ IDENTITY_PROVIDER_ENTITY_ID_LENGTH.min }
                        validate={ composeValidators(
                            required,
                            hasLength(IDENTITY_PROVIDER_ENTITY_ID_LENGTH)
                        ) }
                    />
                    <Hint icon="info circle">
                        Enter identity provider&apos;s entity identifier value.
                        This should be a valid <Code>URI</Code>/<Code>URL</Code>.
                    </Hint>
                </GridItem>

                <GridItem width={ 13 }>
                    <FinalFormField
                        required={ true }
                        name="NameIDType"
                        type="select"
                        placeholder={ "Select identity provider NameIDFormat" }
                        aria-label={ "Choose NameIDFormat for SAML 2.0 assertion" }
                        data-testid={ `${ testId }-NameIDType-field` }
                        component={ SSelectFieldAdapter }
                        options={ getAvailableNameIDFormats() }
                        label={ (
                            <RichLabel htmlFor="NameIDType">
                                Identity provider <Code>NameIDFormat</Code>
                            </RichLabel>
                        ) }
                        validate={ required }
                    />
                    <Hint icon="info circle">
                        Specify the name identifier formats supported by the identity provider. Name identifiers are a
                        way for providers to communicate with each other regarding a user.
                    </Hint>
                </GridItem>

                <GridItem width={ 13 }>
                    <FinalFormField
                        required={ true }
                        name="RequestMethod"
                        type="select"
                        placeholder={ "Select HTTP protocol binding" }
                        aria-label={ "HTTP protocol for SAML 2.0 bindings" }
                        data-testid={ `${ testId }-RequestMethod-field` }
                        component={ SSelectFieldAdapter }
                        options={ getAvailableProtocolBindingTypes() }
                        label={ (
                            <RichLabel htmlFor="NameIDType">
                                HTTP protocol binding
                            </RichLabel>
                        ) }
                        validate={ required }
                    />
                    <Hint icon="info circle">
                        Choose the HTTP binding or decide from incoming request.
                    </Hint>
                </GridItem>

                <GridItem width={ 13 }>
                    <FormSection heading="Single Logout">
                        <Grid>

                            <GridItem width={ 16 }>
                                <FinalFormField
                                    required={ false }
                                    name="IsSLORequestAccepted"
                                    aria-label={ "Specify whether logout is enabled for IdP" }
                                    data-testid={ `${ testId }-IsSLORequestAccepted-field` }
                                    toggle
                                    component={ SCheckboxAdapter }
                                    label={ (
                                        <RichLabel htmlFor="IsSLORequestAccepted">
                                            Accept identity provider logout request
                                        </RichLabel>
                                    ) }
                                />
                                <Hint icon="info circle">
                                    Specify whether single logout request from the identity
                                    provider must be accepted by { config.ui.productName }
                                </Hint>
                            </GridItem>

                            <GridItem width={ 16 }>
                                <FinalFormField
                                    required={ false }
                                    name="IsLogoutEnabled"
                                    aria-label={ "Specify whether logout is enabled for IdP" }
                                    data-testid={ `${ testId }-IsLogoutEnabled-field` }
                                    toggle
                                    component={ SCheckboxAdapter }
                                    label={ (
                                        <RichLabel htmlFor="IsLogoutEnabled">
                                            Identity provider logout enabled
                                        </RichLabel>
                                    ) }
                                />
                                <Hint icon="info circle">
                                    Specify whether logout is supported by the external
                                    identity provider.
                                </Hint>
                            </GridItem>

                            <GridItem width={ 16 }>
                                <FinalFormField
                                    name="LogoutReqUrl"
                                    disabled={ !values?.IsLogoutEnabled }
                                    placeholder={ "Enter logout URL" }
                                    aria-label={ "Specify SAML 2.0 IdP Logout URL" }
                                    data-testid={ `${ testId }-LogoutReqUrl-field` }
                                    component={ STextFieldAdapter }
                                    label={ (
                                        <RichLabel htmlFor="LogoutReqUrl">
                                            IdP logout <Code>URL</Code>
                                        </RichLabel>
                                    ) }
                                    maxLength={ LOGOUT_URL_LENGTH.max }
                                    minLength={ LOGOUT_URL_LENGTH.min }
                                    validate={ (value) => {
                                        return (values?.IsLogoutEnabled && value)
                                            ? composeValidators(
                                                isUrl,
                                                hasLength(LOGOUT_URL_LENGTH)
                                            )(value)
                                            : undefined;
                                    } }
                                />
                                <Hint icon="info circle">
                                    Enter the identity provider&apos;s logout URL value if it is different from the SSO
                                    URL (<Code>{ readAndTransformSSOUrl() }</Code>)
                                </Hint>
                            </GridItem>
                        </Grid>
                    </FormSection>
                </GridItem>

                <GridItem width={ 13 }>
                    <FormSection heading="Request & Response Signing">
                        <Grid>

                            <GridItem width={ 16 }>
                                <FinalFormField
                                    toggle
                                    required={ false }
                                    name="IsAuthnRespSigned"
                                    aria-label={ "Authentication response must be signed always?" }
                                    data-testid={ `${ testId }-IsAuthnRespSigned-field` }
                                    component={ SCheckboxAdapter }
                                    label={ (
                                        <RichLabel htmlFor="IsAuthnRespSigned">
                                            Strictly verify authentication response signature
                                        </RichLabel>
                                    ) }
                                />
                                <Hint icon="info circle">
                                    Specifies if SAML2 authentication response from the external
                                    identity provider must be signed or not.
                                </Hint>
                            </GridItem>

                            <GridItem width={ 16 }>
                                <FinalFormField
                                    toggle
                                    required={ false }
                                    name="IsLogoutReqSigned"
                                    aria-label={ "Specify whether logout is enabled for IdP" }
                                    data-testid={ `${ testId }-IsLogoutReqSigned-field` }
                                    component={ SCheckboxAdapter }
                                    label={ (
                                        <RichLabel htmlFor="IsLogoutEnabled">
                                            Enable logout request signing
                                        </RichLabel>
                                    ) }
                                />
                                <Hint icon="info circle">
                                    Specify whether SAML logout request to the external identity
                                    provider must be signed or not.
                                </Hint>
                            </GridItem>

                            <GridItem width={ 16 }>
                                <FinalFormField
                                    toggle
                                    required={ false }
                                    name="ISAuthnReqSigned"
                                    aria-label={ "Is authentication request signed?" }
                                    data-testid={ `${ testId }-ISAuthnReqSigned-field` }
                                    component={ SCheckboxAdapter }
                                    label={ (
                                        <RichLabel htmlFor="ISAuthnReqSigned">
                                            Enable authentication request signing
                                        </RichLabel>
                                    ) }
                                />
                                <Hint icon="info circle">
                                    Specify whether the SAML authentication request to the external
                                    identity provider must be signed or not.
                                </Hint>
                            </GridItem>

                            <GridItem width={ 16 }>
                                <FinalFormField
                                    required={ eitherOneFieldIsChecked("IsLogoutReqSigned", "ISAuthnReqSigned") }
                                    name="SignatureAlgorithm"
                                    type="select"
                                    disabled={ !eitherOneFieldIsChecked("IsLogoutReqSigned", "ISAuthnReqSigned") }
                                    placeholder={ "Select signature algorithm." }
                                    aria-label={ "Select the signature algorithm for request signing." }
                                    data-testid={ `${ testId }-SignatureAlgorithm-field` }
                                    component={ SSelectFieldAdapter }
                                    options={ getSignatureAlgorithmOptionsMapped(authenticator.meta) }
                                    label={ (
                                        <RichLabel htmlFor="SignatureAlgorithm">
                                            Signature algorithm
                                        </RichLabel>
                                    ) }
                                    validate={ getAlgorithmsDropdownFieldValidators() }
                                />
                            </GridItem>

                            <GridItem width={ 16 }>
                                <FinalFormField
                                    required={ eitherOneFieldIsChecked("IsLogoutReqSigned", "ISAuthnReqSigned") }
                                    name="DigestAlgorithm"
                                    type="select"
                                    disabled={ !eitherOneFieldIsChecked("IsLogoutReqSigned", "ISAuthnReqSigned") }
                                    placeholder={ "Select digest algorithm" }
                                    aria-label={ "Select the digest algorithm for description." }
                                    data-testid={ `${ testId }-DigestAlgorithm-field` }
                                    component={ SSelectFieldAdapter }
                                    options={ getDigestAlgorithmOptionsMapped(authenticator.meta) }
                                    label={ (
                                        <RichLabel htmlFor="DigestAlgorithm">
                                            Select digest algorithm
                                        </RichLabel>
                                    ) }
                                    validate={ getAlgorithmsDropdownFieldValidators() }
                                />
                            </GridItem>

                        </Grid>
                    </FormSection>
                </GridItem>

                <GridItem width={ 13 }>
                    <FormSection heading="Advanced">
                        <Grid>

                            <GridItem width={ 16 }>
                                <FinalFormField
                                    toggle
                                    required={ false }
                                    name="IncludeProtocolBinding"
                                    aria-label={ "Include protocol binding in the request" }
                                    data-testid={ `${ testId }-IncludeProtocolBinding-field` }
                                    component={ SCheckboxAdapter }
                                    label={ (
                                        <RichLabel htmlFor="IncludeProtocolBinding">
                                            Include protocol binding in the request
                                        </RichLabel>
                                    ) }
                                />
                                <Hint icon="info circle">
                                    Specifies whether the transport mechanism should be included in the SAML
                                    request assertion.
                                </Hint>
                            </GridItem>

                            <GridItem width={ 16 }>
                                <FinalFormField
                                    required={ false }
                                    name="IsUserIdInClaims"
                                    aria-label={ "Use Name ID as the user identifier." }
                                    data-testid={ `${ testId }-IsUserIdInClaims-field` }
                                    toggle
                                    component={ SCheckboxAdapter }
                                    label={ (
                                        <RichLabel htmlFor="IsUserIdInClaims">
                                            { values.IsUserIdInClaims
                                                ? (<span>User identifier found among <Code>claims</Code></span>)
                                                : (<span>Use <Code>NameID</Code> as the user identifier</span>)
                                            }
                                        </RichLabel>
                                    ) }
                                />
                                <Hint icon="info circle">
                                    If you need to specify an attribute from the SAML assertion as the User Identifier,
                                    you can uncheck this option and configure the <Code>subject</Code> from
                                    the Attributes section.
                                </Hint>
                            </GridItem>

                            <GridItem width={ 16 }>
                                <RichLabel htmlFor="commonAuthQueryParams">
                                    <span style={ { display: "flex", marginBottom: 10 } }>
                                        Additional query parameters<br/>
                                    </span>
                                </RichLabel>
                                <FinalFormField name="commonAuthQueryParams">
                                    { ({ input }) => (
                                        <QueryParameters
                                            name="commonAuthQueryParams"
                                            value={ input.value }
                                            onChange={ input.onChange }
                                        />
                                    ) }
                                </FinalFormField>
                            </GridItem>

                        </Grid>
                    </FormSection>
                </GridItem>

                <GridItem width={ 13 }>
                    <PrimaryButton
                        size="small"
                        disabled={ !valid || pristine }
                        data-testid={ `${ testId }-submit-button` }
                        ariaLabel="Facebook authenticator update button"
                        type="submit"
                    >
                        { t("common:update") }
                    </PrimaryButton>
                </GridItem>

            </React.Fragment>
        );

    };

    return (
        <ReactFinalForm
            keepDirtyOnReinitialize={ false }
            initialValues={ initialFormValues }
            onSubmit={ onFormSubmit }
            render={ (renderProps) => (
                <SemanticUIForm onSubmit={ renderProps.handleSubmit } aria-labelledby={ testId }>
                    <Grid className="form-container with-max-width">
                        { renderFields(renderProps) }
                    </Grid>
                    <ReactFinalFormListeners/>
                </SemanticUIForm>
            ) }
        />
    );

};

SamlAuthenticatorSettingsForm.defaultProps = {
    "data-testid": "saml-authenticator-settings-form"
};

// Functional react helper components.

type GridItemProps = { width?: SemanticWIDTHS };
const GridItem: FC<GridItemProps> = (
    { width, children }: PropsWithChildren<GridItemProps>
): ReactElement => {
    return (
        <Grid.Row columns={ 1 }>
            <Grid.Column width={ width }>
                { children }
            </Grid.Column>
        </Grid.Row>
    );
};

type RichLabelProps = { htmlFor: string; disabled?: boolean, [ key: string ]: any; };
const RichLabel: FC<RichLabelProps> = (
    { children, htmlFor, disabled }: PropsWithChildren<RichLabelProps>
): ReactElement => {
    return (
        <label htmlFor={ htmlFor } className={ classNames({ disabled }) }>
            { children }
        </label>
    );
};

export type WhenFormProps = {
    field: string;
    becomes: any;
    execute: (
        fieldValue: any,
        fieldRenderProps: FieldRenderProps<any, HTMLElement>,
        formSpyRenderProps: FormSpyRenderProps<Record<string, any>, Partial<Record<string, any>>>
    ) => void;
};

/**
 * At first you might think what the heck is this right? But, this is the recommended way to
 * listen to form changes effectively. This the correct declarative way to manipulate other
 * form fields when some other field changes. You can see for yourself how the author of
 * react-final-form does the exact same thing https://codesandbox.io/s/52q597j2p.
 *
 * I have modified the logic a bit to simplify the listen function. Optionally, we can also
 * pass `subscription` to both `FinalFormField` and `FormSpy` but at the time we don't require
 * such a use-case. But if you want it just simply add `subscription={ { ... } }` to
 * implement more advanced side effects based on fields. Use `FinalFormField` & `FormSpy` to
 * delegate the changes to the callee.
 *
 * @param field { string }
 * @param becomes { value | any }
 * @param execute { Function } Please refer {@link WhenFormProps.execute}
 * @constructor
 */
export const WhenForm: FC<WhenFormProps> = ({ field, becomes, execute }: WhenFormProps): ReactElement => {
    return (
        <FinalFormField name={ field }>
            { (fieldRenderProps) => (
                <FormSpy>
                    { (formSpyRenderProps) => (
                        <OnChange name={ field }>
                            { (fieldValue) => {
                                if (fieldValue === becomes) {
                                    execute(fieldValue, fieldRenderProps, formSpyRenderProps);
                                }
                            } }
                        </OnChange>
                    ) }
                </FormSpy>
            ) }
        </FinalFormField>
    );
};
