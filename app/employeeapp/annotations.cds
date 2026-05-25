using EmployeeService as service from '../../srv/Employee-service';
annotate service.Employees with @(
    UI.HeaderInfo : {
        TypeName       : 'Employee',
        TypeNamePlural : 'Employees',
        Title          : {
            $Type : 'UI.DataField',
            Value : employeeID,
        },
        Description    : {
            $Type : 'UI.DataField',
            Value : firstName,
        },
    },
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'firstName',
                Value : firstName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'lastName',
                Value : lastName,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'Personal Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Contact Information',
            ID : 'ContactInformation',
            Target : '@UI.FieldGroup#ContactInformation',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Employment Details',
            ID : 'EmploymentInformation',
            Target : '@UI.FieldGroup#EmploymentInformation',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Bank details',
            ID : 'Bnakdetails',
            Target : '@UI.FieldGroup#Bnakdetails',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Leave Information',
            ID : 'LeavesInformation',
            Target : '@UI.FieldGroup#LeavesInformation',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Assigned Learnings',
            ID : 'Leanings',
            Target : 'assignedLearnings/@UI.LineItem#Leanings',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Assigned Projects',
            ID : 'AssignedProjects',
            Target : 'assignedProjects/@UI.LineItem#AssignedProjects1',
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Ratings',
            ID : 'Ratings',
            Target : 'ratings/@UI.LineItem#Ratings',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'employeeID',
            Value : employeeID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'firstName',
            Value : firstName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'lastName',
            Value : lastName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'email',
            Value : email,
        },
        {
            $Type : 'UI.DataField',
            Label : 'address',
            Value : address,
        },
    ],
    UI.FieldGroup #EmploymentInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : employeeID,
                Label : 'employeeID',
            },
            {
                $Type : 'UI.DataField',
                Value : role,
                Label : 'role',
            },
            {
                $Type : 'UI.DataField',
                Value : status,
                Label : 'status',
            },
            {
                $Type : 'UI.DataField',
                Value : email,
                Label : 'email',
            },
            {
                $Type : 'UI.DataField',
                Value : department,
                Label : 'department',
            },
            {
                $Type : 'UI.DataField',
                Value : joiningDate,
                Label : 'joiningDate',
            },
        ],
    },
    UI.FieldGroup #Bnakdetails : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : bankCode,
                Label : 'bankCode',
            },
            {
                $Type : 'UI.DataField',
                Value : bankAccountNumber,
                Label : 'bankAccountNumber',
            },
            {
                $Type : 'UI.DataField',
                Value : bankName,
                Label : 'bankName',
            },
        ],
    },
    UI.FieldGroup #LeavesInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : annualLeavesGranted,
                Label : 'annualLeavesGranted',
            },
            {
                $Type : 'UI.DataField',
                Value : annualLeavesUsed,
                Label : 'annualLeavesUsed',
            },
        ],
    },
    UI.FieldGroup #ContactInformation : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : phoneNumber,
                Label : 'phoneNumber',
            },
            {
                $Type : 'UI.DataField',
                Value : address,
                Label : 'address',
            },
        ],
    },
    UI.FieldGroup #Ratings : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Value : ratings.rating,
                Label : 'rating',
            },
            {
                $Type : 'UI.DataField',
                Value : ratings.comments,
                Label : 'comments',
            },
            {
                $Type : 'UI.DataField',
                Value : ratings.year,
                Label : 'year',
            },
            {
                $Type : 'UI.DataField',
                Value : ratings.reviewerID,
                Label : 'reviewerID',
            },
        ],
    },
);

annotate service.Learnings with @(
    UI.LineItem #Leanings : [
        {
            $Type : 'UI.DataField',
            Value : learningMaster_ID,
            Label : 'learningMaster_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : learningMaster.courseCode,
            Label : 'courseCode',
        },
        {
            $Type : 'UI.DataField',
            Value : learningMaster.courseDescription,
            Label : 'courseDescription',
        },
        {
            $Type : 'UI.DataField',
            Value : score,
            Label : 'score',
        },
        {
            $Type : 'UI.DataField',
            Value : assignedDate,
            Label : 'assignedDate',
        },
        {
            $Type : 'UI.DataField',
            Value : completedDate,
            Label : 'completedDate',
        },
        {
            $Type : 'UI.DataField',
            Value : learningMaster.initialLevel,
            Label : 'initialLevel',
        },
    ]
);

annotate service.LearningsMasterData with {
    courseCode @(
        Common.FieldControl : #ReadOnly,
        Common.Text : courseDescription,
        Common.Text.@UI.TextArrangement : #TextFirst,
    )
};

annotate service.LearningsMasterData with {
    courseDescription @Common.FieldControl : #ReadOnly
};

annotate service.Learnings with {
    ID @(
        Common.ExternalID : learningMaster.courseCode,
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'LearningsMasterData',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'ID',
        },
        Common.ValueListWithFixedValues : true,
)};

annotate service.Learnings with {
    learningMaster @(
        Common.ExternalID : learningMaster.learningID,
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'LearningsMasterData',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : learningMaster_ID,
                    ValueListProperty : 'ID',
                },
                {
                    $Type : 'Common.ValueListParameterInOut',
                    ValueListProperty : 'courseCode',
                    LocalDataProperty : learningMaster.courseCode,
                },
                {
                    $Type : 'Common.ValueListParameterInOut',
                    ValueListProperty : 'courseDescription',
                    LocalDataProperty : learningMaster.courseDescription,
                },
            ],
            Label : 'ID',
        },
        Common.ValueListWithFixedValues : false,
)};

annotate service.LearningsMasterData with {
    learningID @(
        Common.Text : courseDescription,
        Common.Text.@UI.TextArrangement : #TextSeparate,
    )
};

annotate service.Employees with {
    employeeID @Common.FieldControl : #ReadOnly
};

annotate service.Employees with {
    status @Common.FieldControl : #ReadOnly
};

annotate service.Employees with {
    email @Common.FieldControl : #ReadOnly
};

annotate service.Employees with {
    joiningDate @Common.FieldControl : #ReadOnly
};

annotate service.Employees with {
    annualLeavesGranted @Common.FieldControl : #ReadOnly
};

annotate service.Employees with {
    annualLeavesUsed @Common.FieldControl : #ReadOnly
};

annotate service.Projects with @(
    UI.LineItem #AssignedProjects : [
        {
            $Type : 'UI.DataField',
            Value : projectMaster_ID,
            Label : 'projectMaster_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : projectMaster.projectDescription,
            Label : 'projectDescription',
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'status',
        },
        {
            $Type : 'UI.DataField',
            Value : assignedDate,
            Label : 'assignedDate',
        },
        {
            $Type : 'UI.DataField',
            Value : completedDate,
            Label : 'completedDate',
        },
    ],
    UI.LineItem #AssignedProjects1 : [
        {
            $Type : 'UI.DataField',
            Value : projectMaster_ID,
            Label : 'projectMaster_ID',
        },
        {
            $Type : 'UI.DataField',
            Value : projectMaster.projectName,
            Label : 'projectName',
        },
        {
            $Type : 'UI.DataField',
            Value : projectMaster.projectDescription,
            Label : 'projectDescription',
        },
        {
            $Type : 'UI.DataField',
            Value : status,
            Label : 'status',
        },
        {
            $Type : 'UI.DataField',
            Value : assignedDate,
            Label : 'assignedDate',
        },
        {
            $Type : 'UI.DataField',
            Value : completedDate,
            Label : 'completedDate',
        },
    ],
);

annotate service.Ratings with {
    ID @(
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'Ratings',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : ID,
                    ValueListProperty : 'ID',
                },
            ],
            Label : 'ID',
        },
        Common.ValueListWithFixedValues : true,
)};

annotate service.Projects with {
    projectMaster @(
        Common.ExternalID : projectMaster.projectID,
        Common.ValueList : {
            $Type : 'Common.ValueListType',
            CollectionPath : 'ProjectsMasterData',
            Parameters : [
                {
                    $Type : 'Common.ValueListParameterInOut',
                    LocalDataProperty : projectMaster_ID,
                    ValueListProperty : 'ID',
                },
                {
                    $Type : 'Common.ValueListParameterInOut',
                    ValueListProperty : 'projectName',
                    LocalDataProperty : projectMaster.projectName,
                },
                {
                    $Type : 'Common.ValueListParameterInOut',
                    ValueListProperty : 'projectDescription',
                    LocalDataProperty : projectMaster.projectDescription,
                },
            ],
            Label : 'ID',
        },
        Common.ValueListWithFixedValues : false,
)};

annotate service.ProjectsMasterData with {
    projectID @(
        Common.Text : projectName,
        Common.Text.@UI.TextArrangement : #TextSeparate,
)};

annotate service.Projects with {
    projectDescription @Common.FieldControl : #ReadOnly
};

annotate service.Ratings with @(
    UI.LineItem #Ratings : [
        {
            $Type : 'UI.DataField',
            Value : employee.ratings.rating,
            Label : 'rating',
        },
        {
            $Type : 'UI.DataField',
            Value : employee.ratings.comments,
            Label : 'comments',
        },
        {
            $Type : 'UI.DataField',
            Value : employee.ratings.reviewerID,
            Label : 'reviewerID',
        },
        {
            $Type : 'UI.DataField',
            Value : employee.ratings.year,
            Label : 'year',
        },
    ]
);

