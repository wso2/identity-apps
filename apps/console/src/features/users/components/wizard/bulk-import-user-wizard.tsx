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
import Alert from "@oxygen-ui/react/Alert";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import {
    AlertLevels,
    ClaimDialect,
    ExternalClaim,
    SCIMResource,
    SCIMSchemaExtension,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    CSVFileStrategy,
    CSVResult,
    FilePicker,
    Heading,
    LinkButton,
    PickerResult,
    PrimaryButton,
    useWizardAlert
} from "@wso2is/react-components";
import { FormValidation } from "@wso2is/validation";
import Axios from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Dropdown, DropdownItemProps, DropdownProps, Form, Grid, Icon, Modal } from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";
import { getUserStores } from "../../../../extensions/components/users/api";
import { UsersConstants } from "../../../../extensions/components/users/constants";
import { userConfig } from "../../../../extensions/configs";
import { getAllExternalClaims, getDialects, getSCIMResourceTypes } from "../../../claims/api";
import { UserStoreDetails, UserStoreProperty, getCertificateIllustrations } from "../../../core";
import { PRIMARY_USERSTORE } from "../../../userstores/constants";
import { addBulkUsers } from "../../api";
import {
    BlockedBulkUserImportAttributes,
    BulkUserImportStatus,
    RequiredBulkUserImportAttributes,
    SpecialMultiValuedComplexAttributes,
    UserManagementConstants
} from "../../constants";
import {
    BulkResponseSummary,
    BulkUserImportOperationResponse,
    BulkUserImportOperationStatus,
    SCIMBulkEndpointInterface,
    SCIMBulkOperation,
    SCIMBulkResponseOperation
} from "../../models";
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

const ASK_PASSWORD_ATTRIBUTE: string = "identity/askPassword";
const CSV_FILE_PROCESSING_STRATEGY: CSVFileStrategy = new CSVFileStrategy(
    undefined,  // Mimetype.
    userConfig.bulkUserImportLimit.fileSize * CSVFileStrategy.KILOBYTE,  // File Size.
    userConfig.bulkUserImportLimit.userCount  // Row Count.
);
const DATA_VALIDATION_ERROR: string = "Data validation error";
const ADDRESS_HOME_ATTRIBUTE: string = "addresses#home";
const ADDRESS_ATTRIBUTE: string = "addresses";
const HOME_ATTRIBUTE: string = "home";

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

    const dispatch: Dispatch = useDispatch();

    const [ selectedCSVFile, setSelectedCSVFile ] = useState<File>(null);
    const [ userData, setUserData ] = useState<CSVResult>();
    const [ alert, setAlert, alertComponent ] = useWizardAlert({ "data-componentid": `${componentId}-alert` });
    const [ hasError, setHasError ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ response, setResponse ] = useState<BulkUserImportOperationResponse[]>([]);
    const [ showResponseView, setShowResponseView ] = useState<boolean>(false);
    const [ bulkResponseSummary, setBulkResponseSummary ] = useState<BulkResponseSummary>(initialBulkResponseSummary);
    const [ readWriteUserStoresList, setReadWriteUserStoresList ] = useState<DropdownItemProps[]>([]);
    const [ selectedUserStore, setSelectedUserStore ] = useState<string>("");
    
    useEffect(() => {
        setSelectedUserStore(userstore);
        getUserStoreList();
    }, [ userstore ]);

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

    /**
     * This will fetch userstore list.
     */
    const getUserStoreList = (): void => {
        setIsLoading(true);

        getUserStores()
            .then((response: UserStoreDetails[]) => {                      
                const userStoreArray: DropdownItemProps[] = [];

                response?.forEach((item: UserStoreDetails, index: number) => {
                    // Set read/write enabled userstores based on the type.
                    if (checkReadWriteUserStore(item)) {    
                        userStoreArray.push({
                            key: index,
                            text: item?.name.toUpperCase(),
                            value: item?.name.toUpperCase()
                        });
                    }});

                if (userstore === PRIMARY_USERSTORE) {
                    userStoreArray.push({
                        key: userStoreArray.length,
                        text: t("console:manage.features.users.userstores.userstoreOptions.primary"),
                        value: PRIMARY_USERSTORE.toUpperCase()
                    });
                }
                
                setReadWriteUserStoresList(userStoreArray);
            }).catch((_error: IdentityAppsApiException) => {
                dispatch(addAlert({
                    description: t("console:manage.features.userstores.notifications.fetchUserstores.genericError." +
                        "description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.userstores.notifications.fetchUserstores.genericError.message")
                }));
                setHasError(true);

                return;
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    /**
     * Check the given user store is Read/Write enabled.
     * 
     * @param userStore - Userstore
     * @returns If the given userstore is read only or not.
     */
    const checkReadWriteUserStore = (userStore: UserStoreDetails): boolean => {
        if( userStore?.typeName === UsersConstants.DEFAULT_USERSTORE_TYPE_NAME ) {
            return true;
        } else {
            return  userStore?.enabled && userStore?.properties.filter((property: UserStoreProperty)=>
                property.name===UsersConstants.USER_STORE_PROPERTY_READ_ONLY)[0].value==="false";
        }
    };

    const hideUserStoreDropdown = (): boolean => {
        // TODO: Currently only primary userstore is supported.
        // if(readWriteUserStoresList) {
        //     return readWriteUserStoresList?.length === 0 || (readWriteUserStoresList?.length === 1 && 
        //         readWriteUserStoresList[0]?.value === userstore);
        // }
        
        return false;
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
    const generateData =
        (   row: string[],
            filteredAttributeMapping: CSVAttributeMapping[],
            headers: string[]): Record<string, unknown> => {
            const dataObj: Record<string, unknown> = {};
            const schemasSet: Set<string> = new Set([ UserManagementConstants.SCIM2_USER_SCHEMA ]);

            for (const attribute of filteredAttributeMapping) {
                const scimAttribute: string = attribute.mappedSCIMAttributeURI.replace(
                    `${attribute.mappedSCIMClaimDialectURI}:`,
                    ""
                );
                const attributeValue: string = row[headers.indexOf(attribute.attributeName.toLowerCase())];
                const isMultiValued: boolean = scimAttribute.includes("#");

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
     * Generate SCIM Operation.
     *
     * @param row - user data row.
     * @param filteredAttributeMapping - filtered attribute mapping.
     * @param headers - csv headers.
     * @returns SCIM Operation
     */
    const generateOperation = (
        row: string[],
        filteredAttributeMapping: CSVAttributeMapping[],
        headers: string[]
    ): SCIMBulkOperation => {
        const asyncOperationID: string = uuidv4();

        return {
            bulkId: `bulkId:${row[headers.indexOf("username")]}:${asyncOperationID}`,
            data: generateData(row, filteredAttributeMapping, headers),
            method: "POST",
            path: "/Users"
        };
    };

    /**
     * Generate SCIM Bulk Request Body
     *
     * @param attributeMapping - attribute mapping.
     * @returns SCIMBulkRequestBody
     */
    const generateSCIMRequestBody = (attributeMapping: CSVAttributeMapping[]): SCIMBulkEndpointInterface => {
        const headers: string[] = userData.headers.map((header: string) => header.toLowerCase());
        const rows: string[][] = userData.items;

        const filteredAttributeMapping: CSVAttributeMapping[] = filterAttributes(headers, attributeMapping);

        const operations: SCIMBulkOperation[] = rows.map((row: string[]) =>
            generateOperation(row, filteredAttributeMapping, headers)
        );

        return {
            Operations: operations,
            failOnErrors: 0,
            schemas: [ UserManagementConstants.BULK_REQUEST_SCHEMA ]
        };
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

            const scimRequestBody: SCIMBulkEndpointInterface = generateSCIMRequestBody(attributeMapping);
            
            setShowResponseView(true);
            const scimResponse: any = await addBulkUsers(scimRequestBody);

            if (scimResponse.status !== 200) {
                throw new Error("Failed to import users.");
            }

            const response: BulkUserImportOperationResponse[] = scimResponse.data.Operations.map(generateBulkResponse);
           
            setResponse(response);
        } catch (error) {
            setHasError(true);
            if (error.message !== DATA_VALIDATION_ERROR) {
                setAlert({
                    description: t(
                        "console:manage.features.users.notifications.bulkImportUser.submit.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.users.notifications.bulkImportUser.submit.genericError.message")
                });
            }

        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Generate bulk response. 
     * @param operation - SCIM bulk operation.
     * @returns - BulkUserImportOperationResponse
     */
    const generateBulkResponse = (operation: SCIMBulkResponseOperation): BulkUserImportOperationResponse => {
        const username: string = operation?.bulkId.split(":")[1];
        const statusCode: number = operation?.status?.code;

        const defaultMsg: string = t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary." +
        "tableMessages.internalErrorMessage");

        const statusMessages: Record<number, string> = {
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

        // Functional update to update the bulk response summary.
        setBulkResponseSummary((prevSummary: BulkResponseSummary) => {
            
            const successCount: number =
                (statusCode === 201 || statusCode === 202) ? prevSummary.successCount + 1 : prevSummary.successCount;
            const failedCount: number =
                (statusCode !== 201 && statusCode !== 202) ? prevSummary.failedCount + 1 : prevSummary.failedCount;

            return {
                ...prevSummary,
                failedCount,
                successCount
            };
        });

        let _statusCode: BulkUserImportStatus = BulkUserImportStatus.FAILED;
        
        if (statusCode === 201 || statusCode === 202) {
            _statusCode = BulkUserImportStatus.SUCCESS;
        }

        return {
            message: statusMessages[statusCode] || defaultMsg,
            status: getStatusFromCode(statusCode),
            statusCode: _statusCode,
            username
        };
    };

    /**
     * Get status message from the status code.
     *
     * @param statusCode - Status code from the bulk response.
     * @returns - Status message.
     */
    const getStatusFromCode = (statusCode: number): BulkUserImportOperationStatus => {
        if (statusCode === 201) return t(
            "console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableStatus.success" );
        if (statusCode === 202) return t(
            "console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableStatus.warning" );

        return t(
            "console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.tableStatus.failed" );
    };

    return (
        <Modal
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
            <Modal.Header className="wizard-header">
                { t("console:manage.features.user.modals.bulkImportUserWizard.title") }
                <Heading as="h6">{ t("console:manage.features.user.modals.bulkImportUserWizard.subTitle") }</Heading>
            </Modal.Header>

            <Modal.Content className="content-container" scrolling>
                <Grid>
                    { !showResponseView ?
                        (
                            <>
                                { alert
                                    && (
                                        <Grid.Row columns={ 1 }>
                                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                                { alertComponent }
                                            </Grid.Column>
                                        </Grid.Row>
                                    ) }
                                { !isLoading && !hideUserStoreDropdown()
                                    && (
                                        <>
                                            <Grid.Row columns={ 1 } className="mb-0 pb-0">
                                            
                                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }> 
                                                    <Alert severity="info">
                                                        { t("console:manage.features.user.modals." +
                                                        "bulkImportUserWizard.wizardSummary." +
                                                    "disabledSecondaryStoreInfo") }
                                                    </Alert>
                                                
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row columns={ 1 }>
                                                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }> 
                                                    <Form.Field required={ true }>
                                                        <label className="pb-2">
                                                            { t("console:manage.features.user.forms."+
                                                                            "addUserForm.inputs.domain.placeholder") }
                                                        </label>
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
                                                            disabled={ true }
                                                            value={ selectedUserStore }
                                                            onChange={
                                                                (e: React.ChangeEvent<HTMLInputElement>,
                                                                    data: DropdownProps) => {
                                                                    setSelectedUserStore(
                                                                        data.value.toString());
                                                                }
                                                            }
                                                            tabIndex={ 1 }
                                                            maxLength={ 60 }
                                                        />
                                                    </Form.Field> 
                                                </Grid.Column>
                                            </Grid.Row>
                                        </>
                                    )
                                }
                                <Grid.Row columns={ 1 } className="pt-0">
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                        <FilePicker
                                            key={ 1 }
                                            fileStrategy={ CSV_FILE_PROCESSING_STRATEGY }
                                            file={ selectedCSVFile }
                                            onChange={ (result: PickerResult<{
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
                            </>
                        ) : (
                            <>
                                { alert && (
                                    <Grid.Row columns={ 1 }>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                            { alertComponent }
                                        </Grid.Column>
                                    </Grid.Row>
                                        
                                ) }
                                <BulkImportResponseList
                                    isLoading={ isSubmitting }
                                    data-componentid={ `${componentId}-response-list` }
                                    hasError={ hasError }
                                    responseList={ response }
                                    bulkResponseSummary={ bulkResponseSummary }
                                />
                            </>
                        ) }
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Grid>
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
                        { !showResponseView || isSubmitting ? (
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <PrimaryButton
                                    data-testid={ `${componentId}-finish-button` }
                                    data-componentid={ `${componentId}-finish-button` }
                                    floated="right"
                                    onClick={ handleBulkUserImport }
                                    loading={ isSubmitting }
                                    disabled={ isLoading || isSubmitting ||  hasError || !selectedCSVFile }
                                >
                                    { t("console:manage.features.user.modals.bulkImportUserWizard.buttons.import") }
                                </PrimaryButton>
                            </Grid.Column>
                        ) : null }
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

const initialBulkResponseSummary: BulkResponseSummary = {
    failedCount: 0,
    successCount: 0
};
