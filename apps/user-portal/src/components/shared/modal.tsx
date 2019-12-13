/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import React, { MouseEvent } from "react";
import { Button, Icon, Modal, ModalProps } from "semantic-ui-react";

interface ModalComponentProps extends ModalProps {
    type: "positive" | "negative" | "warning" | "info";
    primaryAction?: string;
    secondaryAction?: string;
    onPrimaryActionClick?: () => void;
    onSecondaryActionClick?: (e: MouseEvent<HTMLElement>) => void;
}

export const ModalComponent = (props: ModalComponentProps) => {
    const {
        children,
        type,
        header,
        content,
        open,
        onClose,
        primaryAction,
        secondaryAction,
        onPrimaryActionClick,
        onSecondaryActionClick
    } = props;

    const iconName = () => {
        if (type === "positive") {
            return (
            <div className="sa">
                <div className="sa-success">
                    <div className="sa-success-tip"/>
                    <div className="sa-success-long"/>
                    <div className="sa-success-placeholder"/>
                    <div className="sa-success-fix"/>
                </div>
            </div>
            );
        } else if (type === "negative") {
            return (
                <div className="sa">
                <div className="sa-error">
                    <div className="sa-error-x">
                        <div className="sa-error-left"/>
                        <div className="sa-error-right"/>
                    </div>
                    <div className="sa-error-placeholder"/>
                    <div className="sa-error-fix"/>
                </div>
            </div>
            );
        } else if (type === "warning") {
            return (
                    <Icon
                        className="modal-icon"
                        name="exclamation circle"
                        size="huge"
                        color="yellow"
                    />
            );
        } else {
            return (
                    <Icon
                        className="modal-icon"
                        name="info circle"
                        size="huge"
                        color="blue"
                    />
            );
        }
    };

    return (
        <Modal
            { ...props }
            className="custom-modal"
            open={ open }
            onClose={ onClose }
        >
            { iconName() }
            <Modal.Content>
                <h3 className="modal-heading">
                    { header }
                </h3>
            </Modal.Content>
            <p className="modal-description">
                { content }
            </p>
            { children }
            <Modal.Actions>
                <Button
                    className={ `${ type }-modal-link-button` }
                    onClick={ onSecondaryActionClick }
                >
                    { secondaryAction }
                </Button>
                <Button
                    className={ `${ type }-modal-primary-button` }
                    onClick={ () => onPrimaryActionClick() }
                >
                    { primaryAction }
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

/**
 * Default proptypes for the settings section component.
 */
ModalComponent.defaultProps = {
    dimmer: "blurring",
    size: "mini"
};
