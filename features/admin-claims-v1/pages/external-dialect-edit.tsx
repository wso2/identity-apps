/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { AlertLevels, ClaimDialect, ExternalClaim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, DangerZone, DangerZoneGroup, EmphasizedSegment } from "@wso2is/react-components";
import React, {
    FunctionComponent,
    Dispatch as ReactDispatch,
    ReactElement,
    SetStateAction,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Grid, Header, Placeholder } from "semantic-ui-react";
import { attributeConfig } from "../../admin-extensions-v1";
import { getAllExternalClaims } from "../../admin-claims-v1/api";
import { AppConstants, history, sortList } from "../../admin-core-v1";
import { deleteADialect, getADialect } from "../api";
import { EditDialectDetails, EditExternalClaims } from "../components";
import { ClaimManagementConstants } from "../constants";
import { resolveType } from "../utils";

/**
 * Props for the External Dialects edit page.
 */
interface ExternalDialectEditPageInterface extends TestableComponentInterface {
    /**
     * Attribute MAPPING ID.
     */
    id: string;
    /**
     * Attribute type
     */
    attributeType?: string;
    /**
     * Attribute URI
     */
    attributeUri: string;
    /**
     * Mapped Local claim list
     */
    mappedLocalClaims: string[];
    /**
     * Update mapped claims on delete or edit
     */
    updateMappedClaims?: ReactDispatch<SetStateAction<boolean>>;
}

/**
 * This renders the edit external dialect page
 *
 * @param props - Props injected to the component
 * @returns External dialect edit page.
 */
const ExternalDialectEditPage: FunctionComponent<ExternalDialectEditPageInterface> = (
    props: ExternalDialectEditPageInterface
): ReactElement => {
    const {
        attributeType,
        attributeUri,
        mappedLocalClaims,
        updateMappedClaims,
        [ "data-testid" ]: testId,
        id: dialectId
    } = props;

    const [ dialect, setDialect ] = useState<ClaimDialect>(null);
    const [ claims, setClaims ] = useState<ExternalClaim[]>(undefined);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ confirmDelete, setConfirmDelete ] = useState(false);

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    const deleteConfirmation = (): ReactElement => (
        <ConfirmationModal
            onClose={ (): void => setConfirmDelete(false) }
            type="negative"
            open={ confirmDelete }
            assertion={ dialect.dialectURI }
            assertionHint={ (
                /**
                 * TODO: Trans component with strong tags doesn't seem to
                 * work here properly, hence removed for now.
                 *
                 * Need to find the root cause and fix this.
                 */
                <p>
                    Please type <strong>{ dialect.dialectURI }</strong> to confirm.
                </p>
            ) }
            assertionType="input"
            primaryAction={ t("claims:dialects.confirmations.action") }
            secondaryAction={ t("common:cancel") }
            onSecondaryActionClick={ (): void => setConfirmDelete(false) }
            onPrimaryActionClick={ (): void => deleteDialect(dialect.id) }
            data-testid={ `${ testId }-delete-confirmation-modal` }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header data-testid={ `${ testId }-delete-confirmation-modal-header` }>
                { t("claims:dialects.confirmations.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                negative
                data-testid={ `${ testId }-delete-confirmation-modal-message` }
            >
                { t("claims:dialects.confirmations.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content data-testid={ `${ testId }-delete-confirmation-modal-content` }>
                { t("claims:dialects.confirmations.content", {
                    type: resolveType(attributeType)
                }) }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    /**
     * Fetch the dialect.
     *
     * @param id - Dialect ID
     */
    const getDialect = (id?: string) => {
        getADialect(id ?? dialectId)
            .then((response: any) => {
                setDialect(response);
            })
            .catch((error: any) => {
                dispatch(
                    addAlert({
                        description:
                            error?.description ||
                            t(
                                "claims:dialects.notifications." +
                                "fetchADialect.genericError.description"
                            ),
                        level: AlertLevels.ERROR,
                        message:
                            error?.message ||
                            t(
                                "claims:dialects.notifications." +
                                "fetchADialect.genericError.message"
                            )
                    })
                );
            });
    };

    useEffect(() => {
        dialectId && getDialect();
    }, [ dialectId ]);

    /**
     * Fetch external claims.
     *
     * @param limit - List limit.
     * @param offset - List offset.
     * @param sort - List sort order.
     * @param filter - List filter query.
     */
    const getExternalClaims = (limit?: number, offset?: number, sort?: string, filter?: string) => {
        dialectId && setIsLoading(true);
        dialectId && setClaims(undefined);
        dialectId &&
            getAllExternalClaims(dialectId, {
                filter,
                limit,
                offset,
                sort
            })
                .then((response: ExternalClaim[]) => {
                    // Hide identity claims in SCIM
                    const claims: ExternalClaim[] = attributeConfig.attributeMappings.getExternalAttributes(
                        attributeType,
                        response
                    );

                    setClaims(sortList(claims, "claimURI", true));
                })
                .catch((error: any) => {
                    dispatch(
                        addAlert({
                            description:
                                error?.response?.data?.description ||
                                t(
                                    "claims:dialects.notifications." +
                                    "fetchExternalClaims.genericError.description",
                                    { type: resolveType(attributeType) }
                                ),
                            level: AlertLevels.ERROR,
                            message:
                                error?.response?.data?.message ||
                                t(
                                    "claims:dialects.notifications." +
                                    "fetchExternalClaims.genericError.message"
                                )
                        })
                    );
                })
                .finally(() => {
                    setIsLoading(false);
                });
    };

    useEffect(() => {
        getExternalClaims();
    }, [ dialectId ]);

    /**
     * This deletes a dialect
     * @param dialectID - Dialect ID.
     */
    const deleteDialect = (dialectID: string) => {
        deleteADialect(dialectID)
            .then(() => {
                history.push(AppConstants.getPaths().get("CLAIM_DIALECTS"));
                dispatch(
                    addAlert({
                        description: t(
                            "claims:dialects.notifications." +
                            "deleteDialect.success.description",
                            { type: resolveType(attributeType, true) }
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "claims:dialects.notifications." + "deleteDialect.success.message"
                        )
                    })
                );
            })
            .catch((error: any) => {
                dispatch(
                    addAlert({
                        description:
                            error?.description ||
                            t(
                                "claims:dialects.notifications." +
                                "deleteDialect.genericError.description",
                                { type: resolveType(attributeType, true) }
                            ),
                        level: AlertLevels.ERROR,
                        message:
                            error?.message ||
                            t(
                                "claims:dialects.notifications." +
                                "deleteDialect.genericError.message"
                            )
                    })
                );
            });
    };

    return (
        <>
            { attributeConfig.attributeMappings.editAttributeMappingDetails && (
                <>
                    <Grid>
                        <Grid.Row columns={ 1 }>
                            <Grid.Column width={ 16 }>
                                <Header as="h4">
                                    { t("claims:dialects.pageLayout.edit.updateDialectURI", {
                                        type: resolveType(attributeType, true)
                                    }) }
                                </Header>
                                <EmphasizedSegment>
                                    { isLoading ? (
                                        <Placeholder>
                                            <Placeholder.Line length="short" />
                                            <Placeholder.Line length="medium" />
                                        </Placeholder>
                                    ) : (
                                        <EditDialectDetails
                                            dialect={ dialect }
                                            data-testid={ `${ testId }-edit-dialect-details` }
                                            attributeType={ attributeType }
                                            onUpdate={ (id?: string) => { getDialect(id); } }
                                        />
                                    ) }
                                </EmphasizedSegment>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>

                    <Divider hidden />

                    <Grid columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            <Header as="h4">
                                { t("claims:dialects.pageLayout.edit.updateExternalAttributes",
                                    {
                                        type: resolveType(attributeType, true)
                                    }
                                ) }
                            </Header>
                        </Grid.Column>
                    </Grid>

                    <Divider hidden />

                    <Divider hidden />
                </>
            ) }
            <EditExternalClaims
                dialectID={ dialectId }
                isLoading={ isLoading }
                claims={ claims }
                update={ getExternalClaims }
                data-testid={ `${ testId }-edit-external-claims` }
                attributeType={ attributeType }
                attributeUri={ attributeUri }
                mappedLocalClaims={ mappedLocalClaims }
                updateMappedClaims={ updateMappedClaims }
            />

            <Divider hidden />

            { attributeConfig.attributeMappings.showDangerZone && (
                <Grid>
                    <Grid.Row columns={ 1 }>
                        <Grid.Column width={ 16 }>
                            <Show when={ AccessControlConstants.SCOPE_DELETE }>
                                <DangerZoneGroup
                                    sectionHeader={ t("common:dangerZone") }
                                    data-testid={ `${ testId }-danger-zone-group` }
                                >
                                    <DangerZone
                                        actionTitle={ t("claims:dialects." +
                                            "dangerZone.actionTitle", {
                                            type: resolveType(attributeType, true, true)
                                        }) }
                                        header={ t("claims:dialects.dangerZone.header", {
                                            type: resolveType(attributeType, true)
                                        }) }
                                        subheader={ t("claims:dialects.dangerZone.subheader", {
                                            type: resolveType(attributeType)
                                        }) }
                                        onActionClick={ () => setConfirmDelete(true) }
                                        data-testid={ `${ testId }-dialect-delete-danger-zone` }
                                    />
                                </DangerZoneGroup>
                            </Show>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            ) }
            { attributeConfig.attributeMappings.showDangerZone && confirmDelete && deleteConfirmation() }
        </>
    );
};

/**
 * Default props for the component.
 */
ExternalDialectEditPage.defaultProps = {
    attributeType: ClaimManagementConstants.OTHERS,
    "data-testid": "external-dialect-edit"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default ExternalDialectEditPage;
