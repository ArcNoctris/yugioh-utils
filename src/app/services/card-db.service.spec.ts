import { TestBed } from '@angular/core/testing';

import { CardDbService } from './card-db.service';

describe('CardDbService', () => {
  let service: CardDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
