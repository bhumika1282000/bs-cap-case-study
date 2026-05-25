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
    }
);

annotate ProjectService.ProjectsMasterData with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'projectID',
                Value : projectID,
            },
            {
                $Type : 'UI.DataField',
                Label : 'projectName',
                Value : projectName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'projectDescription',
                Value : projectDescription,
            },
            {
                $Type : 'UI.DataField',
                Label : 'startDate',
                Value : startDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'endDate',
                Value : endDate,
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
            Label : 'Project details',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'projectID',
            Value : projectID,
        },
        {
            $Type : 'UI.DataField',
            Label : 'projectName',
            Value : projectName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'projectDescription',
            Value : projectDescription,
        },
        {
            $Type : 'UI.DataField',
            Label : 'startDate',
            Value : startDate,
        },
        {
            $Type : 'UI.DataField',
            Label : 'endDate',
            Value : endDate,
        },
    ],
);

