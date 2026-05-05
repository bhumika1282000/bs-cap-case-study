using EmployeeService as service from '../../srv/Employee-service';
annotate service.Employees with @(
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
            {
                $Type : 'UI.DataField',
                Label : 'email',
                Value : email,
            },
            {
                $Type : 'UI.DataField',
                Label : 'phoneNumber',
                Value : phoneNumber,
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

