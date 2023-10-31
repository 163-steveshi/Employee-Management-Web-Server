import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  useEffect,
  forwardRef,
} from "react";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import StringFilterParams from "./StringFilter";
import { fetchEmployees, deleteEmployee, modifyEmployee } from "./RestRequest";
import NewEmployeeForm from "./Component/NewEmployeeForm";
function Table() {
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "200%", width: "100%" }), []);

  //state for loding backend data to the front end
  const [rowData, setRowData] = useState([]);
  //state for determine show the add new employee form or not
  const [showForm, setShowForm] = useState(false);
  //a ref that stores the AG-Grid Control Object
  const gridRef = useRef(null);
  //a ref that holdes an object that will record all changed employee object
  const changedRow = useRef({});
  //state for displaying the update Employee button
  const [needUpdate, SetNeedUpdate] = useState(false);

  //request the data from the backend
  useEffect(() => {
    async function fetchEmployeeData() {
      try {
        //request the back end to send back the data
        const employees = await fetchEmployees();
        //apply new data to the component
        setRowData(employees);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchEmployeeData();
  }, [showForm]);

  // define the field property for ag-grid to  render the column list
  const fullColumnDefs = useCallback(
    [
      {
        headerName: "ID",
        field: "id",
        sortable: true,
        initialSort: "asc",
        filter: "agNumberColumnFilter",
      },

      {
        field: "firstName",
        sortable: true,
        filter: "agTextColumnFilter",
        filterParams: StringFilterParams,
        editable: true,
      },
      {
        field: "lastName",
        sortable: true,
        filter: "agTextColumnFilter",
        filterParams: StringFilterParams,
        editable: true,
      },
      {
        field: "email",
        sortable: true,
        filter: "agTextColumnFilter",
        filterParams: StringFilterParams,
        editable: true,
      },
    ],
    []
  );

  //aaply the column defintion to the component
  const [columnDefs, setColumnDefs] = useState(fullColumnDefs);

  // a global definition that will apply on every field in this grid
  //since this definition should be never changed.
  //use react.useMemo to only render current definition once--for optimizing performance
  const defaultColDef = useMemo(
    () => ({
      resizable: true,

      sortable: true,
      flex: 1,
      cellDataType: false,
    }),
    []
  );

  //button Add New Employee Handler
  const displayFormHandler = () => {
    //when ever we display the form we reset isSubmit status
    setShowForm(true);
  };

  //cancel submit new employee handler
  const hideFormHandler = () => {
    setShowForm(false);
  };
  //helper fucntion: get the row's id which  is selected on the table
  const getRowId = useCallback((params) => {
    return params.data.id;
  }, []);

  //Handler function: remove the selected employee(s) from both front end and the backend
  const removeSelected = useCallback(() => {
    //use ag-grid build to get all selected rows's nodes
    const selectedRowNodes = gridRef.current.api.getSelectedNodes();
    //use the selected rows node to get selected employee's id
    const selectedIds = selectedRowNodes.map(function (rowNode) {
      return Number.parseInt(rowNode.id);
    });

    //now use built-in filter function to remove all the selected row
    const filteredData = rowData.filter(function (dataItem) {
      // ag-grid feature: all selected row's index is marked <0
      //if the row is unselected.
      return selectedIds.indexOf(dataItem.id) < 0;
    });

    //apply the changed on  the front end.
    setRowData(filteredData);
    //here we request to do the delete Request

    async function deleteSelected() {
      for (let i = 0; i < selectedIds.length; i++) {
        try {
          const response = await deleteEmployee(selectedIds[i]);
        } catch (error) {
          console.log(error.message);
        }
      }
    }
    deleteSelected();
  }, [rowData]);

  //function that record the changed row's row id
  const onCellValueChanged = (params) => {
    // get the modified row's content
    const { data } = params;
    //get the row id of the current modified row
    const modifiedRowID = data.id;

    if (modifiedRowID >= 0) {
      //save the modified row to an object
      //avoid the duplicated object send to the backend
      changedRow.current[`${data.id}`] = data;
      //show the update employee info
      SetNeedUpdate(true);
    }
  };
  //function that handle the send the put request to the server
  const updateEmployeeHandler = useCallback(() => {
    //function takes an nested object and we need to convert it to a
    //array of object for looping and send http request
    async function changeEmployeeInfo(employees) {
      const needUpdateEmployees = Object.values(employees);
      for (let i = 0; i < needUpdateEmployees.length; i++) {
        try {
          const response = await modifyEmployee(needUpdateEmployees[i]);
        } catch (error) {
          console.log(error.message);
        }
      }
      //clear the modifed row  object once finished all http request
      changedRow.current = {};
      //hide the button
      SetNeedUpdate(false);
    }
    changeEmployeeInfo(changedRow.current);
  }, []);

  return (
    <div style={containerStyle}>
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ marginBottom: "5px", minHeight: "30px" }}>
          {rowData && (
            <button onClick={removeSelected}>Remove Employees</button>
          )}
          {showForm ? (
            <NewEmployeeForm hideForm={hideFormHandler}></NewEmployeeForm>
          ) : (
            <button onClick={displayFormHandler}>Add New Employee</button>
          )}
          {needUpdate && (
            <button onClick={updateEmployeeHandler}>Update Empployee</button>
          )}
        </div>

        <div style={{ flex: "1 1 300px", height: "100%" }}>
          <div style={gridStyle} className="ag-theme-alpine">
            <AgGridReact
              //use ref to enable the grid.api method
              ref={gridRef}
              rowData={rowData}
              //contains properties that all columns will inherit.
              defaultColDef={defaultColDef}
              columnDefs={columnDefs}
              rowSelection={"multiple"}
              animateRows={true}
              getRowId={getRowId}
              //allow record value changed
              onCellValueChanged={onCellValueChanged}
            ></AgGridReact>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Table;
