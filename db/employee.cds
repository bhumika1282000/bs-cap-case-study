namespace db;

using { cuid, managed } from '@sap/cds/common';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type EmployeeStatus : String enum {
    Active;
    Inactive;
    Terminated;
}

type RatingValue : Decimal(2,1); // 1.0 to 5.0

type LearningStatus : String enum {
    NotStarted;
    Assigned;
    InProgress;
    Completed;
}

type ProjectStatus : String enum {
    NotStarted;
    Planned;
    InProgress;
    Completed;
    OnHold;
}

// ============================================================================
// LEARNINGS MASTER DATA ENTITY
// Master reference data for all available courses/learnings
// Fields: ID, Course Description, Course Code, Initial, Course Contacts
// ============================================================================

entity LearningsMasterData : cuid, managed {    learningID      : String(10) not null @assert.unique;        // Unique identifier
    courseCode      : String(50) not null @assert.unique;        // Course Code from table
    courseDescription : String(500) not null;            // Course Description from table
    initialLevel    : String(100);                        // Initial (beginner/advance level)
    courseContacts  : String(200);                        // Course Contacts (instructor name/email)
    duration        : Integer;                            // Duration in hours
    isActive        : Boolean default true;
    assignedlearnings : Association to many Learnings
                        on assignedlearnings.learningMaster = $self;
    
    // NO Composition here - we check "in use" before deletion via business logic
}

// ============================================================================
// PROJECTS MASTER DATA ENTITY
// Master reference data for all available projects
// Fields: ID, Project Name, Project Description
// ============================================================================

entity ProjectsMasterData : cuid, managed {
    projectID       : String(10) not null @assert.unique;        // Unique identifier
    projectName     : String(200) not null;              // Project Name from table
    projectDescription : String(1000) not null;          // Project Description from table
    startDate       : Date;
    endDate         : Date;
    isActive        : Boolean default true;
    assignedProjects : Association to many Projects
                        on assignedProjects.projectMaster = $self;
    
}

// ============================================================================
// MAIN EMPLOYEES ENTITY
// Fields: ID, First Name, Last Name, Email ID, Address, Phone Number, Status,
//         Bank Name, Bank Account Number, Bank Code, Annual Leaves Granted, Annual Leaves Used
// ============================================================================

entity Employees : cuid, managed {
    employeeID      : String(10) not null @assert.unique;        // Unique Employee ID (auto-generated)
    firstName       : String(100) not null;              // First Name from table
    lastName        : String(100) not null;              // Last Name from table
    email           : String(100) not null @assert.unique;       // Email ID (auto-generated)
    address         : String(500);                        // Address from table
    phoneNumber     : String(20);                         // Phone Number from table
    status          : EmployeeStatus default 'Active';   // Status from table
    department      : String(100);
    role            : String(100);
    joiningDate     : Date not null;
    
    bankName                : String(100);
    bankAccountNumber       : String(50) @assert.unique;
    bankCode                : String(20);

    annualLeavesGranted     : Integer;
    annualLeavesUsed        : Integer;
    
    // Ratings - Annual performance ratings
    ratings         : Composition of many Ratings
                        on ratings.employee = $self;
    
    // Learnings - Assigned courses/learnings
    assignedLearnings : Composition of many Learnings
                        on assignedLearnings.employee = $self;
    
    // Projects - Assigned projects
    assignedProjects : Composition of many Projects
                        on assignedProjects.employee = $self;
    
}

// ============================================================================
// RATINGS ENTITY (Composition of Employee)
// Annual performance rating per year
// Fields: ID, Employee ID, Year, Rating, Reviewer ID
// ============================================================================

entity Ratings : cuid, managed {
    employee        : Association to Employees;
    year            : Integer not null;
    rating          : RatingValue not null;
    reviewerID      : String(100);
    comments        : String(1000);
    
}

// ============================================================================
// LEARNINGS ENTITY (Composition of Employee)
// Tracks which learnings/courses are assigned to which employee
// Fields: ID, Employee ID, Learning ID, status
// ============================================================================

entity Learnings : cuid, managed {
    employee        : Association to Employees;
    learningMaster  : Association to LearningsMasterData;
    status          : LearningStatus default 'Assigned';
    assignedDate    : Date;
    completedDate   : Date;
    score           : Decimal(5,2);
    

}

// ============================================================================
// PROJECTS ENTITY (Composition of Employee)
// Tracks which projects are assigned to which employee
// Fields: ID, Employee ID, Project ID, Project Description
// ============================================================================

entity Projects : cuid, managed {
    employee        : Association to Employees;
    projectMaster   : Association to ProjectsMasterData;
    projectDescription : String(1000);
    status          : ProjectStatus default 'Planned';
    assignedDate    : Date;
    completedDate   : Date;  
    }
