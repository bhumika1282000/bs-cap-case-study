using LearningService from '../../srv/learning';
using from '../../db/employee';

annotate LearningService.LearningsMasterData with @(
    UI.HeaderInfo : {
        TypeName : 'Learning',
        TypeNamePlural : 'Learnings',
        Title : {
            $Type : 'UI.DataField',
            Value : courseDescription,
        },
        Description : {
            $Type : 'UI.DataField',
            Value : courseCode,
        },
    },
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'learningID',
                Value : learningID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'courseCode',
                Value : courseCode,
            },
            {
                $Type : 'UI.DataField',
                Label : 'courseDescription',
                Value : courseDescription,
            },
            {
                $Type : 'UI.DataField',
                Label : 'initialLevel',
                Value : initialLevel,
            },
            {
                $Type : 'UI.DataField',
                Label : 'courseContacts',
                Value : courseContacts,
            },
            {
                $Type : 'UI.DataField',
                Label : 'duration',
                Value : duration,
            },
            {
                $Type : 'UI.DataField',
                Label : 'isActive',
                Value : isActive,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'Learning Details',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'learningID',
            Value : learningID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'courseCode',
            Value : courseCode,
        },
        {
            $Type : 'UI.DataField',
            Label : 'courseDescription',
            Value : courseDescription,
        },
        {
            $Type : 'UI.DataField',
            Label : 'initialLevel',
            Value : initialLevel,
        },
        {
            $Type : 'UI.DataField',
            Label : 'courseContacts',
            Value : courseContacts,
        },
    ],
);

annotate service.Learnings with @(
    UI.Facets : [
        
    ],
    UI.FieldGroup #assignedlearnings : {
        $Type : 'UI.FieldGroupType',
        Data : [
        ],
    },
);

