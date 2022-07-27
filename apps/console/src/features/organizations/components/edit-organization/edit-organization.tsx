import { SBACInterface } from "@wso2is/core/models";
import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";
import { OrganizationAttributes } from "./organization-attributes";
import { OrganizationOverview } from "./organization-overview";
import { FeatureConfigInterface } from "../../../core";
import { OrganizationResponseInterface } from "../../models";

interface EditOrganizationPropsInterface extends SBACInterface<FeatureConfigInterface> {
    /**
     * Organization Info
     */
    organization: OrganizationResponseInterface;

    /**
     * Is Readonly access
     */
    isReadOnly: boolean;

    /**
     * on org update callback
     */
    onOrganizationUpdate: (orgId: string) => void;

    /**
     * on org delete callback
     */
    onOrganizationDelete: (orgId: string) => void;
}

export const EditOrganization: FunctionComponent<EditOrganizationPropsInterface> = (
    props: EditOrganizationPropsInterface
): JSX.Element => {

    const {
        organization,
        isReadOnly,
        onOrganizationUpdate,
        onOrganizationDelete
    } = props;

    const { t } = useTranslation();

    const panes = () => ([
        {
            menuItem: t("console:manage.features.organizations.edit.tabTitles.overview"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <OrganizationOverview
                        organization={ organization }
                        isReadOnly={ isReadOnly }
                        onOrganizationUpdate={ onOrganizationUpdate }
                        onOrganizationDelete={ onOrganizationDelete }
                    />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: t("console:manage.features.organizations.edit.tabTitles.attributes"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <OrganizationAttributes
                        organization={ organization }
                        isReadOnly={ isReadOnly }
                        onAttributeUpdate={ onOrganizationUpdate }
                    />
                </ResourceTab.Pane>
            )
        }
    ]);

    return (
        <ResourceTab
            panes={ panes() }
        />
    );

};
