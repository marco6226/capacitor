import { EmpModule } from './emp.module';

describe('EmpModule', () => {
  let empModule: EmpModule;

  beforeEach(() => {
    empModule = new EmpModule();
  });

  it('should create an instance', () => {
    expect(empModule).toBeTruthy();
  });
});
