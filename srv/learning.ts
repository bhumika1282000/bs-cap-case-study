import cds from "@sap/cds";

export default class LearningServiceHandler extends cds.ApplicationService {
  async init() {
    const { LearningsMasterData } = this.entities;

    this.before('DELETE', 'LearningsMasterData', async (req) => {
      const learning = await SELECT.one.from(LearningsMasterData).where({ ID: req.data.ID });
      if (!learning) return;
      const assigned = await SELECT.one.from('db.Learnings', (l: any) => {
        l.employee((e: any) => { e.employeeID; e.firstName; e.lastName; });
      }).where({ learningMaster_ID: req.data.ID });
      if (assigned) {
        const emp = assigned.employee;
        req.reject(400, `Learning "${learning.courseDescription}" cannot be deleted as it is assigned to employee ${emp.employeeID} (${emp.firstName} ${emp.lastName})`);
      }
    });

    return super.init();
  }
}
