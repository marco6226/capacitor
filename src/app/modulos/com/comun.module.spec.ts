import { ComunModule } from './comun.module';

describe('ComModule', () => {
  let comModule: ComunModule;

  beforeEach(() => {
    comModule = new ComunModule();
  });

  it('should create an instance', () => {
    expect(comModule).toBeTruthy();
  });
});
