import { TestBed, inject } from '@angular/core/testing';

import { HttpInt } from './http-int.service';

describe('HttpIntService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpInt]
    });
  });

  it('should be created', inject([HttpInt], (service: HttpInt) => {
    expect(service).toBeTruthy();
  }));
});
