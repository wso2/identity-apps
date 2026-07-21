/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import IconButton from "@oxygen-ui/react/IconButton";
import Switch from "@oxygen-ui/react/Switch";
import MuiTextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import {
    AlertInterface,
    AlertLevels,
    HttpErrorResponseDataInterface,
    IdentifiableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FinalFormField, FormRenderProps, TextFieldAdapter } from "@wso2is/forms";
import {
    AnimatedAvatar,
    AppAvatar,
    Button,
    ConfirmationModal,
    ContentLoader,
    DangerZone,
    DangerZoneGroup,
    DataTable,
    EmphasizedSegment,
    Hint,
    PageLayout,
    PrimaryButton,
    ResourceTab,
    ResourceTabPaneInterface,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router-dom";
import { Dispatch } from "redux";
import { Divider, Header, Icon, SemanticICONS } from "semantic-ui-react";
import { deletePresentationDefinition, updatePresentationDefinition } from "../api/presentation-definitions";
import CredentialEditDialog from "../components/credential-edit-dialog";
import { useGetPresentationDefinition } from "../hooks/use-get-presentation-definition";
import {
    CredentialSetModel,
    PresentationDefinitionUpdateModel,
    RequestedCredentialModel
} from "../models/presentation-definitions";

interface RouteParams {
    id: string;
}

type PresentationDefinitionEditPagePropsInterface = IdentifiableComponentInterface & RouteComponentProps<RouteParams>;

interface GeneralFormValues {
    name: string;
    description?: string;
}

/**
 * Presentation Definition edit page.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
const PresentationDefinitionEditPage: FunctionComponent<PresentationDefinitionEditPagePropsInterface> = ({
    match,
    "data-componentid": componentId = "presentation-definition-edit"
}: PresentationDefinitionEditPagePropsInterface): ReactElement => {
    const definitionId: string = match?.params?.id;
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ isGeneralSubmitting, setIsGeneralSubmitting ] = useState<boolean>(false);
    const [ isCredentialsSubmitting, setIsCredentialsSubmitting ] = useState<boolean>(false);
    const [ showDeleteDefinitionModal, setShowDeleteDefinitionModal ] = useState<boolean>(false);

    const [ credentials, setCredentials ] = useState<RequestedCredentialModel[]>([]);
    const [ credentialSets, setCredentialSets ] = useState<CredentialSetModel[]>([]);
    const [ showCredentialDialog, setShowCredentialDialog ] = useState<boolean>(false);
    const [ editingCredentialIndex, setEditingCredentialIndex ] = useState<number>(-1);
    const [ showDeleteCredentialModal, setShowDeleteCredentialModal ] = useState<boolean>(false);
    const [ deletingCredentialIndex, setDeletingCredentialIndex ] = useState<number>(-1);

    const { data: definition, isLoading, error } = useGetPresentationDefinition(definitionId, true);

    useEffect(() => {
        if (error) {
            dispatch(addAlert<AlertInterface>({
                description: t("presentationDefinitions:notifications.fetchDefinition.error.description"),
                level: AlertLevels.ERROR,
                message: t("presentationDefinitions:notifications.fetchDefinition.error.message")
            }));
        }
    }, [ error ]);

    useEffect(() => {
        if (definition?.credentials) {
            setCredentials(definition.credentials);
            setCredentialSets(definition.credentialSets ?? []);
        }
    }, [ definition ]);

    const handleGeneralUpdate = (values: GeneralFormValues): void => {
        if (!values?.name) {
            return;
        }

        setIsGeneralSubmitting(true);

        const updateData: PresentationDefinitionUpdateModel = {
            description: values.description?.trim() || undefined,
            name: values.name.trim()
        };

        updatePresentationDefinition(definitionId, updateData)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.updateDefinition.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("presentationDefinitions:notifications.updateDefinition.success.message")
                }));
            })
            .catch((_error: AxiosError<HttpErrorResponseDataInterface>) => {
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.updateDefinition.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("presentationDefinitions:notifications.updateDefinition.error.message")
                }));
            })
            .finally(() => setIsGeneralSubmitting(false));
    };

    const handleCredentialsUpdate = (): void => {
        setIsCredentialsSubmitting(true);

        const updateData: PresentationDefinitionUpdateModel = {
            credentialSets: credentialSets.length > 0 ? credentialSets : undefined,
            credentials
        };

        updatePresentationDefinition(definitionId, updateData)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.updateDefinition.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("presentationDefinitions:notifications.updateDefinition.success.message")
                }));
            })
            .catch((_error: AxiosError<HttpErrorResponseDataInterface>) => {
                dispatch(addAlert<AlertInterface>({
                    description: t("presentationDefinitions:notifications.updateDefinition.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("presentationDefinitions:notifications.updateDefinition.error.message")
                }));
            })
            .finally(() => setIsCredentialsSubmitting(false));
    };

    const handleDeleteDefinition = (): void => {
        deletePresentationDefinition(definitionId)
            .then(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t(
                        "presentationDefinitions:notifications.deleteDefinition.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t("presentationDefinitions:notifications.deleteDefinition.success.message")
                }));
                history.push(AppConstants.getPaths().get("VP_DEFINITIONS"));
            })
            .catch(() => {
                dispatch(addAlert<AlertInterface>({
                    description: t(
                        "presentationDefinitions:notifications.deleteDefinition.error.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t("presentationDefinitions:notifications.deleteDefinition.error.message")
                }));
            });
    };

    const handleCredentialSave = (credential: RequestedCredentialModel): void => {
        setCredentials((prev: RequestedCredentialModel[]) => {
            const updated: RequestedCredentialModel[] = [ ...prev ];

            if (editingCredentialIndex >= 0) {
                updated[editingCredentialIndex] = credential;
            } else {
                updated.push(credential);
            }

            return updated;
        });
        setShowCredentialDialog(false);
        setEditingCredentialIndex(-1);
    };

    const handleCredentialDelete = (): void => {
        setCredentials((prev: RequestedCredentialModel[]) =>
            prev.filter((_: RequestedCredentialModel, i: number) => i !== deletingCredentialIndex)
        );
        setShowDeleteCredentialModal(false);
        setDeletingCredentialIndex(-1);
    };

    // ---- Credential set handlers ----

    const addCredentialSet = (): void => {
        setCredentialSets((prev: CredentialSetModel[]) => [
            ...prev,
            { options: [ [] ], required: true }
        ]);
    };

    const removeCredentialSet = (setIndex: number): void => {
        setCredentialSets((prev: CredentialSetModel[]) =>
            prev.filter((_: CredentialSetModel, i: number) => i !== setIndex)
        );
    };

    const updateCredentialSetRequired = (setIndex: number, required: boolean): void => {
        setCredentialSets((prev: CredentialSetModel[]) => {
            const updated: CredentialSetModel[] = [ ...prev ];

            updated[setIndex] = { ...updated[setIndex], required };

            return updated;
        });
    };

    const addCredentialSetOption = (setIndex: number): void => {
        setCredentialSets((prev: CredentialSetModel[]) => {
            const updated: CredentialSetModel[] = [ ...prev ];

            updated[setIndex] = {
                ...updated[setIndex],
                options: [ ...updated[setIndex].options, [] ]
            };

            return updated;
        });
    };

    const removeCredentialSetOption = (setIndex: number, optionIndex: number): void => {
        setCredentialSets((prev: CredentialSetModel[]) => {
            const updated: CredentialSetModel[] = [ ...prev ];

            updated[setIndex] = {
                ...updated[setIndex],
                options: updated[setIndex].options.filter(
                    (_: string[], i: number) => i !== optionIndex
                )
            };

            return updated;
        });
    };

    const updateCredentialSetOption = (
        setIndex: number,
        optionIndex: number,
        credentialIds: string[]
    ): void => {
        setCredentialSets((prev: CredentialSetModel[]) => {
            const updated: CredentialSetModel[] = [ ...prev ];
            const updatedOptions: string[][] = [ ...updated[setIndex].options ];

            updatedOptions[optionIndex] = credentialIds;
            updated[setIndex] = { ...updated[setIndex], options: updatedOptions };

            return updated;
        });
    };

    // ----

    const resolveCredentialTableColumns = (): TableColumnInterface[] => [
        {
            allowToggleVisibility: false,
            dataIndex: "type",
            id: "type",
            key: "type",
            render: (credential: RequestedCredentialModel): ReactNode => (
                <Header image as="h6" className="header-with-icon">
                    <AppAvatar
                        image={
                            <AnimatedAvatar
                                name={ credential.type }
                                size="mini"
                                data-componentid={ `${componentId}-credential-avatar` }
                            />
                        }
                        size="mini"
                        spaced="right"
                    />
                    <Header.Content>
                        { credential.type }
                        { credential.purpose && (
                            <Header.Subheader>{ credential.purpose }</Header.Subheader>
                        ) }
                    </Header.Content>
                </Header>
            ),
            title: t("presentationDefinitions:editPage.form.credentials.type.label")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "enforceTrustedIssuers",
            id: "enforceTrustedIssuers",
            key: "enforceTrustedIssuers",
            render: (credential: RequestedCredentialModel): ReactNode => (
                credential.enforceTrustedIssuers
                    ? (
                        <span>
                            <Icon name="check circle" color="green" />
                            { (credential.trustedIssuers?.length ?? 0) > 0
                                ? `${credential.trustedIssuers.length} issuer(s)`
                                : "Enforced"
                            }
                        </span>
                    )
                    : <span>{ "—" }</span>
            ),
            title: t("presentationDefinitions:editPage.form.credentials.enforceTrustedIssuers.label")
        },
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "actions",
            key: "actions",
            textAlign: "right",
            title: t("presentationDefinitions:list.columns.actions")
        }
    ];

    const resolveCredentialTableActions = (): TableActionsInterface[] => [
        {
            "data-componentid": `${componentId}-credential-edit-button`,
            hidden: (): boolean => false,
            icon: (): SemanticICONS => "pencil alternate",
            onClick: (_e: SyntheticEvent, credential: RequestedCredentialModel): void => {
                const index: number = credentials.indexOf(credential);

                setEditingCredentialIndex(index);
                setShowCredentialDialog(true);
            },
            popupText: (): string => t("common:edit"),
            renderer: "semantic-icon"
        },
        {
            "data-componentid": `${componentId}-credential-delete-button`,
            hidden: (): boolean => false,
            icon: (): SemanticICONS => "trash alternate",
            onClick: (_e: SyntheticEvent, credential: RequestedCredentialModel): void => {
                const index: number = credentials.indexOf(credential);

                setDeletingCredentialIndex(index);
                setShowDeleteCredentialModal(true);
            },
            popupText: (): string => t("common:delete"),
            renderer: "semantic-icon"
        }
    ];

    const availableCredentialQueryIds: string[] = credentials.map(
        (c: RequestedCredentialModel) => c.credentialQueryId
    );

    const GeneralTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <EmphasizedSegment paddingless={ false }>
                <FinalForm
                    initialValues={ {
                        description: definition?.description ?? "",
                        name: definition?.name ?? ""
                    } }
                    onSubmit={ handleGeneralUpdate }
                    render={ ({ handleSubmit }: FormRenderProps) => (
                        <form id="editPresentationDefinitionGeneralForm" onSubmit={ handleSubmit }>
                            <FinalFormField
                                name="name"
                                label={ t("presentationDefinitions:editPage.form.name.label") }
                                placeholder={ t("presentationDefinitions:editPage.form.name.placeholder") }
                                required={ true }
                                component={ TextFieldAdapter }
                                maxLength={ 100 }
                                minLength={ 0 }
                            />
                            <FinalFormField
                                name="description"
                                label={ t("presentationDefinitions:editPage.form.description.label") }
                                placeholder={ t("presentationDefinitions:editPage.form.description.placeholder") }
                                required={ false }
                                component={ TextFieldAdapter }
                                maxLength={ 255 }
                                minLength={ 0 }
                            />
                            <Divider hidden />
                            <PrimaryButton
                                type="submit"
                                disabled={ isGeneralSubmitting }
                                loading={ isGeneralSubmitting }
                                onClick={ () => {
                                    document
                                        .getElementById("editPresentationDefinitionGeneralForm")
                                        .dispatchEvent(
                                            new Event("submit", { bubbles: true, cancelable: true })
                                        );
                                } }
                                data-componentid={ `${componentId}-general-save-button` }
                            >
                                { t("common:update") }
                            </PrimaryButton>
                        </form>
                    ) }
                />
            </EmphasizedSegment>

            <Divider hidden />

            <DangerZoneGroup sectionHeader={ t("presentationDefinitions:editPage.dangerZone.header") }>
                <DangerZone
                    actionTitle={ t("presentationDefinitions:editPage.dangerZone.delete.actionTitle") }
                    header={ t("presentationDefinitions:editPage.dangerZone.delete.header") }
                    subheader={ t("presentationDefinitions:editPage.dangerZone.delete.subheader") }
                    onActionClick={ () => setShowDeleteDefinitionModal(true) }
                    data-componentid={ `${componentId}-danger-zone` }
                />
            </DangerZoneGroup>
        </ResourceTab.Pane>
    );

    const CredentialsTabPane = (): ReactElement => (
        <ResourceTab.Pane controlledSegmentation>
            <EmphasizedSegment paddingless={ false }>

                { /* ---- Credentials table ---- */ }
                <DataTable<RequestedCredentialModel>
                    className="credentials-table"
                    isLoading={ false }
                    actions={ resolveCredentialTableActions() }
                    columns={ resolveCredentialTableColumns() }
                    data={ credentials }
                    placeholders={ credentials.length === 0
                        ? (
                            <div className="no-content-placeholder">
                                { t("presentationDefinitions:editPage.form.credentials.noCredentials") }
                            </div>
                        )
                        : null
                    }
                    selectable={ false }
                    showHeader={ true }
                    transparent={ credentials.length === 0 }
                    data-componentid={ `${componentId}-credentials-table` }
                />

                <Divider hidden />

                <PrimaryButton
                    size="mini"
                    onClick={ () => {
                        setEditingCredentialIndex(-1);
                        setShowCredentialDialog(true);
                    } }
                    data-componentid={ `${componentId}-add-credential-button` }
                >
                    <Icon name="add" />
                    { t("presentationDefinitions:editPage.form.credentials.addButton") }
                </PrimaryButton>

                { /* ---- Credential Sets ---- */ }
                <Divider />

                <Typography variant="subtitle1" sx={ { fontWeight: 600, mb: 0.5 } }>
                    { t("presentationDefinitions:editPage.form.credentialSets.label") }
                </Typography>
                <Hint>
                    { t("presentationDefinitions:editPage.form.credentialSets.hint") }
                </Hint>

                { credentialSets.map((credSet: CredentialSetModel, setIndex: number) => (
                    <Box
                        key={ setIndex }
                        sx={ {
                            border: "1px solid #e0e0e0",
                            borderRadius: 1,
                            mb: 1.5,
                            mt: 1,
                            p: 1.5,
                            position: "relative"
                        } }
                        data-componentid={ `${componentId}-credential-set-${setIndex}` }
                    >
                        <IconButton
                            size="small"
                            sx={ { position: "absolute", right: 4, top: 4 } }
                            onClick={ () => removeCredentialSet(setIndex) }
                            aria-label="remove credential set"
                            data-componentid={ `${componentId}-credential-set-${setIndex}-remove` }
                        >
                            <Icon name="close" />
                        </IconButton>

                        <Typography variant="caption" sx={ { color: "text.secondary", display: "block", mb: 1 } }>
                            { t("presentationDefinitions:editPage.form.credentialSets.setLabel",
                                { index: setIndex + 1 }) }
                        </Typography>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={ credSet.required ?? true }
                                    onChange={ (e: React.ChangeEvent<HTMLInputElement>) =>
                                        updateCredentialSetRequired(setIndex, e.target.checked)
                                    }
                                    size="small"
                                    data-componentid={ `${componentId}-credential-set-${setIndex}-required` }
                                />
                            }
                            label={ t("presentationDefinitions:editPage.form.credentialSets.required.label") }
                            sx={ { mb: 1 } }
                        />

                        <Typography variant="caption" sx={ { color: "text.secondary", display: "block", mb: 0.5 } }>
                            { t("presentationDefinitions:editPage.form.credentialSets.options.label") }
                        </Typography>
                        <Hint>
                            { t("presentationDefinitions:editPage.form.credentialSets.options.hint") }
                        </Hint>

                        { credSet.options.map((option: string[], optionIndex: number) => (
                            <Box
                                key={ optionIndex }
                                sx={ { alignItems: "center", display: "flex", gap: 1, mb: 1, mt: 0.5 } }
                                data-componentid={
                                    `${componentId}-credential-set-${setIndex}-option-${optionIndex}`
                                }
                            >
                                <Box sx={ { flex: 1 } }>
                                    <Autocomplete
                                        multiple
                                        freeSolo
                                        options={ availableCredentialQueryIds }
                                        value={ option }
                                        onChange={ (_e: React.SyntheticEvent, newValue: string[]) =>
                                            updateCredentialSetOption(setIndex, optionIndex, newValue)
                                        }
                                        renderInput={ (params: AutocompleteRenderInputParams) => (
                                            <MuiTextField
                                                { ...params }
                                                label={ t(
                                                    "presentationDefinitions:editPage.form.credentialSets.options.optionLabel",
                                                    { index: optionIndex + 1 }
                                                ) }
                                                placeholder={
                                                    option.length === 0
                                                        ? t(
                                                            "presentationDefinitions:editPage.form.credentialSets.options.optionPlaceholder"
                                                        )
                                                        : undefined
                                                }
                                                size="small"
                                            />
                                        ) }
                                        data-componentid={
                                            `${componentId}-credential-set-${setIndex}-option-${optionIndex}-ids`
                                        }
                                    />
                                </Box>
                                { credSet.options.length > 1 && (
                                    <IconButton
                                        size="small"
                                        onClick={ () => removeCredentialSetOption(setIndex, optionIndex) }
                                        aria-label="remove option"
                                        data-componentid={
                                            `${componentId}-credential-set-${setIndex}-option-${optionIndex}-remove`
                                        }
                                    >
                                        <Icon name="close" />
                                    </IconButton>
                                ) }
                            </Box>
                        )) }

                        <Button
                            basic
                            primary
                            size="mini"
                            type="button"
                            onClick={ () => addCredentialSetOption(setIndex) }
                            data-componentid={ `${componentId}-credential-set-${setIndex}-add-option` }
                        >
                            <Icon name="add" />
                            { t("presentationDefinitions:editPage.form.credentialSets.options.addOption") }
                        </Button>
                    </Box>
                )) }

                <Button
                    basic
                    primary
                    size="mini"
                    type="button"
                    onClick={ addCredentialSet }
                    data-componentid={ `${componentId}-add-credential-set-button` }
                >
                    <Icon name="add" />
                    { t("presentationDefinitions:editPage.form.credentialSets.addSet") }
                </Button>
            </EmphasizedSegment>

            <Divider hidden />

            <PrimaryButton
                disabled={ isCredentialsSubmitting }
                loading={ isCredentialsSubmitting }
                onClick={ handleCredentialsUpdate }
                data-componentid={ `${componentId}-credentials-save-button` }
            >
                { t("common:update") }
            </PrimaryButton>
        </ResourceTab.Pane>
    );

    const getPanes = (): ResourceTabPaneInterface[] => [
        {
            "data-tabid": "general",
            menuItem: t("presentationDefinitions:editPage.tabs.general"),
            render: GeneralTabPane
        },
        {
            "data-tabid": "credentials",
            menuItem: t("presentationDefinitions:editPage.tabs.credentials"),
            render: CredentialsTabPane
        }
    ];

    if (isLoading) {
        return <ContentLoader />;
    }

    return (
        <PageLayout
            pageTitle={ t("presentationDefinitions:editPage.title") }
            title={ definition?.name ?? t("presentationDefinitions:editPage.title") }
            description={ definition?.description }
            data-componentid={ `${componentId}-page-layout` }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ true }
            backButton={ {
                "data-componentid": `${componentId}-page-back-button`,
                onClick: () => history.push(AppConstants.getPaths().get("VP_DEFINITIONS")),
                text: t("presentationDefinitions:editPage.backButton")
            } }
        >
            <ResourceTab
                panes={ getPanes() }
                data-componentid={ `${componentId}-resource-tabs` }
            />

            { showDeleteDefinitionModal && (
                <ConfirmationModal
                    data-componentid={ `${componentId}-delete-definition-modal` }
                    onClose={ () => setShowDeleteDefinitionModal(false) }
                    type="negative"
                    open={ showDeleteDefinitionModal }
                    assertionHint={ t(
                        "presentationDefinitions:editPage.confirmations.deleteDefinition.assertionHint"
                    ) }
                    assertionType="checkbox"
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ () => setShowDeleteDefinitionModal(false) }
                    onPrimaryActionClick={ handleDeleteDefinition }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        { t("presentationDefinitions:editPage.confirmations.deleteDefinition.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached negative>
                        { t("presentationDefinitions:editPage.confirmations.deleteDefinition.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("presentationDefinitions:editPage.confirmations.deleteDefinition.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }

            { showDeleteCredentialModal && (
                <ConfirmationModal
                    data-componentid={ `${componentId}-delete-credential-modal` }
                    onClose={ () => setShowDeleteCredentialModal(false) }
                    type="negative"
                    open={ showDeleteCredentialModal }
                    assertionType="checkbox"
                    assertionHint={ t("common:confirm") }
                    primaryAction={ t("common:confirm") }
                    secondaryAction={ t("common:cancel") }
                    onSecondaryActionClick={ () => setShowDeleteCredentialModal(false) }
                    onPrimaryActionClick={ handleCredentialDelete }
                    closeOnDimmerClick={ false }
                >
                    <ConfirmationModal.Header>
                        { t("presentationDefinitions:list.confirmations.deleteItem.header") }
                    </ConfirmationModal.Header>
                    <ConfirmationModal.Message attached negative>
                        { t("presentationDefinitions:list.confirmations.deleteItem.message") }
                    </ConfirmationModal.Message>
                    <ConfirmationModal.Content>
                        { t("presentationDefinitions:list.confirmations.deleteItem.content") }
                    </ConfirmationModal.Content>
                </ConfirmationModal>
            ) }

            <CredentialEditDialog
                open={ showCredentialDialog }
                onClose={ () => {
                    setShowCredentialDialog(false);
                    setEditingCredentialIndex(-1);
                } }
                onSave={ handleCredentialSave }
                editingCredential={
                    editingCredentialIndex >= 0 ? credentials[editingCredentialIndex] : undefined
                }
                isAdd={ editingCredentialIndex < 0 }
                data-componentid={ `${componentId}-credential-edit-dialog` }
            />
        </PageLayout>
    );
};

export default PresentationDefinitionEditPage;
