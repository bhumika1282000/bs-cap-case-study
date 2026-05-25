import cds from '@sap/cds';

export default class ProjectServiceHandler extends cds.ApplicationService {
  async init() {
    const { ProjectsMasterData } = this.entities;

    this.before(['CREATE', 'UPDATE'], 'ProjectsMasterData', async (req) => {
      if (req.data.startDate && req.data.endDate && req.data.endDate < req.data.startDate) {
        req.reject(400, 'End date cannot be before start date');
      }
    });

    this.before('DELETE', 'ProjectsMasterData', async (req) => {
      const project = await SELECT.one.from(ProjectsMasterData).where({ ID: req.data.ID });
      if (!project) return;
      const assigned = await SELECT.one.from('db.Projects', p => {
        p.employee(e => { e.employeeID; e.firstName; e.lastName; });
      }).where({ projectMaster_ID: req.data.ID });
      if (assigned) {
        const emp = assigned.employee;
        req.reject(400, `Project "${project.projectName}" cannot be deleted as it is assigned to employee ${emp.employeeID} (${emp.firstName} ${emp.lastName})`);
      }
    });

    return super.init();
  }
}
