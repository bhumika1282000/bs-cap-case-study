namespace db;

using { cuid, managed } from '@sap/cds/common';
using { db.Learnings } from './employee';

entity LearningsMasterData : cuid, managed {    
    learningID      : String(10) not null @assert.unique;        // Unique identifier */
    courseCode      : String(50) not null @assert.unique;        // Course Code from table
    courseDescription : String(500) not null;            // Course Description from table
    initialLevel    : String(100);                        // Initial (beginner/advance level)
    courseContacts  : String(200);                        // Course Contacts (instructor name/email)
    duration        : Integer;                            // Duration in hours
    isActive        : Boolean default true; 
    assignedlearnings : Association to many Learnings
                        on assignedlearnings.learningMaster = $self;
}