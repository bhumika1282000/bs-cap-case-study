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
                Label : '{i18n>Learningid}',
                Value : learningID,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Coursecode}',
                Value : courseCode,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Coursedescription}',
                Value : courseDescription,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>InitialLearning}',
                Value : initialLevel,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Availability}',
                Value : availability,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Coursecontacts}',
                Value : courseContacts,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Duration}',
                Value : duration,
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
            Label : '{i18n>Learningid}',
            Value : learningID,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Coursecode}',
            Value : courseCode,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Coursedescription}',
            Value : courseDescription,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>InitialLearning}',
            Value : initialLevel,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Availability}',
            Value : availability,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Coursecontacts}',
            Value : courseContacts,
        },
    ],
);

