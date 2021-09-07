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
  AlertLevels,
  TestableComponentInterface
} from "@wso2is/core/models";
import { useTrigger } from "@wso2is/forms";
import {
  Heading,
  LinkButton,
  PrimaryButton,
  Steps
} from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, Modal } from "semantic-ui-react";
import ParentOrgSearch from "./parentOrgSearch";
import { OrgWizardSummary } from "./wizard-summary";
import { addOrganization, getOrganisationList } from "../../api";
import { UserWizardStepIcons } from "../../configs";
import { SelectedOrganization } from "../../models/index";
import { AddOrganisation } from "../add-organisation";
/**
 * Interface for the Organization wizard state.
 */
interface AddOrganizationPropsInterface extends TestableComponentInterface {
  closeWizard: () => void;
  currentStep?: number;
  listOffset: number;
  listItemLimit: number;
  updateList: () => void;
  filterParentOrg: (query: string) => void;
  rolesList: any;
  parentOrgList?: any;
  onAlertFired: (alert: AlertInterface) => void;
  parentOrg?: any;
  organisationListLoading?: boolean;
  [ key: string ]: any;
}

/**
 * Interface for the wizard state.
 */
interface WizardStateInterface {
  [key: string]: any;
}

/**
 * Enum for wizard steps form types.
 * @readonly
 * @enum {string}
 */
enum WizardStepsFormTypes {
  BASIC_DETAILS = "BasicDetails",
  SUMMARY = "summary",
}

/**
 * User creation wizard.
 *
 * @return {JSX.Element}
 */
export const AddOrganization: FunctionComponent<AddOrganizationPropsInterface> = (
  props: AddOrganizationPropsInterface
): ReactElement => {
  const {
    onAlertFired,
    closeWizard,
    currentStep,
    filterParentOrg,
    parentOrgList,
    parentOrg,
    organisationListLoading,
    ["data-testid"]: testId
  } = props;

  const { t } = useTranslation();

  const [headerSectionHide, setHeaderSectionHide] = useState<boolean>(false);
  const [currentWizardStep, setCurrentWizardStep] = useState<number>(
    currentStep
  );
  const [wizardState, setWizardState] = useState<WizardStateInterface>(
    undefined
  );
  const [selectedOrg, setSelectedOrg] = useState<SelectedOrganization>()

  const [submitGeneralSettings, setSubmitGeneralSettings] = useTrigger();
  // const [ submitGroupList, setSubmitGroupList ] = useTrigger();
  // const [ finishSubmit, setFinishSubmit ] = useTrigger();
  const [isParentModal, setIsParentModal] = useState(false);
  const [isValidOrg, setIsValidOrg] = useState<boolean>(true)
  const [organisatonListLoading, setOrganisatonListLoading] = useState<boolean>(false)
  const selectedParentOrg = (obj) => {
      setSelectedOrg(obj)
      setIsParentModal(false); 
  }

 useEffect(() => {
   if(parentOrg) {
     setSelectedOrg(parentOrg)
   }
 }, [])

  const navigateToPrevious = () => {
    setCurrentWizardStep(currentWizardStep - 1);
  };

  const finishSubmit = () => {
    const basicDetailsObj = wizardState.BasicDetails;
    const attributes = [];
    const noAttributes = [
      "name",
      "displayName",
      "description",
      "parentId",
      "status"
    ];
    Object.entries(basicDetailsObj).forEach(([key, value]) => {
      if (!noAttributes.includes(key)) {
        attributes.push({
          key,
          value
        });
      }
    });
    const sendData = {
      name: basicDetailsObj.name,
      displayName: basicDetailsObj.displayName,
      description: basicDetailsObj.description,
      parentId: basicDetailsObj.parentId ? selectedOrg?.id : "",

      /* Use only on edit Org
            status: basicDetailsObj.status, */

      attributes,
      userStoreConfigs: [
        {
          key: "RDN",
          value: basicDetailsObj.name
        }
      ]
    };
    addOrganization(sendData)
      .then(() => {
        onAlertFired({
          description: t("adminPortal:organisation.notifications.create_success.message"),
          level: AlertLevels.SUCCESS,
          message: t("adminPortal:organisation.notifications.create_success.description")
        });
        closeWizard();
      })
      .catch((error) => {
        onAlertFired({
          description: t("adminPortal:organisation.notifications."+ error +".message"),
          level: AlertLevels.WARNING,
          message: t("adminPortal:organisation.notifications."+ error +".description")
        });
      });
  };

  const checkOrgName = (filter: string, attribute: string, limit: number = 10, offset: number = 0, domain: string = null) => {
    setOrganisatonListLoading(true);
    const filterString = `name eq '${filter.trim()}'`
    getOrganisationList(limit, offset, filterString, attribute, domain)
      .then((response) => {
        if (response?.length > 0 && response[0].name === filter) {
            setIsValidOrg(false);
          } 
        if (!response || response?.length === 0) {
            setIsValidOrg(true);
          }
        })
      .finally(() => {
          setOrganisatonListLoading(false);
      });
  }

  /**
   * Handles wizard step submit.
   *
   * @param values - Forms values to be stored in state.
   * @param {WizardStepsFormTypes} formType - Type of the form.
   */
  const handleWizardFormSubmit = (
    values: any,
    formType: WizardStepsFormTypes
  ) => {
    if (!values.parentId || (values.parentId && selectedOrg?.id)) {
      setCurrentWizardStep(currentWizardStep + 1);
      setWizardState({ ...wizardState, [formType]: values });
    }
  };

  const STEPS = [
    {
      content: (
        <div>
          <AddOrganisation
            triggerSubmit={ submitGeneralSettings }
            initialValues={
              wizardState && wizardState[WizardStepsFormTypes.BASIC_DETAILS]
            }
            onSubmit={ (values) =>
              handleWizardFormSubmit(values, WizardStepsFormTypes.BASIC_DETAILS)
            }
            onParentSearch={ () => setIsParentModal(true) }
            selectedOrg={ selectedOrg }
            checkOrgName={ checkOrgName }
            isValidOrg={ isValidOrg }
            checkSubOrgCreation={ parentOrg }
            filterParentOrg={ filterParentOrg }
            parentOrgList={ parentOrgList }
            setSelectedOrg={ selectedParentOrg }
            organisationListLoading={ organisationListLoading }
          />
        </div>
      ),
      icon: UserWizardStepIcons.general,
      title: t(
        "adminPortal:components.user.modals.addUserWizard.steps.basicDetails"
      )
    },
    {
      content: (
        <div>
          <OrgWizardSummary
            summary={
              wizardState && wizardState[WizardStepsFormTypes.BASIC_DETAILS]
            }
          />
        </div>
      ),
      icon: UserWizardStepIcons.summary,
      title: t(
        "adminPortal:components.user.modals.addUserWizard.steps.summary"
      )
    }
  ];

  const navigateToNext = () => {
    switch (currentWizardStep) {
      case 0:
        setSubmitGeneralSettings();
        break;
      case 1:
        finishSubmit();
    }
  };

  return (
    <Modal
      data-testid={ testId }
      open={ true }
      className="wizard application-create-wizard"
      dimmer="blurring"
      size="small"
      onClose={ closeWizard }
      closeOnDimmerClick={ false }
      closeOnEscape={ false }
    >
      {headerSectionHide ? null : (
        <>
          <Modal.Header className="wizard-header">
           Create Organisation
            <Heading as="h6">
              Fill the below form to create new Organisation
            </Heading>
          </Modal.Header>

          <Modal.Content className="steps-container">
            <Steps.Group current={ currentWizardStep }>
              {STEPS.map((step, index) => (
                <Steps.Step key={ index } icon={ step.icon } title={ step.title } />
              ))}
            </Steps.Group>
          </Modal.Content>
        </>
      )}
      <Modal.Content className="content-container" scrolling>
        {STEPS[currentWizardStep].content}
        {isParentModal && (<ParentOrgSearch
          filterParentOrg={ filterParentOrg }
          parentOrgList={ parentOrgList }
          selectedOrg={ selectedParentOrg }
          closeParentPopup={ () => {
            setIsParentModal(false);          
          } }
        />)}
      </Modal.Content>
      {headerSectionHide ? null : (
        <Modal.Actions>
          <Grid>
            <Grid.Row column={ 1 }>
              <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                <LinkButton
                  data-testid={ `${testId}-cancel-button` }
                  floated="left"
                  onClick={ () => closeWizard() }
                >
                  Cancel
                </LinkButton>
              </Grid.Column>
              <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                {currentWizardStep < STEPS.length - 1 && (
                  <PrimaryButton
                    data-testid={ `${testId}-next-button` }
                    floated="right"
                    onClick={ isValidOrg && !organisatonListLoading ? navigateToNext : () => { "" } }
                  >
                    {t(
                      "adminPortal:components.user.modals.addUserWizard.buttons.next"
                    )}
                    <Icon name="arrow right" />
                  </PrimaryButton>
                )}
                {currentWizardStep === STEPS.length - 1 && (
                  <PrimaryButton
                    data-testid={ `${testId}-finish-button` }
                    floated="right"
                    onClick={ navigateToNext }
                  >
                    Finish
                  </PrimaryButton>
                )}
                {currentWizardStep > 0 && (
                  <LinkButton
                    data-testid={ `${testId}-previous-button` }
                    floated="right"
                    onClick={ navigateToPrevious }
                  >
                    <Icon name="arrow left" />
                    {t(
                      "adminPortal:components.user.modals.addUserWizard.buttons.previous"
                    )}
                  </LinkButton>
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Actions>
      )}
    </Modal>
  );
};

/**
 * Default props for the add user wizard.
 */
AddOrganization.defaultProps = {
  currentStep: 0
};
