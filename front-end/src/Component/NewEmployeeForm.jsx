import { useState, useCallback } from "react";
import "./Form.css";
import { uploadNewEmployee } from "../RestRequest";
export default function NewEmployeeForm(props) {
  //states for handing input field changed
  const [enteredFirstName, setEnteredFirstName] = useState("");
  const [enteredLastName, setEnteredLastName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");

  //handling for memory the user's input from the form
  const firstNameChangeHandler = useCallback((event) => {
    setEnteredFirstName(event.target.value);
  }, []);

  const lastNameChangeHandler = useCallback((event) => {
    setEnteredLastName(event.target.value);
  }, []);
  const emailChangeHandler = useCallback((event) => {
    setEnteredEmail(event.target.value);
  }, []);

  //fucntion for submit the form
  const submitForm = useCallback(
    (event) => {
      event.preventDefault();
      const newEmployeeInfo = {
        firstName: enteredFirstName,
        lastName: enteredLastName,
        email: enteredEmail,
      };

      //send the POST request to the server and
      //close the form once finished submite
      uploadNewEmployee(newEmployeeInfo).then(() => {
        props.hideForm();
      });
      //clear the input field
      setEnteredFirstName("");
      setEnteredLastName("");
      setEnteredEmail("");
    },
    [enteredEmail, enteredFirstName, enteredLastName, props]
  );
  return (
    <form onSubmit={submitForm}>
      <div className="new-expense__controls">
        <div className="new-expense__control">
          <label>First Name</label>

          <input
            type="text"
            value={enteredFirstName}
            onChange={firstNameChangeHandler}
          />
        </div>
        <div className="new-expense__control">
          <label>Last Name</label>
          <input
            type="text"
            value={enteredLastName}
            onChange={lastNameChangeHandler}
          />
        </div>
        <div className="new-expense__control">
          <label>Email</label>
          <input
            type="text"
            value={enteredEmail}
            onChange={emailChangeHandler}
          />
        </div>
        <div className="new-expense__actions">
          <button type="submit">Add New Employee</button>

          <button type="button" onClick={props.hideForm}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
