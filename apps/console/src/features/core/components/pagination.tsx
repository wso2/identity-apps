/* eslint-disable max-len */
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, useState } from "react";
// import _ from "lodash";
import { useDispatch } from "react-redux";


  interface PaginationProps {
    dataSource: any;
    pageNo: any;
    onPagination: any;
    customClassName: any;
    disabledNextButton: any;
    disabledPrevButton: any;
    isEditable: boolean;
    customPageNumber: any;
}

  export const Pagination: FunctionComponent<PaginationProps> = ( props: PaginationProps ): ReactElement => {
  const {
    customPageNumber,
    dataSource,
    pageNo,
    onPagination,
    customClassName,
    disabledNextButton,
    disabledPrevButton,
    isEditable
  } = props;

  const [pageOnEdit, setPageOnEdit] = useState(false);

  const dispatch = useDispatch();

  const hOnPageDirection = direction => {
    // eslint-disable-next-line default-case
    setPageOnEdit(false);
    let currentPagination = pageNo;
    switch (direction) {
      case "Previous":
        if (pageNo === 1) {
          return;
        }
        currentPagination = pageNo - 1;
        break;
      case "Next":
        if (dataSource < pageNo) {
          return;
        }
        currentPagination = pageNo + 1;
        break;
    }
   
    onPagination(currentPagination,direction);
  };

  const onPagenumberChange = (e) => {
    if(e.key=="Enter" || e.key == " "){
      if(e.target.value.length < 7){
       setPageOnEdit(false);
       customPageNumber(e.target.value);
      }else{
        dispatch(addAlert({
          description: "Please enter a valid page number",
          level: AlertLevels.ERROR,
          message: "Unexpected Error"
        }));
      }
      
    }
  };

  const pageNumberEdit = () => {
    setPageOnEdit(true);
  };


  return (
    <div className={ `pagination-main-wrap ${customClassName}` }>
      <div className="pagination-inner-wrap">
        {disabledPrevButton ? (
          <button
            data-testid="prev-button disabled"
            type="button"
            className={ `previous-btn ${disabledPrevButton}` }
          >
            ⟨
          </button>
        ) : (
          <button
            data-testid="prev-button"
            type="button"
            className="previous-btn"
            onClick={ () => hOnPageDirection("Previous") }
          >
            ⟨
          </button>
        )}

        <button
          data-testid="page-number"
          type="button"
          className={ `page-no-wrap ${ pageOnEdit }` }
          onFocus = { pageNumberEdit }
        >
        { isEditable && pageOnEdit? (<input type="number" placeholder = { pageNo } className="pagenumber-edit" 
        onKeyPress = { (e) => onPagenumberChange(e) } autoFocus />) : pageNo + " " }
        </button>
        {disabledNextButton ? (
          <button
            data-testid="next-button disabled"
            type="button"
            className={ `next-btn ${disabledNextButton}` }
          >
          ⟩
          </button>
        ) : (
          <button
            data-testid="next-button"
            type="button"
            className="next-btn"
            onClick={ () => hOnPageDirection("Next") }
          >
          ⟩
          </button>
        )}
      </div>
    </div>
  );
};

Pagination.defaultProps = {
  customClassName: null,
  customPageNumber: {},
  disabledNextButton: false,
  disabledPrevButton: false,
  isEditable: false,
  pageNo: 1
};
