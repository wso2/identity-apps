/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { Show } from "@wso2is/access-control";
import { IdentityAppsError } from "@wso2is/core/errors";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import {
    AlertInterface,
    AlertLevels,
    Claim,
    ExternalClaim,
    ProfileSchemaInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert, setProfileSchemaRequestLoadingStatus, setSCIMSchemas } from "@wso2is/core/store";
import { Field, Form } from "@wso2is/form";
import {
    ConfirmationModal,
    CopyInputField,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    Hint,
    Link,
    Message
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    MutableRefObject,
    ReactElement,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Icon, Form as SemanticForm } from "semantic-ui-react";
import { attributeConfig } from "../../../../admin.extensions.v1";
import { SCIMConfigs } from "../../../../admin.extensions.v1/configs/scim";
import { AccessControlConstants } from "../../../../admin.access-control.v1/constants/access-control";
import { AppConstants, AppState, FeatureConfigInterface, history } from "../../../../admin.core.v1";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    ServerConfigurationsConstants,
    getConnectorDetails } from "../../../../admin-server-configurations-v1";
import { getProfileSchemas } from "../../../../admin-users-v1/api";
import { getUsernameConfiguration } from "../../../../admin-users-v1/utils/user-management-utils";
import { useValidationConfigData } from "../../../../admin-validation-v1/api";
import { ValidationFormInterface } from "../../../../admin-validation-v1/models";
import { deleteAClaim, getExternalClaims, updateAClaim } from "../../../api";
import { ClaimManagementConstants } from "../../../constants";

/**
 * Prop types for `EditBasicDetailsLocalClaims` component
 */
interface EditBasicDetailsLocalClaimsPropsInterface extends TestableComponentInterface {
    /**
     * The claim to be edited
     */
    claim: Claim;
    /**
     * The function to be called to initiate an update
     */
    update: () => void;
}

const FORM_ID: string = "local-claim-basic-details-form";

// Claims used by the system and will be readonly.
const READONLY_CLAIM_CONFIGS: string[] = [
    ClaimManagementConstants.GROUPS_CLAIM_URI,
    ClaimManagementConstants.ROLES_CLAIM_URI,
    ClaimManagementConstants.APPLICATION_ROLES_CLAIM_URI
];

/**
 * This component renders the Basic Details pane of the edit local claim screen
 *
 * @param props - Props injected to the component.
 * @returns Functional component.
 */
export const EditBasicDetailsLocalClaims: FunctionComponent<EditBasicDetailsLocalClaimsPropsInterface> = (
    props: EditBasicDetailsLocalClaimsPropsInterface
): ReactElement => {

    const {
        claim,
        update,
        [ "data-testid" ]: testId
    } = props;

    const dispatch: Dispatch= useDispatch();
    const [ shouldShowOnProfile, isSupportedByDefault ] = useState<boolean>(false);
    const [ isShowDisplayOrder, setIsShowDisplayOrder ] = useState(false);
    const [ confirmDelete, setConfirmDelete ] = useState(false);
    const [ isClaimReadOnly, setIsClaimReadOnly ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ hasMapping, setHasMapping ] = useState<boolean>(false);
    const [ mappingChecked, setMappingChecked ] = useState<boolean>(false);

    const nameField: MutableRefObject<HTMLElement> = useRef<HTMLElement>(null);
    const regExField: MutableRefObject<HTMLElement> = useRef<HTMLElement>(null);
    const displayOrderField: MutableRefObject<HTMLElement> = useRef<HTMLElement>(null);
    const descriptionField: MutableRefObject<HTMLElement> = useRef<HTMLElement>(null);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const [ hideSpecialClaims, setHideSpecialClaims ] = useState<boolean>(true);
    const [ usernameConfig, setUsernameConfig ] = useState<ValidationFormInterface>(undefined);
    const [ connector, setConnector ] = useState<GovernanceConnectorInterface>(undefined);
    const [ accountVerificationEnabled, setAccountVerificationEnabled ] = useState<boolean>(false);
    const [ selfRegistrationEnabled, setSelfRegistrationEnabledEnabled ] = useState<boolean>(false);

    const { t } = useTranslation();

    const { data: validationData } = useValidationConfigData();

    /**
     * Get username configuration.
     */
    useEffect(() => {
        if (validationData) {
            setUsernameConfig(getUsernameConfiguration(validationData));
        }
    }, [ validationData ]);

    /**
     * Get username configuration.
     */
    useEffect(() => {
        // If the alpha-numeric username validator is enabled, remove the email claim from the system claims.
        if (
            usernameConfig?.enableValidator === "true"
            && attributeConfig?.systemClaims.includes(ClaimManagementConstants.EMAIL_CLAIM_URI)
        ){
            const emailClaimIndex: number
                = attributeConfig?.systemClaims.indexOf(ClaimManagementConstants.EMAIL_CLAIM_URI);

            attributeConfig?.systemClaims.splice(emailClaimIndex, 1);
        } else if (
            usernameConfig?.enableValidator === "false"
             && !attributeConfig?.systemClaims.includes(ClaimManagementConstants.EMAIL_CLAIM_URI)
        )
        {
            attributeConfig?.systemClaims.push(ClaimManagementConstants.EMAIL_CLAIM_URI);
        }
    }, [ usernameConfig, attributeConfig ]);

    useEffect(() => {
        if (claim?.supportedByDefault) {
            setIsShowDisplayOrder(true);
        }
        if (claim?.readOnly) {
            setIsClaimReadOnly(true);
        }
        if (claim
            && (
                attributeConfig?.systemClaims.length <= 0
                || attributeConfig?.systemClaims.indexOf(claim?.claimURI) === -1
            )
        ) {
            setHideSpecialClaims(false);
        }
        else {
            setHideSpecialClaims(true);
        }
    }, [ claim, usernameConfig ]);

    useEffect(() => {
        const dialectID: string[] = getDialectID();

        if(claim) {
            const externalClaimRequest: Promise<ExternalClaim[]>[] = [];

            dialectID.forEach((dialectId: string) => {
                externalClaimRequest.push(getExternalClaims(dialectId));
            });

            Promise.allSettled(externalClaimRequest).then((
                results: PromiseSettledResult<ExternalClaim[]>[]
            ) => {
                const resolvedResults: PromiseSettledResult<ExternalClaim[]>[] = results.filter(
                    (result: PromiseSettledResult<ExternalClaim[]>) => {
                        if (result.status === "fulfilled") {
                            return true;
                        } else {
                            const error: IdentityAppsApiException = result.reason;

                            if (error.code !== 404) {
                                dispatch(
                                    addAlert({
                                        description: error?.response?.data?.description,
                                        level: AlertLevels.ERROR,
                                        message: t("claims:dialects"
                                            + ".notifications.fetchExternalClaims.genericError.message")
                                    })
                                );
                            }

                            return false;
                        }
                    });

                const claims: ExternalClaim[] = resolvedResults.flatMap(
                    (result: PromiseSettledResult<ExternalClaim[]>) => {
                        return result.status === "fulfilled" ? result.value : [];
                    });

                if (claims.find((externalClaim: ExternalClaim) =>
                    externalClaim.mappedLocalClaimURI === claim.claimURI)) {
                    setHasMapping(true);
                }
            }).finally(() => setMappingChecked(true));
        }
    }, [ claim ]);

    useEffect(() => {
        getConnectorDetails(ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
            ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID)
            .then((response: GovernanceConnectorInterface) => {
                setConnector(response);
            })
            .catch((error: AxiosError) => {
                if (error?.response?.data?.detail) {
                    dispatch(
                        addAlert({
                            description: t(
                                "governanceConnectors:notifications." +
                                "getConnector.error.description",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "getConnector.error.message"
                            )
                        })
                    );
                } else {
                    dispatch(
                        addAlert({
                            description: t(
                                "governanceConnectors:notifications." +
                                "getConnector.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "governanceConnectors:notifications." +
                                "getConnector.genericError.message"
                            )
                        })
                    );
                }
            });
    }, []);

    useEffect(() => {

        if (isEmpty(connector?.properties)) {
            return;
        }

        connector.properties.map((property: ConnectorPropertyInterface) => {
            if (property.name === ServerConfigurationsConstants.ACCOUNT_CONFIRMATION) {
                if (property.value === "false") {
                    setAccountVerificationEnabled(false);
                } else {
                    setAccountVerificationEnabled(true);
                }
            }

            if (property.name === ServerConfigurationsConstants.SELF_REGISTRATION_ENABLE) {
                if (property.value === "false") {
                    setSelfRegistrationEnabledEnabled(false);
                } else {
                    setSelfRegistrationEnabledEnabled(true);
                }
            }

        });
    }, [ connector ]);

    const getDialectID = (): string[]  => {
        const dialectID: string[] = [];

        dialectID.push(ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_CORE"));
        dialectID.push(ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_CORE_USER"));
        dialectID.push(ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_EXT_ENT_USER"));
        if (SCIMConfigs.scimDialectID?.customEnterpriseSchema) {
            dialectID.push(SCIMConfigs.scimDialectID.customEnterpriseSchema);
        }

        return dialectID;
    };

    // Temporary fix to check system claims and make them readonly
    const isReadOnly: boolean = useMemo(() => {
        if (hideSpecialClaims) {
            return true;
        } else {
            return !hasRequiredScopes(
                featureConfig?.attributeDialects, featureConfig?.attributeDialects?.scopes?.update, allowedScopes);
        }
    }, [ featureConfig, allowedScopes, hideSpecialClaims ]);

    const deleteConfirmation = (): ReactElement => (
        <ConfirmationModal
            onClose={ (): void => setConfirmDelete(false) }
            type="negative"
            open={ confirmDelete }
            assertionHint={ t("claims:local.confirmation.hint") }
            assertionType="checkbox"
            primaryAction={ t("claims:local.confirmation.primaryAction") }
            secondaryAction={ t("common:cancel") }
            onSecondaryActionClick={ (): void => setConfirmDelete(false) }
            onPrimaryActionClick={ (): void => deleteLocalClaim(claim.id) }
            data-testid={ `${ testId }-delete-confirmation-modal` }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header>
                { t("claims:local.confirmation.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message attached negative>
                { t("claims:local.confirmation.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content>
                { t("claims:local.confirmation.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    /**
     * This deletes a local claim
     *
     * @param id - Claim id.
     */
    const deleteLocalClaim = (id: string): void => {
        deleteAClaim(id).then(() => {
            history.push(AppConstants.getPaths().get("LOCAL_CLAIMS"));
            dispatch(addAlert(
                {
                    description: t("claims:local.notifications.deleteClaim.success." +
                        "description"),
                    level: AlertLevels.SUCCESS,
                    message: t("claims:local.notifications.deleteClaim.success.message")
                }
            ));
        }).catch((error: IdentityAppsError) => {
            dispatch(addAlert(
                {
                    description: error?.description
                        || t("claims:local.notifications.deleteClaim.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("claims:local.notifications.deleteClaim.genericError.message")
                }
            ));
        }).finally(() => {
            setConfirmDelete(false);
        });
    };

    /**
     * Fetch the updated SCIM2 schema list.
     */
    const fetchUpdatedSchemaList = (): void => {
        dispatch(setProfileSchemaRequestLoadingStatus(true));

        getProfileSchemas()
            .then((response: ProfileSchemaInterface[]) => {
                dispatch(setSCIMSchemas<ProfileSchemaInterface[]>(response));
            })
            .catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("console:manage.notifications.getProfileSchema.error.message")
                    })
                    );
                }

                dispatch(
                    addAlert<AlertInterface>({
                        description: t(
                            "console:manage.notifications.getProfileSchema.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.notifications.getProfileSchema.genericError.message"
                        )
                    })
                );
            })
            .finally(() => {
                dispatch(setProfileSchemaRequestLoadingStatus(false));
            });
    };

    const onSubmit = (values: Record<string, unknown>) => {
        const data: Claim = {
            attributeMapping: claim.attributeMapping,
            claimURI: claim.claimURI,
            description: values?.description !== undefined ? values.description?.toString() : claim?.description,
            displayName: values?.name !== undefined ? values.name?.toString() : claim?.displayName,
            displayOrder: attributeConfig.editAttributes.getDisplayOrder(
                claim.displayOrder, values.displayOrder?.toString()),
            properties: claim.properties,
            readOnly: values?.readOnly !== undefined ? !!values.readOnly : claim?.readOnly,
            regEx:  values?.regularExpression !== undefined ? values.regularExpression?.toString() : claim?.regEx,
            required: values?.required !== undefined && !values?.readOnly ? !!values.required : false,
            supportedByDefault: values?.supportedByDefault !== undefined
                ? !!values.supportedByDefault : claim?.supportedByDefault
        };

        setIsSubmitting(true);

        updateAClaim(claim.id, data).then(() => {
            dispatch(addAlert(
                {
                    description: t("claims:local.notifications." +
                        "updateClaim.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("claims:local.notifications." +
                        "updateClaim.success.message")
                }
            ));
            update();
            fetchUpdatedSchemaList();
        }).catch((error: IdentityAppsError) => {
            dispatch(addAlert(
                {
                    description: error?.description
                        || t("claims:local.notifications.updateClaim." +
                            "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("claims:local.notifications." +
                            "updateClaim.genericError.description")
                }
            ));
        })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <>
            { confirmDelete && deleteConfirmation() }
            <EmphasizedSegment padded="very">
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column tablet={ 16 } computer={ 12 } largeScreen={ 9 } widescreen={ 6 } mobile={ 16 }>
                            <SemanticForm>
                                <SemanticForm.Field
                                    data-testid={ `${ testId }-form-attribute-uri-readonly-input` }
                                >
                                    <label>{ t("claims:local.attributes.attributeURI") }</label>
                                    <CopyInputField value={ claim ? claim.claimURI : "" } />
                                    <Hint>Unique identifier of the attribute.</Hint>
                                </SemanticForm.Field>
                            </SemanticForm>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Form
                    id={ FORM_ID }
                    uncontrolledForm={ true }
                    onSubmit={ (values: Record<string, unknown>): void => {
                        onSubmit(values as Record<string, unknown>);
                    } }
                    data-testid={ testId }
                >
                    <Field.Input
                        ariaLabel="name"
                        inputType="name"
                        name="name"
                        label={ t("claims:local.forms.name.label") }
                        required={ true }
                        message={ t("claims:local.forms." +
                            "name.requiredErrorMessage") }
                        placeholder={ t("claims:local.forms.name.placeholder") }
                        value={ claim?.displayName }
                        ref={ nameField }
                        validation={ (value: string) => {
                            if (!value.toString().match(/^[A-za-z0-9#+._\-\s]{1,30}$/)) {
                                return t("claims:local" +
                                    ".forms.name.validationErrorMessages.invalidName");
                            }
                        } }
                        data-testid={ `${ testId }-form-name-input` }
                        maxLength={ 30 }
                        minLength={ 1 }
                        hint={ t("claims:local.forms.nameHint") }
                        readOnly={ isReadOnly }

                    />
                    <Field.Textarea
                        ariaLabel="description"
                        inputType="description"
                        name="description"
                        label={ t("claims:local.forms.description.label") }
                        required={ false }
                        requiredErrorMessage=""
                        placeholder={
                            t("claims:local.forms.description.placeholder")
                        }
                        ref={ descriptionField }
                        value={ claim?.description }
                        maxLength={ 255 }
                        minLength={ 3 }
                        data-testid={ `${ testId }-form-description-input` }
                        hint={ t("claims:local.forms.descriptionHint") }
                        readOnly={ isReadOnly }
                    />

                    { !attributeConfig.localAttributes.createWizard.showRegularExpression && !hideSpecialClaims
                        && (
                            <Field.Input
                                ariaLabel="regularExpression"
                                inputType="default"
                                name="regularExpression"
                                label={ t("claims:local.forms.regEx.label") }
                                required={ false }
                                requiredErrorMessage=""
                                placeholder={ t("claims:local.forms.regEx.placeholder") }
                                value={ claim?.regEx }
                                ref={ regExField }
                                data-testid={ `${ testId }-form-regex-input` }
                                maxLength={ ClaimManagementConstants.REGEX_FIELD_MAX_LENGTH }
                                minLength={ ClaimManagementConstants.REGEX_FIELD_MIN_LENGTH }
                                hint={ t("claims:local.forms.regExHint") }
                                readOnly={ isReadOnly }
                            />
                        )
                    }
                    { !READONLY_CLAIM_CONFIGS.includes(claim?.claimURI) &&  mappingChecked
                        ? (
                            !hideSpecialClaims &&
                            (<Grid.Row columns={ 1 } >
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                                    <Message
                                        type="info"
                                        content={
                                            !hasMapping ? (
                                                <>
                                                    { t("claims:local.forms.infoMessages." +
                                                        "disabledConfigInfo") }
                                                    <div>
                                                        Add SCIM mapping from
                                                        <Link
                                                            external={ false }
                                                            onClick={ () =>
                                                                history.push(
                                                                    AppConstants.getPaths().get("SCIM_MAPPING")
                                                                )
                                                            }
                                                        > here
                                                        </Link>.
                                                    </div>
                                                </>
                                            ):(
                                                t("claims:local.forms.infoMessages." +
                                                    "configApplicabilityInfo")
                                            )
                                        }
                                    />
                                </Grid.Column>
                            </Grid.Row>)
                        )
                        : null
                    }
                    {
                        //Hides on user_id, username and groups claims
                        claim && !READONLY_CLAIM_CONFIGS.includes(claim?.claimURI)
                            && claim.claimURI !== ClaimManagementConstants.USER_ID_CLAIM_URI
                            && claim.claimURI !== ClaimManagementConstants.USER_NAME_CLAIM_URI
                            && claim.claimURI !== ClaimManagementConstants.GROUPS_CLAIM_URI
                            && !hideSpecialClaims && mappingChecked &&
                        (
                            <Field.Checkbox
                                ariaLabel="supportedByDefault"
                                name="supportedByDefault"
                                label={ t("claims:local.forms.supportedByDefault.label") }
                                required={ false }
                                defaultValue={ claim?.supportedByDefault }
                                listen={ (values: Claim) => {
                                    setIsShowDisplayOrder(!!values?.supportedByDefault);
                                } }
                                data-testid={ `${testId}-form-supported-by-default-input` }
                                readOnly={ isReadOnly }
                                disabled={
                                    !hasMapping
                                    || (
                                        accountVerificationEnabled
                                        && selfRegistrationEnabled
                                        && claim?.claimURI === ClaimManagementConstants.EMAIL_CLAIM_URI
                                        && usernameConfig?.enableValidator === "true"
                                    )
                                }
                                {
                                    ...( shouldShowOnProfile
                                        ? { checked: true }
                                        : { defaultValue : claim?.supportedByDefault }
                                    )
                                }
                            />
                        )
                    }
                    {
                        attributeConfig.editAttributes.showDisplayOrderInput
                        && !READONLY_CLAIM_CONFIGS.includes(claim?.claimURI)
                        && isShowDisplayOrder
                        && !hideSpecialClaims
                        && (
                            <Field.Input
                                ariaLabel="displayOrder"
                                inputType="default"
                                name="displayOrder"
                                type="number"
                                min="0"
                                label={ t("claims:local.forms.displayOrder" +
                                    ".label") }
                                required={ false }
                                placeholder={ t("claims:local.forms." +
                                    "displayOrder.placeholder") }
                                value={ claim?.displayOrder.toString() || 0 }
                                maxLength={ 50 }
                                minLength={ 1 }
                                ref={ displayOrderField }
                                data-testid={ `${ testId }-form-display-order-input` }
                                hint={ t("claims:local.forms.displayOrderHint") }
                                readOnly={ isReadOnly }
                            />
                        )
                    }
                    {
                        claim && !READONLY_CLAIM_CONFIGS.includes(claim?.claimURI)
                            && attributeConfig.editAttributes.showRequiredCheckBox
                            && claim.claimURI !== ClaimManagementConstants.GROUPS_CLAIM_URI
                            && !hideSpecialClaims && mappingChecked && (
                            <Field.Checkbox
                                ariaLabel="required"
                                name="required"
                                required={ false }
                                requiredErrorMessage=""
                                label={ t("claims:local.forms.required.label") }
                                data-testid={ `${ testId }-form-required-checkbox` }
                                readOnly={ isReadOnly }
                                hint={ t("claims:local.forms.requiredHint") }
                                listen ={ (value: boolean) => {
                                    isSupportedByDefault(value);
                                } }
                                disabled={
                                    isClaimReadOnly
                                    || !hasMapping
                                    || (
                                        accountVerificationEnabled
                                        && selfRegistrationEnabled
                                        && claim?.claimURI === ClaimManagementConstants.EMAIL_CLAIM_URI
                                        && usernameConfig?.enableValidator === "true"
                                    )
                                }
                                {
                                    ...( isClaimReadOnly
                                        ? { value: false }
                                        : { defaultValue : claim?.required }
                                    )
                                }
                            />
                        )
                    }
                    {
                        accountVerificationEnabled
                        && !READONLY_CLAIM_CONFIGS.includes(claim?.claimURI)
                        && selfRegistrationEnabled
                        && usernameConfig?.enableValidator === "true"
                        && claim?.claimURI === ClaimManagementConstants.EMAIL_CLAIM_URI
                        && (
                            <Message info>
                                <Icon name="info circle" />
                                { t("claims:local.forms.requiredWarning") }
                            </Message>
                        )
                    }
                    {
                        //Hides on user_id, username and groups claims
                        claim && !READONLY_CLAIM_CONFIGS.includes(claim?.claimURI)
                            && claim.claimURI !== ClaimManagementConstants.USER_ID_CLAIM_URI
                            && claim.claimURI !== ClaimManagementConstants.USER_NAME_CLAIM_URI
                            && claim.claimURI !== ClaimManagementConstants.GROUPS_CLAIM_URI
                            && claim.claimURI !== ClaimManagementConstants.EMAIL_CLAIM_URI
                            && !hideSpecialClaims
                            && mappingChecked
                            &&  (
                                <Field.Checkbox
                                    ariaLabel="readOnly"
                                    name="readOnly"
                                    required={ false }
                                    label={ t("claims:local.forms.readOnly.label") }
                                    requiredErrorMessage=""
                                    defaultValue={ claim?.readOnly }
                                    data-testid={ `${ testId }-form-readonly-checkbox` }
                                    readOnly={ isReadOnly }
                                    hint={ t("claims:local.forms.readOnlyHint") }
                                    listen={ (value: boolean) => {
                                        setIsClaimReadOnly(value);
                                    } }
                                    disabled={ !hasMapping }
                                />
                            )
                    }
                    {
                        !hideSpecialClaims &&
                        (
                            <Show
                                when={ AccessControlConstants.ATTRIBUTE_EDIT }
                            >
                                <Field.Button
                                    form={ FORM_ID }
                                    ariaLabel="submit"
                                    size="small"
                                    buttonType="primary_btn"
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
                                    label={ t("common:update") }
                                    name="submit"
                                />
                            </Show>
                        )
                    }
                </Form>
            </EmphasizedSegment>
            <Divider hidden />
            {
                attributeConfig.editAttributes.showDangerZone
                && !READONLY_CLAIM_CONFIGS.includes(claim?.claimURI)
                && !hideSpecialClaims
                && claim.claimURI !== ClaimManagementConstants.EMAIL_CLAIM_URI
                && (
                    <Show when={ AccessControlConstants.ATTRIBUTE_DELETE }>
                        <DangerZoneGroup
                            sectionHeader={ t("common:dangerZone") }
                            data-testid={ `${ testId }-danger-zone-group` }
                        >
                            <DangerZone
                                actionTitle={ t("claims:local.dangerZone.actionTitle") }
                                header={ t("claims:local.dangerZone.header") }
                                subheader={ t("claims:local.dangerZone.subheader") }
                                onActionClick={ () => setConfirmDelete(true) }
                                data-testid={ `${ testId }-local-claim-delete-danger-zone` }
                            />
                        </DangerZoneGroup>
                    </Show>
                )
            }
        </>
    );
};

/**
 * Default props for the component.
 */
EditBasicDetailsLocalClaims.defaultProps = {
    "data-testid": "local-claims-basic-details-edit"
};
