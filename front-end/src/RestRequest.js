export async function fetchEmployees() {
  const response = await fetch("http://localhost:8080/employees", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  //get the json from the back end (it is already convert back from)
  const resData = await response.json();
  return resData;
}

//an POST request
export async function uploadNewEmployee(newEmployee) {
  const response = await fetch("http://localhost:8080/employees", {
    method: "POST",
    body: JSON.stringify(newEmployee),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const resData = await response.json();
  if (!response.ok) {
    throw new Error("Failed to Upload the new Employee");
  }
  return resData.message;
}

//an POST request
export async function deleteEmployee(employee_id) {
  console.log(employee_id);
  const response = await fetch(
    `http://localhost:8080/employees/${employee_id}`,
    {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const resData = await response.json();
  console.log(resData);
  if (!response.ok) {
    throw new Error("Failed to Delete the Employee");
  }
  return resData.message;
}

//an PUT request
export async function modifyEmployee(employee) {
  console.log(employee.id);
  const response = await fetch(
    `http://localhost:8080/employees/${employee.id}`,
    {
      method: "PUT",
      body: JSON.stringify(employee),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const resData = await response.json();
  console.log(resData);
  if (!response.ok) {
    throw new Error("Failed to Delete the Employee");
  }
  return resData.message;
}
