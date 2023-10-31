package com.luv2code.springboot.cruddemo.services;

import com.luv2code.springboot.cruddemo.dao.EmployeeRepository;
import com.luv2code.springboot.cruddemo.entity.Employee;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

//this annotation tell spring that this class is the service's layer
@Service
public class EmployeeServiceImpl implements EmployeeService{


    private EmployeeRepository employeeRepository;

    public EmployeeServiceImpl(EmployeeRepository theEmployeeRepository){

        this.employeeRepository  = theEmployeeRepository;
    }
    @Override
    public List<Employee> findAll() {
        return employeeRepository.findAll();
    }



    @Override
    public Employee findById(int theId) {

        Optional<Employee> result = employeeRepository.findById(theId);
        //optional different pattern instead of having to check for null
        //A container object which may or may not contain a non-null value.
        // If a value is present, isPresent() will return true and get() will return the value.

        Employee theEmployee = null;
        if(result.isPresent())
            theEmployee = result.get();
        else {

            //we didn't find the employee
            throw new RuntimeException("Did not find employee id - " + theId);
        }

        return theEmployee;
    }
    //now server holds the DAO object and handle the JDBC transaction
    //we need to use Transactional method
    //since we use the JPA Repository, and it contains @Transactional
    //so, we can comment out below line
    //@Transactional
    @Override
    public Employee save(Employee e) {
        return employeeRepository.save(e);
    }
    //@Transactional
    @Override
    public void deleteById(int theId) {
        employeeRepository.deleteById(theId);
    }
}
