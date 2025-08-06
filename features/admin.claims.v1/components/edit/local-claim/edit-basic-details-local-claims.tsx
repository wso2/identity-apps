/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import IconButton from "@oxygen-ui/react/IconButton";
import Paper from "@oxygen-ui/react/Paper";
import Table from "@oxygen-ui/react/Table";
import TableBody from "@oxygen-ui/react/TableBody";
import TableCell from "@oxygen-ui/react/TableCell";
import TableHead from "@oxygen-ui/react/TableHead";
import TableRow from "@oxygen-ui/react/TableRow";
import { TrashIcon } from "@oxygen-ui/react-icons";
import { Show, useRequiredScopes } from "@wso2is/access-control";
import useGetAllLocalClaims from "@wso2is/admin.claims.v1/api/use-get-all-local-claims";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { attributeConfig } from "@wso2is/admin.extensions.v1";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import {
    ConnectorPropertyInterface,
    GovernanceConnectorInterface,
    ServerConfigurationsConstants,
    getConnectorDetails } from "@wso2is/admin.server-configurations.v1";
import { getProfileSchemas } from "@wso2is/admin.users.v1/api";
import { getUsernameConfiguration } from "@wso2is/admin.users.v1/utils/user-management-utils";
import { useValidationConfigData } from "@wso2is/admin.validation.v1/api";
import { ValidationFormInterface } from "@wso2is/admin.validation.v1/models";
import { IdentityAppsError } from "@wso2is/core/errors";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import {
    AlertInterface,
    AlertLevels,
    Claim,
    ClaimDataType,
    ClaimDialect,
    ClaimInputFormat,
    ExternalClaim,
    ProfileSchemaInterface,
    SharedProfileValueResolvingMethod,
    TestableComponentInterface,
    UniquenessScope
} from "@wso2is/core/models";
import { Property } from "@wso2is/core/src/models";
import { addAlert, setProfileSchemaRequestLoadingStatus, setSCIMSchemas } from "@wso2is/core/store";

import { Field, Form } from "@wso2is/form";
import { DropDownItemInterface } from "@wso2is/form/src";
import { DynamicField , KeyValue } from "@wso2is/forms";
import {
    ConfirmationModal,
    CopyInputField,
    DangerZone,
    DangerZoneGroup,
    EmphasizedSegment,
    Heading,
    Hint,
    Link,
    Message,
    Tooltip
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
import { deleteAClaim, getExternalClaims, updateAClaim } from "../../../api";
import useGetClaimDialects from "../../../api/use-get-claim-dialects";
import { ClaimManagementConstants } from "../../../constants";
import "./edit-basic-details-local-claims.scss";

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
    const [ dataType, setDataType ] = useState<string>(claim?.dataType || "");
    const [ inputType, setInputType ] = useState<string>(claim?.inputFormat?.inputType || ClaimInputFormat.TEXT_INPUT);
    const [ multiValued, setMultiValued ] = useState<boolean>(claim?.multiValued || false);
    const [ subAttributes, setSubAttributes ] = useState<string[]>([]);
    const [ canonicalValues, setCanonicalValues ] = useState<KeyValue[]>();

    const nameField: MutableRefObject<HTMLElement> = useRef<HTMLElement>(null);
    const regExField: MutableRefObject<HTMLElement> = useRef<HTMLElement>(null);
    const displayOrderField: MutableRefObject<HTMLElement> = useRef<HTMLElement>(null);
    const descriptionField: MutableRefObject<HTMLElement> = useRef<HTMLElement>(null);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const userSchemaURI: string = useSelector((state: AppState) => state?.config?.ui?.userSchemaURI);

    const hasAttributeUpdatePermissions: boolean = useRequiredScopes(featureConfig?.attributeDialects?.scopes?.update);
    const isUpdatingSharedProfilesEnabled: boolean = !featureConfig?.attributeDialects?.disabledFeatures?.includes(
        "attributeDialects.sharedProfileValueResolvingMethod"
    );
    const [ hideSpecialClaims, setHideSpecialClaims ] = useState<boolean>(true);
    const [ usernameConfig, setUsernameConfig ] = useState<ValidationFormInterface>(undefined);
    const [ connector, setConnector ] = useState<GovernanceConnectorInterface>(undefined);
    const [ accountVerificationEnabled, setAccountVerificationEnabled ] = useState<boolean>(false);
    const [ selfRegistrationEnabled, setSelfRegistrationEnabledEnabled ] = useState<boolean>(false);
    const [ isSystemClaim, setIsSystemClaim ] = useState<boolean>(false);

    const { isSubOrganization } = useGetCurrentOrganizationType();
    const [ isConsoleRequired, setIsConsoleRequired ] = useState<boolean>(false);
    const [ isEndUserRequired, setIsEndUserRequired ] = useState<boolean>(false);
    const [ isSelfRegistrationRequired, setIsSelfRegistrationRequired ] = useState<boolean>(false);
    const [ isConsoleReadOnly, setIsConsoleReadOnly ] = useState<boolean>(false);
    const [ isEndUserReadOnly, setIsEndUserReadOnly ] = useState<boolean>(false);
    const [ isSelfRegistrationReadOnly, setIsSelfRegistrationReadOnly ] = useState<boolean>(false);

    const isDistinctAttributeProfilesDisabled: boolean = featureConfig?.attributeDialects?.disabledFeatures?.includes(
        ClaimManagementConstants.DISTINCT_ATTRIBUTE_PROFILES_FEATURE_FLAG
    );

    const { t } = useTranslation();

    const { data: validationData } = useValidationConfigData();

    const { UIConfig } = useUIConfig();

    const isAgentAttribute: boolean = useMemo(() => {
        const agentAttributeProperty: Property = claim?.properties?.find(
            (property: Property) => property.key === "isAgentClaim"
        );

        return agentAttributeProperty?.value === "true";
    }, [ claim ]);

    const sharedProfileValueResolvingMethodOptions: DropDownItemInterface[] = [
        {
            text: t("claims:local.forms." +
                "sharedProfileValueResolvingMethod.options.fromOrigin"),
            value: SharedProfileValueResolvingMethod.FROM_ORIGIN
        },
        {
            text: t("claims:local.forms.sharedProfileValueResolvingMethod." +
                "options.fromSharedProfile"),
            value: SharedProfileValueResolvingMethod.FROM_SHARED_PROFILE
        },
        {
            text: t("claims:local.forms.sharedProfileValueResolvingMethod." +
                "options.fromFirstFoundInHierarchy"),
            value: SharedProfileValueResolvingMethod.FROM_FIRST_FOUND_IN_HIERARCHY
        }
    ];

    const dataTypeOptions: DropDownItemInterface[] = [
        {
            text: t("claims:local.forms.dataType.options.text"),
            value: ClaimDataType.TEXT
        },
        {
            text: t("claims:local.forms.dataType.options.options"),
            value: ClaimDataType.OPTIONS
        },
        {
            text: t("claims:local.forms.dataType.options.integer"),
            value: ClaimDataType.INTEGER
        },
        {
            text: t("claims:local.forms.dataType.options.decimal"),
            value: ClaimDataType.DECIMAL
        },
        {
            text: t("claims:local.forms.dataType.options.boolean"),
            value: ClaimDataType.BOOLEAN
        },
        {
            text: t("claims:local.forms.dataType.options.dateTime"),
            value: ClaimDataType.DATE_TIME
        },
        {
            text: t("claims:local.forms.dataType.options.object"),
            value: ClaimDataType.COMPLEX
        }
    ];

    const {
        data: fetchedDialects,
        error: fetchDialectsRequestError
    } = useGetClaimDialects(null);

    const enableIdentityClaims: boolean = useSelector((state: AppState) => state?.config?.ui?.enableIdentityClaims);

    const {
        data: fetchedAttributes
    } = useGetAllLocalClaims({
        "exclude-identity-claims": !enableIdentityClaims,
        filter: null,
        limit: null,
        offset: null,
        sort: null
    });

    // Extract custom user schema ID.
    const customUserSchemaID: string = useMemo(() => fetchedDialects?.find(
        (dialect: ClaimDialect) => dialect?.dialectURI === userSchemaURI
    )?.id || null, [ fetchedDialects ]);

    /**
     * Handle the fetch dialects request error.
     */
    useEffect(() => {
        if (fetchDialectsRequestError) {
            dispatch(
                addAlert({
                    description: t(
                        "console:manage.features.claims.dialects.notifications.fetchDialects" +
                            ".genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.claims.dialects.notifications.fetchDialects" +
                            ".genericError.message"
                    )
                })
            );
        }
    }, [ fetchDialectsRequestError ]);

    /**
     * Update attribute profile states from claims
     */
    useEffect(() => {

        if (claim?.canonicalValues && Array.isArray(claim.canonicalValues)) {
            setCanonicalValues(
                claim.canonicalValues.map((item: any) => ({
                    key: item.label,
                    value: item.value
                }))
            );
        } else {
            setCanonicalValues([]);
        }

        if (claim && claim.subAttributes && Array.isArray(claim.subAttributes)) {
            setSubAttributes(claim.subAttributes);
        }

        if (claim?.dataType === ClaimDataType.STRING && claim?.canonicalValues?.length > 0) {
            setDataType(ClaimDataType.OPTIONS);
        } else if (claim?.dataType === ClaimDataType.STRING) {
            setDataType(ClaimDataType.TEXT);
        } else {
            setDataType(claim?.dataType || ClaimDataType.STRING);
        }

        setInputType(claim?.inputFormat?.inputType || ClaimInputFormat.TEXT_INPUT);
        setIsConsoleRequired(claim?.profiles?.console?.required ?? claim?.required);
        setIsEndUserRequired(claim?.profiles?.endUser?.required ?? claim?.required);
        setIsSelfRegistrationRequired(claim?.profiles?.selfRegistration?.required ?? claim?.required);

        setIsConsoleReadOnly(claim?.profiles?.console?.readOnly ?? claim?.readOnly);
        setIsEndUserReadOnly(claim?.profiles?.endUser?.readOnly ?? claim?.readOnly);
        setIsSelfRegistrationReadOnly(claim?.profiles?.selfRegistration?.readOnly ?? claim?.readOnly);
    }, [ claim ]);

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

        setIsSystemClaim(
            claim?.properties?.some((property: Property) =>
                property.key === ClaimManagementConstants.SYSTEM_CLAIM_PROPERTY_NAME
                && property.value === "true"
            )
        );
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
    }, [ claim, customUserSchemaID ]);

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
        dialectID.push(ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("SCIM2_SCHEMAS_EXT_SYSTEM"));

        if (customUserSchemaID) {
            dialectID.push(customUserSchemaID);
        }

        return dialectID;
    };

    // Temporary fix to check system claims and make them readonly
    const isReadOnly: boolean = useMemo(() => {
        if (hideSpecialClaims || isAgentAttribute) {
            return true;
        } else {
            return !hasAttributeUpdatePermissions;
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

    const subAttributeDropdownOptions: DropDownItemInterface[] = useMemo(() => {
        if (!props.claim) return [];

        return fetchedAttributes
            ?.filter((claim: Claim) => {
                const isSystemClaim: boolean = claim.properties?.some(
                    (property: Property) =>
                        property.key === "isSystemClaim" && property.value === "true"
                );
                const isCurrentClaim: boolean = claim.claimURI === props.claim.claimURI;
                const isAlreadySelected: boolean = subAttributes.includes(claim.claimURI);

                return !isSystemClaim && !isCurrentClaim && !isAlreadySelected;
            })
            .map((claim: Claim) => ({
                text: claim.claimURI,
                value: claim.claimURI
            }))
            .sort(
                (a: { text: string }, b: { text: string }) =>
                    a.text.localeCompare(b.text)
            ) ?? [];
    }, [ fetchedAttributes, subAttributes, props.claim?.claimURI ]);

    const onSubmit = (values: Record<string, unknown>) => {
        let data: Claim;

        if (dataType === ClaimDataType.COMPLEX && subAttributes.length === 0) {
            dispatch(
                addAlert({
                    description: t("claims:local.forms.subAttributes.validationError"),
                    level: AlertLevels.ERROR,
                    message: t("claims:local.forms.subAttributes.validationErrorMessage")
                })
            );

            return;
        }

        if (dataType === ClaimDataType.OPTIONS && canonicalValues.length === 0) {
            dispatch(
                addAlert({
                    description: t("claims:local.forms.canonicalValues.validationError"),
                    level: AlertLevels.ERROR,
                    message: t("claims:local.forms.canonicalValues.validationErrorMessage")
                })
            );

            return;
        }
        if (isDistinctAttributeProfilesDisabled) {
            // Use the legacy configuration.
            data = {
                attributeMapping: claim.attributeMapping,
                canonicalValues: values?.canonicalValues !== undefined
                    ? (values.canonicalValues as KeyValue[]).map((item: KeyValue) => ({
                        label: item.key,
                        value: item.value
                    }))
                    : canonicalValues?.map((item: KeyValue) => ({
                        label: item.key,
                        value: item.value
                    })),
                claimURI: claim.claimURI,
                dataType: dataType === ClaimDataType.TEXT || dataType === ClaimDataType.OPTIONS
                    ? ClaimDataType.STRING
                    : dataType,
                description: values?.description !== undefined
                    ? values.description?.toString()
                    : claim?.description,
                displayName: values?.name !== undefined
                    ? values.name?.toString()
                    : claim?.displayName,
                displayOrder: attributeConfig.editAttributes.getDisplayOrder(
                    claim.displayOrder, values.displayOrder?.toString()),
                inputFormat: inputType ? { inputType: inputType } : claim?.inputFormat,
                multiValued: multiValued,
                properties: claim?.properties,
                readOnly: values?.readOnly !== undefined
                    ? !!values.readOnly
                    : claim?.readOnly,
                regEx:  values?.regularExpression !== undefined
                    ? values.regularExpression?.toString()
                    : claim?.regEx,
                required: values?.required !== undefined && !values?.readOnly
                    ? !!values.required
                    : false,
                sharedProfileValueResolvingMethod: values?.sharedProfileValueResolvingMethod !== undefined
                    ? values?.sharedProfileValueResolvingMethod as SharedProfileValueResolvingMethod
                    : claim?.sharedProfileValueResolvingMethod,
                subAttributes: dataType === ClaimDataType.COMPLEX ? subAttributes : undefined,
                supportedByDefault: values?.supportedByDefault !== undefined
                    ? !!values.supportedByDefault
                    : claim?.supportedByDefault,
                uniquenessScope: values?.uniquenessScope !== undefined
                    ? values?.uniquenessScope as UniquenessScope
                    : claim?.uniquenessScope
            };
        } else {
            // Use the new configuration.
            data = {
                attributeMapping: claim.attributeMapping,
                canonicalValues: values?.canonicalValues !== undefined
                    ? (values.canonicalValues as KeyValue[]).map((item: KeyValue) => ({
                        label: item.key,
                        value: item.value
                    }))
                    : canonicalValues?.map((item: KeyValue) => ({
                        label: item.key,
                        value: item.value
                    })),
                claimURI: claim.claimURI,
                dataType: dataType === ClaimDataType.TEXT || dataType === ClaimDataType.OPTIONS
                    ? ClaimDataType.STRING
                    : dataType,
                description: values?.description !== undefined
                    ? values.description?.toString()
                    : claim?.description,
                displayName: values?.name !== undefined
                    ? values.name?.toString()
                    : claim?.displayName,
                displayOrder: attributeConfig.editAttributes.getDisplayOrder(
                    claim.displayOrder, values.displayOrder?.toString()),
                inputFormat: inputType ? { inputType: inputType } : claim?.inputFormat,
                multiValued: multiValued,
                profiles: {
                    console: {
                        readOnly: values?.consoleReadOnly !== undefined ?
                            !!values.consoleReadOnly
                            : claim?.profiles?.console?.readOnly,
                        required: values?.consoleRequired !== undefined ?
                            (!isConsoleReadOnly && !!values.consoleRequired)
                            : claim?.profiles?.console?.required,
                        supportedByDefault: values?.consoleSupportedByDefault !== undefined ?
                            (isConsoleRequired || !!values.consoleSupportedByDefault)
                            : claim?.profiles?.console?.supportedByDefault
                    },
                    endUser: {
                        readOnly: values?.endUserReadOnly !== undefined ?
                            !!values.endUserReadOnly
                            : claim?.profiles?.endUser?.readOnly,
                        required: values?.endUserRequired !== undefined ?
                            (!isEndUserReadOnly && !!values.endUserRequired)
                            : claim?.profiles?.endUser?.required,
                        supportedByDefault: values?.endUserSupportedByDefault !== undefined ?
                            (isEndUserRequired || !!values.endUserSupportedByDefault)
                            : claim?.profiles?.endUser?.supportedByDefault
                    },
                    selfRegistration: {
                        readOnly: values?.selfRegistrationReadOnly !== undefined
                            ? !!values.selfRegistrationReadOnly
                            : claim?.profiles?.selfRegistration?.readOnly,
                        required: values?.selfRegistrationRequired !== undefined ?
                            !!values.selfRegistrationRequired
                            : claim?.profiles?.selfRegistration?.required,
                        supportedByDefault: values?.selfRegistrationSupportedByDefault !== undefined ?
                            (isSelfRegistrationRequired || !!values.selfRegistrationSupportedByDefault)
                            : claim?.profiles?.selfRegistration?.supportedByDefault
                    }
                },
                properties: claim?.properties,
                readOnly: values?.readOnly !== undefined ? !!values.readOnly : claim?.readOnly,
                regEx:  values?.regularExpression !== undefined ? values.regularExpression?.toString() : claim?.regEx,
                required: values?.required !== undefined && !values?.readOnly ? !!values.required : false,
                sharedProfileValueResolvingMethod: values?.sharedProfileValueResolvingMethod !== undefined
                    ? values?.sharedProfileValueResolvingMethod as SharedProfileValueResolvingMethod
                    : claim?.sharedProfileValueResolvingMethod,
                subAttributes: dataType === ClaimDataType.COMPLEX ? subAttributes : undefined,
                supportedByDefault: values?.supportedByDefault !== undefined
                    ? !!values.supportedByDefault : claim?.supportedByDefault,
                uniquenessScope: values?.uniquenessScope !== undefined
                    ? values?.uniquenessScope as UniquenessScope
                    : claim?.uniquenessScope
            };
        }

        if (isSystemClaim || !isUpdatingSharedProfilesEnabled) {
            delete data.sharedProfileValueResolvingMethod;
        }

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

    const resolveAttributeSupportedByDefaultRow = (): ReactElement => {
        const isSupportedByDefaultCheckboxDisabled: boolean = isReadOnly || isSubOrganization() || !hasMapping
            || (
                accountVerificationEnabled
                && selfRegistrationEnabled
                && claim?.claimURI ===
                    ClaimManagementConstants.EMAIL_CLAIM_URI
                && usernameConfig?.enableValidator === "true"
            );

        return (
            <TableRow>
                <TableCell>
                    { t("claims:local.forms.profiles.displayByDefault") }
                    <Tooltip
                        compact
                        trigger={ (
                            <Icon name="info circle" color="grey" className="ml-1" />
                        ) }
                        content={
                            t("claims:local.forms.profiles.displayByDefaultHint")
                        }
                    />
                </TableCell>
                <TableCell align="center">
                    <Field.Checkbox
                        ariaLabel="Display by default in console"
                        name="consoleSupportedByDefault"
                        defaultValue={ claim?.profiles?.console?.supportedByDefault ?? claim?.supportedByDefault }
                        data-componentid={
                            `${ testId }-form-console-supported-by-default-checkbox` }
                        readOnly={ isSupportedByDefaultCheckboxDisabled }
                        {
                            ...( isConsoleRequired
                                ? { checked: true }
                                : { defaultValue: claim?.profiles?.console?.supportedByDefault
                                    ?? claim?.supportedByDefault }
                            )
                        }
                    />
                </TableCell>
                <TableCell align="center">
                    <Field.Checkbox
                        ariaLabel="Display by default in My Account"
                        name="endUserSupportedByDefault"
                        defaultValue={ claim?.profiles?.endUser?.supportedByDefault ?? claim?.supportedByDefault }
                        data-componentid={ `${ testId }-form-end-user-supported-by-default-checkbox` }
                        readOnly={ isSupportedByDefaultCheckboxDisabled }
                        {
                            ...( isEndUserRequired
                                ? { checked: true }
                                : { defaultValue: claim?.profiles?.endUser?.supportedByDefault
                                    ?? claim?.supportedByDefault }
                            )
                        }
                    />
                </TableCell>
                <TableCell align="center">
                    <Field.Checkbox
                        ariaLabel="Display by default in self-registration"
                        name="selfRegistrationSupportedByDefault"
                        defaultValue={ claim?.profiles?.selfRegistration?.supportedByDefault ??
                            claim?.supportedByDefault }
                        data-componentid={
                            `${ testId }-form-self-registration-supported-by-default-checkbox` }
                        readOnly={ isSupportedByDefaultCheckboxDisabled }
                        {
                            ...( isSelfRegistrationRequired
                                ? { checked: true }
                                : { defaultValue: claim?.profiles?.selfRegistration?.supportedByDefault ??
                                    claim?.supportedByDefault }
                            )
                        }
                    />
                </TableCell>
            </TableRow>
        );
    };

    const setDefaultInputTypeForDataType = (dataType: ClaimDataType, multiValued: boolean): void => {

        switch (dataType) {
            case ClaimDataType.OPTIONS:
                setInputType(multiValued ? ClaimInputFormat.MULTI_SELECT_DROPDOWN : ClaimInputFormat.DROPDOWN);

                break;
            case ClaimDataType.BOOLEAN:
                setInputType(ClaimInputFormat.CHECKBOX);

                break;
            default:
                setInputType(ClaimInputFormat.TEXT_INPUT);
        }
    };

    const resolveInputFormatOptions = (dataType: ClaimDataType, multiValued: boolean): DropDownItemInterface[] => {

        const textInputOption: DropDownItemInterface[] = [
            {
                text: t("claims:local.forms.inputFormat.options.textInput"),
                value: ClaimInputFormat.TEXT_INPUT
            }
        ];

        if (dataType === ClaimDataType.DATE_TIME) {
            return [
                ...textInputOption,
                {
                    text: t("claims:local.forms.inputFormat.options.datePicker"),
                    value: ClaimInputFormat.DATE_PICKER
                }
            ];
        }

        if (dataType === ClaimDataType.OPTIONS) {
            if (multiValued) {
                return [
                    {
                        text: t("claims:local.forms.inputFormat.options.multiSelectDropdown"),
                        value: ClaimInputFormat.MULTI_SELECT_DROPDOWN
                    },
                    {
                        text: t("claims:local.forms.inputFormat.options.checkBoxGroup"),
                        value: ClaimInputFormat.CHECKBOX_GROUP
                    }
                ];
            }

            return [
                {
                    text: t("claims:local.forms.inputFormat.options.radioGroup"),
                    value: ClaimInputFormat.RADIO_GROUP
                },
                {
                    text: t("claims:local.forms.inputFormat.options.dropdown"),
                    value: ClaimInputFormat.DROPDOWN
                }
            ];
        }

        if (dataType === ClaimDataType.INTEGER) {
            return [
                ...textInputOption,
                {
                    text: t("claims:local.forms.inputFormat.options.numberInput"),
                    value: ClaimInputFormat.NUMBER_INPUT
                }
            ];
        }

        if (dataType === ClaimDataType.BOOLEAN) {
            return [
                {
                    text: t("claims:local.forms.inputFormat.options.checkbox"),
                    value: ClaimInputFormat.CHECKBOX
                },
                {
                    text: t("claims:local.forms.inputFormat.options.toggle"),
                    value: ClaimInputFormat.TOGGLE
                }
            ];
        }

        return textInputOption;
    };

    const resolveAttributeRequiredRow = (): ReactElement => {
        const isRequiredCheckboxDisabled: boolean = isReadOnly || isSubOrganization() || !hasMapping
            || (
                accountVerificationEnabled
                && selfRegistrationEnabled
                && claim?.claimURI === ClaimManagementConstants.EMAIL_CLAIM_URI
                && usernameConfig?.enableValidator === "true"
            );

        return (
            <TableRow>
                <TableCell>
                    { t("claims:local.forms.profiles.required") }
                    <Tooltip
                        compact
                        trigger={ (
                            <Icon name="info circle" color="grey" className="ml-1" />
                        ) }
                        content={
                            t("claims:local.forms.profiles.requiredHint")
                        }
                    />
                </TableCell>
                <TableCell align="center">
                    <Field.Checkbox
                        ariaLabel="Required in console"
                        name="consoleRequired"
                        defaultValue={ claim?.profiles?.console?.required ?? claim?.required }
                        data-componentid={ `${ testId }-form-console-required-checkbox` }
                        readOnly={ isRequiredCheckboxDisabled || isConsoleReadOnly }
                        listen ={ (value: boolean) => {
                            setIsConsoleRequired(value);
                        } }
                        {
                            ...( isConsoleReadOnly
                                ? { value: false }
                                : { defaultValue: claim?.profiles?.console?.required ?? claim?.required }
                            )
                        }
                    />
                </TableCell>
                <TableCell align="center">
                    <Field.Checkbox
                        ariaLabel="Required in My Account"
                        name="endUserRequired"
                        defaultValue={ claim?.profiles?.endUser?.required ?? claim?.required }
                        data-componentid={ `${ testId }-form-end-user-required-checkbox` }
                        readOnly={ isRequiredCheckboxDisabled || isEndUserReadOnly }
                        listen ={ (value: boolean) => {
                            setIsEndUserRequired(value);
                        } }
                        {
                            ...( isEndUserReadOnly
                                ? { value: false }
                                : { defaultValue: claim?.profiles?.endUser?.required ?? claim?.required }
                            )
                        }
                    />
                </TableCell>
                <TableCell align="center">
                    <Field.Checkbox
                        ariaLabel="Required in self-registration"
                        name="selfRegistrationRequired"
                        defaultValue={ claim?.profiles?.selfRegistration?.required ?? claim?.required }
                        data-componentid={ `${ testId }-form-self-registration-required-checkbox` }
                        readOnly={ isRequiredCheckboxDisabled || isSelfRegistrationReadOnly }
                        listen ={ (value: boolean) => {
                            setIsSelfRegistrationRequired(value);
                        } }
                        {
                            ...( isSelfRegistrationReadOnly
                                ? { value: false }
                                : { defaultValue: claim?.profiles?.selfRegistration?.required ?? claim?.required }
                            )
                        }
                    />
                </TableCell>
            </TableRow>
        );
    };

    const resolveAttributeReadOnlyRow = (): ReactElement => {
        const isReadOnlyCheckboxDisabled: boolean = isReadOnly || isSubOrganization() || !hasMapping;

        return (
            <TableRow hideBorder>
                <TableCell>
                    { t("claims:local.forms.profiles.readonly") }
                    <Tooltip
                        compact
                        trigger={ (
                            <Icon name="info circle" color="grey" className="ml-1" />
                        ) }
                        content={
                            t("claims:local.forms.profiles.readonlyHint")
                        }
                    />
                </TableCell>
                <TableCell align="center">
                    <Field.Checkbox
                        ariaLabel="Read-only in console"
                        name="consoleReadOnly"
                        defaultValue={ claim?.profiles?.console?.readOnly ?? claim?.readOnly }
                        data-componentid={ `${ testId }-form-console-readOnly-checkbox` }
                        readOnly={ isReadOnlyCheckboxDisabled }
                        listen ={ (value: boolean) => {
                            setIsConsoleReadOnly(value);
                        } }
                    />
                </TableCell>
                <TableCell align="center">
                    <Field.Checkbox
                        ariaLabel="Read-only in My Account"
                        name="endUserReadOnly"
                        defaultValue={ claim?.profiles?.endUser?.readOnly ?? claim?.readOnly }
                        data-componentid={ `${ testId }-form-end-user-readOnly-checkbox` }
                        readOnly={ isReadOnlyCheckboxDisabled }
                        listen ={ (value: boolean) => {
                            setIsEndUserReadOnly(value);
                        } }
                    />
                </TableCell>
                <TableCell align="center">
                    <Tooltip
                        trigger={ (
                            <Field.Checkbox
                                ariaLabel="Read-only in self-registration"
                                name="selfRegistrationReadOnly"
                                defaultValue={ claim?.profiles?.selfRegistration?.readOnly ?? claim?.readOnly }
                                data-componentid={ `${ testId }-form-self-registration-readOnly-checkbox` }
                                listen ={ (value: boolean) => {
                                    setIsSelfRegistrationReadOnly(value);
                                } }
                                readOnly
                            />
                        ) }
                        content={
                            t("claims:local.forms.profiles.selfRegistrationReadOnlyHint")
                        }
                        compact
                    />
                </TableCell>
            </TableRow>
        );
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
                        readOnly={ isSubOrganization() || isReadOnly }

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
                        readOnly={ isSubOrganization() || isReadOnly }
                    />
                    <Field.Dropdown
                        ariaLabel={ t("claims:local.forms.dataType.label") }
                        name="dataType"
                        label={ t("claims:local.forms.dataType.label") }
                        data-testid={ `${testId}-form-data-type-input` }
                        hint={ t("claims:local.forms.dataType.hint") }
                        disabled={ isSubOrganization() || isSystemClaim || isReadOnly }
                        options={ dataTypeOptions }
                        value={ dataType }
                        onChange={ (
                            event: React.SyntheticEvent<HTMLElement, Event>,
                            data: { value: string }
                        ) => {
                            setSubAttributes([]);
                            setCanonicalValues([]);
                            setDataType(data.value);
                            setDefaultInputTypeForDataType(data.value as ClaimDataType, multiValued);
                            if (data.value === ClaimDataType.COMPLEX || data.value === ClaimDataType.BOOLEAN) {
                                setMultiValued(false);
                            }
                        } }
                    />

                    { dataType === ClaimDataType.COMPLEX && (
                        <>
                            <Field.Dropdown
                                ariaLabel="subAttributes-dropdown"
                                name="subAttributesDropdown"
                                label={ t("claims:local.forms.subAttributes.label") }
                                placeholder={ t("claims:local.forms.subAttributes.placeholder") }
                                options={ subAttributeDropdownOptions }
                                onChange={ (
                                    event: React.SyntheticEvent<HTMLElement, Event>,
                                    data: { value: string }
                                ) => {
                                    if (event.type === "click" && !subAttributes.includes(data.value)) {
                                        setSubAttributes([ ...subAttributes, data.value ]);
                                    }
                                } }
                                data-testid={ `${testId}-form-sub-attributes-dropdown` }
                                disabled={ isSubOrganization() || isSystemClaim || isReadOnly }
                                search
                            />
                            <div className="sub-attribute-list">
                                { subAttributes.map((attribute: string, index: number) => (
                                    <div
                                        className="sub-attribute-row"
                                        key={ index }>
                                        <span>{ attribute }</span>
                                        { !(isSubOrganization() || isSystemClaim || isReadOnly) && (
                                            <IconButton
                                                className="sub-attribute-delete-btn"
                                                disabled={ isReadOnly }
                                                onClick={ () => {
                                                    setSubAttributes(
                                                        subAttributes.filter(
                                                            (item: string) => item !== attribute
                                                        )
                                                    );
                                                } }
                                                data-componentid={ `${testId}-delete-sub-attribute-${index}` }
                                                style={ { marginLeft: "auto" } }
                                            >
                                                <TrashIcon />
                                            </IconButton>
                                        ) }
                                    </div>
                                )) }
                            </div>
                        </>
                    ) }

                    { dataType === ClaimDataType.OPTIONS && (
                        <>
                            <p>{ t("claims:local.forms.canonicalValues.hint") }</p>
                            <DynamicField
                                data={ canonicalValues.map((value: KeyValue) =>
                                    ({ key: value.key, value: value.value })) }
                                keyType="text"
                                keyName={ t("claims:local.forms.canonicalValues.keyLabel") }
                                valueName={ t("claims:local.forms.canonicalValues.valueLabel") }
                                keyRequiredMessage={ t("claims:local.forms.canonicalValues.keyRequiredErrorMessage") }
                                valueRequiredErrorMessage=
                                    { t("claims:local.forms.canonicalValues.valueRequiredErrorMessage") }
                                requiredField={ true }
                                listen={ (data: KeyValue[]) => {
                                    setCanonicalValues(data.map((item: KeyValue) =>
                                        ({ key: item.key, value: item.value })));
                                } }
                                data-testid={ `${testId}-form-canonical-values-dynamic-field` }
                                readOnly={ isSubOrganization() || isReadOnly }
                            />
                        </>
                    ) }

                    <Field.Checkbox
                        ariaLabel={ t("claims:local.forms.multiValued.label") }
                        name="multiValued"
                        label={ t("claims:local.forms.multiValued.label") }
                        required={ false }
                        checked={ multiValued }
                        data-componentid={ `${testId}-form-multi-valued-input` }
                        hint={ isSystemClaim
                            ? t("claims:local.forms.multiValuedSystemClaimHint")
                            : t("claims:local.forms.multiValuedHint") }
                        readOnly={ isSubOrganization() || isSystemClaim || isReadOnly
                            || dataType === ClaimDataType.COMPLEX || dataType === ClaimDataType.BOOLEAN
                        }
                        listen={ (checked: boolean) => {
                            setMultiValued(checked);
                            if (dataType === ClaimDataType.OPTIONS) {
                                setDefaultInputTypeForDataType(dataType as ClaimDataType, checked);
                            }
                        } }
                    />

                    { dataType !== ClaimDataType.COMPLEX && (
                        <Field.Dropdown
                            ariaLabel={ t("claims:local.forms.inputFormat.label") }
                            name="inputFormat"
                            label={ t("claims:local.forms.inputFormat.label") }
                            data-componentid={ `${testId}-form-input-format-input` }
                            hint={ t("claims:local.forms.inputFormat.hint") }
                            disabled={ isSubOrganization() || isReadOnly }
                            options={ resolveInputFormatOptions(dataType as ClaimDataType, multiValued) }
                            value={ inputType }
                            onChange={ (
                                event: React.SyntheticEvent<HTMLElement, Event>,
                                data: { value: string }
                            ) => {
                                setInputType(data.value);
                            } }
                        />
                    ) }
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
                                readOnly={ isSubOrganization() || isReadOnly }
                            />
                        )
                    }
                    { isUpdatingSharedProfilesEnabled &&
                        (
                            <Field.Dropdown
                                ariaLabel="shared-profile-value-resolving-method-dropdown"
                                name={ ClaimManagementConstants.SHARED_PROFILE_VALUE_RESOLVING_METHOD_PROPERTY_NAME }
                                label={ t("claims:local.forms.sharedProfileValueResolvingMethod.label") }
                                data-componentid={ `${ testId }-form-shared-profile-value-resolving-method-dropdown` }
                                hint={ t("claims:local.forms.sharedProfileValueResolvingMethod.hint") }
                                disabled={ isSubOrganization() || isSystemClaim || isReadOnly }
                                options={ sharedProfileValueResolvingMethodOptions }
                                value={ claim?.sharedProfileValueResolvingMethod
                                    || SharedProfileValueResolvingMethod.FROM_ORIGIN
                                }
                            />
                        )
                    }
                    {
                        claim && UIConfig?.isClaimUniquenessValidationEnabled
                            && !hideSpecialClaims
                            && !READONLY_CLAIM_CONFIGS.includes(claim?.claimURI)
                            && !isAgentAttribute && (
                            <Field.Dropdown
                                ariaLabel="uniqueness-scope-dropdown"
                                name={ ClaimManagementConstants.UNIQUENESS_SCOPE_PROPERTY_NAME }
                                label={ t("claims:local.forms.uniquenessScope.label") }
                                data-componentid={ `${ testId }-form-uniqueness-scope-dropdown` }
                                hint={ t("claims:local.forms.uniquenessScopeHint") }
                                disabled={ isSubOrganization() }
                                options={ [
                                    {
                                        text: t("claims:local.forms.uniquenessScope.options.none"),
                                        value: UniquenessScope.NONE
                                    },
                                    {
                                        text: t("claims:local.forms.uniquenessScope.options.withinUserstore"),
                                        value: UniquenessScope.WITHIN_USERSTORE
                                    },
                                    {
                                        text: t("claims:local.forms.uniquenessScope.options.acrossUserstores"),
                                        value: UniquenessScope.ACROSS_USERSTORES
                                    }
                                ] }
                                value={ claim?.uniquenessScope || UniquenessScope.NONE }
                            />
                        )
                    }
                    { !READONLY_CLAIM_CONFIGS.includes(claim?.claimURI) && mappingChecked
                        ? (
                            !hideSpecialClaims && !hasMapping && !isAgentAttribute &&
                            (<Grid.Row columns={ 1 } >
                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 14 }>
                                    <Message
                                        type="info"
                                        content={ (
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
                        isDistinctAttributeProfilesDisabled &&
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
                                readOnly={ isSubOrganization() || isReadOnly }
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
                                readOnly={ isSubOrganization() || isReadOnly }
                            />
                        )
                    }
                    {
                        isDistinctAttributeProfilesDisabled &&
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
                                readOnly={ isSubOrganization() || isReadOnly }
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
                        isDistinctAttributeProfilesDisabled &&
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
                                    readOnly={ isSubOrganization() || isReadOnly }
                                    hint={ t("claims:local.forms.readOnlyHint") }
                                    listen={ (value: boolean) => {
                                        setIsClaimReadOnly(value);
                                    } }
                                    disabled={ !hasMapping }
                                />
                            )
                    }
                    {
                        // Hides on groups claim
                        !isDistinctAttributeProfilesDisabled && claim && !hideSpecialClaims && mappingChecked
                            && claim.claimURI !== ClaimManagementConstants.GROUPS_CLAIM_URI &&
                            !isAgentAttribute && (
                            <>
                                <Divider />
                                <Heading as="h4">
                                    { t("claims:local.forms.profiles.attributeConfigurations.title") }
                                </Heading>
                                <Heading as="h6" color="grey" compact>
                                    { t("claims:local.forms.profiles.attributeConfigurations.description") }
                                </Heading>
                                <Divider hidden />
                                <Paper variant="outlined" elevation={ 0 }>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell align="center">
                                                    { t("claims:local.forms.profiles.administratorConsole") }
                                                </TableCell>
                                                <TableCell align="center">
                                                    { t("claims:local.forms.profiles.endUserProfile") }
                                                </TableCell>
                                                <TableCell align="center">
                                                    { t("claims:local.forms.profiles.selfRegistration") }
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {
                                                // Hides on user_id, username claims
                                                !READONLY_CLAIM_CONFIGS.includes(claim?.claimURI)
                                                    && claim.claimURI !== ClaimManagementConstants.USER_ID_CLAIM_URI
                                                    && claim.claimURI !== ClaimManagementConstants.USER_NAME_CLAIM_URI
                                                    && resolveAttributeSupportedByDefaultRow()
                                            }
                                            {
                                                !READONLY_CLAIM_CONFIGS.includes(claim?.claimURI)
                                                    && attributeConfig.editAttributes.showRequiredCheckBox
                                                    && resolveAttributeRequiredRow()
                                            }
                                            {
                                                // Hides on user_id, username and email claims
                                                !READONLY_CLAIM_CONFIGS.includes(claim?.claimURI)
                                                    && claim.claimURI !== ClaimManagementConstants.USER_ID_CLAIM_URI
                                                    && claim.claimURI !== ClaimManagementConstants.USER_NAME_CLAIM_URI
                                                    && claim.claimURI !== ClaimManagementConstants.EMAIL_CLAIM_URI
                                                    && resolveAttributeReadOnlyRow()
                                            }
                                        </TableBody>
                                    </Table>
                                </Paper>
                            </>
                        )
                    }
                    {
                        !hideSpecialClaims && !isSubOrganization() &&
                        (
                            <Show
                                when={ featureConfig?.attributeDialects?.scopes?.update }
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
                && !isSystemClaim
                && (
                    <Show
                        when={ featureConfig?.attributeDialects?.scopes?.delete }
                    >
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
