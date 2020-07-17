/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { LoadableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import {
    AnimatedAvatar,
    ConfirmationModal,
    EmptyPlaceholder,
    PrimaryButton,
    ResourceList,
    ResourceListItem
} from "@wso2is/react-components";
import React, { FunctionComponent , ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Icon, Image } from "semantic-ui-react";
import { EmailTemplateIllustrations } from "../../configs";
import { EMAIL_TEMPLATE_VIEW_PATH, UIConstants } from "../../constants";
import { history } from "../../helpers";
import { EmailTemplateType } from "../../models";

interface EmailTemplateListPropsInterface extends LoadableComponentInterface, TestableComponentInterface {
    onDelete: (templateId: string) => void;
    templateTypeList: EmailTemplateType[];
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick: () => void;
}

/**
 * List component to render email template types.
 *
 * @param {EmailTemplateListPropsInterface} props - props required to render the email template list.
 *
 * @return {React.ReactElement}
 */
export const EmailTemplateTypeList: FunctionComponent<EmailTemplateListPropsInterface> = (
    props: EmailTemplateListPropsInterface
): ReactElement => {

    const {
        isLoading,
        templateTypeList: templateList,
        onDelete,
        onEmptyListPlaceholderActionClick,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ showTemplateTypeDeleteConfirmation, setShowTemplateTypeDeleteConfirmation ] = useState<boolean>(false);
    const [ currentDeletingTemplate, setCurrentDeletingTemplate ] = useState<EmailTemplateType>(undefined);

    const handleEditTemplate = (templateTypeId: string) => {
        history.push(EMAIL_TEMPLATE_VIEW_PATH + templateTypeId);
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {
        if (templateList?.length === 0) {
            return (
                <EmptyPlaceholder
                    action={
                        <PrimaryButton onClick={ onEmptyListPlaceholderActionClick }>
                            <Icon name="add"/>
                            { t("adminPortal:components.emailTemplateTypes.placeholders.emptyList.action") }
                        </PrimaryButton>
                    }
                    title={ t("adminPortal:components.emailTemplateTypes.placeholders.emptyList.title") }
                    subtitle={ [
                        t("adminPortal:components.emailTemplateTypes.placeholders.emptyList.subtitles.0"),
                        t("adminPortal:components.emailTemplateTypes.placeholders.emptyList.subtitles.1"),
                        t("adminPortal:components.emailTemplateTypes.placeholders.emptyList.subtitles.2")
                    ] }
                    image={ EmailTemplateIllustrations.emptyEmailListing }
                    imageSize="tiny"
                    data-testid={ `${ testId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <>
            <ResourceList
                className="email-template-types-list"
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                fill={ true }
                celled={ false }
                divided={ true }
                data-testid={ testId }
            >
                {
                    templateList && templateList instanceof Array && templateList.length > 0
                        ? templateList && templateList.map((template: EmailTemplateType, index: number) => (
                            <ResourceListItem
                                key={ index }
                                actionsFloated="right"
                                actions={ [{
                                    icon: "pencil alternate",
                                    onClick: () => handleEditTemplate(template.id),
                                    popupText: t("adminPortal:components.emailTemplateTypes.buttons.editTemplate"),
                                    type: "button"
                                },{
                                    icon: "trash alternate",
                                    onClick: () => {
                                        setCurrentDeletingTemplate(template);
                                        setShowTemplateTypeDeleteConfirmation(true)

                                    },
                                    popupText: t("adminPortal:components.emailTemplateTypes.buttons.deleteTemplate"),
                                    type: "button"
                                }] }
                                avatar={ (
                                    <Image
                                        floated="left"
                                        verticalAlign="middle"
                                        rounded
                                        centered
                                        size="mini"
                                        data-testid={ `${ testId }-item-image` }
                                    >
                                        <AnimatedAvatar />
                                        <span className="claims-letter">
                                            { template.displayName[0].toLocaleUpperCase() }
                                        </span>
                                    </Image>
                                ) }
                                itemHeader={ template.displayName }
                                data-testid={ `${ testId }-item` }
                            />
                        ))
                        : showPlaceholders()
                }
            </ResourceList>
            {
                showTemplateTypeDeleteConfirmation && (
                    <ConfirmationModal
                        onClose={ (): void => setShowTemplateTypeDeleteConfirmation(false) }
                        type="warning"
                        open={ showTemplateTypeDeleteConfirmation }
                        assertion={ currentDeletingTemplate.displayName }
                        assertionHint={
                            <p>
                                <Trans
                                    i18nKey={ "adminPortal:components.emailTemplateTypes.confirmations" +
                                    ".deleteTemplateType.assertionHint" }
                                    tOptions={ { id: currentDeletingTemplate.displayName } }
                                >
                                    Please type <strong>{ currentDeletingTemplate.displayName }</strong> to confirm.
                                </Trans>
                            </p>
                        }
                        assertionType="input"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowTemplateTypeDeleteConfirmation(false) }
                        onPrimaryActionClick={ (): void => {
                            onDelete(currentDeletingTemplate.id);
                            setShowTemplateTypeDeleteConfirmation(false);
                        } }
                        data-testid={ `${ testId }-delete-confirmation-modal` }
                    >
                        <ConfirmationModal.Header
                            data-testid={ `${ testId }-delete-confirmation-modal-header` }
                        >
                            { t("adminPortal:components.emailTemplateTypes.confirmations.deleteTemplateType" +
                                ".header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            warning
                            data-testid={ `${ testId }-delete-confirmation-modal-message` }
                        >
                            { t("adminPortal:components.emailTemplateTypes.confirmations.deleteTemplateType" +
                                ".message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-testid={ `${ testId }-delete-confirmation-modal-content` }
                        >
                            { t("adminPortal:components.emailTemplateTypes.confirmations.deleteTemplateType" +
                                ".content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    )
};

/**
 * Default props for the component.
 */
EmailTemplateTypeList.defaultProps = {
    "data-testid": "email-template-types-list"
};
