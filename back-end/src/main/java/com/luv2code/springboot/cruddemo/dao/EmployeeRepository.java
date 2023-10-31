package com.luv2code.springboot.cruddemo.dao;

import com.luv2code.springboot.cruddemo.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

//JpaRepository takes <entity type, primary key type>
public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

    //this template Repository eliminates the old DAO and old DAO implements
}
