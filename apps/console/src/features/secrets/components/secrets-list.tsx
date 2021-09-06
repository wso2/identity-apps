import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    AnimatedAvatar,
    AppAvatar,
    DataTable,
    GridLayout,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import { AxiosResponse } from "axios";
import React, { FC, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header, SemanticICONS } from "semantic-ui-react";
import { getSecretList } from "../api/secret";
import { GetSecretListResponse, SecretModel } from "../models/secret";
import { formatDateString, humanizeDateString } from "../utils/secret.common.utils";

export type SecretsListProps = {
    secretType: string;
} & IdentifiableComponentInterface;

const SecretsList: FC<SecretsListProps> = (props: SecretsListProps): ReactElement => {

    const {
        secretType,
        ["data-componentid"]: testId
    } = props;

    const { t } = useTranslation();

    /**
     * List of secrets for the selected {@code secretType}. It can hold secrets of
     * either a custom one or the static type "ADAPTIVE_AUTH_CALL_CHOREO"
     */
    const [ secretList, setSecretList ] = useState<SecretModel[]>([]);
    const [ loadingSecretsList, setLoadingSecretsList ] = useState<boolean>(true);

    useEffect(() => {

        setLoadingSecretsList(true);

        getSecretList({
            params: { secretType }
        }).then((axiosResponse: AxiosResponse<GetSecretListResponse>) => {

            setSecretList(axiosResponse.data);
            setLoadingSecretsList(false);

            console.log(axiosResponse);
        }).catch(() => {

            setLoadingSecretsList(false);

        });

    }, []);

    // Event handlers

    const onRowClick = (e: React.SyntheticEvent, item: SecretModel) => {
        // FIXME: stash key 'edit_section`
    };

    // JSX methods and render()

    const createDatatableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "secretName",
                id: "secret-name",
                key: "data-column-secret-name",
                render(data: SecretModel) {
                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-testid={ `${ testId }-first-column` }>
                            <Header.Content
                                data-testid={ `${ testId }-first-column-item-header` }>
                                <AppAvatar
                                    image={ (
                                        <AnimatedAvatar
                                            name={ data.secretName }
                                            size="mini"
                                            data-testid={ `${ testId }-item-image-inner` }
                                        />
                                    ) }
                                    size="mini"
                                    spaced="right"
                                    data-testid={ `${ testId }-item-image` }
                                />
                                { data.secretName }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "Secret Name"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "created",
                id: "created-at",
                key: "data-column-created-at",
                render(data: SecretModel) {
                    return (
                        <Header as="h6" data-testid={ `${ testId }-second-column` }>
                            <Header.Content data-testid={ `${ testId }-second-column-data` }>
                                { formatDateString(data.created) }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "Created At"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "lastModified",
                id: "last-modified",
                key: "data-column-last-modified",
                render(data: SecretModel) {
                    return (
                        <Header as="h6" data-testid={ `${ testId }-third-column` }>
                            <Header.Content data-testid={ `${ testId }-third-column-data` }>
                                { humanizeDateString(data.lastModified) }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "Last Modified"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: "Manage"
            }
        ];
    };

    const createDatatableActions = (): TableActionsInterface[] => {
        return [
            {
                "data-componentid": `${ testId }-item-edit-button`,
                hidden: () => false,
                icon: (): SemanticICONS => "pencil alternate",
                onClick(event: SyntheticEvent, data: SecretModel) {
                    // FIXME: stash key 'edit_section`
                },
                popupText: (): string => t("common:edit"),
                renderer: "semantic-icon"
            },
            {
                "data-componentid": `${ testId }-item-delete-button`,
                hidden: () => false,
                icon: (): SemanticICONS => "trash alternate",
                onClick(event: SyntheticEvent, data: SecretModel) {
                    // TODO: implement
                },
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    return (
        <GridLayout isLoading={ loadingSecretsList }>
            <DataTable<SecretModel>
                data={ secretList }
                onRowClick={ onRowClick }
                actions={ createDatatableActions() }
                columns={ createDatatableColumns() }>
            </DataTable>
        </GridLayout>
    );

};

SecretsList.defaultProps = {
    "data-componentid": "secrets-list"
};

export default SecretsList;
