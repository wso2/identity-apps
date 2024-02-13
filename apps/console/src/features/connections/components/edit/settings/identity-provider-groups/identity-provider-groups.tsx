/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import useUIConfig from "@wso2is/common/src/hooks/use-ui-configs";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader, EmphasizedSegment, Hint, Message } from "@wso2is/react-components";
import React, {
    ChangeEvent,
    FunctionComponent,
    ReactElement,
    useEffect,
    useState
} from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Form, Grid } from "semantic-ui-react";
import { IdentityProviderGroupsList } from "./identity-provider-groups-list";
import { AppState, FeatureConfigInterface } from "../../../../../core";
import { useClaimConfigs } from "../../../../api/connections";
import { ConnectionManagementConstants } from "../../../../constants/connection-constants";
import {
    ConnectionClaimMappingInterface,
    ConnectionInterface
} from "../../../../models/connection";

const FORM_ID: string = "idp-group-attributes-form";

/**
 * Proptypes for the identity provider groups component.
 */
interface IdentityProviderGroupsPropsInterface extends SBACInterface<FeatureConfigInterface>,
    IdentifiableComponentInterface {
    /**
     * Currently editing IDP.
     */
    editingIDP: ConnectionInterface;
    /**
     * Make the form read only.
     */
    isReadOnly?: boolean;
    /**
     * Is the data still loading.
     */
    isLoading?: boolean;
    /**
     * Loading Component.
     */
    loader: () => ReactElement;
}

/**
 * Identity provider groups component.
 *
 * @param props - Props related to identity provider groups component.
 */
export const IdentityProviderGroupsTab: FunctionComponent<IdentityProviderGroupsPropsInterface> = (
    props: IdentityProviderGroupsPropsInterface
): ReactElement => {

    const {
        editingIDP,
        isReadOnly,
        [ "data-componentid" ]: componentId
    } = props;

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const { UIConfig } = useUIConfig();
    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    const [ groupAttribute, setGroupAttribute ] = useState<string>("");

    const {
        data: originalClaimConfigs,
        isLoading: isClaimConfigsFetchRequestLoading,
        error: claimConfigsFetchRequestError
    } = useClaimConfigs(editingIDP?.id);

    useEffect(() => {
        if (originalClaimConfigs instanceof IdentityAppsApiException
                || claimConfigsFetchRequestError) {
            handleRetrieveError();

            return;
        }

        if (!originalClaimConfigs) {
            return;
        }

        setGroupAttribute(getGroupAttribute());
    }, [ originalClaimConfigs ]);

    /**
     * Displays the error banner when unable to fetch identity claim configurations.
     */
    const handleRetrieveError = (): void => {
        dispatch(
            addAlert({
                description: t("extensions:console.identityProviderGroups.claimConfigs." +
                    "notifications.fetchConfigs.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("extensions:console.identityProviderGroups.claimConfigs." +
                    "notifications.fetchConfigs.genericError.message")
            })
        );
    };

    const getGroupAttribute = (): string => {
        if (originalClaimConfigs?.mappings?.length > 0) {
            const groupAttribute: ConnectionClaimMappingInterface = originalClaimConfigs.mappings.find(
                (claim: ConnectionClaimMappingInterface) => {
                    return claim.localClaim.uri === ConnectionManagementConstants.CLAIM_APP_ROLE;
                }
            );

            if (groupAttribute) {
                return groupAttribute.idpClaim;
            } else {
                return "";
            }
        } else {
            return "";
        }
    };

    /**
     * Renders the group attribute update form.
     */
    const renderGroupAttributeUpdateForm = (): ReactElement => {
        return (
            <EmphasizedSegment padded="very">
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={ 8 }>
                            <Form
                                id={ FORM_ID }
                            >
                                <Form.Input
                                    name="groupAttribute"
                                    label={ t("extensions:console.identityProviderGroups.claimConfigs." +
                                        "groupAttributeLabel") }
                                    placeholder={ t("extensions:console.identityProviderGroups.claimConfigs." +
                                        "groupAttributePlaceholder") }
                                    readOnly={ true }
                                    maxLength={ ConnectionManagementConstants.CLAIM_CONFIG_FIELD_MAX_LENGTH }
                                    minLength={ ConnectionManagementConstants.CLAIM_CONFIG_FIELD_MIN_LENGTH }
                                    data-componentid={ `${ componentId }-group-attribute-input` }
                                    value={ groupAttribute }
                                    onChange={ (e: ChangeEvent<HTMLInputElement>) => {
                                        setGroupAttribute(e.target.value);
                                    } }
                                    width={ 16 }
                                />
                                <Hint>
                                    { t("extensions:console.identityProviderGroups.claimConfigs.groupAttributeHint") }
                                </Hint>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </EmphasizedSegment>
        );
    };

    /**
     * Renders the group attribute message when the `useRoleClaimAsGroupClaim` is enabled.
     */
    const renderGroupAttributeMessage = (): ReactElement => {
        return (
            <Message
                data-componentid={ `${ componentId }-group-attribute-message` }
                header={ t("extensions:console.identityProviderGroups.claimConfigs.groupAttributeLabel") }
                content={
                    (<>
                        <p>
                            <Trans
                                i18nKey="extensions:console.identityProviderGroups.claimConfigs.groupAttributeMessage1"
                            >
                                Please be aware that the attribute selected in the <b>Attributes tab</b> as
                                the group attribute is used to identify groups at the Connection.
                            </Trans>
                        </p>
                        <p>
                            <Trans
                                i18nKey="extensions:console.identityProviderGroups.claimConfigs.groupAttributeMessage2"
                            >
                                For modifications to the group attribute, please visit the <b>Attributes tab</b>.
                            </Trans>
                        </p>
                    </>)
                }
                info
            />
        );
    };

    return (
        !isClaimConfigsFetchRequestLoading
            ? (
                <>
                    {
                        UIConfig?.useRoleClaimAsGroupClaim
                            ? renderGroupAttributeMessage()
                            : renderGroupAttributeUpdateForm()
                    }
                    <Divider hidden/>

                    <EmphasizedSegment padded="very">
                        <IdentityProviderGroupsList
                            idpId={ editingIDP?.id }
                            featureConfig={ featureConfig }
                            readOnly={ isReadOnly }
                            allowedScopes={ allowedScopes }
                            isGroupListLoading={ false }
                        />
                    </EmphasizedSegment>
                </>
            ) : (
                <EmphasizedSegment padded>
                    <ContentLoader inline="centered" active/>
                </EmphasizedSegment>
            )
    );
};

/**
 * Default props for identity provider groups tab component.
 */
IdentityProviderGroupsTab.defaultProps = {
    "data-componentid": "identity-provider-groups-tab"
};
