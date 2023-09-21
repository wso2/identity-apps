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
import { RolesInterface, TestableComponentInterface, ClaimDialect,
    ExternalClaim,  AlertInterface, 
    AlertLevels,  } from "@wso2is/core/models";
import {
    CSVFileStrategy,
    CSVResult,
    ContentLoader,
    FilePicker,
    Heading,
    Hint,
    LinkButton,
    Message,
    PickerResult,
    PrimaryButton,
    URLInput,
    useWizardAlert
} from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { addAlert } from "@wso2is/core/store";
import { useTranslation } from "react-i18next";
import {  Button, Grid, Icon, Modal } from "semantic-ui-react";
import { getRoleById } from "../../../roles/api/roles";
import { PermissionList } from "../../../roles/components/wizard/role-permission";
import { Field, FormValue, Forms, Validation } from "@wso2is/forms";
import { AppState, ConfigReducerStateInterface, getCertificateIllustrations } from "../../../core";
import { getDialects, getAllExternalClaims } from "../../../claims/api";
import { ClaimManagementConstants } from "../../../claims/constants";
import { SCIMConfigs, attributeConfig } from "../../../../extensions";
import { type } from "os";
import Axios from "axios";
import { resolveType } from "../../../claims/utils";



/**
 * Proptypes for the role permission component.
 */
interface BulkImportUserInterface extends TestableComponentInterface {
    isAdminUser?: boolean;
    closeWizard: () => void;
}

/**
 *  Roles permission component.
 *
 * @param props - Props injected to the component.
 * @returns Roles permission component.
 */
export const BulkImportUserWizard
: FunctionComponent<BulkImportUserInterface> = (
    props: BulkImportUserInterface
): ReactElement => {
    const {
        closeWizard,
        isAdminUser,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch<any> = useDispatch();

    const [ selectedCSVFile, setSelectedCSVFile] = useState<File>(null);
    const [ pastedCSVContent, setPastedCSVContent ] = useState<string>(null);
    const [emptyFileError, setEmptyFileError] = useState(false);
    const [ userData, setUserData ] = useState<CSVResult>();
    const [role, setRole] = useState<RolesInterface>();
    const [alert, setAlert, alertComponent] = useWizardAlert();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [ dialects, setDialects ] = useState<ClaimDialect[]>(null);
    const [claimMapping, setClaimMapping] = useState<any[]>([]); //TODO: Define
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const listAllAttributeDialects: boolean = useSelector(
        (state: AppState) => state.config.ui.listAllAttributeDialects
    );
    
    /**
     * Fetches all the dialects.
     *
     * @param {number} limit.
     * @param {number} offset.
     * @param {string} sort.
     * @param {string} filter.
     */
    const getDialect = async (limit?: number, offset?: number, sort?: string,
        filter?: string): Promise<ClaimDialect[]> => {
        
        setIsLoading(true);

        try {
            const response: ClaimDialect[] = await getDialects({filter, limit, offset, sort });
            const filteredDialect: ClaimDialect[] = response.filter((claim: ClaimDialect) => {
                if (!listAllAttributeDialects) {
                    return (
                        claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("LOCAL") &&
                        claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("AXSCHEMA") &&
                        claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("EIDAS_LEGAL") &&
                        claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("EIDAS_NATURAL") &&
                        claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OPENID_NET") &&
                        claim.id != ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("XML_SOAP") &&
                        (attributeConfig.attributeMappings.showSCIMCore1
                        || claim.dialectURI !== "urn:scim:schemas:core:1.0")
                    );
                }
                return claim.id !== "local";
            });

            const attributeMappings: ClaimDialect[] = [];
            const type: string = "scim";

            filteredDialect.forEach((attributeMapping: ClaimDialect) => {
                if (ClaimManagementConstants.OIDC_MAPPING.includes(attributeMapping.dialectURI)) {
                    type === ClaimManagementConstants.OIDC && attributeMappings.push(attributeMapping);
                } else if (Object.values(ClaimManagementConstants.SCIM_TABS).map(
                    (tab: { name: string; uri: string }) => tab.uri).includes(attributeMapping.dialectURI)) {
                    type === ClaimManagementConstants.SCIM && attributeMappings.push(attributeMapping);
                } else if (type === ClaimManagementConstants.OTHERS) {
                    attributeMappings.push(attributeMapping);
                }
            });

            if (type === ClaimManagementConstants.SCIM) {
                if (attributeConfig.showCustomDialectInSCIM 
                    && filteredDialect.filter(e => e.dialectURI 
                        === attributeConfig.localAttributes.customDialectURI).length > 0  ) {
                    attributeMappings.push(filteredDialect.filter(e => e.dialectURI 
                        === attributeConfig.localAttributes.customDialectURI)[0]);
                }
            }

            setDialects(attributeMappings);

            return attributeMappings;

        } catch (error) {
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
     * and create a list of already mapped local claims 
     * for filteration purpose.
     * 
     * TODO : This is not the ideal way to fetch and 
     *        identify the already mapped claims. Need
     *        API support for this.
     */
    const getClaimMapping = async (dialects: ClaimDialect[], 
        limit?: number, 
        offset?: number, 
        sort?: string, 
        filter?: string) => {
        
        const dialectIdList: string[] = dialects.map((dialect: ClaimDialect) => dialect.id);
        const mappedLocalClaimPromises: Promise<ExternalClaim[]>[] = dialectIdList.map((id: string) =>
            getAllExternalClaims(id, {
                filter,
                limit,
                offset,
                sort
            })
        );
    
        const type: string = "scim";
        
        try {
            const response: ExternalClaim[][] = await Axios.all(mappedLocalClaimPromises);

            const claimMapping: ExternalClaim[] = [];

            response.forEach((claimList: ExternalClaim[]) => {
                claimMapping.push(...claimList);
            });

            setClaimMapping(claimMapping);

            return claimMapping;
        } catch (error) {
            dispatch(
                addAlert({
                    description:
                        error[0]?.response?.data?.description ||
                        t(
                            "console:manage.features.claims.dialects.notifications." +
                            "fetchExternalClaims.genericError.description",
                            { type: resolveType(type) }
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

    // TODO: Error message
    const validateCSVHeaders = (headers: string[], blockedAttributes: string[]): boolean => {
        // Check if headers contain any blocked attributes
        for (const attribute of headers) {
            if (blockedAttributes.includes(attribute)) {
                console.error(`Header "${attribute}" is a blocked attribute.`);
                setAlert({
                    description: 
                        `Header "${attribute}" is not allowed.`,
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.users.notifications.addUser.error.message"
                    )
                });

                return false;
            }
        }
    
        // Check if any attribute is empty or null
        for (const attribute of headers) {
            if (!attribute || attribute.trim() === "") {
                console.error("Header cannot be empty or null.");
                setAlert({
                    description:
                        "Header cannot be empty or null.",
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.users.notifications.addUser.error.message"
                    )
                });

                return false;
            }
        }
    
        // Check headers against a regex pattern
        // This regex checks for any character that is not an alphabet, number, or the '/' character.
        const regexPattern = /[^a-zA-Z0-9/]/; 
        
        for (const attribute of headers) {
            if (regexPattern.test(attribute)) {
                setAlert({
                    description: 
                        `Header "${attribute}" contains invalid characters.`,
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.users.notifications.addUser.error.message"
                    )
                });

                return false;
            }
        }
        return true;
    };


    const handleSubmitButtonClick = async () => {
        setIsSubmitting(true);
        const dialects = await getDialect();

        const claimMapping: ExternalClaim[] = await getClaimMapping(dialects);
        
        const externalClaimAttributes: string[] = claimMapping.map((item: ExternalClaim) => {
            return item.mappedLocalClaimURI.replace("http://wso2.org/claims/", "");
        });
        console.log(claimMapping, externalClaimAttributes);

        const blockedAttributes = ["roles", "groups"]

        if (!validateCSVHeaders(userData.headers, blockedAttributes)) {
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(false);
        
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
                {/* { t("console:manage.features.user.modals.bulkUserImportWizard.title") } */}
                Bulk Import Users
            </Modal.Header>
            
            <Modal.Content className="content-container" scrolling>
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            <FilePicker
                                key={ 1 }
                                fileStrategy={ CSV_FILE_PROCESSING_STRATEGY }
                                file={ selectedCSVFile }
                                pastedContent={ pastedCSVContent }
                                onChange={ (result: PickerResult<any>) => {
                                    setSelectedCSVFile(result.file);
                                    setPastedCSVContent(result.pastedContent);
                                    setUserData(result.serialized);
                                } }
                                uploadButtonText="Upload CSV File"
                                dropzoneText="Drag and drop a CSV file here."
                                data-testid={ `${testId}-form-wizard-bulk-user-import-file-picker` }
                                icon={ getCertificateIllustrations().uploadPlaceholder }
                                placeholderIcon={ <Icon name="file code" size="huge"/> }
                                normalizeStateOnRemoveOperations={ true }
                                emptyFileError={ emptyFileError }
                                hidePasteOption={ true }
                            />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 }>
                            { alert && alertComponent }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
               
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                data-testid={ `${ testId }-cancel-button` }
                                floated="left"
                                onClick={() => closeWizard()}
                                disabled={ isSubmitting }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                data-testid={ `${ testId }-finish-button` }
                                floated="right"
                                onClick={handleSubmitButtonClick }
                                loading={ isSubmitting }
                                disabled={ isSubmitting }
                            >
                                Finish</PrimaryButton>
                            
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

const CSV_FILE_PROCESSING_STRATEGY: CSVFileStrategy = new CSVFileStrategy();
