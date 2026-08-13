/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import Box from "@oxygen-ui/react/Box";
import FormControl from "@oxygen-ui/react/FormControl";
import FormControlLabel from "@oxygen-ui/react/FormControlLabel";
import Radio from "@oxygen-ui/react/Radio";
import RadioGroup from "@oxygen-ui/react/RadioGroup";
import { OrganizationListInterface } from "@wso2is/admin.organizations.v1/models";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EmphasizedSegment, Heading, PrimaryButton } from "@wso2is/react-components";
import { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import uniq from "lodash-es/uniq";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import IdentityProviderSelectiveShare from "./identity-provider-selective-share";
import { shareIdPWithAllOrganizations } from "../../../api/share/idp/share-idp-with-all-organizations";
import { shareIdPWithSelectedOrganizations } from "../../../api/share/idp/share-idp-with-selected-organizations";
import {
    unshareIdPFromSelectedOrganizations
} from "../../../api/share/idp/unshare-idp-from-selected-organizations";
import { unshareIdPWithAllOrganizations } from "../../../api/share/idp/unshare-idp-with-all-organizations";
import useGetIdVPShare from "../../../api/use-get-idp-share";
import { ConnectionInterface } from "../../../models/connection";
import {
    IdPSelectiveShareOrganizationInterface,
    IdPShareType,
    IdPSharingPolicy
} from "../../../models/identity-provider-sharing";

/**
 * Proptypes for the identity provider shared access component.
 */
interface IdentityProviderSharedAccessPropsInterface extends IdentifiableComponentInterface {
    /**
     * The identity provider being edited.
     */
    identityProvider: ConnectionInterface;
    /**
     * Whether the tab is read-only.
     */
    isReadOnly: boolean;
}

/**
 * Shared Access tab for identity providers.
 *
 * Allows sharing an identity provider with all organizations, a selected set of organizations,
 * or none. Unlike user/application sharing, identity provider sharing does not support role sharing.
 *
 * @param props - Props injected to the component.
 * @returns The identity provider shared access component.
 */
const IdentityProviderSharedAccess: FunctionComponent<IdentityProviderSharedAccessPropsInterface> = (
    props: IdentityProviderSharedAccessPropsInterface
): ReactElement => {
    const {
        [ "data-componentid" ]: componentId = "identity-provider-shared-access",
        identityProvider,
        isReadOnly
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const identityProviderId: string = identityProvider?.id;

    const [ shareType, setShareType ] = useState<IdPShareType>(IdPShareType.UNSHARE);
    const [ savedShareType, setSavedShareType ] = useState<IdPShareType>(IdPShareType.UNSHARE);
    const [ selectedItems, setSelectedItems ] = useState<string[]>([]);
    const [ addedOrgs, setAddedOrgs ] = useState<string[]>([]);
    const [ removedOrgs, setRemovedOrgs ] = useState<string[]>([]);
    const [ shouldShareWithFutureChildOrgsMap, setShouldShareWithFutureChildOrgsMap ] =
        useState<Record<string, boolean>>({});
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const {
        data: shareData,
        isLoading: isShareDataLoading,
        mutate: mutateShareData
    } = useGetIdVPShare(
        identityProviderId,
        !isEmpty(identityProviderId),
        true,
        null,
        null,
        null,
        null,
        "sharingMode"
    );

    // Derive the initial share type from the current share status.
    useEffect(() => {
        const data: OrganizationListInterface = shareData as OrganizationListInterface;

        if (!data) {
            return;
        }

        if (data.sharingMode?.policy === IdPSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS) {
            setShareType(IdPShareType.SHARE_ALL);
            setSavedShareType(IdPShareType.SHARE_ALL);

            return;
        }

        if (data.organizations?.length > 0) {
            setShareType(IdPShareType.SHARE_SELECTED);
            setSavedShareType(IdPShareType.SHARE_SELECTED);

            return;
        }

        setShareType(IdPShareType.UNSHARE);
        setSavedShareType(IdPShareType.UNSHARE);
    }, [ shareData ]);

    const resolvePolicyForOrg = (orgId: string): IdPSelectiveShareOrganizationInterface["policy"] => {
        return shouldShareWithFutureChildOrgsMap[orgId]
            ? IdPSharingPolicy.SELECTED_ORG_WITH_ALL_EXISTING_AND_FUTURE_CHILDREN
            : IdPSharingPolicy.SELECTED_ORG_ONLY;
    };

    const handleShareError = (error: AxiosError): void => {
        dispatch(addAlert({
            description: (error?.response?.data as { description?: string })?.description
                || t("authenticationProvider:sharedAccess.notifications.share.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("authenticationProvider:sharedAccess.notifications.share.genericError.message")
        }));
    };

    const handleShareSuccess = (): void => {
        dispatch(addAlert({
            description: t("authenticationProvider:sharedAccess.notifications.share.success.description"),
            level: AlertLevels.SUCCESS,
            message: t("authenticationProvider:sharedAccess.notifications.share.success.message")
        }));
    };

    const handleUnshareAll = async (): Promise<void> => {
        await unshareIdPWithAllOrganizations({ identityProviderId });
    };

    const handleShareWithAll = async (): Promise<void> => {
        await shareIdPWithAllOrganizations({
            identityProviderId,
            policy: IdPSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS
        });
    };

    const handleShareWithSelected = async (): Promise<void> => {
        // When switching away from "share with all", first unshare from all organizations.
        if (savedShareType === IdPShareType.SHARE_ALL) {
            await handleUnshareAll();
        }

        const orgsToShare: string[] = uniq(selectedItems);

        if (orgsToShare.length > 0) {
            const organizations: IdPSelectiveShareOrganizationInterface[] = orgsToShare.map(
                (orgId: string) => ({ orgId, policy: resolvePolicyForOrg(orgId) })
            );

            await shareIdPWithSelectedOrganizations({ identityProviderId, organizations });
        }

        const orgsToUnshare: string[] = uniq(removedOrgs).filter((orgId: string) => !orgsToShare.includes(orgId));

        if (orgsToUnshare.length > 0) {
            await unshareIdPFromSelectedOrganizations({ identityProviderId, orgIds: orgsToUnshare });
        }
    };

    const handleSave = async (): Promise<void> => {
        if (shareType === IdPShareType.SHARE_SELECTED && isEmpty(selectedItems)) {
            dispatch(addAlert({
                description: t("authenticationProvider:sharedAccess.notifications." +
                    "noOrganizationsSelected.description"),
                level: AlertLevels.WARNING,
                message: t("authenticationProvider:sharedAccess.notifications.noOrganizationsSelected.message")
            }));

            return;
        }

        setIsSubmitting(true);

        try {
            if (shareType === IdPShareType.UNSHARE) {
                await handleUnshareAll();
            } else if (shareType === IdPShareType.SHARE_ALL) {
                await handleShareWithAll();
            } else {
                await handleShareWithSelected();
            }

            handleShareSuccess();
            setSavedShareType(shareType);
            setAddedOrgs([]);
            setRemovedOrgs([]);
            mutateShareData();
        } catch (error) {
            handleShareError(error as AxiosError);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleShareTypeChange = (_event: ChangeEvent<HTMLInputElement>, value: string): void => {
        setShareType(value as IdPShareType);
    };

    const isLoading: boolean = useMemo(() => isShareDataLoading, [ isShareDataLoading ]);

    return (
        <EmphasizedSegment padded="very" loading={ isLoading }>
            <Heading as="h4">
                { t("authenticationProvider:sharedAccess.title") }
            </Heading>
            <Heading subHeading ellipsis as="h6">
                { t("authenticationProvider:sharedAccess.subTitle") }
            </Heading>
            <FormControl fullWidth data-componentid={ `${ componentId }-share-type-form` }>
                <RadioGroup
                    value={ shareType }
                    onChange={ handleShareTypeChange }
                    data-componentid={ `${ componentId }-share-type-radio-group` }
                >
                    <FormControlLabel
                        value={ IdPShareType.UNSHARE }
                        control={ <Radio /> }
                        label={ t("authenticationProvider:sharedAccess.modes.doNotShare") }
                        disabled={ isReadOnly }
                        data-componentid={ `${ componentId }-do-not-share-radio` }
                    />
                    <FormControlLabel
                        value={ IdPShareType.SHARE_ALL }
                        control={ <Radio /> }
                        label={ t("authenticationProvider:sharedAccess.modes.shareWithAll") }
                        disabled={ isReadOnly }
                        data-componentid={ `${ componentId }-share-all-radio` }
                    />
                    {
                        shareType === IdPShareType.SHARE_ALL && (
                            <Alert severity="info" sx={ { mb: 2, ml: 4 } }>
                                { t("authenticationProvider:sharedAccess.shareAllInfo") }
                            </Alert>
                        )
                    }
                    <FormControlLabel
                        value={ IdPShareType.SHARE_SELECTED }
                        control={ <Radio /> }
                        label={ t("authenticationProvider:sharedAccess.modes.shareWithSelected") }
                        disabled={ isReadOnly }
                        data-componentid={ `${ componentId }-share-selected-radio` }
                    />
                </RadioGroup>
            </FormControl>
            {
                shareType === IdPShareType.SHARE_SELECTED && (
                    <Box sx={ { mt: 2 } }>
                        <IdentityProviderSelectiveShare
                            data-componentid={ `${ componentId }-selective-share` }
                            identityProviderId={ identityProviderId }
                            selectedItems={ selectedItems }
                            setSelectedItems={ setSelectedItems }
                            addedOrgs={ addedOrgs }
                            setAddedOrgs={ setAddedOrgs }
                            removedOrgs={ removedOrgs }
                            setRemovedOrgs={ setRemovedOrgs }
                            shouldShareWithFutureChildOrgsMap={ shouldShareWithFutureChildOrgsMap }
                            setShouldShareWithFutureChildOrgsMap={ setShouldShareWithFutureChildOrgsMap }
                        />
                    </Box>
                )
            }
            {
                !isReadOnly && (
                    <Box sx={ { mt: 3 } }>
                        <PrimaryButton
                            loading={ isSubmitting }
                            disabled={ isSubmitting }
                            onClick={ handleSave }
                            data-componentid={ `${ componentId }-save-button` }
                        >
                            { t("common:update") }
                        </PrimaryButton>
                    </Box>
                )
            }
        </EmphasizedSegment>
    );
};

export default IdentityProviderSharedAccess;
