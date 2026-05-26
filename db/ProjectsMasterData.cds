namespace db;
using { cuid, managed } from '@sap/cds/common';
using { db.Projects  } from './employee';


entity ProjectsMasterData : cuid, managed {
    projectID       : String(10) not null @assert.unique;        // Unique identifier
    projectName     : String(200) not null;              // Project Name from table
    projectDescription : String(1000) not null;          // Project Description from table
    assignedprojects : Association to many Projects
                        on assignedprojects.projectMaster = $self;
    
}