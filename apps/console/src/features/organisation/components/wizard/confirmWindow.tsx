import { TestableComponentInterface } from "@wso2is/core/models";
import { LinkButton, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";

import {
  Grid,
  Modal
} from "semantic-ui-react";

interface ConfirmWindowInterface extends TestableComponentInterface {
  modalDetails?: {
    title: string;
    description: string;
    cancelButtonText?: string;
    confirmButtonText?: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmWindow: FunctionComponent<ConfirmWindowInterface> = (
  props: ConfirmWindowInterface
): ReactElement => {
  const {
    ["data-testid"]: testId,
    onCancel,
    onConfirm,
    modalDetails
  } = props
  return (
    <Modal
      data-testid={ testId }
      open={ true }
      className="wizard application-create-wizard"
      dimmer="blurring"
      size="small"
      onClose={ onCancel }
      closeOnDimmerClick
      closeOnEscape
    >
      <Modal.Header>{ modalDetails?.title || "Revoke User" }</Modal.Header>
      <Modal.Content>
        { modalDetails?.description || "Do you really want to revoke this user?" }
      </Modal.Content>
      <Modal.Actions>
        <Grid>
          <Grid.Row column={ 1 }>
            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
              <LinkButton
                data-testid={ `${testId}-cancel-button` }
                floated="left"
                onClick={ onCancel }
              >
                { modalDetails?.cancelButtonText || "Cancel" }
              </LinkButton>
            </Grid.Column>
            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
              <PrimaryButton
                data-testid={ `${testId}-cancel-button` }
                floated="right"
                onClick={ onConfirm }
              >
                { modalDetails?.confirmButtonText || "Confirm" }
              </PrimaryButton>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Modal.Actions>
    </Modal>
  )
}

export default ConfirmWindow;
