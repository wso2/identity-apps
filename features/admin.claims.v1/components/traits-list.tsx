import React, { FunctionComponent, ReactElement, SyntheticEvent } from "react";
import { DataTable, AppAvatar, AnimatedAvatar } from "@wso2is/react-components";
import { TableActionsInterface, TableColumnInterface } from "@wso2is/react-components";
import { SemanticICONS } from "semantic-ui-react";
import { Trait } from "../api/traits";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";

interface TraitsListProps {
    traits: Trait[];
    isLoading: boolean;
    onRefresh: () => void;
}

export const TraitsList: FunctionComponent<TraitsListProps> = ({
    traits,
    isLoading,
    onRefresh
}: TraitsListProps): ReactElement => {

    const columns: TableColumnInterface[] = [
        {
            allowToggleVisibility: false,
            dataIndex: "attribute_name",
            id: "attribute_name",
            key: "attribute_name",
            render: (trait: Trait) => {
                const displayName = trait.attribute_name.replace(/^traits\./, "");
                const initial = displayName.split(".").pop();

                return (
                    <div className="header-with-icon">
                        <AppAvatar
                            image={ (
                                <AnimatedAvatar
                                    name={ initial }
                                    size="mini"
                                />
                            ) }
                            size="mini"
                            spaced="right"
                        />
                        { displayName }
                    </div>
                );
            },
            title: "Name"
        },
        {
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "actions",
            key: "actions",
            textAlign: "right",
            title: ""
        }
    ];

    const actions: TableActionsInterface[] = [
        {
            icon: (): SemanticICONS => "pencil alternate",
            onClick: (e: SyntheticEvent, trait: Trait): void => {
                history.push(AppConstants.getPaths().get("TRAITS_EDIT").replace(":id", trait.attribute_id));
            },
            popupText: (): string => "Edit",
            renderer: "semantic-icon"
        }
    ];

    return (
        <DataTable<Trait>
            isLoading={ isLoading }
            columns={ columns }
            data={ traits }
            actions={ actions }
            onRowClick={ (e: SyntheticEvent, trait: Trait): void => {
                history.push(AppConstants.getPaths().get("TRAITS_EDIT").replace(":id", trait.attribute_id));
            } }
            showHeader={ true }
            transparent={ !isLoading && traits.length === 0 }
            showActions={ true }
        />
    );
};
