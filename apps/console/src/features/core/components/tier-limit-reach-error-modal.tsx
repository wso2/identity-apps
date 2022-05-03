/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { EmptyPlaceholder, LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Modal, ModalProps } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "../configs/ui";

/**
 * Prop types for the limit reach error modal component.
 */
interface TierLimitReachErrorModalPropsInterface extends ModalProps, TestableComponentInterface {
    actionLabel: string;
    description: string;
    handleModalClose: () => void;
    header: string;
    message: string;
    openModal: boolean;
}

/**
 * Limit reach error modal component.
 *
 * @param {TierLimitReachErrorModalPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const TierLimitReachErrorModal: FunctionComponent<TierLimitReachErrorModalPropsInterface> = (
    props: TierLimitReachErrorModalPropsInterface
): ReactElement => {
    const { actionLabel, description, header, message, openModal, handleModalClose } = props;

    const { t } = useTranslation();

    return (
        <Modal
            open={ openModal }
            dimmer="blurring"
            onClose={ handleModalClose }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Header className="wizard-header">{ header }</Modal.Header>
            <Modal.Content>
                <EmptyPlaceholder
                    action={ (
                        <PrimaryButton onClick={ () => window.open("", "_blank").focus() }>
                            { actionLabel }
                        </PrimaryButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().brokenPage }
                    imageSize="tiny"
                    subtitle={ [ description ] }
                    title={ message }
                />
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ handleModalClose }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

/**
 * Default props for the component.
 */
TierLimitReachErrorModal.defaultProps = {
    openModal: false
};
