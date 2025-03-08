/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants";
import { AppState } from "@wso2is/admin.core.v1/store";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface, SBACInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ContentLoader, EmphasizedSegment, Hint, Message } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
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
import { useClaimConfigs } from "../../../../api/connections";
import { ConnectionUIConstants } from "../../../../constants/connection-ui-constants";
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
    /**
     * Whether the editing IDP is an OIDC IDP.
     */
    isOIDC: boolean;
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
        isOIDC,
        [ "data-componentid" ]: componentId
    } = props;

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
                description: t("idp:identityProviderGroups.claimConfigs." +
                    "notifications.fetchConfigs.genericError.description"),
                level: AlertLevels.ERROR,
                message: t("idp:identityProviderGroups.claimConfigs." +
                    "notifications.fetchConfigs.genericError.message")
            })
        );
    };

    const getGroupAttribute = (): string => {
        if (originalClaimConfigs?.mappings?.length > 0) {
            const groupAttribute: ConnectionClaimMappingInterface = originalClaimConfigs.mappings.find(
                (claim: ConnectionClaimMappingInterface) => {
                    return claim.localClaim.uri === ClaimManagementConstants.GROUPS_CLAIM_URI;
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
     * Renders the group attribute section based on the configurations and
     * the availability of the group attribute mapping.
     */
    const renderGroupAttributeSection = (): ReactElement => {
        /**
         * Handle the scenario where the UI config is not initialized.
         */
        if (!UIConfig) {
            return null;
        }

        /**
         * If the role claim is used as the group claim, display the message.
         */
        if (UIConfig.useRoleClaimAsGroupClaim) {
            return (
                <Message
                    header={ t("idp:identityProviderGroups.claimConfigs.groupAttributeLabel") }
                    content={
                        (<>
                            <p>
                                Please note that the attribute selected in the Group section of
                                the <strong>Attributes tab</strong> as
                                the <strong>Group Attribute</strong> is used to identify groups at the Connection.
                            </p>
                            <p>
                                For modifications to the <strong>Group Attribute</strong>, please go to the
                                Group section in the <strong>Attributes tab</strong>.
                            </p>
                        </>)
                    }
                    data-componentid={ `${ componentId }-group-attribute-message` }
                    info
                />
            );
        }

        // The default group claim is determined based on the IDP type.
        const groupClaim: string = isOIDC
            ? ClaimManagementConstants.GROUPS_CLAIM_NAME
            : ClaimManagementConstants.GROUPS_CLAIM_URI;

        // Construct the default dialect group claim message.
        const defaultDialectMessage: ReactElement = (
            <Message
                header={ t("idp:identityProviderGroups.claimConfigs.groupAttributeLabel") }
                content={ isOIDC ? (
                    <Trans
                        i18nKey={
                            "idp:identityProviderGroups.claimConfigs.groupAttributeMessageOIDC"
                        }
                        tOptions={ {
                            attribute: groupClaim
                        } }
                    >
                        Please note that OpenID Connect attribute named <strong>{ groupClaim }</strong> will be
                        considered as the default <strong>Group Attribute</strong> as you have not added
                        a custom attribute mapping.
                    </Trans>
                ) : (
                    <Trans
                        i18nKey={
                            "idp:identityProviderGroups.claimConfigs.groupAttributeMessageSAML"
                        }
                        tOptions={ {
                            attribute: groupClaim
                        } }
                    >
                        Please note that <strong>{ groupClaim }</strong> attribute will be
                        considered as the default <strong>Group Attribute</strong> as you have not added
                        a custom attribute mapping.
                    </Trans>
                ) }
                data-componentid={ `${ componentId }-group-attribute-message` }
                info
            />
        );

        /**
         * If the claim mappings are empty,
         * display the message mentioning that the default dialect group claim will be used.
         */
        if ((editingIDP?.claims?.mappings?.length ?? 0) === 0) {
            return defaultDialectMessage;
        }

        /**
         * If the group attribute is available, display the mapped group attribute.
         */
        if (!isEmpty(groupAttribute)) {
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
                                        label={ t("idp:identityProviderGroups.claimConfigs." +
                                            "groupAttributeLabel") }
                                        placeholder={ t("idp:identityProviderGroups.claimConfigs." +
                                            "groupAttributePlaceholder") }
                                        readOnly={ true }
                                        maxLength={ ConnectionUIConstants.GROUP_CLAIM_LENGTH.max }
                                        minLength={ ConnectionUIConstants.GROUP_CLAIM_LENGTH.min }
                                        data-componentid={ `${ componentId }-group-attribute-input` }
                                        value={ groupAttribute }
                                        onChange={ (e: ChangeEvent<HTMLInputElement>) => {
                                            setGroupAttribute(e.target.value);
                                        } }
                                        width={ 16 }
                                    />
                                    <Hint>
                                        The attribute from the connection that will be mapped to the
                                        organization&apos;s group attribute. For modifications, please go to the
                                        <strong> Attributes tab</strong>.
                                    </Hint>
                                </Form>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </EmphasizedSegment>
            );
        }

        /**
         * If the custom claim mapping is enabled and the custom claim mapping merge is not enabled,
         * display a message asking the user to add a custom attribute mapping for the connection groups attribute.
         */
        if (UIConfig.isCustomClaimMappingEnabled
            && !UIConfig.isCustomClaimMappingMergeEnabled) {
            return (
                <Message
                    header={ t("idp:identityProviderGroups.claimConfigs.groupAttributeLabel") }
                    content={
                        (<p>
                            Please note that you have enabled custom attribute mapping, but have not added a custom
                            attribute mapping for the connection&apos;s groups attribute. Go to the <strong>
                                Attributes tab
                            </strong> to add a custom attribute mapping for the connection&apos;s groups attribute.
                        </p>)
                    }
                    data-componentid={ `${ componentId }-group-attribute-message` }
                    info
                />
            );
        }

        /**
         * For all other cases, display the message mentioning that the default dialect group claim will be used.
         */
        return defaultDialectMessage;
    };

    return (
        !isClaimConfigsFetchRequestLoading
            ? (
                <>
                    { renderGroupAttributeSection() }
                    <Divider hidden/>

                    <EmphasizedSegment padded="very">
                        <IdentityProviderGroupsList
                            idpId={ editingIDP?.id }
                            featureConfig={ featureConfig }
                            readOnly={ isReadOnly }
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
