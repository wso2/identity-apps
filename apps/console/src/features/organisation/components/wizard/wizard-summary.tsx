/* eslint-disable max-len */
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

import { Heading, UserAvatar } from "@wso2is/react-components";
import React, { Fragment, FunctionComponent, ReactElement } from "react";
// import { useTranslation } from "react-i18next";
import { Grid } from "semantic-ui-react";
import Country from "../../../data/country";
import language from "../../../data/language";

interface OrgWizardSummary {
  summary: any;
}

/**
 * Add user wizard summary page.
 *
 * @param props
 */
export const OrgWizardSummary: FunctionComponent<OrgWizardSummary> = (
  props: OrgWizardSummary
): ReactElement => {
  const { summary } = props;
  const mapSummary = summary
    ? [
        { displayName: "Organisation Name", value: summary.name },
        {
          displayName: "Organisation Display Name",
          value: summary.displayName
        },
        { displayName: "Type", value: summary.Type },
        { displayName: "Status", value: summary.status },
        summary.country !== "NULL" && summary.country !== ""?{ displayName: "Country", value: Country.filter((data)=> (data.value === summary.country))[0].text }:{},
        summary.locale !== "null" && summary.locale !== ""?{ displayName: "Locale", value: language.filter((data)=> (data.value === summary.locale))[0].text }:{},
        { displayName: "Segment", value: summary.segment },
        { displayName: "Description", value: summary.description },
        { displayName: "Parent Organisation", value: summary.parentId }
        // { displayName: "Source", value: summary.source }
      ]
    : [];

  return (
    <Grid className="wizard-summary">
      <Grid.Row>
        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 16 } textAlign="center">
          <div className="general-details">
            <UserAvatar name={ summary?.name } size="tiny" />
            {summary?.name && (
              <Heading size="small" className="name">
                {summary.name}
              </Heading>
            )}
            {summary?.description && (
              <div className="description">{summary.description}</div>
            )}
          </div>
        </Grid.Column>
      </Grid.Row>
      {mapSummary && (
        <Grid.Row className="summary-field attached" columns={ 2 }>
          {mapSummary.map((data, index) => {
            return (
              <Fragment key={ index }>
                {data.value && (
                  <>
                    <Grid.Column
                      mobile={ 16 }
                      tablet={ 8 }
                      computer={ 8 }
                      textAlign="right"
                    >
                      <div className="label">{data.displayName}</div>
                    </Grid.Column>
                    <Grid.Column
                      mobile={ 16 }
                      tablet={ 8 }
                      computer={ 8 }
                      textAlign="left"
                    >
                      <div className="value url">{data.value}</div>
                    </Grid.Column>
                  </>
                )}
              </Fragment>
            );
          })}
        </Grid.Row>
      )}
    </Grid>
  );
};
