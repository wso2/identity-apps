
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
     * Handles org update callback
     */
    handleOrganizationUpdate: (orgId: string) => void;
}

export const EditOrganization: FunctionComponent<EditOrganizationPropsInterface> = (
    props: EditOrganizationPropsInterface
): JSX.Element => {

    const {
        organization,
        handleOrganizationUpdate
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const onOrganizationDelete = useCallback(() =>
        history.push(AppConstants.getPaths().get("ORGANIZATIONS")),
    []
    );

    const panes = () => ([
        {
            menuItem: t("Organization Details"),
            render: () => (
                <ResourceTab.Pane controlledSegmentation attached={ false }>
                    <OrganizationProfile 
                        organization={ organization }
                        onOrganizationDelete={ onOrganizationDelete }
                        isReadOnly={ false }
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
