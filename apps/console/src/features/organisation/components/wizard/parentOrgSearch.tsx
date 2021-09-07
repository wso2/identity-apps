import { TestableComponentInterface } from "@wso2is/core/models";
import { LinkButton, PrimaryButton } from "@wso2is/react-components";
import { Radio } from "antd";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "semantic-ui-react";
import { OrganisationAdvancedSearch } from "../../../core/components/organisation-advanced-search";

interface SelectParentOrg extends TestableComponentInterface {
  closeParentPopup: () => void;
  filterParentOrg: (query: string) => void;
  parentOrgList?: any;
  selectedOrg: (orgSelected) => void;
}

const SelectParentOrg: FunctionComponent<SelectParentOrg> = (
  props: SelectParentOrg
): ReactElement => {
  const {
    closeParentPopup,
    filterParentOrg,
    parentOrgList,
    selectedOrg,
    ["data-testid"]: testId
  } = props;
  const { t } = useTranslation();
  const [selectedOrganization, setSelectedOrganization] = useState();

  const selectOrg = (e) => {
    setSelectedOrganization(e.target.value);
  };

  const orgList = () => {
    return (
      <Radio.Group
        className="width--100 radio-group"
        onChange={ selectOrg }
        value={ selectedOrganization }
      >
        {parentOrgList.map((org, index) => {
          return (
            <Radio className="radioStyle width--100" key={ index } value={ org }>
              {org.name}
            </Radio>
          );
        })}
      </Radio.Group>
    );
  };

  return (
    <Modal
      data-testid={ testId }
      open={ true }
      className="wizard application-create-wizard parent-modal-create-org parent-search-create-org"
      dimmer="blurring"
      size="large"
      onClose={ closeParentPopup }
      closeOnDimmerClick
      closeOnEscape
    >
      <Modal.Header>
        <h5>Select Parent Organisation </h5>
      </Modal.Header>
      <Modal.Content>
        <OrganisationAdvancedSearch
          parentSearchPopup={ true }
          onFilter={ filterParentOrg }
          filterAttributeOptionOne={ [
            {
                key: 0,
                text: "Organisation Name",
                value: "name"
            }]
        }
        filterAttributeOptionTwo={ [ {
                key: 0,
                text: "Type",
                value: "attributeValue"
            }]
        }
        filterAttributeOptionThree={ [{
                key: 0,
                text: "Organisation Status",
                value: "status"
            }]
        }    
        filterAttributeOptionFour={ [{
                key: 0,
                text: "Parent Organisation Name",
                value: "parentName"
            }]
        }   
        filterConditionsPlaceholder={
            t("adminPortal:components.users.advancedSearch.form.inputs.filterCondition" +
                ".placeholder")
        }
        filterValuePlaceholder={
            t("adminPortal:components.users.advancedSearch.form.inputs.filterValue" +
                ".placeholder")
        }
        placeholder={ t("adminPortal:components.users.advancedSearch.placeholder") }
        defaultSearchAttribute={ "name" }
        defaultSearchOperator={ "eq" }
          // triggerClearQuery={ () => { "" } }
        />
        {parentOrgList && parentOrgList.length > 0 && orgList()}
      </Modal.Content>
      <Modal.Actions>
        <LinkButton floated="left" onClick={ closeParentPopup }>
          Cancel
        </LinkButton>
        <PrimaryButton
          disabled={ !selectedOrganization }
          floated="right"
          onClick={ () => selectedOrg(selectedOrganization) }
        >
          Select
        </PrimaryButton>
      </Modal.Actions>
    </Modal>
  );
};

export default SelectParentOrg;
