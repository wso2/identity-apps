/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
    LinkButton,
    PickerResult,
    PrimaryButton,
    useWizardAlert
} from "@wso2is/react-components";
import Axios from "axios";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { v4 as uuidv4 } from "uuid";
import { getAllExternalClaims, getDialects, getSCIMResourceTypes } from "../../../claims/api";
import { getCertificateIllustrations } from "../../../core";
import { bulkAddUsers } from "../../api";
import { BlockedBulkUserImportAttributes } from "../../constants";
import { BulkUserImportOperationResponse, BulkUserImportOperationStatus, SCIMBulkOperation } from "../../models";
import { BulkImportResponseList } from "../bulk-import-response-list";

/**
 * Prototypes for the BulkImportUserWizardComponent.
 */
interface BulkImportUserInterface extends TestableComponentInterface {
    closeWizard: () => void;
}

interface SCIMOperation {
    method: string;
    bulkId: string;
    path: string;
    data: any;
}

interface SCIMRequestBody {
    failOnErrors: number;
    schemas: string[];
    Operations: SCIMOperation[];
}

interface CSVAttributeMapping {
    attributeName: string;
    mappedLocalClaimURI: string;
    mappedSCIMAttributeURI: string;
    mappedSCIMClaimDialectURI: string;
    claimURI?: string;
}

interface BulkResponseSummary {
    successCount: number;
    failedCount: number;
}

interface MultiValuedComplexAttribute {
    [key: string] : string | boolean;
    
}


const WSO2_LOCAL_CLAIM_DIALECT: string = "http://wso2.org/claims";
const SCIM2_USER_SCHEMA: string = "urn:ietf:params:scim:schemas:core:2.0:User";
const SCIM2_ENTERPRISE_USER_SCHEMA: string = "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User";
const BULK_REQUEST_SCHEMA: string = "urn:ietf:params:scim:api:messages:2.0:BulkRequest";
const CSV_FILE_PROCESSING_STRATEGY: CSVFileStrategy = new CSVFileStrategy();

/**
 *  BulkImportUserWizard component.
 *
 * @param props - Props injected to the component.
 * @returns BulkImportUser
 */
export const BulkImportUserWizard: FunctionComponent<BulkImportUserInterface> = (
    props: BulkImportUserInterface
): ReactElement => {
    const { closeWizard, ["data-testid"]: testId } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch<any> = useDispatch();

    const [ selectedCSVFile, setSelectedCSVFile ] = useState<File>(null);
    const [ emptyFileError, setEmptyFileError ] = useState(false);
    const [ userData, setUserData ] = useState<CSVResult>();
    const [alert, setAlert, alertComponent] = useWizardAlert();
    const [ hasError, setHasError ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ response, setResponse ] = useState<BulkUserImportOperationResponse[]>([]);
    const [ showResponseView, setShowResponseView ] = useState<boolean>(false);
    const [ bulkResponseSummary, setBulkResponseSummary ] = useState<BulkResponseSummary>(initialBulkResponseSummary);

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
            const scimClaimResponse: ExternalClaim[][] = await Axios.all(scimClaimPromises);
            const _attributeMapping: CSVAttributeMapping[] = [];

            scimClaimResponse.forEach((claimList: ExternalClaim[]) => {
                const claims: CSVAttributeMapping[] = claimList.map(
                    (item: ExternalClaim): CSVAttributeMapping => {
                        return {
                            attributeName: item.mappedLocalClaimURI
                                .replace(WSO2_LOCAL_CLAIM_DIALECT+"/", "")
                                .toLowerCase(),
                            mappedLocalClaimURI: item.mappedLocalClaimURI,
                            mappedSCIMAttributeURI: item.claimURI,
                            mappedSCIMClaimDialectURI: item.claimDialectURI
                        };
                    }
                );

                _attributeMapping.push(...claims);
            });

            return _attributeMapping;
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
     * Validate the CSV file.
     *
     * @param userData - user data from the CSV file.
     * @param blockedAttributes - blocked attributes.
     * @param externalClaimAttributes - external claim attributes.
     * @returns
     */
    const validateCSVFile = (
        userData: CSVResult,
        blockedAttributes: string[],
        externalClaimAttributes: string[]
    ): boolean => {
        const headers: string[] = userData.headers.map((header: string) => header.toLowerCase());
        const rows: string[][] = userData.items;

        if (isEmpty(headers) || isEmpty(rows)) {
            setAlert({
                description: t(
                    "console:manage.features.users.notifications.bulkImportUser.validation.emptyRowError.description"),
                level: AlertLevels.ERROR,
                message: t(
                    "console:manage.features.users.notifications.bulkImportUser.validation.emptyRowError.message")
            });

            return false;
        }

        for (const attribute of headers) {
            if (isInvalidAttribute(attribute, blockedAttributes, externalClaimAttributes)) {
                return false;
            }
        }

        return true;
    };

    // Helper function to check if the array is empty.
    const isEmpty = (array: any[]): boolean => {
        return array.length === 0;
    };

    /**
     * Helper function to check if the attribute is invalid.
     * @param attribute - attribute to be checked.
     * @param blockedAttributes - blocked attributes.
     * @param externalClaimAttributes - external claim attributes.
     * @returns isInvalidAttribute - boolean
     */
    const isInvalidAttribute = (
        attribute: string,
        blockedAttributes: string[],
        externalClaimAttributes: string[]
    ): boolean => {
        const regexPattern: RegExp = /[^a-zA-Z0-9/.]/;

        if (!attribute || attribute.trim() === "") {
            setAlert({
                description: t(
                    "console:manage.features.users.notifications.bulkImportUser.validation." +
                    "headerEmptyError.description" ),
                level: AlertLevels.ERROR,
                message: t(
                    "console:manage.features.users.notifications.bulkImportUser.validation.headerEmptyError.message")
            });

            return true;
        }

        if (regexPattern.test(attribute)) {
            setAlert({
                description: t(
                    "console:manage.features.users.notifications.bulkImportUser.validation." +
                    "headerInvalidCharacterError.description", { attribute }),
                level: AlertLevels.ERROR,
                message: t(
                    "console:manage.features.users.notifications.bulkImportUser.validation." +
                    "headerInvalidCharacterError.message")
            });

            return true;
        }

        if (blockedAttributes.includes(attribute)) {
            setAlert({
                description: t(
                    "console:manage.features.users.notifications.bulkImportUser.validation." +
                    "blockedAttributeError.description", { attribute }),
                level: AlertLevels.ERROR,
                message: t(
                    "console:manage.features.users.notifications.bulkImportUser.validation." +
                    "blockedAttributeError.message")
            });

            return true;
        }

        if (!externalClaimAttributes.some((externalClaim: string) => attribute === externalClaim.toLowerCase())) {
            setAlert({
                description: t(
                    "console:manage.features.users.notifications.bulkImportUser.validation." +
                    "invalidAttributeError.description", { attribute }),
                level: AlertLevels.ERROR,
                message: t(
                    "console:manage.features.users.notifications.bulkImportUser.validation." +
                    "invalidAttributeError.message")
            });

            return true;
        }

        return false;
    };

    /**
     * Generate SCIM Operation.
     *
     * @param row - user data row.
     * @param filteredAttributeMapping - filtered attribute mapping.
     * @param headers - csv headers.
     * @returns
     */
    const generateOperation = (
        row: string[],
        filteredAttributeMapping: CSVAttributeMapping[],
        headers: string[]
    ): SCIMOperation => {
        const asyncOperationID: string = uuidv4();

        return {
            bulkId: `bulkId.${row[headers.indexOf("username")]}.${asyncOperationID}`,
            data: generateData(row, filteredAttributeMapping, headers),
            method: "POST",
            path: "/Users"
        };
    };

    /**
     * Generate SCIM Bulk Request Body
     *
     * @param attributeMapping - attribute mapping.
     * @returns
     */
    const generateSCIMRequestBody = (attributeMapping: CSVAttributeMapping[]): SCIMRequestBody => {
        const headers: string[] = userData.headers.map((header: string) => header.toLowerCase());
        const rows: string[][] = userData.items;

        const filteredAttributeMapping: CSVAttributeMapping[] = filterAttributes(headers, attributeMapping);

        const operations: SCIMOperation[] = rows.map((row: string[]) =>
            generateOperation(row, filteredAttributeMapping, headers));

        return {
            Operations: operations,
            failOnErrors: 0,
            schemas: [ BULK_REQUEST_SCHEMA ]
        };
    };

    /**
     * Get only attributes that are in the header.
     * @param headers - csv header.
     * @param attributeMapping  - attribute mapping.
     * @returns
     */
    const filterAttributes = (headers: string[], attributeMapping: CSVAttributeMapping[]): CSVAttributeMapping[] => {
        return headers
            .map((header: string) =>
                attributeMapping.find(
                    (attribute: CSVAttributeMapping) => header.toLowerCase() === attribute.attributeName.toLowerCase()
                )
            )
            .filter(Boolean);
    };

    /**
     * Get SCIM data for each operation.
     *
     * @param row - user data row.
     * @param filteredAttributeMapping - filtered attribute mapping.
     * @param headers - csv headers.
     * @returns
     */
    const generateData = (row: string[], filteredAttributeMapping: CSVAttributeMapping[], headers: string[]): any => {
        const dataObj: any = {};
        const schemasSet: Set<string> = new Set([ SCIM2_USER_SCHEMA ]);

        for (const attribute of filteredAttributeMapping) {
            const scimAttribute: string = attribute.mappedSCIMAttributeURI.replace(
                `${attribute.mappedSCIMClaimDialectURI}:`,
                ""
            );
            const attributeValue: string = row[headers.indexOf(attribute.attributeName.toLowerCase())];
            const isMultiValued: boolean = scimAttribute.includes("#");
            
            const attrTypes: string[] = [ "emails", "phoneNumbers", "photos", "addresses", "entitlements",
                "x509Certificates" ];

            const matchingAttrType: string = attrTypes.find((attrType: string) => scimAttribute.includes(attrType));

            // Check if scimAttribute contains any of the attrTypes
            if (!isMultiValued && matchingAttrType) {
                const info: MultiValuedComplexAttribute = scimAttribute.includes(matchingAttrType + ".")
                    ? { type: scimAttribute.split(".")[1], value: attributeValue }
                    : { primary: true, value: attributeValue };

                dataObj[matchingAttrType] = dataObj[matchingAttrType] || [];
                dataObj[matchingAttrType].push(info);

                continue;
                
            }

            if (scimAttribute.includes("addresses#home")) {
                // For Asgardeo. TODO: test
                dataObj["addresses"] = dataObj["addresses"] || [];
                dataObj["addresses"].push(
                    {
                        type: "home",
                        [scimAttribute.replace(SCIM2_ENTERPRISE_USER_SCHEMA + "addresses#home", "")]:
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
                const target: any =
                    attribute.mappedSCIMClaimDialectURI === SCIM2_USER_SCHEMA
                        ? dataObj
                        : dataObj[attribute.mappedSCIMClaimDialectURI] ||
                        (dataObj[attribute.mappedSCIMClaimDialectURI] = {});

                if (isMultiValued) {
                    target[cleanedAttribute] = (target[cleanedAttribute] || []).concat(attributeValue);
                } else {
                    target[cleanedAttribute] = attributeValue;
                }

                continue;
            }
            // Handle complex attributes.
            else if (cleanedAttribute.includes(".")) {
                const [ parentAttr, childAttr ] = cleanedAttribute.split(".");
                const target: any =
                    attribute.mappedSCIMClaimDialectURI === SCIM2_USER_SCHEMA
                        ? dataObj
                        : dataObj[attribute.mappedSCIMClaimDialectURI] ||
                        (dataObj[attribute.mappedSCIMClaimDialectURI] = {});
                
                if (isMultiValued) {
                    target[parentAttr] = (target[parentAttr] || []).concat({
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

        // Check if the SCIM2_ENTERPRISE_USER_SCHEMA exists; if not, create an empty object.
        if (!dataObj[SCIM2_ENTERPRISE_USER_SCHEMA]) {
            dataObj[SCIM2_ENTERPRISE_USER_SCHEMA] = {};
        }

        // Set the askPassword attribute to "true".
        dataObj[SCIM2_ENTERPRISE_USER_SCHEMA].askPassword = "true";

        return {
            schema: Array.from(schemasSet),
            ...dataObj
        };
    };

    /**
     * Handle bulk user import.
     */
    const handleBulkUserImport = async () => {
        setIsSubmitting(true);

        try {
            const attributeMapping: CSVAttributeMapping[] = await getClaimMapping();
            const validAttributeNames: string[] = attributeMapping.map(
                (item: CSVAttributeMapping) => item.attributeName
            );
            const blockedAttributeNames: string[] = Object.values(BlockedBulkUserImportAttributes);

            if (!validateCSVFile(userData, blockedAttributeNames, validAttributeNames)) {
                setHasError(true);
                setIsSubmitting(false);

                return;
            }

            const scimRequestBody: SCIMRequestBody = generateSCIMRequestBody(attributeMapping);

            setShowResponseView(true);
            const scimResponse: any = await bulkAddUsers(scimRequestBody);

            if (scimResponse.status !== 200) {
                throw new Error("Failed to import users.");
            }

            const response: BulkUserImportOperationResponse[] = scimResponse.data.Operations.map(generateBulkResponse);
           
            setResponse(response);
        } catch (error) {
            setHasError(true);
            
            setAlert({
                description: t(
                    "console:manage.features.users.notifications.bulkImportUser.submit.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.users.notifications.bulkImportUser.submit.genericError.message")
            });
            console.log("Error occurred while importing users.", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    /**
     * Generate bulk response. 
     * @param operation - SCIM bulk operation.
     * @returns
     */
    const generateBulkResponse = (operation: SCIMBulkOperation): BulkUserImportOperationResponse => {
        const username: string = operation.bulkId.split(".")[1];
        const statusCode: number = operation?.status?.code;

        const defaultMsg: string = "Error occurred while importing user.";

        const statusMessages: Record<number, string> = {
            201: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.userCreatedMessage"),
            202: t(
                "console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.userCreationAcceptedMessage"),
            400: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.invalidDataMessage"),
            409: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.userAlreadyExistsMessage"),
            500: t("console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.internalErrorMessage")
        };

        // Update the summary.
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

        return {
            message: statusMessages[statusCode] || defaultMsg,
            status: getStatusFromCode(statusCode),
            statusCode,
            username
        };
    };

    /**
     * Get status from the status code.
     *
     * @param statusCode - Status code.
     * @returns
     */
    const getStatusFromCode = (statusCode: number): BulkUserImportOperationStatus => {
        if (statusCode === 201) return t(
            "console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.success" );
        if (statusCode === 202) return t(
            "console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.warning" );

        return t(
            "console:manage.features.user.modals.bulkImportUserWizard.wizardSummary.failed" );
    };

    /**
     * Renders the bulk response summary.
     * 
     * @returns BulkResponseSummary component.
     */
    const showBulkResponseSummary = (): ReactElement => {
        return (
            <Grid.Row columns={ 2 }>
                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                    Success Count: { bulkResponseSummary.successCount }
                </Grid.Column>
                <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                    Failed Count: { bulkResponseSummary.failedCount }
                </Grid.Column>
            </Grid.Row>
        );
    };

    return (
        <Modal
            data-testid={ testId }
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
            </Modal.Header>

            <Modal.Content className="content-container" scrolling>
                { !showResponseView ? (
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                { alert && alertComponent }
                                <FilePicker
                                    key={ 1 }
                                    fileStrategy={ CSV_FILE_PROCESSING_STRATEGY }
                                    file={ selectedCSVFile }
                                    onChange={ (result: PickerResult<any>) => {
                                        setSelectedCSVFile(result.file);
                                        setUserData(result.serialized);
                                        setAlert(null);
                                        setHasError(false);
                                    } }
                                    uploadButtonText="Upload CSV File"
                                    dropzoneText="Drag and drop a CSV file here."
                                    data-testid={ `${testId}-form-wizard-csv-file-picker` }
                                    icon={ getCertificateIllustrations().uploadPlaceholder }
                                    placeholderIcon={ <Icon name="file code" size="huge" /> }
                                    normalizeStateOnRemoveOperations={ true }
                                    emptyFileError={ emptyFileError }
                                    hidePasteOption={ true }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                ) : (
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                { alert && alertComponent }
                            </Grid.Column>
                        </Grid.Row>
                        { showResponseView && !isSubmitting && showBulkResponseSummary() }
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                                <BulkImportResponseList
                                    isLoading={ isSubmitting }
                                    data-testid={ `${testId}-bulk-user-response-list` }
                                    responseList={ response }
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                ) }

            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                data-testid={ `${testId}-cancel-button` }
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
                                    data-testid={ `${testId}-finish-button` }
                                    floated="right"
                                    onClick={ handleBulkUserImport }
                                    loading={ isSubmitting }
                                    disabled={ isLoading || isSubmitting ||  hasError }
                                >
                                    { t("common:finish") }
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
