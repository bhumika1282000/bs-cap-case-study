using ProjectService from '../../srv/project';
using from '../../db/employee';

annotate ProjectService.ProjectsMasterData with @(
    UI.HeaderInfo : {
        TypeName : 'Project',
        TypeNamePlural : 'Projects',
        Title : {
            $Type : 'UI.DataField',
            Value : projectName,
        },
        Description : {
            $Type : 'UI.DataField',
            Value : projectDescription,
        },
    },
);

annotate ProjectService.ProjectsMasterData with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Projectid}',
                Value : projectID,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Projectname}',
                Value : projectName,
            },
            {
                $Type : 'UI.DataField',
                Label : '{i18n>Projectdescription}',
                Value : projectDescription,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'Project details',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },

    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Projectid}',
            Value : projectID,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Projectname}',
            Value : projectName,
        },
        {
            $Type : 'UI.DataField',
            Label : '{i18n>Projectdescription}',
            Value : projectDescription,
        },
    ],
);

