using LearningService as service from '../../srv/learning';
annotate service.LearningsMasterData with @(
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
            Label : 'General Information',
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

