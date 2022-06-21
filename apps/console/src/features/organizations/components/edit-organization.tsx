
import { SBACInterface } from "@wso2is/core/models";
import { ResourceTab } from "@wso2is/react-components";
import React, { FunctionComponent, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { OrganizationProfile } from "./organization-profile";
import { AppConstants, FeatureConfigInterface, history } from "../../core";
import { UserGroupsList, UserProfile, UserRolesList, UserSessions } from "../../users";
import { OrganizationInterface, OrganizationResponseInterface } from "../models";

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
            menuItem: t("Organization Details"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <OrganizationProfile 
                        organization={ organization }
                        isReadOnly={ isReadOnly }
                        onOrganizationUpdate={ onOrganizationUpdate }
                        onOrganizationDelete={ onOrganizationDelete }
                    />
                </ResourceTab.Pane>
            )
        },
        {
            menuItem: t("Organization Attributes"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <div>Organization Attributes</div>
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
