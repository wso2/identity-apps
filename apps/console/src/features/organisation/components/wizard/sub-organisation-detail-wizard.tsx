/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable sort-keys */
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
import {
  AlertInterface,
  TestableComponentInterface
} from "@wso2is/core/models";
import {
  Heading,
  LinkButton
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState  } from "react";
import { Grid, Modal } from "semantic-ui-react";
import { getOrganisationDetails } from "../../api";
import { EditOrganisation } from "../../components";

interface AddOrganizationPropsInterface extends TestableComponentInterface {
  closeDetailWizard: () => void;
  currentStep?: number;
  listOffset: number;
  listItemLimit: number;
  updateList: () => void;
  filterParentOrg: (query: string) => void;
  rolesList: any;
  parentOrgList?: any;
  onAlertFired: (alert: AlertInterface) => void;
  parentOrg?: any;
  [ key: string ]: any;
}

export const SubOrganisationDetails: FunctionComponent<AddOrganizationPropsInterface> = (
  props: AddOrganizationPropsInterface
): ReactElement => {
  const {
    closeDetailWizard,
    organisationProfile,
    handleOrganisationUpdate
  } = props;

  const [ selectedOrgDetail, setSelectedOrgDetail ] = useState([]);
  const [ selectedOrgName, setSelectedOrgName ] = useState([]);
  const [ organisationType, setOrganisationType ] = useState<any>([]);

  const getOrganisation = (id: string) => {

    getOrganisationDetails(id)
        .then((response) => {
          setSelectedOrgDetail(response.data);
          setSelectedOrgName(response.data.name);
          setOrganisationType(findValueByKey(response.data.attributes, "Type"));
        })
        .catch(() => {
            // TODO add to notifications
        })
        .finally(() => {
          // TODO add to notifications
        });
};

const findValueByKey = (attributes, key): void => {
  const match = attributes.filter(function (attributes) {
      return attributes.key === key;
  });
  return match[0] ? match[0].value : "";
};

useEffect(() => {
    getOrganisation(organisationProfile);
}, []);

  return (
    <Modal
      open={ true }
      className="wizard application-create-wizard"
      dimmer="blurring"
      size="large"
      onClose={ closeDetailWizard }
      closeOnDimmerClick
      closeOnEscape
    >
      <Modal.Header className="wizard-header">
           { selectedOrgName }
            <Heading as="h6">
            { organisationType }
            </Heading>
          </Modal.Header>
      <Modal.Content className="content-container" scrolling>
      <EditOrganisation organisation={ selectedOrgDetail } handleOrganisationUpdate={ handleOrganisationUpdate }/>
      </Modal.Content>
      <Modal.Actions>
          <Grid>
            <Grid.Row column={ 1 }>
              <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                <LinkButton
                  data-testid={ "cancel-button" }
                  floated="left"
                  onClick={ () => closeDetailWizard() }
                >
                  Cancel
                </LinkButton>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Actions>
    </Modal>
  );
};

/**
 * Default props for the add user wizard.
 */
SubOrganisationDetails.defaultProps = {
  currentStep: 0
};
