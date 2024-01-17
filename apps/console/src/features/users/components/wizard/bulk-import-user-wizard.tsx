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

import {
    AlertTitle,
    Autocomplete,
    AutocompleteRenderGetTagProps,
    AutocompleteRenderInputParams
} from "@mui/material";
import Alert from "@oxygen-ui/react/Alert";
import Box from "@oxygen-ui/react/Box";
import Chip from "@oxygen-ui/react/Chip";
import Divider from "@oxygen-ui/react/Divider";
import InputLabel from "@oxygen-ui/react/InputLabel/InputLabel";
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import {
    AlertLevels,
    ClaimDialect,
    ExternalClaim,
    HttpMethods,
    RolesInterface,
    SCIMResource,
    SCIMSchemaExtension,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    CSVFileStrategy,
    CSVResult,
    ContentLoader,
    FilePicker,
    Heading,
    Hint,
    Link,
    LinkButton,
    Message,
    PickerResult,
    PrimaryButton,
    useWizardAlert
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import Axios,  { AxiosResponse }from "axios";
import React, { FunctionComponent, ReactElement, Suspense, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Button, Dropdown, DropdownItemProps, DropdownProps, Form, Grid, Icon } from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";
import { UsersConstants } from "../../../../extensions/components/users/constants";
import { userConfig } from "../../../../extensions/configs";
import { ClaimManagementConstants } from "../../../../features/claims/constants";
import { getGroupList, useGroupList } from "../../../../features/groups/api";
import { GroupsInterface } from "../../../../features/groups/models";
import { getAllExternalClaims, getDialects, getSCIMResourceTypes } from "../../../claims/api";
import {
    AppConstants,
    ModalWithSidePanel,
    UserStoreDetails,
    UserStoreProperty,
    getCertificateIllustrations,
    history
} from "../../../core";
import { useGetCurrentOrganizationType } from "../../../organizations/hooks/use-get-organization-type";
import { PatchRoleDataInterface } from "../../../roles/models";
import { getAUserStore, getUserStores } from "../../../userstores/api";
import { PRIMARY_USERSTORE } from "../../../userstores/constants";
import { addBulkUsers } from "../../api";
import {
    BlockedBulkUserImportAttributes,
    BulkImportResponseOperationTypes,
    BulkUserImportStatus,
    RequiredBulkUserImportAttributes,
    SpecialMultiValuedComplexAttributes,
    UserManagementConstants
} from "../../constants";
import {
    BulkResponseSummary,
    BulkUserImportOperationResponse,
    BulkUserImportOperationStatus,
    MultipleInviteMode,
    SCIMBulkEndpointInterface,
    SCIMBulkOperation,
    SCIMBulkResponseOperation,
    UserDetailsInterface
} from "../../models";
import { UserManagementUtils } from "../../utils";
import { BulkImportResponseList } from "../bulk-import-response-list";

/**
 * Prototypes for the BulkImportUserWizardComponent.
 */
interface BulkImportUserInterface extends TestableComponentInterface {
    closeWizard: () => void;
    userstore: string;
    ["data-componentid"]?: string;
}

interface CSVAttributeMapping {
    attributeName: string;
    mappedLocalClaimURI: string;
    mappedSCIMAttributeURI: string;
    mappedSCIMClaimDialectURI: string;
    claimURI?: string;
}

interface MultiValuedComplexAttribute {
    [key: string] : string | boolean;
}

type ValidationError = {
    descriptionKey: string;
    messageKey: string;
    descriptionValues?: { [key: string]: string };
};

interface Validation {
    check: () => boolean;
    error: ValidationError;
}

interface User {
    value: string;
    display: string;
}

interface GroupMemberAssociation {
    id: string;
    displayName: string;
    members: User[];
}

const ASK_PASSWORD_ATTRIBUTE: string = "identity/askPassword";
const CSV_FILE_PROCESSING_STRATEGY: CSVFileStrategy = new CSVFileStrategy(
    undefined,  // Mimetype.
    userConfig.bulkUserImportLimit.fileSize * CSVFileStrategy.KILOBYTE,  // File Size.
    userConfig.bulkUserImportLimit.userCount  // Row Count.
);
const DATA_VALIDATION_ERROR: string = "Data validation error";
const TIMEOUT_ERROR: string = "TIMEOUT_ERROR";
const ADDRESS_HOME_ATTRIBUTE: string = "addresses#home";
const ADDRESS_ATTRIBUTE: string = "addresses";
const HOME_ATTRIBUTE: string = "home";
const BULK_ID: string = "bulkId";
const FILE_IMPORT_TIMEOUT: number = 60000; // 1 minutes.

/**
 *  BulkImportUserWizard component.
 *
 * @param props - Props injected to the component.
 * @returns BulkImportUser
 */
export const BulkImportUserWizard: FunctionComponent<BulkImportUserInterface> = (
    props: BulkImportUserInterface
): ReactElement => {
    const { closeWizard, userstore, ["data-componentid"]: componentId } = props;

    const { t } = useTranslation();
    const { isSubOrganization } = useGetCurrentOrganizationType();

    const dispatch: Dispatch = useDispatch();

    const [ selectedCSVFile, setSelectedCSVFile ] = useState<File>(null);
    const [ userData, setUserData ] = useState<CSVResult>();
    const [ hasError, setHasError ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ response, setResponse ] = useState<BulkUserImportOperationResponse[]>([]);
    const [ manualInviteResponse, setManualInviteResponse ] = useState<BulkUserImportOperationResponse[]>([]);
    const [ showResponseView, setShowResponseView ] = useState<boolean>(false);
    const [ showManualInviteTable, setshowManualInviteTable ] = useState<boolean>(false);
    const [ bulkResponseSummary, setBulkResponseSummary ] = useState<BulkResponseSummary>(initialBulkResponseSummary);
    const [ manualInviteResponseSummary, setManualInviteesponseSummary ]
        = useState<BulkResponseSummary>(initialBulkResponseSummary);
    const [ configureMode, setConfigureMode ] = useState<string>(MultipleInviteMode.MANUAL);
    const [ emailData, setEmailData ] = useState<string[]>();
    const [ isEmailDataError, setIsEmailDataError ] = useState<boolean>(false);
    const [ emailDataError, setEmailDataError ] = useState<string>("");
    const [ groupsData, setGroupsData ] = useState<GroupsInterface[]>();
    const [ alert, setAlert, alertComponent ] = useWizardAlert({ "data-componentid": `${componentId}-alert` });
    const [ manualInviteAlert, setManualInviteAlert, manualInviteAlertComponent ]
        = useWizardAlert({ "data-componentid": `${componentId}-manual-invite-alert` });
    const [ readWriteUserStoresList, setReadWriteUserStoresList ] = useState<DropdownItemProps[]>([]);
    const [ selectedUserStore, setSelectedUserStore ] = useState<string>("");
    const [ isUserStoreError, setUserStoreError ] = useState<boolean>(false);
    const [ fileModeTimeOutError , setFileModeTimeOutError ] = useState<boolean>(false);

    const optionsArray: string[] = [];

    const {
        data: groupList,
        error: groupsError
    } = useGroupList(selectedUserStore, "members", null, true);

    useEffect(() => {
        if (groupsError) {
            dispatch(addAlert({
                description: groupsError?.response?.data?.description ?? groupsError?.response?.data?.detail
                    ?? t("console:manage.features.groups.notifications.fetchGroups.genericError.description"),
                level: AlertLevels.ERROR,
                message: groupsError?.response?.data?.message
                    ?? t("console:manage.features.groups.notifications.fetchGroups.genericError.message")
            }));
        }
    },[ groupsError ]);

    /**
     * Set the user store list.
     */
    useEffect(() => {
        setSelectedUserStore(userstore);
        getUserStoreList();
    }, [ userstore ]);

    /**
     * This will fetch userstore list.
     */
    const getUserStoreList = (): void => {
        setIsLoading(true);
        const userStoreArray: DropdownItemProps[] = [
            {
                key: -1,
                text: t("console:manage.features.users.userstores.userstoreOptions.primary"),
                value: "PRIMARY"
            }
        ];

        getUserStores(null)
            .then((response: UserStoreDetails[]) => {
                response?.forEach(async (item: UserStoreDetails, index: number) => {
                    // Set read/write enabled userstores based on the type.
                    if (await checkReadWriteUserStore(item)) {
                        userStoreArray.push({
                            key: index,
                            text: item.name.toUpperCase(),
                            value: item.name.toUpperCase()
                        });
                    }});

                setUserStoreError(false);
                setReadWriteUserStoresList(userStoreArray);
            }).catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                            ?? t("console:manage.features.userstores.notifications.fetchUserstores.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                            ?? t("console:manage.features.userstores.notifications.fetchUserstores.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:manage.features.userstores.notifications.fetchUserstores.genericError" +
                        ".description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.userstores.notifications.fetchUserstores.genericError.message")
                }));

                setUserStoreError(true);

                return;
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    /**
     * Check the given user store is Read/Write enabled
     *
     * @param userStore - Userstore
     * @returns If the given userstore is read only or not
     */
    const checkReadWriteUserStore = (userStore: UserStoreDetails): Promise<boolean> => {
        let isReadWriteUserStore: boolean = false;

        return getAUserStore(userStore?.id).then((response: UserStoreDetails) => {
            response?.properties?.some((property: UserStoreProperty) => {
                if (property.name === UsersConstants.USER_STORE_PROPERTY_READ_ONLY) {
                    isReadWriteUserStore = property.value === "false";

                    return true;
                }
            });

            return isReadWriteUserStore;
        }).catch(() => {
            dispatch(addAlert({
                description: t("console:manage.features.users.notifications.fetchUserStores.genericError." +
                    "description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.users.notifications.fetchUserStores.genericError.message")
            }));

            return false;
        });
    };

    const hideUserStoreDropdown = (): boolean => {
        if (!userConfig?.enableBulkImportSecondaryUserStore || isUserStoreError) {
            return true;
        }

        if(readWriteUserStoresList) {
            return readWriteUserStoresList?.length === 0 || (readWriteUserStoresList?.length === 1 &&
                readWriteUserStoresList[0]?.value === userstore);
        }
    };

    /**
     * Fetch the group list.
     */
    const getGroupMemberAssociation = async (): Promise<Record<string, GroupMemberAssociation>> => {
        try {
            const response: AxiosResponse = await getGroupList(selectedUserStore);
            const newGroups: Record<string, GroupMemberAssociation> = response?.data?.Resources?.reduce((
                groups: Record<string, GroupMemberAssociation>, group: GroupsInterface) => {
                groups[group?.displayName.toLowerCase()] = {
                    displayName: group?.displayName,
                    id: group?.id,
                    members: []
                };

                return groups;
            }, {});

            return newGroups;
        } catch (error) {
            setHasError(true);
            dispatch(
                addAlert({
                    description: t(
                        "console:manage.features.users.notifications.bulkImportUser.submit.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.users.notifications.bulkImportUser.submit.genericError.message")
                })
            );
        }
    };

    // Validate the input string is an email address.
    const validateEmail = (emailList: string[]) => {

        const emailValidation: boolean = FormValidation.email(emailList[emailList.length-1]);

        if (!emailValidation) {
            setIsEmailDataError(true);
            setEmailDataError(
                t("console:manage.features.users.guestUsers.fields." +
                "username.validations.regExViolation")
            );
            emailList.pop();
        }
    };

    /**
     * Fetches SCIM dialects.
     */
    const getSCIMDialects = async (): Promise<ClaimDialect[]> => {
        setIsLoading(true);

        try {
            // Get SCIM dialect URIs for the user resource.
            const resourceResponse: any = await getSCIMResourceTypes();
            const scimResources: SCIMResource[] = resourceResponse?.Resources;
            let scimDialectsSchemas: string[];

            for (const resource of scimResources) {
                if (resource?.id === "User") {
                    const schemaExtensions: SCIMSchemaExtension[] = resource?.schemaExtensions;

                    scimDialectsSchemas = schemaExtensions.map((extension: SCIMSchemaExtension) => {
                        return extension.schema;
                    });

                    scimDialectsSchemas.push(resource?.schema);
                }
            }

            const dialectResponse: ClaimDialect[] = await getDialects({});

            // Filter only the SCIM dialects.
            const scimDialects: ClaimDialect[] = dialectResponse.filter((dialect: ClaimDialect) => {
                return scimDialectsSchemas.includes(dialect.dialectURI);
            });

            return scimDialects;
        } catch (error) {
            setHasError(true);
            dispatch(
                addAlert({
                    description:
                        error?.response?.data?.description ||
                        t(
                            "console:manage.features.claims.dialects.notifications.fetchDialects" +
                            ".genericError.description"
                        ),
                    level: AlertLevels.ERROR,
                    message:
                        error?.response?.data?.message ||
                        t(
                            "console:manage.features.claims.dialects.notifications.fetchDialects" +
                            ".genericError.message"
                        )
                })
            );
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * This will fetch external claims for each dialect
     * and create a list of already mapped local claims.
     */
    const getClaimMapping = async (): Promise<CSVAttributeMapping[]> => {
        const scimDialects: ClaimDialect[] = await getSCIMDialects();

        const scimClaimPromises: Promise<ExternalClaim[]>[] = [];

        scimDialects.forEach((dialect: ClaimDialect) => {
            scimClaimPromises.push(getAllExternalClaims(dialect.id, null));
        });

        try {
            setIsLoading(true);
            const scimClaimResponse: ExternalClaim[][] = await Axios.all(scimClaimPromises);
            const attributeMapping: CSVAttributeMapping[] = [];

            scimClaimResponse.forEach((claimList: ExternalClaim[]) => {
                const claims: CSVAttributeMapping[] = claimList.map(
                    (item: ExternalClaim): CSVAttributeMapping => {
                        return {
                            attributeName: item?.mappedLocalClaimURI
                                .replace(UserManagementConstants.WSO2_LOCAL_CLAIM_DIALECT+"/", "")
                                .toLowerCase(),
                            mappedLocalClaimURI: item?.mappedLocalClaimURI,
                            mappedSCIMAttributeURI: item?.claimURI,
                            mappedSCIMClaimDialectURI: item?.claimDialectURI
                        };
                    }
                );

                attributeMapping.push(...claims);
            });

            return attributeMapping;
        } catch (error) {
            setHasError(true);
            dispatch(
                addAlert({
                    description:
                        error[0]?.response?.data?.description ||
                        t(
                            "console:manage.features.claims.dialects.notifications." +
                                "fetchExternalClaims.genericError.description"
                        ),
                    level: AlertLevels.ERROR,
                    message:
                        error[0]?.response?.data?.message ||
                        t(
                            "console:manage.features.claims.dialects.notifications." +
                                "fetchExternalClaims.genericError.message"
                        )
                })
            );
        } finally {
            setIsLoading(false);
        }
    };

    const joinWithAnd = (arr: string[]): string => {
        if (arr.length === 0) return "";
        if (arr.length === 1) return arr[0];

        return arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
    };

    const getDuplicateEntries = (array: string[]): string[] => {
        const counts: { [key: string]: number } = array.reduce((acc: { [key: string]: number }, value: string) => {
            const lowerCaseValue: string = value.toLowerCase();

            acc[lowerCaseValue] = (acc[lowerCaseValue] || 0) + 1;

            return acc;
        }, {});

        return Object.keys(counts).filter((key: string) => counts[key] > 1);
    };

    const getMissingFields = (headers: string[], requiredFields: string[]): string[] => {
        return requiredFields.filter((field: string) =>
            !headers.some((header: string) => header.toLowerCase() === field.toLowerCase())
        );
    };

    const isEmptyArray = (array: unknown[]): boolean => {
        return array.length === 0;
    };

    const isEmptyAttribute = (attribute: string): boolean => {
        return !attribute || attribute.trim() === "";
    };

    const getEmptyHeaderIndices = (headers: string[]): number[] => {
        return headers
            .map((header: string, index: number) => (isEmptyAttribute(header) ? index : -1))
            .filter((index: number) => index !== -1);
    };

    const getBlockedAttributes = (headers: string[], blockedAttributes: string[]): string[] => {
        return headers.filter((attribute: string) =>
            blockedAttributes.some((blockedAttribute: string) =>
                attribute.toLowerCase() === blockedAttribute.toLowerCase()
            )
        );
    };

    const getInvalidHeaderAttributes = (headers: string[], externalClaimAttributes: string[]): string[] => {
        return headers.filter((attribute: string) =>
            !externalClaimAttributes.some((externalClaimAttributeName: string) =>
                attribute.toLowerCase() === externalClaimAttributeName.toLowerCase()
            )
        );
    };

    const setValidationError = (error: ValidationError) => {
        setAlert({
            description: t(
                `console:manage.features.users.notifications.bulkImportUser.validation.${error.descriptionKey}`,
                error.descriptionValues || {}
            ),
            level: AlertLevels.ERROR,
            message: t(
                `console:manage.features.users.notifications.bulkImportUser.validation.${error.messageKey}`
            )
        });
    };

    const runValidations = (validations: Validation[]): boolean => {
        for (const validation of validations) {
            if (!validation.check()) {
                setValidationError(validation.error);

                return false;
            }
        }

        return true;
    };

    /**
     * Validate the CSV file.
     *
     * @param userData - user data from the CSV file.
     * @param externalClaimAttributes - external claim attribute names.
     * @returns
     */
    const validateCSVFile = (
        userData: CSVResult,
        externalClaimAttributes: string[]
    ): boolean => {
        const headers: string[] = userData.headers;
        const rows: string[][] = userData.items;

        const requiredFields: string[] = Object.values(RequiredBulkUserImportAttributes);
        const missingFields: string[] = getMissingFields(headers, requiredFields);
        const duplicateEntries: string[] = getDuplicateEntries(headers);
        const blockedAttributes: string[] = Object.values(BlockedBulkUserImportAttributes);
        const blockedHeaders: string[] = getBlockedAttributes(headers, blockedAttributes);
        const invalidHeaders: string[] = getInvalidHeaderAttributes(headers, externalClaimAttributes);
        const emptyHeaderIndices: number[] = getEmptyHeaderIndices(headers);

        const csvValidations: Validation[] = [
            {
                check: () => !(isEmptyArray(headers) || isEmptyArray(rows)),
                error: {
                    descriptionKey: "emptyRowError.description",
                    messageKey: "emptyRowError.message"
                }
            },
            {
                check: () => rows.every((row: string[]) => row.length === headers.length),
                error: {
                    descriptionKey: "columnMismatchError.description",
                    messageKey: "columnMismatchError.message"
                }
            },
            {
                check: () => emptyHeaderIndices.length === 0,
                error: {
                    descriptionKey: "emptyHeaderError.description",
                    messageKey: "emptyHeaderError.message"
                }
            },
            {
                check: () => missingFields.length === 0,
                error: {
                    descriptionKey: "missingRequiredHeaderError.description",
                    descriptionValues: { headers: joinWithAnd(missingFields) },
                    messageKey: "missingRequiredHeaderError.message"
                }
            },
            {
                check: () => blockedHeaders.length === 0,
                error: {
                    descriptionKey: "blockedHeaderError.description",
                    descriptionValues: { headers: joinWithAnd(blockedHeaders) },
                    messageKey: "blockedHeaderError.message"
                }
            },
            {
                check: () => duplicateEntries.length === 0,
                error: {
                    descriptionKey: "duplicateHeaderError.description",
                    descriptionValues: { headers: joinWithAnd(duplicateEntries) },
                    messageKey: "duplicateHeaderError.message"
                }
            },
            {
                check: () => invalidHeaders.length === 0,
                error: {
                    descriptionKey: "invalidHeaderError.description",
                    descriptionValues: { headers: joinWithAnd(invalidHeaders) },
                    messageKey: "invalidHeaderError.message"
                }
            }
        ];

        if (!runValidations(csvValidations)) return false;

        return true;
    };

    /**
     * Get only attributes that are in the header.
     * @param headers - csv header.
     * @param attributeMapping  - attribute mapping.
     * @returns filtered attribute mapping.
     */
    const filterAttributes = (headers: string[], attributeMapping: CSVAttributeMapping[]): CSVAttributeMapping[] => {
        const filteredAttributeList: CSVAttributeMapping[] = headers
            .map((header: string) =>
                attributeMapping.find(
                    (attribute: CSVAttributeMapping) => header.toLowerCase() === attribute.attributeName.toLowerCase()
                )
            )
            .filter(Boolean);

        filteredAttributeList.push(
            attributeMapping.find((attribute: CSVAttributeMapping) =>
                attribute.attributeName.toLowerCase() === (ASK_PASSWORD_ATTRIBUTE.toLowerCase()))
        );

        return filteredAttributeList;
    };

    const setEmptyDataFieldError = (attributeName: string) => {
        setHasError(true);
        setValidationError({
            descriptionKey: "emptyDataField.description",
            descriptionValues: { dataField: attributeName },
            messageKey: "emptyDataField.message"
        });
    };

    /**
     * Get SCIM data for each operation.
     *
     * @param row - user data row.
     * @param filteredAttributeMapping - filtered attribute mapping.
     * @param headers - csv headers.
     * @returns
     */
    const generateUserOperationData =
        (   row: string[],
            filteredAttributeMapping: CSVAttributeMapping[],
            headers: string[]
        ): Record<string, unknown> => {
            const dataObj: Record<string, unknown> = {};
            const schemasSet: Set<string> = new Set([ UserManagementConstants.SCIM2_USER_SCHEMA ]);

            for (const attribute of filteredAttributeMapping) {
                const scimAttribute: string = attribute.mappedSCIMAttributeURI.replace(
                    `${attribute.mappedSCIMClaimDialectURI}:`,
                    ""
                );
                const attributeValue: string = row[headers.indexOf(attribute.attributeName.toLowerCase())];
                const isMultiValued: boolean = scimAttribute.includes("#");

                if (attribute.attributeName === UserManagementConstants.ROLES ||
                    attribute.attributeName === UserManagementConstants.GROUPS) {
                    continue;
                }

                // Handle username attribute.
                if (scimAttribute === RequiredBulkUserImportAttributes.USERNAME) {
                    if (isEmptyAttribute(attributeValue)) {
                        setEmptyDataFieldError(attribute.attributeName);
                        throw new Error(DATA_VALIDATION_ERROR);
                    }

                    dataObj[RequiredBulkUserImportAttributes.USERNAME] = selectedUserStore &&
                    selectedUserStore.toLowerCase() !== PRIMARY_USERSTORE.toLowerCase()
                        ? `${selectedUserStore}/${attributeValue}`
                        : attributeValue;

                    continue;
                }

                // Handle email attribute.
                if (attribute.attributeName === RequiredBulkUserImportAttributes.EMAILADDRESS) {
                    if (isEmptyAttribute(attributeValue)) {
                        setEmptyDataFieldError(attribute.attributeName);
                        throw new Error(DATA_VALIDATION_ERROR);
                    } else if (!FormValidation.email(attributeValue)) {
                        setAlert({
                            description:  t(
                                "console:manage.features.user.forms.addUserForm.inputs.email." +
                                    "validations.invalid"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.user.modals.bulkImportUserWizard.wizardSummary." +
                                "tableMessages.invalidDataMessage")
                        });
                        throw new Error(DATA_VALIDATION_ERROR);
                    }
                }

                // Handle askPassword attribute.
                if (attribute.attributeName.toLowerCase() === ASK_PASSWORD_ATTRIBUTE.toLowerCase()) {
                    dataObj[attribute.mappedSCIMClaimDialectURI] = {
                        ...(dataObj[attribute.mappedSCIMClaimDialectURI] as Record<string, unknown> || {}),
                        [scimAttribute]: "true"
                    };

                    continue;
                }

                // Usage in your existing code
                const specialMultiValuedComplex: SpecialMultiValuedComplexAttributes | undefined =
                Object.values(SpecialMultiValuedComplexAttributes).find(
                    (attrType: string) => scimAttribute.includes(attrType)
                );

                if (!isMultiValued && specialMultiValuedComplex) {
                    const info: MultiValuedComplexAttribute = scimAttribute.includes(specialMultiValuedComplex + ".")
                        ? { type: scimAttribute.split(".")[1], value: attributeValue }
                        : { primary: true, value: attributeValue };

                    dataObj[specialMultiValuedComplex] = dataObj[specialMultiValuedComplex] || [];
                    (dataObj[specialMultiValuedComplex] as unknown[]).push(info);

                    continue;

                }

                // Handle multi-valued address attribute.
                if (scimAttribute.includes(ADDRESS_HOME_ATTRIBUTE)) {
                    dataObj[ADDRESS_ATTRIBUTE] = dataObj[ADDRESS_ATTRIBUTE] || [];
                    (dataObj[ADDRESS_ATTRIBUTE] as unknown[]).push(
                        {
                            type: HOME_ATTRIBUTE,
                            [scimAttribute.replace(`${ADDRESS_HOME_ATTRIBUTE}.`, "")]:
                            attributeValue
                        }
                    );

                    continue;
                }

                // Add the schema to the set
                schemasSet.add(attribute.mappedSCIMClaimDialectURI);

                const cleanedAttribute: string = isMultiValued ? scimAttribute.split("#")[0] : scimAttribute;

                // Handle simple attributes.
                if (!cleanedAttribute.includes(".")) {
                    const target: unknown =
                    attribute.mappedSCIMClaimDialectURI === UserManagementConstants.SCIM2_USER_SCHEMA
                        ? dataObj
                        : dataObj[attribute.mappedSCIMClaimDialectURI] ||
                        (dataObj[attribute.mappedSCIMClaimDialectURI] = {});

                    if (isMultiValued) {
                        target[cleanedAttribute] =
                            ((target[cleanedAttribute] || [] ) as unknown[]).concat(attributeValue);
                    } else {
                        target[cleanedAttribute] = attributeValue;
                    }

                    continue;
                }
                // Handle complex attributes.
                else if (cleanedAttribute.includes(".")) {
                    const [ parentAttr, childAttr ] = cleanedAttribute.split(".");
                    const target: unknown =
                    attribute.mappedSCIMClaimDialectURI === UserManagementConstants.SCIM2_USER_SCHEMA
                        ? dataObj
                        : dataObj[attribute.mappedSCIMClaimDialectURI] ||
                        (dataObj[attribute.mappedSCIMClaimDialectURI] = {});

                    if (isMultiValued) {
                        target[parentAttr] = ((target[parentAttr] || []) as unknown[]).concat({
                            [childAttr]: attributeValue
                        });
                    } else {
                        if (!target[parentAttr]) {
                            target[parentAttr] = {};
                        }
                        target[parentAttr][childAttr] = attributeValue;
                    }

                    continue;
                }
            }

            return {
                schema: Array.from(schemasSet),
                ...dataObj
            };
        };

    /**
     * Generate SCIM User Operation.
     *
     * @param row - user data row.
     * @param filteredAttributeMapping - filtered attribute mapping.
     * @param headers - csv headers.
     * @returns SCIM Operation
     */
    const generateUserOperation = (
        row: string[],
        filteredAttributeMapping: CSVAttributeMapping[],
        headers: string[],
        groupMemberAssociations: Record<string, GroupMemberAssociation>
    ): {
        newGroupMemberAssociations: Record<string, GroupMemberAssociation>;
        userOperation: SCIMBulkOperation;
    } => {
        const asyncOperationID: string = uuidv4();
        const bulkId: string =
            `${BULK_ID}:${row[headers.indexOf(
                RequiredBulkUserImportAttributes.USERNAME.toLowerCase())]}:${asyncOperationID}`;
        const username: string = row[headers.indexOf(RequiredBulkUserImportAttributes.USERNAME.toLowerCase())];
        let newGroupMemberAssociations: Record<string, GroupMemberAssociation> = { ...groupMemberAssociations };

        // Check if groups are included in the headers.
        if (headers.includes(UserManagementConstants.GROUPS)) {
            const csvGroups: string[] = row[headers.indexOf(UserManagementConstants.GROUPS)].split("|");
            const uniqueCSVGroups: string[] = [ ...new Set(csvGroups) ];

            uniqueCSVGroups.forEach((group: string) => {
                if (isEmptyAttribute(group)) return;
                const domainGroupName: string = selectedUserStore &&
                    selectedUserStore.toLowerCase() !== PRIMARY_USERSTORE.toLowerCase()
                    ? `${selectedUserStore}/${group}`
                    : group;

                if (domainGroupName.toLowerCase() in groupMemberAssociations) {
                    newGroupMemberAssociations = addMemberToGroup(domainGroupName, {
                        display: username,
                        value: `bulkId:${bulkId}`
                    }, newGroupMemberAssociations);
                } else {
                    setValidationError({
                        descriptionKey: "invalidGroup.description",
                        descriptionValues: { group: domainGroupName },
                        messageKey: "invalidGroup.message"
                    });
                    throw new Error(DATA_VALIDATION_ERROR);
                }
            });
        }

        const userOperation: SCIMBulkOperation = {
            bulkId,
            data: generateUserOperationData(row, filteredAttributeMapping, headers),
            method: HttpMethods.POST,
            path: UserManagementConstants.SCIM_USER_PATH
        };

        return {
            newGroupMemberAssociations,
            userOperation
        };
    };

    /**
     * Add member to group.
     * @param groupName - group name.
     * @param userBulkId  - user bulk id.
     */
    const addMemberToGroup = (
        groupName: string,
        member: User,
        groupMemberAssociations: Record<string, GroupMemberAssociation>
    ): Record<string, GroupMemberAssociation> => {
        // Copying existing groupMemberAssociations to avoid direct mutation
        const updatedGroupMemberAssociations: Record<string, GroupMemberAssociation> = { ...groupMemberAssociations };

        const existingGroup: GroupMemberAssociation = updatedGroupMemberAssociations[groupName.toLowerCase()];

        updatedGroupMemberAssociations[groupName.toLowerCase()] = {
            ...existingGroup,
            members: Array.from(new Set([ ...existingGroup.members, member ]))
        };

        return updatedGroupMemberAssociations;
    };

    /**
     * Generate SCIM Role Operations.
     *
     * @returns SCIM Role Operations.
     */
    const generateGroupOperations = (
        groupMemberAssociations: Record<string, GroupMemberAssociation>
    ): SCIMBulkOperation[] => {
        const asyncOperationID: string = uuidv4();

        return Object.values(groupMemberAssociations)
            .filter((groupMemberAssociation: GroupMemberAssociation) => groupMemberAssociation.members.length > 0)
            .map((groupMemberAssociation: GroupMemberAssociation) => {
                const bulkId: string = `${BULK_ID}:${groupMemberAssociation.displayName}:${asyncOperationID}`;

                return {
                    bulkId,
                    data: {
                        Operations: [
                            {
                                op: "add",
                                value: {
                                    members: groupMemberAssociation.members.map((user: User) => ({
                                        display: user.display,
                                        value: user.value
                                    }))
                                }
                            }
                        ]
                    },
                    method: HttpMethods.PATCH,
                    path: `${UserManagementConstants.SCIM_GROUP_PATH}/${groupMemberAssociation.id}`
                };
            });
    };

    /**
     * Generate SCIM Bulk Request Body.
     *
     * @param attributeMapping - attribute mapping.
     * @returns SCIMBulkRequestBody
     */
    const generateSCIMRequestBody = async (attributeMapping: CSVAttributeMapping[]):
        Promise<SCIMBulkEndpointInterface> => {
        const headers: string[] = userData.headers.map((header: string) => header.toLowerCase());
        const rows: string[][] = userData.items;


        const filteredAttributeMapping: CSVAttributeMapping[] = filterAttributes(headers, attributeMapping);
        let groupMemberAssociations: Record<string, GroupMemberAssociation> = await getGroupMemberAssociation();

        const userOperations: SCIMBulkOperation[] = [];
        let groupOperations: SCIMBulkOperation[] = [];

        for (let rowNumber: number = 0; rowNumber < rows.length; rowNumber++) {
            const row: string[] = rows[rowNumber];

            const userOperationData: any = generateUserOperation(
                row,
                filteredAttributeMapping,
                headers,
                groupMemberAssociations
            );

            // Append the user operation to the collection.
            userOperations.push(userOperationData.userOperation);

            groupMemberAssociations = userOperationData.newGroupMemberAssociations;
        }

        if (headers.includes(UserManagementConstants.GROUPS)) {
            groupOperations = generateGroupOperations(groupMemberAssociations);
        }

        const operations: SCIMBulkOperation[] = userOperations.concat(groupOperations);

        return {
            Operations: operations,
            failOnErrors: 0,
            schemas: [ UserManagementConstants.BULK_REQUEST_SCHEMA ]
        };
    };

    /**
     * Generate SCIM Bulk Request Body
     *
     * @param attributeMapping - attribute mapping.
     * @returns SCIMBulkRequestBody
     */
    const generateMultipleUsersSCIMRequestBody = (): SCIMBulkEndpointInterface => {
        // Create the data operations.
        const operations: SCIMBulkOperation[] = [];
        const users : { display: string; value: string; }[]= [];
        const asyncOperationID: string = uuidv4();

        // Create the user record.
        emailData?.map((email: string) => {
            const userDetails: UserDetailsInterface = {
                emails: [
                    {
                        primary: true,
                        value: email
                    }
                ],
                schemas: [
                    "urn:ietf:params:scim:schemas:core:2.0:User",
                    "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User"
                ],
                userName:
                    selectedUserStore.toLowerCase() !== PRIMARY_USERSTORE.toLowerCase()
                        ? `${selectedUserStore}/${email}`
                        : email,
                [ userstore.toLowerCase() !== PRIMARY_USERSTORE.toLowerCase()
                    ? UserManagementConstants.CUSTOMSCHEMA
                    : UserManagementConstants.ENTERPRISESCHEMA
                ]: {
                    askPassword: "true"
                }
            };

            const SCIMBulkOperation: SCIMBulkOperation = {
                bulkId: `bulkId:${email}:${asyncOperationID}`,
                data: userDetails,
                method: HttpMethods.POST,
                path: UserManagementConstants.SCIM_USER_PATH
            };

            const user: { display: string; value: string; } = {
                display: email,
                value: `bulkId:bulkId:${email}:${asyncOperationID}`
            };

            users.push(user);
            operations.push(SCIMBulkOperation);
        });

        // Create the group record.
        groupsData?.map((group: GroupsInterface) => {
            const groupDetails: PatchRoleDataInterface = {
                "Operations":[
                    {
                        op: "add",
                        value: {
                            members: users
                        }
                    }
                ]
            };

            const SCIMGroupsOperation: SCIMBulkOperation = {
                bulkId: `bulkId:${group?.displayName}:${asyncOperationID}`,
                data: groupDetails,
                method: HttpMethods.PATCH,
                path: `${UserManagementConstants.SCIM_GROUP_PATH}/${group?.id}`
            };

            operations.push(SCIMGroupsOperation);
        });

        return {
            Operations: operations,
            failOnErrors: 0,
            schemas: [ UserManagementConstants.BULK_REQUEST_SCHEMA ]
        };
    };

    /**
     * Handle multiple user invite.
     */
    const manualInviteMultipleUsers = async () => {
        const handleManualInvite: SCIMBulkEndpointInterface = generateMultipleUsersSCIMRequestBody();

        try {
            const scimResponse: any = await addBulkUsers(handleManualInvite);

            setshowManualInviteTable(true);

            if (scimResponse.status !== 200) {
                throw new Error("Failed to import users.");
            }

            const response: BulkUserImportOperationResponse[]
                = scimResponse.data.Operations.map(generateManualInviteResponse);

            setManualInviteResponse(response);
        } catch (error) {
            setHasError(true);
            setManualInviteAlert({
                description: t(
                    "console:manage.features.users.notifications.bulkImportUser.submit.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.users.notifications.bulkImportUser.submit.genericError.message")
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Handle bulk user import.
     */
    const handleBulkUserImport = async () => {
        setIsSubmitting(true);

        try {
            const attributeMapping: CSVAttributeMapping[] = await getClaimMapping();

            // List of valid attribute names.
            const validAttributeNames: string[] = attributeMapping.map(
                (item: CSVAttributeMapping) => item.attributeName
            );

            if (!validateCSVFile(userData, validAttributeNames)) {
                setHasError(true);
                setIsSubmitting(false);

                return;
            }

            const scimRequestBody: SCIMBulkEndpointInterface = await generateSCIMRequestBody(attributeMapping);

            setShowResponseView(true);

            const scimResponsePromise: Promise<unknown> = addBulkUsers(scimRequestBody);
            const timeoutPromise: Promise<unknown> = new Promise((_: unknown, reject: (reason?: any) => void) => {
                setTimeout(() => reject(
                    new Error(TIMEOUT_ERROR)
                ), FILE_IMPORT_TIMEOUT);
            });

            const scimResponse: any = await Promise.race([ scimResponsePromise, timeoutPromise ]);

            if (scimResponse.status !== 200) {
                throw new Error("Failed to import users.");
            }

            const response: BulkUserImportOperationResponse[] = scimResponse.data.Operations.map(generateBulkResponse);

            setResponse(response);
        } catch (error) {
            setHasError(true);
            if (error.message === TIMEOUT_ERROR) {
                setFileModeTimeOutError(true);
                setAlert({
                    description: t(
                        "console:manage.features.users.notifications.bulkImportUser.timeOut.description"),
                    level: AlertLevels.WARNING,
                    message: t(
                        "console:manage.features.users.notifications.bulkImportUser.timeOut.message")
                });
            } else if (error.message !== DATA_VALIDATION_ERROR) {
                setAlert({
                    description: t(
                        "console:manage.features.users.notifications.bulkImportUser.submit.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.users.notifications.bulkImportUser.submit.genericError.message")
                });
            }
        } finally {
            setIsLoading(false);
            setIsSubmitting(false);
        }
    };

    /**
     * Generate bulk response.
     * @param operation - SCIM bulk operation.
     * @returns - BulkUserImportOperationResponse
     */
    const generateBulkResponse = (operation: SCIMBulkResponseOperation): BulkUserImportOperationResponse => {
        const resourceIdentifier: string = operation?.bulkId.split(":")[1];
        const statusCode: number = operation?.status?.code;
        let operationType: BulkImportResponseOperationTypes = BulkImportResponseOperationTypes.USER_CREATION;

        const defaultMsg: string = t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary." +
        "tableMessages.internalErrorMessage");

        let statusMessages: Record<number, string> = {};

        if (operation?.method === HttpMethods.POST) {
            statusMessages = {
                201: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableMessages." +
                    "userCreatedMessage"),
                202: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableMessages." +
                    "userCreationAcceptedMessage"),
                400: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableMessages." +
                    "invalidDataMessage"),
                409: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableMessages." +
                    "userAlreadyExistsMessage"),
                500: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableMessages." +
                    "internalErrorMessage")
            };
        } else if (operation?.method === HttpMethods.PATCH) {
            operationType = BulkImportResponseOperationTypes.ROLE_ASSIGNMENT;
            statusMessages = {
                200: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableMessages." +
                "userAssignmentSuccessMessage", { resource: resourceIdentifier }),
                400: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableMessages." +
                "userAssignmentFailedMessage", { resource: resourceIdentifier }),
                500: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableMessages." +
                "userAssignmentInternalErrorMessage", { resource: resourceIdentifier })
            };
        }

        // Functional update to update the bulk response summary.
        setBulkResponseSummary((prevSummary: BulkResponseSummary) => {
            const successUserAssignment: number = (operation?.method === HttpMethods.PATCH && statusCode === 200) ?
                prevSummary.successUserAssignment + 1 : prevSummary.successUserAssignment;

            const failedUserAssignment: number = (operation?.method === HttpMethods.PATCH && statusCode !== 200) ?
                prevSummary.failedUserAssignment + 1 : prevSummary.failedUserAssignment;

            const successUserCreation: number =
                (operation?.method === HttpMethods.POST && (statusCode === 201 || statusCode === 202)) ?
                    prevSummary.successUserCreation + 1 :
                    prevSummary.successUserCreation;

            const failedUserCreation: number =
                (operation?.method === HttpMethods.POST && (statusCode !== 201 && statusCode !== 202)) ?
                    prevSummary.failedUserCreation + 1 :
                    prevSummary.failedUserCreation;

            return {
                ...prevSummary,
                failedUserAssignment,
                failedUserCreation,
                successUserAssignment,
                successUserCreation
            };
        });

        let _statusCode: BulkUserImportStatus = BulkUserImportStatus.FAILED;

        if (statusCode === 201 || statusCode === 202 || statusCode === 200) {
            _statusCode = BulkUserImportStatus.SUCCESS;
        }

        return {
            message: statusMessages[statusCode] || defaultMsg,
            operationType,
            resourceIdentifier,
            status: getStatusFromCode(statusCode),
            statusCode: _statusCode
        };
    };

    /**
     * Generate bulk response.
     * @param operation - SCIM bulk operation.
     * @returns - BulkUserImportOperationResponse
     */
    const generateManualInviteResponse = (operation: SCIMBulkResponseOperation): BulkUserImportOperationResponse => {
        const resourceIdentifier: string = operation?.bulkId.split(":")[1];
        const statusCode: number = operation?.status?.code;
        let operationType: BulkImportResponseOperationTypes = BulkImportResponseOperationTypes.USER_CREATION;

        const defaultMsg: string = t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary." +
        "tableMessages.internalErrorMessage");

        let statusMessages: Record<number, string> = {};

        if (operation?.method === HttpMethods.POST) {
            statusMessages = {
                201: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableMessages." +
                    "userCreatedMessage"),
                202: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableMessages." +
                    "userCreationAcceptedMessage"),
                400: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableMessages." +
                    "invalidDataMessage"),
                409: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableMessages." +
                    "userAlreadyExistsMessage"),
                500: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableMessages." +
                    "internalErrorMessage")
            };
        } else if (operation?.method === HttpMethods.PATCH) {
            operationType = BulkImportResponseOperationTypes.ROLE_ASSIGNMENT;
            statusMessages = {
                200: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableMessages." +
                "userAssignmentSuccessMessage", { resource: resourceIdentifier }),
                400: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableMessages." +
                "userAssignmentFailedMessage", { resource: resourceIdentifier }),
                500: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableMessages." +
                "userAssignmentInternalErrorMessage", { resource: resourceIdentifier })
            };
        }

        // Functional update to update the bulk response summary.
        setManualInviteesponseSummary((prevSummary: BulkResponseSummary) => {
            const successUserAssignment: number = (operation?.method === HttpMethods.PATCH && statusCode === 200) ?
                prevSummary.successUserAssignment + 1 : prevSummary.successUserAssignment;

            const failedUserAssignment: number = (operation?.method === HttpMethods.PATCH && statusCode !== 200) ?
                prevSummary.failedUserAssignment + 1 : prevSummary.failedUserAssignment;

            const successUserCreation: number =
                (operation?.method === HttpMethods.POST && (statusCode === 201 || statusCode === 202)) ?
                    prevSummary.successUserCreation + 1 :
                    prevSummary.successUserCreation;

            const failedUserCreation: number =
                (operation?.method === HttpMethods.POST && (statusCode !== 201 && statusCode !== 202)) ?
                    prevSummary.failedUserCreation + 1 :
                    prevSummary.failedUserCreation;

            return {
                ...prevSummary,
                failedUserAssignment,
                failedUserCreation,
                successUserAssignment,
                successUserCreation
            };
        });

        let _statusCode: BulkUserImportStatus = BulkUserImportStatus.FAILED;

        if (statusCode === 201 || statusCode === 202 || statusCode === 200) {
            _statusCode = BulkUserImportStatus.SUCCESS;
        }

        return {
            message: statusMessages[statusCode] || defaultMsg,
            operationType,
            resourceIdentifier,
            status: getStatusFromCode(statusCode),
            statusCode: _statusCode
        };
    };

    /**
     * Get status message from the status code.
     *
     * @param statusCode - Status code from the bulk response.
     * @returns - Status message.
     */
    const getStatusFromCode = (statusCode: number): BulkUserImportOperationStatus => {
        if (statusCode === 201 || statusCode === 200) return t(
            "console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableStatus.success" );
        if (statusCode === 202) return t(
            "console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableStatus.warning" );

        return t(
            "console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableStatus.failed" );
    };

    /**
     * Render Multiple Users mode selection section.
     */
    const resolveMultipleUsersModeSelection = (): ReactElement => {
        return(
            <Grid.Row>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                    <Button.Group
                        size="large"
                        labeled
                        basic
                    >
                        {
                            Object.values(MultipleInviteMode).map((mode: string, index: number) => {
                                return(
                                    <Button
                                        data-componentid={ `${componentId}-${mode}-tab-option` }
                                        key={ index }
                                        active={ configureMode === mode }
                                        className="multiple-users-config-mode-wizard-tab"
                                        content={
                                            UserManagementUtils.resolveMultipleInvitesDisplayName(
                                                mode as MultipleInviteMode
                                            )
                                        }
                                        onClick={ (
                                            event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                                            event.preventDefault();
                                            setConfigureMode(mode);
                                        } }
                                    />
                                );
                            })
                        }
                    </Button.Group>
                </Grid.Column>
            </Grid.Row>
        );
    };

    /**
     * Check if the manual invite button should be disabled.
     * @returns true if the manual invite button should be disabled.
     */
    const isManualInviteButtonDisabled = (): boolean => {
        return isLoading
            || isSubmitting
            || hasError
            || !emailData
            || emailData?.length === 0;
    };

    const userStoreDropDown = (): ReactElement => {
        return (
            <Form.Field required={ true }>
                <InputLabel
                    htmlFor="tags-filled"
                    disableAnimation
                    shrink={ false }
                    margin="dense"
                    className="spacing-bottom"
                    data-componentid={ `${componentId}-userstore-label` }
                >
                    { t("console:manage.features.user.forms.addUserForm." +
                        "inputs.domain.label") }
                </InputLabel>
                <Dropdown
                    className="mt-2"
                    fluid
                    selection
                    labeled
                    options={ readWriteUserStoresList }
                    loading={ false }
                    data-testid={
                        `${componentId}-userstore-dropdown`
                    }
                    data-componentid={
                        `${componentId}-userstore-dropdown`
                    }
                    name="userstore"
                    disabled={ false }
                    readOnly={ false }
                    value={ selectedUserStore }
                    onChange={
                        (e: React.ChangeEvent<HTMLInputElement>,
                            data: DropdownProps) => {
                            setSelectedUserStore(data.value.toString());
                        }
                    }
                    tabIndex={ 1 }
                    maxLength={ 60 }
                />
            </Form.Field>
        );
    };

    /**
     * Render Multiple Users configuration section.
     */
    const resolveMultipleUsersConfiguration = (): ReactElement => {

        if (configureMode == MultipleInviteMode.MANUAL) {
            return (
                <>
                    { manualInviteAlert
                            && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                        { manualInviteAlertComponent }
                                    </Grid.Column>
                                </Grid.Row>
                            )
                    }
                    {
                        !showManualInviteTable
                            ? (
                                <>
                                    { !hideUserStoreDropdown() &&
                                        (<Grid.Row columns={ 1 } className="mb-0 pb-0">
                                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                                { userStoreDropDown() }
                                            </Grid.Column>
                                        </Grid.Row>)
                                    }
                                    <Autocomplete
                                        size="small"
                                        limitTags={ userConfig.bulkUserImportLimit.inviteEmails }
                                        fullWidth
                                        multiple
                                        id="tags-filled"
                                        options={ optionsArray.map((option: string) => option) }
                                        defaultValue={ [] }
                                        freeSolo
                                        renderTags={ (
                                            value: readonly string[],
                                            getTagProps: AutocompleteRenderGetTagProps
                                        ) =>
                                            value.map((option: string, index: number) => (
                                                <Chip
                                                    key={ index }
                                                    size="small"
                                                    sx={ { marginLeft: 1 } }
                                                    className="oxygen-chip-beta"
                                                    label={ option }
                                                    { ...getTagProps({ index }) }
                                                />
                                            ))
                                        }
                                        renderInput={ (params: AutocompleteRenderInputParams) => (
                                            <>
                                                <InputLabel
                                                    htmlFor="tags-filled"
                                                    disableAnimation
                                                    shrink={ false }
                                                    margin="dense"
                                                    className="mt-2"
                                                    data-componentid={ `${componentId}-emails-label` }
                                                >
                                                    {
                                                        t("console:manage.features.user.modals.bulkImportUserWizard" +
                                                        ".wizardSummary.manualCreation.emailsLabel")
                                                    }
                                                </InputLabel>
                                                <TextField
                                                    id="tags-filled"
                                                    margin="normal"
                                                    error={ isEmailDataError }
                                                    helperText= {
                                                        isEmailDataError
                                                        && emailDataError
                                                    }
                                                    InputLabelProps= { {
                                                        required: true
                                                    } }
                                                    { ...params }
                                                    required
                                                    variant="outlined"
                                                    placeholder={
                                                        t("console:manage.features.user.modals.bulkImportUserWizard" +
                                                        ".wizardSummary.manualCreation.emailsPlaceholder")
                                                    }
                                                    data-componentid={ `${componentId}-email-input` }
                                                />
                                            </>
                                        ) }
                                        onChange={ (
                                            event: React.SyntheticEvent<Element, Event>,
                                            value: string[]
                                        ) => {
                                            setEmailData(value);
                                            validateEmail(value);
                                        } }
                                        onInputChange={ () => {
                                            setIsEmailDataError(false);
                                        } }
                                    />
                                    <Hint>
                                        { t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary" +
                                        ".manualCreation.hint" ) }
                                    </Hint>
                                    {
                                        ( <Autocomplete
                                            size="small"
                                            multiple
                                            fullWidth
                                            disablePortal
                                            id="combo-box-demo"
                                            options={
                                                groupList?.Resources ?? []
                                            }
                                            getOptionLabel={ (option: GroupsInterface) => option?.displayName }
                                            renderOption={ (
                                                props: React.HTMLAttributes<HTMLLIElement>,
                                                option: RolesInterface
                                            ) => (
                                                <Box
                                                    component="li"
                                                    { ...props }
                                                >
                                                    <Typography
                                                        sx={ { fontWeight: 500 } }
                                                    >
                                                        { option?.displayName }
                                                    </Typography>
                                                </Box>
                                            ) }
                                            renderInput={ (params: AutocompleteRenderInputParams) =>
                                                (<>
                                                    <InputLabel
                                                        htmlFor="tags-filled"
                                                        disableAnimation
                                                        shrink={ false }
                                                        margin="dense"
                                                        className="mt-2"
                                                        data-componentid={ `${componentId}-roles-label` }
                                                    >
                                                        {
                                                            t("console:manage.features.user.modals." +
                                                            "bulkImportUserWizard.wizardSummary." +
                                                            "manualCreation.groupsLabel")
                                                        }
                                                    </InputLabel>
                                                    <TextField
                                                        id="tags-filled"
                                                        margin="normal"
                                                        InputLabelProps= { {
                                                            required: true
                                                        } }
                                                        { ...params }
                                                        required
                                                        variant="outlined"
                                                        placeholder={
                                                            t("console:manage.features.user.modals." +
                                                            "bulkImportUserWizard.wizardSummary." +
                                                            "manualCreation.groupsPlaceholder")
                                                        }
                                                        data-componentid={ `${componentId}-roles-input` }

                                                    />
                                                </>)
                                            }
                                            onChange={ (
                                                event: React.SyntheticEvent<Element, Event>,
                                                value: RolesInterface[]
                                            ) => {
                                                setGroupsData(value);
                                            } }
                                            renderTags={ (
                                                value: RolesInterface[],
                                                getTagProps: AutocompleteRenderGetTagProps
                                            ) =>
                                                value.map((option: RolesInterface, index: number) => (
                                                    <Chip
                                                        key={ index }
                                                        size="small"
                                                        className="oxygen-chip-beta"
                                                        label={
                                                            (<label>
                                                                { option?.displayName }
                                                            </label>)
                                                        }
                                                        { ...getTagProps({ index }) }
                                                    />
                                                ))
                                            }
                                        />)
                                    }
                                </>
                            )
                            : (
                                <>
                                    { manualInviteAlert && (
                                        <Grid.Row columns={ 1 }>
                                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                                { manualInviteAlertComponent }
                                            </Grid.Column>
                                        </Grid.Row>
                                    ) }
                                    <BulkImportResponseList
                                        isLoading={ isSubmitting }
                                        data-componentid={ `${componentId}-manual-response-list` }
                                        hasError={ hasError }
                                        responseList={ manualInviteResponse }
                                        bulkResponseSummary={ manualInviteResponseSummary }
                                        successAlert={ (
                                            <Alert
                                                severity="success"
                                                data-componentid={ `${componentId}-success-alert` }
                                            >
                                                <AlertTitle data-componentid={ `${componentId}-success-alert-title` }>
                                                    {
                                                        t("console:manage.features.user.modals.bulkImportUserWizard." +
                                                    "wizardSummary.manualCreation.alerts.creationSuccess.message")
                                                    }
                                                </AlertTitle>
                                                {
                                                    t("console:manage.features.user.modals.bulkImportUserWizard." +
                                                "wizardSummary.manualCreation.alerts.creationSuccess.description")
                                                }
                                            </Alert>
                                        ) }
                                    />
                                </>
                            )
                    }
                </>
            );
        } else if (configureMode === MultipleInviteMode.META_FILE) {
            return (
                !showResponseView
                    ? (
                        <>
                            { alert
                                && (
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                            { alertComponent }
                                        </Grid.Column>
                                    </Grid.Row>
                                )
                            }
                            { !isLoading && !hideUserStoreDropdown() &&
                                (
                                    <Grid.Row columns={ 1 } className="mb-0 pb-0">
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                            { userStoreDropDown() }
                                        </Grid.Column>
                                    </Grid.Row>
                                )
                            }
                            <Grid.Row columns={ 1 } className="pt-0">
                                <Grid.Column mobile={ 16 }>
                                    <FilePicker
                                        key={ 1 }
                                        fileStrategy={ CSV_FILE_PROCESSING_STRATEGY }
                                        file={ selectedCSVFile }
                                        onChange={ (
                                            result: PickerResult<{
                                            headers: string[];
                                            items: string[][];
                                        }>) => {
                                            setSelectedCSVFile(result.file);
                                            setUserData(result.serialized);
                                            setAlert(null);
                                            setHasError(false);
                                        } }
                                        uploadButtonText="Upload CSV File"
                                        dropzoneText="Drag and drop a CSV file here."
                                        data-testid={ `${componentId}-form-wizard-csv-file-picker` }
                                        data-componentid={ `${componentId}-form-wizard-csv-file-picker` }
                                        icon={ getCertificateIllustrations().uploadPlaceholder }
                                        placeholderIcon={ <Icon name="file code" size="huge" /> }
                                        normalizeStateOnRemoveOperations={ true }
                                        emptyFileError={ false }
                                        hidePasteOption={ true }
                                    />
                                </Grid.Column>
                            </Grid.Row>
                            {
                                <Hint>
                                    { t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary" +
                                    ".fileBased.hint" ) }
                                </Hint>
                            }
                        </>
                    )
                    : (
                        <>
                            { alert &&
                                (
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                            { alertComponent }
                                        </Grid.Column>
                                    </Grid.Row>

                                )
                            }
                            { !fileModeTimeOutError &&
                                (
                                    <BulkImportResponseList
                                        isLoading={ isSubmitting }
                                        data-componentid={ `${componentId}-response-list` }
                                        hasError={ hasError }
                                        responseList={ response }
                                        bulkResponseSummary={ bulkResponseSummary }
                                    />
                                )
                            }
                        </>
                    )
            );
        }
    };

    /**
     * Renders the help panel containing wizard help.
     *
     * @returns Help Panel.
     */
    const renderHelpPanel = (): ReactElement => {
        return (
            <ModalWithSidePanel.SidePanel>
                <ModalWithSidePanel.Header className="wizard-header help-panel-header muted">
                    <div className="help-panel-header-text">
                        { t("console:develop.features.applications.wizards.minimalAppCreationWizard.help.heading") }
                    </div>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    <Suspense fallback={ <ContentLoader/> }>
                        <Heading as="h5">
                            { t("console:manage.features.user.modals.bulkImportUserWizard.sidePanel.manual") }
                        </Heading>
                        <p>
                            { t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary" +
                                ".manualCreation.hint" ) }
                        </p>
                        <p>
                            { t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary" +
                                ".manualCreation.warningMessage" ) }
                        </p>
                        <Divider />
                        <Heading as="h5">
                            { t("console:manage.features.user.modals.bulkImportUserWizard.sidePanel.fileBased") }
                        </Heading>
                        <p>
                            { t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary" +
                                ".fileBased.hint" ) }
                        </p>
                        <Heading as="h6">
                            { t("console:manage.features.user.modals.bulkImportUserWizard.sidePanel." +
                                "fileFormatTitle") }
                        </Heading>
                        <p>
                            {
                                !isSubOrganization()
                                    ? (
                                        <Trans
                                            i18nKey={
                                                "console:manage.features.user.modals.bulkImportUserWizard.sidePanel." +
                                            "fileFormatContent"
                                            }
                                        >
                                            Headers of the CSV file should be user attributes that are mapped to
                                            local <Link onClick={ navigateToSCIMAttributesPage }>attribute names</Link>.
                                        </Trans>
                                    )
                                    : (
                                        <Trans
                                            i18nKey={
                                                "console:manage.features.user.modals.bulkImportUserWizard.sidePanel." +
                                                "fileFormatContent"
                                            }
                                        >
                                            Headers of the CSV file should be user attributes that are mapped to
                                            <b>local attribute</b> names.
                                        </Trans>
                                    )
                            }

                        </p>
                        <p> { t("console:manage.features.user.modals.bulkImportUserWizard.sidePanel." +
                                "fileFormatSampleHeading") }</p>
                        <p>
                            <code>
                                username,givenname,emailaddress,groups<br />
                                user1,john,john@test.com,group1|group2<br/>
                                user2,jake,jake@test.com,group2<br/>
                                user3,jane,jane@test.com,group1<br/>
                            </code>
                        </p>
                    </Suspense>
                </ModalWithSidePanel.Content>
            </ModalWithSidePanel.SidePanel>
        );
    };

    const navigateToSCIMAttributesPage = () => history.push(AppConstants.getPaths()
        .get("ATTRIBUTE_MAPPINGS")
        .replace(":type", ClaimManagementConstants.SCIM));

    return (
        <ModalWithSidePanel
            data-testid={ componentId }
            data-componentid={ componentId }
            open={ true }
            className="wizard application-create-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <ModalWithSidePanel.MainPanel>
                <ModalWithSidePanel.Header className="wizard-header">
                    { t("console:manage.features.user.modals.bulkImportUserWizard.title") }
                    <Heading as="h6">
                        { t("console:manage.features.user.modals.bulkImportUserWizard.subTitle") }
                    </Heading>
                </ModalWithSidePanel.Header>

                <ModalWithSidePanel.Content className="content-container">
                    <Grid>
                        <>
                            <Grid.Row columns={ 1 }>
                                <Grid.Column>
                                    <Message
                                        icon="mail"
                                        content={ t("console:manage.features.user.modals.bulkImportUserWizard" +
                                        ".wizardSummary.inviteEmailInfo") }
                                        hideDefaultIcon
                                    />
                                </Grid.Column>
                            </Grid.Row>
                        </>
                        { resolveMultipleUsersModeSelection() }
                        { resolveMultipleUsersConfiguration() }
                    </Grid>

                </ModalWithSidePanel.Content>
                <ModalWithSidePanel.Actions>
                    <Grid>
                        {
                            configureMode == MultipleInviteMode.MANUAL
                                ? (
                                    <Grid.Row column={ 1 }>
                                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                            <LinkButton
                                                data-testid={ `${componentId}-close-button` }
                                                data-componentid={ `${componentId}-close-button` }
                                                floated="left"
                                                onClick={ () => {
                                                    closeWizard();
                                                    setshowManualInviteTable(false);
                                                } }
                                                disabled={ isSubmitting }
                                            >
                                                { t("common:close") }
                                            </LinkButton>
                                        </Grid.Column>
                                        { !showManualInviteTable || isSubmitting
                                            ? (
                                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                                    <PrimaryButton
                                                        data-testid={ `${componentId}-invite-button` }
                                                        data-componentid={ `${componentId}-invite-button` }
                                                        floated="right"
                                                        onClick={ manualInviteMultipleUsers }
                                                        loading={ isSubmitting }
                                                        disabled={ isManualInviteButtonDisabled() }
                                                    >
                                                        { t("console:manage.features.user.modals." +
                                                    "bulkImportUserWizard.wizardSummary.manualCreation.primaryButton") }
                                                    </PrimaryButton>
                                                </Grid.Column>
                                            )
                                            : null
                                        }
                                    </Grid.Row>
                                ) : (
                                    <Grid.Row column={ 1 }>
                                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                            <LinkButton
                                                data-testid={ `${componentId}-cancel-button` }
                                                data-componentid={ `${componentId}-cancel-button` }
                                                floated="left"
                                                onClick={ () => {
                                                    closeWizard();
                                                    setShowResponseView(false);
                                                } }
                                                disabled={ isSubmitting }
                                            >
                                                { t("common:close") }
                                            </LinkButton>
                                        </Grid.Column>
                                        { !showResponseView || isSubmitting
                                            ? (
                                                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                                    <PrimaryButton
                                                        data-testid={ `${componentId}-finish-button` }
                                                        data-componentid={ `${componentId}-finish-button` }
                                                        floated="right"
                                                        onClick={ handleBulkUserImport }
                                                        loading={ isSubmitting }
                                                        disabled={ isLoading || isSubmitting || hasError
                                                        || !selectedCSVFile
                                                        }
                                                    >
                                                        { t("console:manage.features.user.modals." +
                                                    "bulkImportUserWizard.buttons.import") }
                                                    </PrimaryButton>
                                                </Grid.Column>
                                            )
                                            : null }
                                    </Grid.Row>
                                )
                        }
                    </Grid>
                </ModalWithSidePanel.Actions>
            </ModalWithSidePanel.MainPanel>
            { renderHelpPanel() }
        </ModalWithSidePanel>
    );
};

const initialBulkResponseSummary: BulkResponseSummary = {
    failedUserAssignment: 0,
    failedUserCreation: 0,
    successUserAssignment: 0,
    successUserCreation: 0
};
