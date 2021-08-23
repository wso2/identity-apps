/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { EmptyPlaceholder, PrimaryButton } from "@wso2is/react-components";
import React, { FC, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Icon, Segment } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "../../../../core";

/**
 * Props interface of {@link EmptyCertificatesPlaceholder}
 */
export interface EmptyCertificatesPlaceholderProps extends IdentifiableComponentInterface {
    onAddCertificateClicked: () => void;
}

/**
 * The placeholder component when there's no certificates added to a
 * given IdP or Application instance. I
 *
 * @param props {@link EmptyCertificatesPlaceholderProps}
 * @constructor
 */
export const EmptyCertificatesPlaceholder: FC<EmptyCertificatesPlaceholderProps> = (
    props: EmptyCertificatesPlaceholderProps
): ReactElement => {

    const { ["data-componentid"]: testId, onAddCertificateClicked } = props;

    const { t } = useTranslation();

    return (
        <Segment>
            <EmptyPlaceholder
                title={ t(`${ AUTH_PROV_PLACEHOLDER_EMPTY_I18N_KEY }.title`) }
                image={ getEmptyPlaceholderIllustrations().emptyList }
                subtitle={ [
                    t(`${ AUTH_PROV_PLACEHOLDER_EMPTY_I18N_KEY }.subtitles.0`),
                    t(`${ AUTH_PROV_PLACEHOLDER_EMPTY_I18N_KEY }.subtitles.1`)
                ] }
                imageSize="tiny"
                action={ (
                    <Show when={ AccessControlConstants.IDP_EDIT }>
                        <PrimaryButton
                            onClick={ onAddCertificateClicked }
                            data-testid={ `${ testId }-emptyPlaceholder-add-certificate-button` }
                            type="button">
                            <Icon name="add"/>
                            { t("console:develop.features.authenticationProvider.buttons.addCertificate") }
                        </PrimaryButton>
                    </Show>
                ) }
                data-testid={ `${ testId }-empty-placeholder` }
            />
        </Segment>
    );

};

// Component constants.

const AUTH_PROV_PLACEHOLDER_EMPTY_I18N_KEY = "console:develop.features.authenticationProvider" +
    ".placeHolders.emptyCertificateList";

/**
 * Default props of {@link EmptyCertificatesPlaceholder}
 */
EmptyCertificatesPlaceholder.defaultProps = {
    "data-componentid": "empty-certificates-placeholder"
};
