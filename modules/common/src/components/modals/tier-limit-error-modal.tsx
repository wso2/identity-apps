/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { EmptyPlaceholder, LinkButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Modal, ModalProps } from "semantic-ui-react";
import { ReactComponent as CreateErrorIllustration } from "../../assets/illustrations/create-error-illustration.svg";

/**
 * Prop types for the limit reach error modal component.
 */
interface TierLimitErrorModalPropsInterface extends ModalProps {
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
 * @param {TierLimitErrorModalPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const TierLimitReachErrorModal: FunctionComponent<TierLimitErrorModalPropsInterface> = (
    props: TierLimitErrorModalPropsInterface
): ReactElement => {
    const { description, message, openModal, handleModalClose } = props;

    const { t } = useTranslation();

    return (
        <Modal
            open={ openModal }
            dimmer="blurring"
            onClose={ handleModalClose }
            closeOnDimmerClick={ false }
            closeOnEscape
        >
            <Modal.Content>
                <EmptyPlaceholder
                    image={ CreateErrorIllustration }
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
