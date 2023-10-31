package com.luv2code.springboot.cruddemo.rest;



import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.luv2code.springboot.cruddemo.entity.Employee;
import com.luv2code.springboot.cruddemo.services.EmployeeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


//allow other url to use this rest server
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/employees")
public class EmployeeRestController {

    private EmployeeService employeeService;
    //constructor injection
    @Autowired
    public EmployeeRestController(EmployeeService theEmployeeService) {
        this.employeeService = theEmployeeService;
    }

    //expose "/employees" and return a list of employees
    @GetMapping("")
    public String findAll(){

        Gson gson = new Gson();


        //error here the return value is not a valid json format
        //so, we need a third party package to convert the format
        //System.out.println(gson.toJson( employeeService.findAll()) );
        return gson.toJson( employeeService.findAll()) ;
    }

    //add mapping for Get "/employees/{employeeId}"
    //by default the path variable must match the parameter's input
    @GetMapping("/{employeeId}")
    public Employee getEmployee(@PathVariable int employeeId){

        Employee theEmployee = employeeService.findById(employeeId);
        if(theEmployee == null)
            throw new RuntimeException("Employee id not fount - " + employeeId);

        return theEmployee;
    }
    //add mapping for Post "/employees" - add new employee
    @PostMapping("")
    //since we post the new employee as a json
    //so we need to add @RequestBody Annotation
    public Employee addEmployee(@RequestBody Employee theEmployee){

        //just in case they pass an id in JSON ... set id to 0
        //this is to force a save of new item .... instead of update
        theEmployee.setId(0);
        Employee dbEmployee = employeeService.save(theEmployee);
        return dbEmployee;
    }


    //add mapping for Put "/employees" -update an existed employee
    @PutMapping("/{employeeId}")
    public Employee updateEmployee(@RequestBody Employee theEmployee){





        return employeeService.save(theEmployee);
    }

    //add mapping for DELETE /employee/{employeeId} - delete Employee by Id
    @DeleteMapping("/{employeeId}")
    public String deleteEmployee(@PathVariable String employeeId){
        //we take a string value
        // we need to convert it to an int value
        System.out.println(employeeId);
        int id = Integer.parseInt(employeeId);
        Employee tempEmployee = employeeService.findById(id);


        //throw exception if the database doesn't have the searched employee
        if(tempEmployee == null)
            throw new RuntimeException("Employee id not found - " + employeeId);
        employeeService.deleteById(id);
        //create a new json object and send back to the data
        //first create a string ==> as the inner content of the json object
        String jsonString = "{\"message\":\"Successfully Delete " +employeeId +"\"}";
        Gson gson = new Gson();
        // Parse the JSON string into a JSON object
        JsonObject jsonObject = gson.fromJson(jsonString, JsonObject.class);

        System.out.println(gson.toJson(jsonObject));
        return gson.toJson(jsonObject);
    }
}
